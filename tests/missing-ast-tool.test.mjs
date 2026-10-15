import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

test('missing ast-grep cannot produce PASS from regex matches alone', () => {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'missing-ast-')));
  try {
    mkdirSync(join(root, 'scripts'));
    mkdirSync(join(root, 'tests', 'fixtures', 'bad'), { recursive: true });
    mkdirSync(join(root, 'tests', 'fixtures', 'good'), { recursive: true });
    writeFileSync(join(root, 'scripts', 'validate-rule.mjs'), readFileSync(new URL('../scripts/validate-rule.mjs', import.meta.url)));
    writeFileSync(join(root, 'tests', 'fixtures', 'bad', 'bad.ts'), 'bad');
    writeFileSync(join(root, 'tests', 'fixtures', 'good', 'good.ts'), 'good');
    writeFileSync(join(root, 'clean-code.md'), '---\ncondition:\n  - "bad"\nastCondition:\n  - "console.log($A)"\n---\nRule\n');
    const result = spawnSync(process.execPath, [join(root, 'scripts', 'validate-rule.mjs')], { encoding: 'utf8', env: { ...process.env, PATH: root } });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /ast-grep/);
    assert.doesNotMatch(result.stdout, /PASS/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
