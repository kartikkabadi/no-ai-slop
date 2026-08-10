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
const langByExt = {
  ts: 'ts', tsx: 'tsx', js: 'js', jsx: 'jsx', mjs: 'js', cjs: 'js',
  py: 'python', go: 'go', rb: 'ruby', rs: 'rust', java: 'java', kt: 'kotlin',
  php: 'php', swift: 'swift', c: 'c', h: 'c', cpp: 'cpp', hpp: 'cpp', cs: 'csharp',
};

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

export function parseFrontmatter(raw) {
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

function listFixtures(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => /\.(ts|tsx|js|jsx|mjs|cjs|py|go|rb|swift)$/.test(f))
    .sort();
}

function fireSources(regexes, patterns, file) {
  const content = fs.readFileSync(file, 'utf8');
  const hits = [];
  for (let i = 0; i < regexes.length; i++) {
    if (regexes[i].test(content)) hits.push(`regex[${i}]`);
  }
  for (let i = 0; i < patterns.length; i++) {
    if (astGrepMatches(patterns[i], file)) hits.push(`ast[${i}]`);
  }
  return hits;
}

function main() {
  const rulePath = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.join(root, 'clean-code.md');
  const raw = fs.readFileSync(rulePath, 'utf8');
  const meta = parseFrontmatter(raw);

  const regexes = [];
  (meta.condition || []).forEach((src, i) => {
    try { regexes.push(compileRegex(src)); }
    catch (e) {
      console.error(`REGEX [${i}] does not compile: ${e.message}\n  ${src}`);
      regexes.push(/a^/); // never matches; keeps indices aligned
      process.exitCode = 1;
    }
  });
  const patterns = meta.astCondition || [];

  const badDir = path.join(root, 'tests', 'fixtures', 'bad');
  const goodDir = path.join(root, 'tests', 'fixtures', 'good');
  const bad = listFixtures(badDir);
  const good = listFixtures(goodDir);
  let failures = 0;

  console.log(`rule: ${path.basename(rulePath)} (${regexes.length} regexes, ${patterns.length} ast patterns)`);

  for (const f of bad) {
    const hits = fireSources(regexes, patterns, path.join(badDir, f));
    if (hits.length === 0) {
      console.error(`FAIL  bad/${f}: no trigger fired`);
      failures++;
    } else {
      console.log(`ok    bad/${f}: ${hits.join(', ')}`);
    }
  }

  for (const f of good) {
    const hits = fireSources(regexes, patterns, path.join(goodDir, f));
    if (hits.length > 0) {
      console.error(`FAIL  good/${f}: fired ${hits.join(', ')}`);
      failures++;
    } else {
      console.log(`ok    good/${f}`);
    }
  }

  console.log(failures === 0 ? `PASS (${bad.length} bad, ${good.length} good)` : `FAIL (${failures} problems)`);
  process.exitCode = failures === 0 ? 0 : 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
