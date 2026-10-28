---
description: Generate a smoke spec for one QA Mart area, verified against the live app.
argument-hint: area, for example login, products, cart, checkout or orders
agent: agent
---
Area: ${input:area:checkout}

1. Read [team conventions](../../docs/team-conventions.md), [fixtures](../../tests/fixtures.ts), [test data](../../tests/test-data.ts) and [the seed spec](../../tests/seed.spec.ts). Find the story for this area in [docs/stories](../../docs/stories/). If none matches, say so and stop.
2. Check the app is running with the `qamart_health` tool. If not, tell me to run `npm start` and stop.
3. Explore the page with the Playwright MCP tools and confirm each role, label and test id exists before you use it.
4. Write `tests/lab/smoke-<area>.spec.ts` with 3 to 5 tests: the page loads, the main action works, and one negative case. Each title carries the story id and criterion. Locators by role, label, then `getByTestId`. No hard waits.
5. Run `npm run typecheck`, `npm run lint:specs` and the new spec on `chromium`, then with `npm run test:v2`.
6. If a test fails because the app disagrees with the story, keep the test and report it. Do not weaken the assertion and do not edit `app/`.

Finish with: the spec path, one line per test, and any failure with the story criterion it breaks.
