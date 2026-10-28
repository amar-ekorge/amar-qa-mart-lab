# QA Mart checkout rules (from the stories)

## Coupons (US-101)
| Code | Threshold | Discount | Cap | Rounding | Who |
|---|---|---|---|---|---|
| SAVE10 | none | 10% of subtotal | ₹200 | down to the rupee | everyone |
| FLAT100 | subtotal ≥ ₹500 (inclusive) | ₹100 | none | n/a | everyone |
| WELCOME50 | none | 50% of subtotal | ₹250 | down to the rupee | first order only |
| SUMMER25 | n/a | none | n/a | n/a | expired: "This coupon has expired" |

- Codes ignore case and surrounding spaces. Unknown code: "Invalid coupon code". Empty code: "Enter a coupon code".
- Cap reached at subtotal 2000 for SAVE10 and 500 for WELCOME50.
- Total = Subtotal − Discount (US-101 AC7, US-106 AC1).

## Stock limits per order (US-103)
Wireless Mouse 10, USB-C Cable 25, Test Charter Notebook 5, Desk Lamp 3, Coffee Mug 40, Laptop Stand 0 (out of stock).
- No stock: button disabled, order rejected 422 "<product name> is out of stock".
- Over the limit: 422 naming the product. Exactly at the limit: accepted.

## Order API (US-105)
- No bearer token: 401, no order created.
- Token for a different email than the body: 403.
- Valid token, same email: 201 with `orderId`, `subtotal`, `discount`, `total`.
- Treat any deviation as a security defect.

## Delivery form (US-106)
| Field | Invalid when | Message |
|---|---|---|
| Full name | empty | Enter your full name |
| Mobile | not exactly 10 digits | Enter a 10-digit mobile number |
| Delivery address | empty | Enter your delivery address |
| PIN code | not 6 digits, or starts with 0 | Enter a 6-digit PIN code |

- Each invalid field has `aria-invalid="true"` and `aria-errormessage` pointing at its message.
- Empty cart: "Place order" disabled and "Your cart is empty".

## Accounts
asha@qamart.test (first order), ravi@qamart.test (returning), locked@qamart.test (locked). Use `users` in `tests/test-data.ts`.
