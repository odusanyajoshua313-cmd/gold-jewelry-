# Goldplugdami Technical Plan

**Version:** 0.1 — options and requirements only. No platform or architecture is selected.

## 1. Product boundary

Phase 1 is a WhatsApp-first catalog storefront with a protected admin workspace for four daily Karat selling rates, products, stock movements, and stock alerts. Future online cart/checkout is a separate phase. The central engineering challenge is keeping rate, calculated item prices, and inventory accurate across website, WhatsApp orders, and the Tejuosho shop.

## 2. Platform evaluation criteria

Compare at least hosted commerce platform, CMS plus commerce plugin, and custom application. Score each on:

- Admin usability on mobile; safe daily rate entry and preview/publish.
- Price computation from rate-per-gram × exact product weight, snapshots/history, and currency rounding.
- Unique item/SKU support and stock movements across shop and online channels.
- Admin-only access, role controls, audit trail, backups, recovery, and low-stock notifications.
- Nigeria hosting/performance, payment-provider availability and fees for future checkout, tax/delivery workflows.
- WhatsApp deep links; Search indexing; accessible product templates; SEO control.
- Total cost of ownership, maintenance owner, vendor lock-in, and data export.

Do not select a platform based only on popularity. Validate dynamic price support and in-person inventory/POS sync with a working proof of concept before commitment.

## 3. Logical data model

- `AdminUser`: identity, role, status, last login.
- `KaratRate`: Karat, NGN/gram, effective timestamp, draft/published state, entered/published by, previous version.
- `Product`: name, category, description, active state, image references.
- `SellableItem`: unique SKU, product ID, Karat, weight, size, stock quantity/status, private authenticity reference.
- `PriceSnapshot`: SKU, rate record ID, weight used, calculated NGN amount, rounding policy version, created timestamp.
- `InventoryMovement`: SKU, delta, reason, channel, reference/order, admin, timestamp.
- `Inquiry/Order`: item, rate/price snapshot, contact workflow state, payment/delivery state, timestamps; minimize personal data.
- `AuthenticityEvidence`: evidence type, public explanation, private code/reference, receipt inclusion flag, verification instructions.

## 4. Pricing and publication behavior

1. Store each Karat's rate independently; do not derive rates from one base rate unless the owner changes the requirement.
2. Store weight as a precise decimal value with defined scale, never binary floating-point for money calculation.
3. Calculate item price using the confirmed formula: applicable rate per gram × item weight in grams.
4. Apply one approved currency-rounding rule consistently and record the rate snapshot used for display/quote.
5. Admin drafts all four rates, previews affected item prices, then publishes atomically with WAT timestamp and audit event.
6. Define expiry/stale behavior before launch. If the rate is stale, do not continue labeling the calculated price as current.
7. When a customer has a confirmed WhatsApp quote, preserve the rate/price snapshot and communicate validity; future checkout requires a formal price lock.

## 5. Inventory and alerts

- One source of truth for website and shop/WhatsApp sale adjustments.
- Every movement records before/after quantity, reason, actor, timestamp, channel, and linked order where available.
- Clarify reserve/hold conditions and expiry; inquiries alone should not decrement stock.
- Prevent negative stock and concurrent overselling where the chosen platform supports it.
- Admin receives sold-out alert. Channel and low-stock threshold are still open; make delivery/retry/failure status visible to admin.
- Reconcile stock regularly and provide a correction reason field.

## 6. Security and privacy

- Protect admin routes and APIs; no public admin links or credentials in source control.
- Use strong password policy, secure sessions, rate limiting, password reset, and multifactor authentication if supported.
- Restrict changes by role where multiple staff exist; log rate and stock edits.
- Back up catalog/rates/orders and document restore steps.
- Keep full gold bar authentication IDs private until purchase/receipt if public exposure risks duplication.
- Collect only necessary customer data; define retention and access; do not send message contents or personal details to analytics.
- Keep payment confirmation manual/trusted in Phase 1; never treat a customer screenshot as verified settlement.

## 7. Integrations and operations

- WhatsApp click-to-chat with encoded SKU/product facts and a fallback phone-copy action.
- Google Business Profile and Search Console after exact public shop details are verified.
- Future payment provider selected only after Nigerian availability, fees, settlement, refunds, and reconciliation are assessed.
- POS/inventory integration must be investigated; otherwise provide a fast mobile admin sale-adjustment workflow.
- Admin runbook: daily rate update, product publishing, stock recording, payment verification, notification handling, backup check, incident contact.

## 8. Non-functional requirements

- Responsive and accessible to WCAG 2.2 AA target; keyboard, screen reader, and reduced-motion support.
- Fast mobile load, optimized user-provided images, minimal third-party scripts.
- Search-friendly server-rendered or prerendered catalog content.
- HTTPS, uptime/backup monitoring, error logging, and recoverable rate/inventory publication.
- Currency and timestamps consistent: NGN and West Africa Time for owner-entered updates.

## 9. Delivery roadmap

1. **Discovery:** settle open business/policy rules and gather sample data/assets.
2. **Platform spike:** test rate × weight, atomic publishing, inventory tracking, admin protection, and export on candidate platforms.
3. **Experience design:** approve flow maps, information architecture, responsive wireframes, and design tokens.
4. **Phase 1 implementation:** catalog, rate board, protected admin, inventory ledger, notifications, WhatsApp flow, SEO foundations.
5. **Operational validation:** test price examples, stock sale/update across channels, stale-rate behavior, receipt fields, mobile usability, backups.
6. **Launch:** publish only after business facts and policies are approved; monitor Search Console and inquiry/stock mismatch metrics.
7. **Future checkout gate:** confirm price lock, payment provider, delivery fees, refunds, fraud controls, and shop sync before cart/payment build.

## 10. Decisions blocking stack selection

Weight precision/rounding; stale-rate cutoff; reservation rules; stock exactness; notification channel/threshold; POS status; public location details; delivery/returns; authenticity lookup; admin staffing; hosting/budget/maintenance owner; checkout payment-provider expectations.
