# Severity and classification guide

## Severity
| Level | Use when | QA Mart example |
|---|---|---|
| Critical | Primary journey unusable, or data/security impact, no workaround | Anyone can place an order for another shopper's email |
| High | Core feature wrong for many users, costly workaround | Order rejected or priced wrongly at a documented boundary |
| Medium | Limited scenario, or a workaround exists | Wrong message text, wrong rounding on one coupon |
| Low | Cosmetic or minor usability | Spacing, copy that does not change meaning |

Base severity on user impact and scope, not on the number of failing tests.

## Confidence
- **High**: reproduced twice, outside the test too, story criterion quoted.
- **Medium**: reproduced in the test only, or only on one design.
- **Low**: seen once, or the story is ambiguous.

## Classification checks
| Evidence | Likely class |
|---|---|
| Same request returns the wrong status or amount for every run | application bug |
| Passes with `--repeat-each` sometimes, fails sometimes | flaky: test bug unless the app has a race |
| Fails on `ui-v2` only with a locator error | test bug (position or class locator) |
| Connection refused, 404 on every route | environment issue |
| Fails after another test placed an order | environment: shared state, missing `api.reset()` |
