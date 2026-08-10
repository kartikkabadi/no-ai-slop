#!/usr/bin/env node
// Validates no-ai-slop rules against test fixtures.
//
// Usage: node scripts/validate-rule.mjs [rule-file]
//
// For every file in tests/fixtures/bad/, at least one trigger (regex or
// ast-grep) must fire. For every file in tests/fixtures/good/, no trigger
// may fire. Exits non-zero on any failure.
//
// Zero dependencies: parses the rule frontmatter with a small parser that
// understands the subset of YAML these rule files use (block lists of
// double-quoted strings plus scalar fields).

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rulePath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(root, 'clean-code.md');

// --- frontmatter subset parser ---

function unescapeYaml(s) {
  let out = '';
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '\\' && i + 1 < s.length) {
      const n = s[i + 1];
      if (n === 'n') { out += '\n'; i++; }
      else { out += n; i++; }
    } else {
      out += s[i];
    }
  }
  return out;
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) throw new Error('no frontmatter found');
  const meta = {};
  let section = null;
  for (const line of m[1].split('\n')) {
    const key = line.match(/^([\w-]+):\s*(.*)$/);
    if (key) {
      section = key[1];
      const val = key[2].trim();
      meta[section] = val ? [val] : [];
    } else if (section && /^  - "/.test(line)) {
      const item = line.match(/^  - "(.*)"\s*$/)[1];
      meta[section].push(unescapeYaml(item));
    }
  }
  for (const k of Object.keys(meta)) {
    if (meta[k].length === 1) {
      const v = meta[k][0];
      if (v === 'true') meta[k] = true;
      else if (v === 'false') meta[k] = false;
      else meta[k] = v;
    }
  }
  return meta;
}

// --- regex helpers ---

function compileRegex(src) {
  let flags = '';
  let s = src;
  const m = s.match(/^\(\?([ims]+)\)/);
  if (m) {
    flags = [...new Set(m[1].split(''))].join('');
    s = s.slice(m[0].length);
  }
  return new RegExp(s, flags);
}

// --- ast-grep helpers ---

const langByExt = {
  ts: 'ts', tsx: 'tsx', js: 'js', jsx: 'jsx', mjs: 'js', cjs: 'js',
  py: 'python', go: 'go', rb: 'ruby', rs: 'rust', java: 'java', kt: 'kotlin',
  php: 'php', swift: 'swift', c: 'c', h: 'c', cpp: 'cpp', hpp: 'cpp', cs: 'csharp',
};

function astGrepMatches(pattern, file) {
  const lang = langByExt[path.extname(file).slice(1)];
  if (!lang) return false;
  try {
    const out = execFileSync('ast-grep', ['run', '--lang', lang, '--pattern', pattern, file], {
      encoding: 'utf8', timeout: 20000, stdio: ['ignore', 'pipe', 'pipe'],
    });
    return out.trim().length > 0;
  } catch (e) {
    // stdout carrying matches means it matched; parse failures for a
    // language whose grammar cannot express the pattern are expected.
    return Boolean(e.stdout && e.stdout.trim());
  }
}

// --- main ---

const raw = fs.readFileSync(rulePath, 'utf8');
const meta = parseFrontmatter(raw);

const regexes = (meta.condition || []).map((src, i) => {
  try { return { i, rx: compileRegex(src) }; }
  catch (e) { console.error(`REGEX [${i}] does not compile: ${e.message}\n  ${src}`); process.exitCode = 1; return null; }
}).filter(Boolean);
const patterns = meta.astCondition || [];

const badDir = path.join(root, 'tests', 'fixtures', 'bad');
const goodDir = path.join(root, 'tests', 'fixtures', 'good');
const list = (d) => fs.existsSync(d)
  ? fs.readdirSync(d).filter((f) => f.endsWith('.ts') || f.endsWith('.py') || f.endsWith('.go') || f.endsWith('.rb') || f.endsWith('.swift') || f.endsWith('.js')).sort()
  : [];

let failures = 0;

function fireSources(file) {
  const content = fs.readFileSync(file, 'utf8');
  const hits = [];
  for (const { i, rx } of regexes) {
    if (rx.test(content)) hits.push(`regex[${i}]`);
  }
  for (let i = 0; i < patterns.length; i++) {
    if (astGrepMatches(patterns[i], file)) hits.push(`ast[${i}]`);
  }
  return hits;
}

console.log(`rule: ${path.basename(rulePath)} (${regexes.length} regexes, ${patterns.length} ast patterns)`);

for (const f of list(badDir)) {
  const hits = fireSources(path.join(badDir, f));
  if (hits.length === 0) {
    console.error(`FAIL  bad/${f}: no trigger fired`);
    failures++;
  } else {
    console.log(`ok    bad/${f}: ${hits.join(', ')}`);
  }
}

for (const f of list(goodDir)) {
  const hits = fireSources(path.join(goodDir, f));
  if (hits.length > 0) {
    console.error(`FAIL  good/${f}: fired ${hits.join(', ')}`);
    failures++;
  } else {
    console.log(`ok    good/${f}`);
  }
}

console.log(failures === 0 ? `PASS (${list(badDir).length} bad, ${list(goodDir).length} good)` : `FAIL (${failures} problems)`);
process.exitCode = failures === 0 ? 0 : 1;
