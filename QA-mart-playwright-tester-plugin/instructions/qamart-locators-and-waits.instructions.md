---
name: 'QA Mart locators and waits'
description: 'Use when writing or changing Playwright specs or Page Objects for QA Mart: locator order, data-testid usage, no hard waits, web-first assertions.'
applyTo: '{tests,pages}/**/*.ts'
---
# Locators, test ids and waiting

## Locator order
1. `getByRole` with a name
2. `getByLabel`
3. `getByText` for static copy
4. `getByTestId` (`data-testid`) when there is no accessible name, for example `cart-count`, `order-total`, `coupon-message`
5. CSS only as a last resort, and then ask for a test id instead

Never use XPath, `nth-child`, `.nth()`, CSS ids or generated class names. v2 reorders products and renames classes and ids; accessible names and `data-testid` values stay the same.

## data-testid
- Check the id exists in `app/public/*.html` or `app/public/app.js` before using it. Do not invent one.
- `app/` is read-only. If an element has no usable locator, report it and suggest the test id. Do not add it yourself.

## Waiting and assertions
- No `waitForTimeout`, no `setTimeout`, no polling loops. Rely on auto-waiting and web-first assertions: `toBeVisible`, `toHaveText`, `toHaveValue`, `toHaveCount`, `toHaveURL`.
- Do not read a value and then assert on it (`textContent()` then `toBe`). Assert on the locator so the check retries.
- Wait for the outcome, not for time: after "Place order" assert `toHaveURL(/\/confirmation$/)`.

## Page Objects
- One class per page in `pages/<Name>Page.ts`, named export, constructor takes `Page`.
- Locators as readonly properties, user actions as methods. No `expect` inside a Page Object.
- No credentials or absolute URLs. Navigate with relative paths (`/login`).
