---
name: bug-report-writer
description: Use when a QA Mart test fails or the app behaves differently from its story and a bug report, defect write-up or triage note is needed. Produces a complete report with classification, severity, exact evidence and reproduction steps.
---
# Bug report writer

A failing test is a signal, not proof. Decide what is wrong before writing it up.

## Steps
1. Reproduce with the narrowest command: `npx playwright test <file> -g "<title>"` (add `--project=<name>` for seeded, legacy or ui-v2). Record the exact command. Use `tests_list_failures` for the last run.
2. Find the story and acceptance criterion in `docs/stories/`. No criterion means the report is "unconfirmed".
3. Classify using [severity-guide.md](./severity-guide.md):
   - **application bug**: test matches the story, app does not
   - **test bug**: test contradicts the story, uses a wrong locator or data, or races
   - **environment issue**: app not running, port, stale server state, missing reset
   - **unconfirmed**: not reproducible or story unclear
4. For API-level claims, repeat the request outside the test (`qamart_validate_coupon`, or a direct call) and quote status and body. Check the same behavior on v1 and v2 when the UI is involved.
5. Fill `docs/templates/bug-report.md` completely: exact status codes, messages and amounts, the command, the trace or screenshot path, file and line.
6. Keep **confirmed facts** and **guesses** in separate sections. Never name a root cause in `app/` as fact unless you read the code.

## Rules
- Do not edit `app/` and do not weaken the failing test.
- Never include real secrets. Lab accounts are fine.
- Orders, auth and money errors are at least High unless a workaround is documented.

## Output
Only the completed report.
