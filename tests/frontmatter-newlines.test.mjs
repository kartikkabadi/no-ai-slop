import assert from 'node:assert/strict';
import test from 'node:test';
import { parseFrontmatter } from '../scripts/validate-rule.mjs';

test('Windows line endings and a UTF-8 BOM preserve rule frontmatter', () => {
  const text = '---\ncondition:\n  - "debugger"\n---\nBody\n';
  const expected = parseFrontmatter(text);
  assert.deepEqual(parseFrontmatter(text.replaceAll('\n', '\r\n')), expected);
  assert.deepEqual(parseFrontmatter('\uFEFF' + text), expected);
});
