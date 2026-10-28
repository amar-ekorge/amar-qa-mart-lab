---
name: 'QA Mart spec naming, data and failure handling'
description: 'Use when writing, naming or fixing Playwright specs for QA Mart: story ids in titles, test data, fixtures, isolation, and what to do when a correct test fails.'
applyTo: 'tests/**/*.ts'
---
# Spec naming, data and failure handling

## Naming and layout
- Specs: `tests/<area>/<feature>.spec.ts`. Lab work goes in `tests/lab/`.
- Every test links to a story: put the id and criterion in the title, for example `US-101 AC3: FLAT100 gives ₹100 off at exactly ₹500`.
- Name the behavior, not the mechanics. One behavior per test. Wrap multi-step flows in `test.step`.

## Data and fixtures
- Emails, passwords, prices, product ids and coupon codes come from `tests/test-data.ts` (`users`, `shipping`, `products`, `coupons`). Never type them into a spec.
- Import `test` and `expect` from `tests/fixtures.ts` when you need `api` or `signedInPage`, otherwise from `@playwright/test`.
- Use `baseURL` and relative paths. Never write `http://localhost:3000`.
- Tests share no state. Each one sets up what it needs. `api.reset()` wipes orders for the whole app, so do not call it from tests that run in parallel with order-placing tests.
- Tests must pass on v1 and v2 (`npm run test:v2`).

## When a test fails
- A failing test is a signal, not proof. Find the acceptance criterion in `docs/stories/` first.
- Never weaken, skip or delete an assertion, and never change an expected value, status code or message to match what the app does.
- If the test matches the story and the app does not, keep the test, mark it `test.fixme()` only if the team asks, and report the bug with `docs/templates/bug-report.md`.
- `app/` is read-only.

## Before you hand work over
`npm run typecheck`, `npm run lint:specs`, then the affected specs.
