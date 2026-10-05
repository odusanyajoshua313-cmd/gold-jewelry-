# Goldplugdami Website — Readiness Audit

**Date:** 3 October 2026  
**Scope:** Review of `Goldplugdami-PRD.md` and `Goldplugdami-Landing-Page-Strategy.md` from software delivery, SEO/content, and UI/UX perspectives.  
**Status:** Audit and planning only. No website, code, or mockup has been built.

## Executive assessment

The product direction is now clear enough to plan: a Lagos gold jewelry and gold bar retailer, with a WhatsApp-first launch, owner-updated selling rates, dynamic product prices, available-stock counts, shop meet-ups at Yaba Tejuosho, and a future checkout phase.

The current documents are a good discovery foundation but are **not implementation-ready**. The project is described as a landing page in places, while the requirements describe a small commerce system with a catalog, rate calculator, owner admin, inventory ledger, alerts, authentication evidence, WhatsApp order handling, local SEO, and future checkout. The next decision should be to name and scope the Phase 1 product as a **WhatsApp-first catalog storefront with owner-managed rate and stock tools**, then settle the operational rules before design.

The daily rate-entry pattern, item-price formula, admin recipient for stock alerts, receipt authenticity details, and sales geography are confirmed: the owner enters a separate selling rate per gram each day for 18 Karat, 21 Karat, 22 Karat, and 24 Karat; each final item price is its Karat rate per gram multiplied by its weight in grams; the receipt records hallmark/authenticity information and a gold bar authenticity ID; Goldplugdami is at Tejuosho, Yaba, Lagos, and delivers nationwide in Nigeria. The biggest remaining blockers are:

1. Calculation precision, rounding, and rate validity.
2. One source of stock truth across the website, WhatsApp sales, and the shop.
3. What “verified hallmark” and the gold-bar authentication ID actually verify.
4. Delivery, return, address, hours, and in-shop payment details.
5. The actual platform/payment/POS combination for Nigeria.

## What is already strong

- The user and business context is specific: jewelry, bars, Lagos, Yaba Tejuosho, nationwide delivery.
- WhatsApp is correctly treated as a conversion action and a manual sales workflow.
- The PRD separates an initial WhatsApp-first release from later checkout.
- Product facts include Karat written in full, weight, price, stock, and visual evidence.
- The design direction avoids using low-contrast gold text and calls for true-to-life product photography.
- The plan recognizes that WhatsApp inquiries and in-store sales will not update website inventory unless staff or a POS records them.
- SEO expectations avoid promising a Google ranking.

## Priority findings

### P0 — Decide before design/build

#### 1. Scope is larger than a landing page

The first release includes multiple catalog/category/product views, the rate table and estimator, admin product/rate editing, stock tracking and alerts, sale/reservation operations, local/shop details, WhatsApp links, and SEO. That is a compact ecommerce product even without checkout.

**Improve:** Use one scope statement everywhere: “Phase 1: WhatsApp-first storefront with owner-managed catalog, daily selling rates, and inventory.” Keep Phase 2 checkout out of Phase 1 acceptance criteria and platform estimates.

#### 2. Pricing details still need precision rules

The user has confirmed that each item's final price is calculated as its applicable Karat selling rate per gram multiplied by its weight in grams. Example: 18 Karat at ₦180,000 per gram × 2 grams = ₦360,000. Separate daily rates are entered for 18 Karat, 21 Karat, 22 Karat, and 24 Karat. Weight precision, currency rounding, rate publication timing, and stale-rate behavior remain undefined. Do not reintroduce unconfirmed making charges or other price components into the formula.

**Improve:** Write a one-page pricing rule with worked examples for a ring, necklace, and gold bar using the confirmed formula. Decide weight precision, naira rounding, daily update cut-off, stale-rate handling, and whether the published price remains valid for a specified time. Keep item price distinct from an estimate tool result where the product itself has a calculated price.

#### 3. “Verified hallmark” and authentication ID need a customer-verifiable process

“Verified hallmark” could mean a visual stamp, a test by a jeweler, an assay by a third party, or another source. The gold-bar ID may be checked by Goldplugdami, its supplier, the refinery, or an independent verifier. The current requirements wisely avoid claiming an independent certificate, but the customer-facing truth and support process are still undefined.

**Improve:** The receipt should include hallmark/authenticity information and the gold bar authentication ID. Document who issues/inspects the mark or ID, how customers verify it, and what Goldplugdami will do if verification fails. Only publish claims supported by the actual process. Keep private unique bar codes off public product pages unless the issuer confirms it is safe.

#### 4. Stock has multiple sales channels and high-value goods

Exact public counts are requested, but stock can change through web inquiries, WhatsApp orders, and physical shop sales. A count is only trustworthy if each completed shop/WhatsApp sale is recorded promptly in the same system. Public counts can also expose more inventory detail than the business wants.

**Improve:** Admin is confirmed as the stock-alert recipient, but delivery channel and low-stock threshold remain open. Decide the source of truth and sale state transitions: available → held/reserved → paid/committed → fulfilled, with expiry/release for unpaid holds and adjustment history for damage/restock. Decide whether public count is always exact or whether the site shows “in stock” and only shows exact numbers at low stock.

#### 5. Delivery/payment policies are not publishable yet

Bank transfer before delivery and payment at the shop are known, but the payment methods at the shop, transfer verification procedure, delivery costs/times, tracking/insurance, proof of delivery, loss/damage handling, returns/exchanges, and refund policy are not.

**Improve:** Make a concise operations/policy sheet before writing conversion copy. A payment screenshot should not count as payment confirmation; define who verifies settlement and when dispatch is authorized. Do not advertise insurance, “secure delivery,” free delivery, guarantees, or returns until confirmed.

#### 6. Shop details and Google profile readiness need verification

The business base and coverage are confirmed: Tejuosho, Yaba, Lagos, with nationwide delivery. The exact public shop address/landmark, hours, walk-in/appointment rules, and business phone are still needed for a map pin, directions, and consistent local business details. Google Business Profile should represent the real customer-facing shop accurately.

**Improve:** Confirm the public address and how customers visit. Then align the site, Google Business Profile, social profiles, and business signage/name. Follow [Google’s Business Profile rules](https://support.google.com/business/answer/3038177?hl=en).

### P1 — Settle before implementation; can be decided after content intake

#### 7. Product model needs a simple canonical data definition

The PRD mixes a single product’s stock with variants. Many individual gold pieces may be one-of-one items, while other items may have multiple sizes/weights. Gold bars need separate fields. The data model should not assume every product is a variant or that multiple pieces have identical weights.

**Improve:** Define three record types: product design/category; sellable SKU or unique physical item; and rate/price snapshot. A unique piece should have its own SKU, exact weight, photo set, and quantity (often one). Repeated units can share a parent product but retain stock at the sellable variant/SKU level. Bar serial/authentication details need restricted access.

#### 8. Daily-rate update needs safe publishing and price history

The requirements mention preview, time stamps, and history, which is good, but not who can publish, how a bad rate is rolled back, or what customers see during an update. A partial recalculation could expose inconsistent prices.

**Improve:** Make rate publication atomic: draft → preview affected SKUs → publish together → record actor/time/source → allow rollback. Add a stale-rate cutoff chosen by the owner; after it expires, keep product pages accessible but suppress old calculated prices and prompt customers to confirm on WhatsApp.

#### 9. Future checkout should not shape Phase 1 beyond justified foundations

The future checkout requirements are useful, but the current PRD includes them beside V1 requirements and may cause unnecessary platform/custom-build work. A dynamic precious-metal price needs explicit price locking and payment behavior, not merely a standard cart.

**Improve:** Phase 1 should have clean product IDs, price/rate snapshots, inventory events, and order statuses. Defer cart, payment gateway, automated reservation expiry, and checkout UI to a future decision gate. Before that phase, assess Nigerian provider availability/fees/settlement, chargebacks, card/bank-transfer status, shipping rules, and any shop POS integration.

#### 10. Admin access and operational ownership need more detail

“Secure sign-in” and “authorized staff” are not enough for a high-value catalog with pricing and stock edits.

**Improve:** Define owner/admin roles, password reset, multifactor authentication if available, who can change rates versus stock, audit history, backups, failed-update recovery, and staff offboarding. Decide who owns daily data entry and the target update time.

## Role-based audit

### Software developer / systems view

- **Architecture:** Do not select Shopify or custom development only because it is popular. Compare candidate platforms against daily variable pricing, manual rate publication, SKU-level stock, alert delivery, WhatsApp links, shop/POS sync, one-of-one items, and a future Nigeria-compatible checkout.
- **Core entities:** business location; Karat selling rate and effective timestamp; product; sellable SKU/unique item; inventory movement; price snapshot; WhatsApp inquiry/order; reservation; payment confirmation; delivery; authenticity evidence.
- **State consistency:** Separate physical on-hand stock from available-to-sell, reserved, paid/committed, damaged, and fulfilled states. Ensure the storefront shows available-to-sell quantity, not a stale cached total.
- **Concurrency:** When checkout is later added, simultaneous customers must not buy the final unit. Reservations need an expiry and a clear release path. Shopify documents committed/reserved stock concepts, but actual suitability depends on the final rate and POS workflow: [inventory states](https://help.shopify.com/en/manual/products/inventory/fundamentals/inventory-states).
- **Price consistency:** Store the displayed price and the rate snapshot used for each confirmed quote/order. Future checkout needs a price-validity rule and a final review step before payment.
- **Failure behavior:** Define what happens if rate editing fails, photos fail to upload, an alert fails, a WhatsApp link is unavailable, or the inventory system is temporarily offline.
- **Auditability:** Every rate and stock edit needs timestamp, user, previous value, new value, and reason. Do not silently overwrite historical prices/stock changes.
- **Security/privacy:** Protect admin access and unique authenticity IDs; minimize customer personal data; avoid putting addresses, phone numbers, or other sensitive information in public analytics or URL parameters.
- **Maintainability:** Name who handles platform subscriptions, domain/hosting renewal, backup checks, product uploads, and security updates.

### UI/UX designer view

- **Primary action mismatch:** The PRD says WhatsApp-first, while the visual plan makes “Shop Gold Jewelry” the hero primary CTA. For Phase 1, decide whether primary means “Browse Jewelry” or “Chat to Order.” Recommended hierarchy: browse is the main hero action; rate and WhatsApp are clearly visible secondary actions; product-level WhatsApp is the purchase action. If lead generation is the overriding goal, swap the hero hierarchy deliberately.
- **Avoid overloading the hero:** Do not put every Karat, category, delivery, authenticity, and location statement in the first screen. Lead with what is sold, Lagos/Nigeria coverage, a strong real photo, and one clear browse action; show current rate as the next section.
- **Rate estimator usability:** Show what the estimate includes, accept decimal weights if operations allow them, validate positive values, and explain that it is an estimate. Provide a simple rate table even if the estimator fails.
- **High-value trust:** Put hallmark/authentication explanation near the product decision, not only in a footer/FAQ. Show real, legible proof and a support route if the buyer cannot verify it.
- **Inventory exposure:** Showing exact remaining stock may create urgency but reveals stock volume. Confirm this preference; consider exact counts only for low quantities. In either case, counts must update from a single reliable source.
- **Product imagery:** One clean product view plus detail and worn/scale photo is more useful than decorative lifestyle-only photos. Avoid editing metal hue. Need minimum photo specs and consistent cropping before design.
- **Responsive behavior:** Specify mobile product grid, sticky WhatsApp action, accessible filter bottom sheet, gallery controls, and rate calculator before producing a visual design.
- **Accessibility:** The palette has candidate AA contrast pairs, but implementation must test all states, focus rings, stock badges, disabled controls, and text over actual photos. Keep reduced-motion and keyboard behavior in scope.
- **In-shop route:** Give “Get directions” and “Chat before visiting” separate actions if visits require coordination. The exact address/hours are prerequisites.

### SEO writer / search view

- **Landing page vs organic coverage:** One long home page will not be enough to target all jewelry and gold-bar product intent. Use crawlable category pages and product-detail URLs for distinct inventory items/categories. Keep category pages useful even when inventory rotates.
- **Local intent:** Build accurate copy around Lagos, Yaba Tejuosho, delivery across Nigeria, and product terms customers actually use. Do keyword research from Search Console after launch, customer WhatsApp language, and available search tools; do not publish thin pages for every Nigerian city.
- **Product markup:** Google’s merchant listing structured data can expose product price/availability, but it is for pages where customers can purchase, and rich display is not guaranteed. Since Phase 1 sends order completion to WhatsApp, do not promise Merchant Listing eligibility or mark up prices/stock in a way that differs from the visible page. Reassess structured data and Merchant Center when direct checkout launches. See [Google’s merchant listing documentation](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing?hl=en) and [product variant guidance](https://developers.google.com/search/docs/appearance/structured-data/product-variants?hl=en).
- **Dynamic price and stock:** Search snippets/feed values must match visible product facts and be fresh. If a product is sold out, keep the detail page informative and mark availability accurately; do not keep advertising a stale price.
- **Karat spelling:** All visible copy uses full “Karat” exactly as requested. Add relevant terms naturally, including product names, Karat, weight, and location. Avoid repeating variants unnaturally.
- **Brand/entity consistency:** Use Goldplugdami consistently in titles, profile, contact info, social links, product data, and the about section. Make the exact shop name/address/phone match across eligible listings.
- **Technical foundations:** One canonical domain; HTTPS; descriptive titles/meta descriptions; one clear page heading; crawlable server-rendered or prerendered product/category content; sitemap; robots/canonical checks; Search Console; image filenames/alt text; internal links and breadcrumbs.
- **Content plan:** Prioritize category/product pages, a truthful Karat explainer, rate/pricing explanation, hallmark/bar-ID verification, delivery/payment, and shop visit details. Avoid generic blog content solely to add page count.
- **Search outcome:** Optimize for qualified local discovery and branded visibility; never promise top ranking or a specific rich result. Google says local results depend on relevance, distance, and prominence; profile completeness helps but cannot guarantee placement: [local ranking guidance](https://support.google.com/business/answer/7091/improve-your-local-ranking-on-google?hl=en-GB).

## Documentation audit

### Strategy document corrections needed

The strategy still contains historical material that needs clearer labeling:

- Some Las Vegas examples are custom jewelers; use them only as visual/UX references, not as direct retail-gold competitors or proof of Goldplugdami's local market.
- Remove or relabel the superseded early assumptions as historical; the approved business is based at Tejuosho, Yaba, Lagos, delivers nationwide in Nigeria, and prices items at Karat selling rate per gram × weight.
- Earlier stack/palette recommendations are duplicated by later sections; the updated “Modern Lagos Gold House” direction should be the single source of truth.

**Recommendation:** Consolidate the strategy into one current document and remove superseded Ghana/Las Vegas/hypothetical custom-work sections. Keep a dated research appendix only if it is explicitly separated from the approved direction.

### PRD improvements needed

- Label requirements by phase: `V1`, `Future checkout`, or `Post-launch`; currently future FR-38–FR-42 sit among first-release functional requirements.
- Add measurable acceptance scenarios for rate update, expired/stale rate, stock decrement, sold out alert, failed alert, WhatsApp order confirmation, rate change while order is pending, and shop sale.
- Add a glossary for selling rate, calculated price, price estimate, public price, reservation, committed stock, verified hallmark, and authentication ID.
- Add requirement ownership and priority (`Must`, `Should`, `Could`) so platform and cost estimates can be scoped.
- Define analytics events and privacy: category view, product view, rate table view, estimate submitted, WhatsApp click, order confirmed, paid, shipped, delivered, and shop direction click. Avoid logging private chat content.
- Add non-functional target values and how they will be measured rather than broad phrases such as “fast” or “secure.”

## What is needed to make the product come alive

### Business inputs

1. A daily rate table for 18 Karat, 21 Karat, 22 Karat, and 24 Karat, plus examples of the confirmed item-price formula: Karat rate per gram × weight in grams. Decide precision and rounding.
2. First catalog spreadsheet for each SKU/unique item: category, name, Karat, weight, dimensions, price, stock, description, and authentication evidence.
3. Product photo set: front, detail/hallmark, scale/on-person where appropriate; identify the actual hero products.
4. Exact public shop address/landmark within Yaba Tejuosho, hours, visit rules, phone, and map pin. Lagos base and nationwide delivery are confirmed.
5. Delivery table by area/state, price or quote method, delivery time range, tracking/insurance, and issue/return process.
6. Bank-transfer confirmation procedure, shop payment methods, receipt sample, hallmark proof, and gold-bar authentication instructions.
7. WhatsApp Business number, response hours, owner/staff who handles inquiries, and message handoff process.

### Decisions

1. Is exact public stock count shown for every product or only near sellout?
2. What event reserves stock for a WhatsApp sale, and what is the reservation expiry?
3. Who receives low-stock/sold-out alerts, through which channel, and at what threshold?
4. Does a shop POS/inventory tool exist, or will staff update stock using the website admin?
5. Which platform fits the rate calculation, catalog, alerts, future checkout, Nigerian payments, and inventory sync? Decide from a scored comparison, not preference alone.
6. Which hero CTA is primary in V1: browse categories or start WhatsApp?

## Recommended next sequence

1. **Resolve P0 operations and pricing** from the list above. Do not design around invented price/purity/delivery promises.
2. **Revise the PRD** into phase-labelled, prioritized, testable requirements and approve the V1 scope.
3. **Create the product data template and populate the first five categories** with actual item data/photos.
4. **Compare commerce platform options** against the real pricing, inventory, shop-sale, alert, and future-payment requirements.
5. **Consolidate the design direction** after inspecting the actual logo and photos; create annotated Mobbin/Pinterest references and one approved design system.
6. **Write the page content and SEO map** from actual product/search intents; settle title/H1/URL patterns and local business facts.
7. **Produce wireframes and interaction specs** for mobile and desktop, including rate, catalog, sold-out, WhatsApp, and admin states.
8. Only after those reviews are approved should implementation planning and estimates begin.

## Required Markdown files

The current Strategy and PRD are enough for the discovery record, but the following files would make the project handoff clearer:

1. `Goldplugdami-Readiness-Audit.md` — this audit, blockers, risks, and next actions.
2. `Goldplugdami-Design-System.md` — final tokens, contrast pairs, type, components, photography direction, motion, accessibility.
3. `Goldplugdami-Product-Catalog-Template.md` — product/rate/stock fields and first catalog data.
4. `Goldplugdami-User-Flows.md` — customer ordering, rate estimate, admin updates, stock, alerts, shop purchase, and future checkout.
5. `Goldplugdami-SEO-Content-Plan.md` — page/URL map, local keywords, page titles, metadata, product copy rules, Search Console/local profile plan.
6. `Goldplugdami-Technical-Plan.md` — platform comparison, data model, integrations, security, backup, alerts, deployment and maintenance owners.

Do not create a generic `README.md` or `AGENTS.md` just to add files. A repository `README.md` becomes useful when a code project exists; project-specific developer instructions should be written only if an implementation team needs them.

## Sources for the audit

- [Google Business Profile eligibility/representation](https://support.google.com/business/answer/3038177?hl=en)
- [Google local ranking guidance](https://support.google.com/business/answer/7091/improve-your-local-ranking-on-google?hl=en-GB)
- [Google merchant listing structured data](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing?hl=en)
- [Google product variant structured data](https://developers.google.com/search/docs/appearance/structured-data/product-variants?hl=en)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [W3C WCAG 2.2 contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [Shopify inventory states](https://help.shopify.com/en/manual/products/inventory/fundamentals/inventory-states)
