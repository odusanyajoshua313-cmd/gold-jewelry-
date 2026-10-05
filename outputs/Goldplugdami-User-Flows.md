# Goldplugdami User Flows

**Version:** 0.1 — planning draft. These flows describe intended behavior, not a built interface.

## 1. Shopper: discover and enquire via WhatsApp

1. Arrive from Google, social, referral, or direct URL.
2. Recognize Goldplugdami as a Lagos gold jewelry and gold bar retailer with nationwide Nigeria delivery.
3. Browse category, search/filter by product facts, or review today's four Karat rates.
4. Open a product and inspect image gallery, Karat, weight, calculated NGN price, stock, hallmark/authenticity details, and delivery/shop information.
5. Select **Ask on WhatsApp**. Prefilled message includes product name/SKU, full Karat spelling, weight, displayed price, rate timestamp, and delivery city/state prompt.
6. Seller confirms stock and current price; customer confirms order and delivery details.
7. Seller records the confirmed order/reservation in the admin inventory workflow.
8. Customer transfers funds; seller verifies bank settlement (a screenshot alone is not proof).
9. Admin records payment and delivery; issue receipt with applicable hallmark/authenticity information and gold bar authentication ID where relevant.
10. Inventory transitions to sold/committed and is no longer advertised as available.

### Shopper edge cases

- Rate has expired: suppress or clearly mark stale calculated price and direct visitor to confirm on WhatsApp.
- Item is sold out: retain product information, show Sold out, prevent ordering, optionally allow restock enquiry.
- Item is reserved: display a clear availability state without exposing private customer details.
- WhatsApp unavailable: show the business number and copy action.
- Delivery terms unavailable: do not claim cost, speed, tracking, or insurance until confirmed.

## 2. Shop visit and in-person sale

1. Shopper opens Visit section and checks confirmed address, hours/visit rules, and contact.
2. Shopper visits Tejuosho, Yaba; exact public directions remain open.
3. Seller confirms item, Karat, weight, current price, hallmark/authenticity evidence, and in-stock status.
4. Customer pays on arrival using a confirmed in-shop method.
5. Seller records shop sale and reduces available count in the same inventory source as online/WhatsApp orders.
6. Issue receipt with relevant authenticity details and gold bar ID if applicable.

## 3. Admin: publish daily rates

1. Authorized admin signs in to protected workspace.
2. Enter separate NGN-per-gram selling rates for 18 Karat, 21 Karat, 22 Karat, and 24 Karat.
3. Validate values, date/time, completeness, and obvious entry errors.
4. Preview affected item prices (rate × weight) and compare with previous published values.
5. Publish the set atomically; record actor and timestamp; preserve prior rate snapshots.
6. Site updates rate board and product prices together. If publishing fails, keep previous set and alert admin.

Open: admin roles, rate cutoff, stale behavior, precision/rounding, rollback authority.

## 4. Admin: manage product and stock

1. Create/edit product using the catalog template and owner-supplied images.
2. Validate category, Karat, measured weight, price calculation, stock quantity, image, and authenticity fields.
3. Preview public card/detail and WhatsApp text before publishing.
4. Publish or mark unavailable/sold out.
5. Record every restock, correction, shop sale, confirmed WhatsApp sale, reservation, cancellation, or damage as a stock movement.
6. On zero or configured low threshold, notify admin through the chosen channel.

## 5. Admin: WhatsApp sale and stock coordination

1. Inquiry arrives with product ID and displayed facts.
2. Admin checks current stock and rate snapshot.
3. If the item is to be held, create a reservation with owner-defined expiry; otherwise leave it available.
4. Confirm final amount and delivery/payment policy with shopper.
5. Verify payment before dispatch; mark paid/committed and decrement stock.
6. If customer declines or hold expires, release reservation and restore availability.

## 6. Future checkout flow (not Phase 1)

1. Shopper adds an item to cart.
2. At checkout, system revalidates stock and latest rate snapshot.
3. Show final price, delivery cost, terms, and quote/price validity before payment.
4. Reserve inventory during an owner-approved window.
5. Confirm payment only from trusted payment-provider or verified bank workflow.
6. Create order, issue receipt, and update inventory atomically.

Future checkout requires a rate-locking rule and Nigeria-compatible payment provider decision. Do not implement as part of the WhatsApp-first release.
