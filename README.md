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
- `simple-english.md` — an always-on rule: speak in the simplest possible
  English, short words, short sentences, one idea per sentence.

## Install

```sh
cp voice.md simple-english.md ~/.omp/agent/rules/
```

OMP loads every rule file in `~/.omp/agent/rules/`. Rules apply to new
sessions; restart your agent after copying.

## Rule format

Each file is Markdown with YAML frontmatter:

- `name` — rule id
- `description` — one line saying what the rule does
- `condition` — list of regex patterns. When any pattern matches your
  output, the rule fires.
- `scope` — what the rule checks (`text`)
- `interruptMode` — `prose-only` means chat prose, not code
- `alwaysApply` — run on every output, not only on trigger

The body tells the agent what to do when the rule fires.

## Contribute

The word lists are the point. Send a pull request to add a banned word or
phrase you keep seeing. Keep additions to the right regex line so the list
stays organized.

## License

MIT. See [LICENSE](LICENSE).
