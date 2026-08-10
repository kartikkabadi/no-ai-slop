---
name: clean-code
description: Enforce clean-code discipline on written code. Interrupt edits that introduce type-unsafe, error-swallowing, badly named, magic-number, or debug-leftover patterns.
alwaysApply: true
condition:
  # Type safety and debug leftovers
  - "\\bdebugger\\b"
  - "console\\.(?:log|debug)\\s*\\("
  - "@ts-(?:ignore|nocheck)\\b"
  - "(?::\\s*any\\b|as\\s+any\\b|any\\s*\\[\\s*\\]|<\\s*any\\b|,\\s*any(?=\\s*[,>)\\]]))"
  # Error handling
  - "(?s)catch\\s*(\\([^)]*\\))?\\s*\\{\\s*(?:(?:/\\*[\\s\\S]*?\\*/)|(?://[^\\r\\n]*)|(?:\\s))*\\}"
  - "\\.catch\\s*\\(\\s*\\([^)]*\\)\\s*=>\\s*\\{\\s*(?:(?:/\\*[\\s\\S]*?\\*/)|(?://[^\\r\\n]*)|(?:\\s))*\\}\\s*\\)"
  - "(?m)^\\s*except\\s*:\\s*(?:#[^\\n]*)?$"
  - "(?m)^\\s*except\\s*[^:\\n]*:\\s*(?:#[^\\n]*)?\\n\\s*(?:pass|\\.\\.\\.)\\s*(?:#[^\\n]*)?$"
  - "except\\s+(Exception|BaseException)\\b"
  - "(?<!\\.)\\brecover\\s*\\(\\s*\\)"
  - "rescue\\s+Exception\\b"
  # Python mutable defaults
  - "def\\s+\\w+\\s*\\([^)]*?=\\s*(\\[\\]|\\{\\}|set\\s*\\(\\s*\\)|list\\s*\\(\\s*\\)|dict\\s*\\(\\s*\\))"
  # Global state
  - "\\bglobal\\s+[A-Za-z_]\\w*"
  - "\\bglobals\\s*\\(\\s*\\)"
  - "\\b(?:window|globalThis|global)\\.(?!location\\b)\\w+\\s*=(?!=)"
  # Debug output
  - "\\bprint\\s*\\("
  - "\\bfmt\\.(?:Print|Println|Printf)\\s*\\("
  - "\\bputs\\b"
  # var
  - "\\bvar\\s+\\w+\\s*=(?!=)"
  # Names
  - "\\b(?:function|def|fn|func)\\s+[a-z]\\b"
  - "\\b(?:function|def|fn|func)\\s+\\w+\\s*\\(\\s*(?!e\\b)[a-z]\\b[^)]*\\)"
  - "\\b(?:const|let|var)\\s+(?!i\\b|j\\b|k\\b|x\\b|y\\b|e\\b)\\w(?!\\w)\\s*[=;,]"
  - "(?i)\\b(?:const|let|var|function|def|class)\\s+(?:data|item|tmp|temp|helper|manager|util|utils|handler|stuff|thing|misc|foo|bar|baz|val|value|result|ret|res|flag|obj|str|num|input|output)\\b"
  - "(?i)\\b(?:doStuff|doWork|doThing|handleData|handleThing|processInput|processData|handleInput)\\b"
  # Magic numbers
  - "\\b\\d{2,}\\s*(?:ms|secs?|mins?|hrs?|days?|px|kb|mb|gb|bytes?)\\b"
  - "(?:===|==|!==|!=|>=|<=|>|<)\\s*\\d{2,}\\b"
  # Comment hygiene
  - "(?i)(?://|#|--|/\\*|\\*)\\s*(?:\\b(?:todo|fixme|hack)\\b(?:\\s*[:(-]|(?=\\s*[\\r\\n]|$))|\\bxxx\\b)"
  - "(?i)(?:^|[\\r\\n])\\s*(?://|#|--|/\\*|\\*)\\s*(?:(?:if|for|while|switch|catch|try|except|finally|match|do|else)\\s*[({=\\[:]|else\\s+if\\s*[({])"
  - "(?i)(?:^|[\\r\\n])\\s*(?://|#|--|/\\*|\\*)\\s*(?:return|const|let|var|def|class|function|func|fun|fn|throw|break|continue|yield|defer|void|public|private|protected|type|interface|enum|struct|impl)\\b\\s*(?:[\\w$]+\\s*(?:[=({;.[:]|(?=\\s*[\\r\\n]|$))|;(?=\\s*[\\r\\n]|$))"
  - "(?i)(?:^|[\\r\\n])\\s*(?://|#|--|/\\*|\\*)\\s*(?:import|export)\\s*(?:[({]|default\\b|const\\b|let\\b|var\\b|function\\b|class\\b|async\\b|[\\w$]+\\s+from\\b)"
  - "(?i)(?:^|[\\r\\n])\\s*(?://|#|--|/\\*|\\*)\\s*[}\\]]"
  - "(?i)(?:^|[\\r\\n])\\s*(?://|#|--|/\\*|\\*)\\s*[\\w$]+\\s*(?:[+\\-*/%&|^]?=)\\s*(?![tT]he\\b|[aA]n?\\b)[^=\\s]"
  - "(?i)(?:^|[\\r\\n])\\s*(?://|#|--|/\\*|\\*)\\s*await\\s+[a-z_][\\w$.]*\\("
  - "(?i)(?:^|[\\r\\n])\\s*(?://|#|--|/\\*|\\*)\\s*(?:increment|decrement)\\s+(?:the\\s+|a\\s+)?[\\w$]+"
  - "(?i)(?:^|[\\r\\n])\\s*(?://|#|--|/\\*|\\*)\\s*(?:loop|iterate)\\s+(?:over|through)\\s+(?:the\\s+|a\\s+)?[\\w$]+"
  - "(?i)(?:^|[\\r\\n])\\s*(?://|#|--|/\\*|\\*)\\s*(?:initialize|initialise)\\s+(?:the\\s+|a\\s+)?[\\w$]+"
astCondition:
  - "try { $$$BODY } catch ($_) {}"
  - "try { $$$BODY } catch {}"
  - "$A!"
  - "if ($A) { if ($B) { if ($C) { $$$ } } }"
  - "if $A:\n    if $B:\n        if $C:\n            $$$"
  - "if $A { if $B { if $C { $$$ } } }"
  - "if ($A) { return $B; } else { $$$ }"
  - "if ($A) { return; } else { $$$ }"
  - "if ($A) { throw $B; } else { $$$ }"
  - "if $A:\n    return $B\nelse:\n    $$$"
  - "if $A:\n    raise $B\nelse:\n    $$$"
  - "if $A { return $B } else { $$$ }"
  - "function $F($A, $$$R) { const $A = $_; }"
  - "function $F($A, $$$R) { let $A = $_; }"
  - "($A) => { const $A = $_; }"
  - "($A) => { let $A = $_; }"
  - "def $F($A, $$$R):\n    def $G($A, $$$S):\n        $$$"
  - "{ return $A; $B; $$$REST }"
  - "{ return; $B; $$$REST }"
  - "if (true) $BODY"
  - "if (false) $BODY"
  - "def $F($$$ARGS):\n    return $B\n    $C"
  - "def $F($$$HEAD, $A = [], $$$TAIL)"
  - "def $F($$$HEAD, $A = {}, $$$TAIL)"
  - "def $F($$$HEAD, $A = set(), $$$TAIL)"
  - "def $F($$$HEAD, $A = list(), $$$TAIL)"
  - "def $F($$$HEAD, $A = dict(), $$$TAIL)"
  - "let $A = $B == $C"
  - "let $A = $B != $C"
  - "const $A = $B == $C"
  - "const $A = $B != $C"
  - "($A) => $B == $C"
  - "($A) => $B != $C"
  - "($$$ARGS) => $B == $C"
  - "($$$ARGS) => $B != $C"
  - "function $F($$$ARGS) { return $A == $B }"
  - "function $F($$$ARGS) { return $A != $B }"
  - "breakpoint()"
  - "todo!()"
scope:
  - "tool:edit(**/*.ts)"
  - "tool:edit(**/*.tsx)"
  - "tool:edit(**/*.js)"
  - "tool:edit(**/*.jsx)"
  - "tool:edit(**/*.mjs)"
  - "tool:edit(**/*.cjs)"
  - "tool:edit(**/*.py)"
  - "tool:edit(**/*.go)"
  - "tool:edit(**/*.rs)"
  - "tool:edit(**/*.java)"
  - "tool:edit(**/*.kt)"
  - "tool:edit(**/*.rb)"
  - "tool:edit(**/*.php)"
  - "tool:edit(**/*.swift)"
  - "tool:edit(**/*.c)"
  - "tool:edit(**/*.h)"
  - "tool:edit(**/*.cpp)"
  - "tool:edit(**/*.hpp)"
  - "tool:edit(**/*.cs)"
  - "tool:write(**/*.ts)"
  - "tool:write(**/*.tsx)"
  - "tool:write(**/*.js)"
  - "tool:write(**/*.jsx)"
  - "tool:write(**/*.mjs)"
  - "tool:write(**/*.cjs)"
  - "tool:write(**/*.py)"
  - "tool:write(**/*.go)"
  - "tool:write(**/*.rs)"
  - "tool:write(**/*.java)"
  - "tool:write(**/*.kt)"
  - "tool:write(**/*.rb)"
  - "tool:write(**/*.php)"
  - "tool:write(**/*.swift)"
  - "tool:write(**/*.c)"
  - "tool:write(**/*.h)"
  - "tool:write(**/*.cpp)"
  - "tool:write(**/*.hpp)"
  - "tool:write(**/*.cs)"
interruptMode: tool-only
---

# Clean Code

Write code the next reader can change without guessing. Make behavior, ownership, and failure modes visible. Apply this to every file you write or edit.

A trigger fired. Fix the violation, then retry:

## Type safety

- `any`: replace with a precise type. Use `unknown` and narrow with guards or a schema parse when the shape is not known. Never use `any` to silence the compiler.
- `@ts-ignore` / `@ts-nocheck`: remove. Fix the underlying type error, or use `@ts-expect-error` when the error is known and will disappear with the fix.
- Non-null assertion (`!`): replace with a runtime check that narrows the type or throws a descriptive error. Do not assert what the code has not verified.
- `debugger`: remove. It stops execution and ships by accident.
- `console.log` / `console.debug`: remove debug output. If logging is intentional, use the project logger; keep `console.error` and `console.warn` for real failures.

## Errors

- Never swallow an error. An empty catch block, a catch that holds only comments, or an empty `.catch()` handler hides a failure. Every failure needs a decision: handle it, wrap it with context, re-raise it, or return a typed failure. If ignoring a failure is deliberate, log it, say why in a comment, and keep the reason observable.
- Never use a bare `except:`. Name the exceptions you expect. Do not follow an except clause with `pass` or `...`.
- Catch the specific exception the call can raise. A bare `catch {}`, `except Exception`, `recover()`, or `rescue Exception` swallows bugs and keeps the program running on broken state.

## Names

- Give every name a purpose in the local domain. Prefer `resolveInvoiceRecipient` over `handleData`, `remainingRetryBudget` over `count`, `timeoutMs` over `t`.
- Rename single-letter names. Conventional loop indices (`i`, `j`, `k`), coordinates (`x`, `y`), and event params (`e`) may stay.
- Replace generic names (`data`, `item`, `tmp`, `helper`, `manager`, `util`) with domain names.
- Name booleans as predicates (`isSessionExpired`). Name functions for their effect or returned result.
- One concept, one term. Use the same word for the same idea everywhere.

## Magic numbers

- Extract bare literals into named constants. The name must say why the value exists: `MAX_RETRIES`, `FIVE_SECONDS_MS`.
- `0` and `1` in boundary checks are fine. HTTP and status codes are fine when named.

## Dead code

- Delete statements that follow a `return`, `throw`, or `raise` — they never run.
- Delete commented-out code. Version control keeps history; a comment explains why, not what was removed.
- Remove `if (true)` scaffolding and `if (false)` branches.
- Delete duplicate object keys; the first entry is shadowed.
- Do not leave unused variables or unreachable branches behind when you edit.

## State and equality

- Mutable default argument: use `None` (or a sentinel) and build the list, dict, or set inside the function. Never share one container across calls.
- Global state: pass values in and out instead of mutating globals. Replace `global x` and `window.x =` with parameters and return values. Keep package-level values read-only.
- `var`: use `let` or `const` in JavaScript; prefer `:=` for locals in Go.
- Loose equality: use `===` and `!==`. Keep `== null` only when you mean "null or undefined".

## Comments

- Delete comments that restate the code. Say why, never what.
- Read each comment against the code below it. If the comment is stale or wrong, fix the comment or fix the code.
- Remove TODO, FIXME, HACK, and XXX markers. Do the work now, or move the note to the issue tracker. A finished change carries no markers.
- Remove leftover debug calls: console.log, console.debug, debugger, breakpoint(), todo!().

## What triggers cannot see

Check these yourself on the lines you touch: long functions, deep nesting, duplication, unclear data flow, hidden side effects. Keep units focused on one job. Make errors useful: keep the context, hide secrets, and let the caller decide what happens next. Keep the edit minimal. Do not fold unrelated renames or cleanups into the same change.

If a trigger fires, fix it and retry.
