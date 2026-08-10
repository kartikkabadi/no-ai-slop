# no-ai-slop

Agent rules that stop AI assistants from writing in corporate and AI-slop style.

This repo holds two rules for OMP (Oh My Pi), but the
word lists work in any agent harness that supports regex-based output rules.

## Files

- `voice.md` — interrupts output when it uses a banned corporate/AI word or
  a common AI-tell phrase. The banned list lives in the rule frontmatter as
  regex patterns. Covers ~400 words and phrases: buzzwords (`leverage`,
  `synergy`, `circle back`), AI tells (`delve`, `tapestry`, `it's worth
  noting`), filler (`very`, `basically`), and hype (`game-changer`,
  `revolutionary`).
- `simple-english.md` — always-on rule: write in Simplified Technical English
  (STE-100). Short words, short sentences, one idea per sentence. Like voice,
  it carries trigger patterns and interrupts output that uses long words or
  filler phrases.
- `clean-code.md` — interrupts code edits that introduce fixable smells:
  type-unsafe patterns (`any`, `@ts-ignore`, non-null assertions), swallowed
  errors (empty catches, bare `except:`), bad names, magic numbers, debug
  leftovers, global state, and comment hygiene. Uses regex triggers plus
  ast-grep structural patterns, and watches edit/write tool streams only.

## Install

```sh
cp voice.md simple-english.md clean-code.md ~/.omp/agent/rules/
```

OMP loads every rule file in `~/.omp/agent/rules/`. Rules apply to new
sessions; restart your agent after copying.

## Rule format

Each file is Markdown with YAML frontmatter:

- `name` — rule id
- `description` — one line saying what the rule does
- `condition` — list of regex patterns. When any pattern matches your
  output, the rule fires.
- `astCondition` — list of ast-grep structural patterns (for example
  `catch ($_) {}`). Matches code being written or edited; the language is
  inferred from the file path.
- `scope` — which streams the rule watches. Tokens: `text`, `thinking`,
  `tool`, and `tool:edit(<glob>)` / `tool:write(<glob>)` for code files.
- `interruptMode` — `prose-only` means chat prose, not code
- `alwaysApply` — marks the rule as always active. In OMP, a rule with a
  `condition` is a stream rule: it watches output and interrupts on match so
  the agent can rephrase. A rule can carry both flags.

The body tells the agent what to do when the rule fires.

## Validate

`node scripts/validate-rule.mjs` runs the rule triggers against fixture
pairs in `tests/fixtures/`:

- `tests/fixtures/bad/*` — each file must fire at least one trigger
- `tests/fixtures/good/*` — each file must fire no trigger

Requires Node and the `ast-grep` binary. Run it before sending a rule
change; the fixtures keep the trigger list honest.

## Contribute

The word lists are the point. Send a pull request to add a banned word or
phrase you keep seeing. Keep additions to the right regex line so the list
stays organized. Run the validator after any change to a rule file.

## License

MIT. See [LICENSE](LICENSE).
