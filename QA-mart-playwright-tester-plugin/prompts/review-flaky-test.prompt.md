---
description: Prove a Playwright test is flaky, find the cause and fix it without weakening it.
argument-hint: spec path, for example tests/legacy/legacy-checkout.spec.ts
agent: agent
---
Spec: ${input:spec:tests/legacy/legacy-checkout.spec.ts}

1. Run it 10 times to get a failure rate: `npx playwright test ${input:spec:tests/legacy/legacy-checkout.spec.ts} --repeat-each=10 --retries=0`. Add `--project=legacy` if the file is under `tests/legacy/`. Record passes and failures. If it never fails, say so and stop.
2. Read the first failure's error and trace. Use the `tests_find_flaky` tool on `reports/results.json` to confirm which tests flip.
3. Name the cause, with the line: hard wait, read-then-assert, positional or class locator, shared state or `api.reset()` clash in parallel, hard-coded data, or an app race.
4. Fix only test-side causes, with the smallest change: web-first assertion, role/label/test-id locator, own setup, data from `tests/test-data.ts`. Never remove or loosen an assertion.
5. If the cause is an app race, do not hide it with a wait. Report it with [the bug template](../../docs/templates/bug-report.md).
6. Re-run with `--repeat-each=10`, then `npm run typecheck` and `npm run lint:specs`.

Finish with a table: line, cause, change, and before/after failure rate (for example 4/10 to 0/10).
