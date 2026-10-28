---
name: checkout-test-design
description: "Use when designing, writing or reviewing tests for QA Mart checkout: coupons (SAVE10, FLAT100, WELCOME50, SUMMER25), order totals, delivery form validation, stock limits, or order API authentication."
---
# Checkout test design

Checkout fails at edges: money thresholds, caps, rounding, first-order state, field lengths, stock limits, auth. Test those on purpose.

## Steps
1. Read the story: US-101 (coupons, totals), US-103 (stock), US-105 (order API auth), US-106 (delivery form). Rules are in [rules.md](./rules.md); if a story differs, trust the story and say so.
2. For each rule list boundaries: threshold (n-1, n, n+1), cap (just below, at, above), rounding (a subtotal where the percentage has a fraction), eligibility (first order vs returning shopper), stock (limit-1, limit, limit+1, zero), field length (9, 10, 11 digits; 5, 6, 7 for PIN; leading 0).
3. Build the table in `docs/templates/test-case.md` format: one row per value, the technique, UI or API, and the reason for the row. Prefer API for rules, UI for messages and `aria-invalid` wiring.
4. Confirm each row against the live app with the `qamart_validate_coupon` and `qamart_list_products` tools, or `POST /api/coupons/validate` directly. Record status and amounts.
5. Write the spec in `tests/lab/`, one data-driven `for` loop per rule. Data from `tests/test-data.ts`, fixtures from `tests/fixtures.ts`, story id and AC in every title.
6. A row where the app disagrees with the story is an application bug. Keep the test, report it with the `bug-report-writer` skill, never edit `app/`, never change the expected value.

## Order-state hygiene
- WELCOME50 depends on whether the account has an order. Orders persist until `api.reset()`, which wipes the whole app. Say which account and state each row needs.
- Order-placing tests and `api.reset()` must not run in parallel.
- `qamart_place_order` and `qamart_reset` change app state. Tell the user before using them.

## Output
The filled table, the spec path, and the rows where the app disagrees with the story.
