import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

test('invoking the validator through a symlink actually validates the rule', () => {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), 'rule-symlink-')));
  try {
    const link = join(dir, 'validator.mjs');
    symlinkSync(fileURLToPath(new URL('../scripts/validate-rule.mjs', import.meta.url)), link);
    const invalid = join(dir, 'invalid.md');
    writeFileSync(invalid, 'not a rule');
    const valid = join(dir, 'valid.md');
    writeFileSync(valid, '---\ncondition:\n  - "a^"\n---\n');
    for (const flags of [[], ['--preserve-symlinks-main']]) {
      const result = spawnSync(process.execPath, [...flags, link, invalid], { encoding: 'utf8' });
      assert.equal(result.status, 1);
      assert.match(result.stderr, /no frontmatter found/);
      const fixtures = spawnSync(process.execPath, [...flags, link, valid], { encoding: 'utf8' });
      assert.equal(fixtures.status, 1);
      assert.match(fixtures.stdout, /FAIL \(34 problems\)/);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('module import tolerates a nonexistent argv entrypoint', () => {
  const moduleUrl = new URL('../scripts/validate-rule.mjs', import.meta.url).href;
  const script = "process.argv[1] = '/nonexistent-validator-entry'; await import(" + JSON.stringify(moduleUrl) + ");";
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', script], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
});
