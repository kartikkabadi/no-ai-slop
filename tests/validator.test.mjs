import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { parseFrontmatter } from '../scripts/validate-rule.mjs';

test('one-item YAML lists remain arrays while scalar fields keep their type', () => {
  const meta = parseFrontmatter('---\ndescription: Example\nalwaysApply: true\ncondition:\n  - "hello"\nastCondition:\n  - "console.log($A)"\n---\nRule\n');
  assert.deepEqual(meta.condition, ['hello']);
  assert.deepEqual(meta.astCondition, ['console.log($A)']);
  assert.equal(meta.description, 'Example');
  assert.equal(meta.alwaysApply, true);
});

function runValidator(condition) {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'rule-validator-')));
  try {
    mkdirSync(join(root, 'scripts'));
    mkdirSync(join(root, 'tests', 'fixtures', 'good'), { recursive: true });
    writeFileSync(join(root, 'scripts', 'validate-rule.mjs'), readFileSync(new URL('../scripts/validate-rule.mjs', import.meta.url)));
    writeFileSync(join(root, 'tests', 'fixtures', 'good', 'good.ts'), 'const answer = 42;\n');
    writeFileSync(join(root, 'clean-code.md'), `---\ncondition:\n${condition}\n---\nRule\n`);
    return spawnSync(process.execPath, [join(root, 'scripts', 'validate-rule.mjs')], { encoding: 'utf8' });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('CLI accepts a valid one-item regex list', () => {
  const result = runValidator('  - "a^"');
  assert.equal(result.status, 0, result.stderr);
});

test('invalid regex keeps the CLI failure even when fixtures pass', () => {
  const result = runValidator('  - "["\n  - "a^"');
  assert.match(result.stderr, /does not compile/);
  assert.equal(result.status, 1);
  assert.doesNotMatch(result.stdout, /PASS/);
});
