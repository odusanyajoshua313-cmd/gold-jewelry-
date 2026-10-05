# Goldplugdami Website — Product Requirements Document

**Version:** 0.1 — planning draft  
**Date:** 3 October 2026  
**Status:** Requirements planning only. No website, mockup, or checkout has been built.

## 1. Purpose

Define requirements for a mobile-first Goldplugdami online storefront that presents gold jewelry and gold bars, shows the owner’s daily selling rate and available stock, and helps customers place orders through WhatsApp. The first release is WhatsApp-first. The product and inventory model should support online checkout in a later release.

## 2. Product summary

Goldplugdami is a gold jewelry and gold bar store based at Tejuosho, Yaba, Lagos. The store sells online, meets customers at its shop, and delivers nationwide in Nigeria. Product categories include earrings, rings, bangles, bracelets, necklaces, pendants, and gold bars. The owner enters daily selling rates for 18 Karat, 21 Karat, 22 Karat, and 24 Karat; each item’s final price is its applicable Karat rate per gram multiplied by its weight in grams. For each product, the owner uploads an image and provides its accessory type, design where known, Karat, weight in grams, and stock. Product availability depends on actual stock.

**Confirmed pricing example:** 18 Karat selling rate of ₦180,000 per gram × 2 grams = **₦360,000** item price. Record item weight in grams. Weight precision and how to round amounts that include kobo remain open.

Customers should be able to browse real products and their Karat, weight, calculated price, and quantity available; understand the current selling rate; review authenticity information; and start an item-specific WhatsApp order. Delivery orders are paid by bank transfer before dispatch. Shop customers can pay when they arrive; accepted in-shop payment types still need confirmation.

## 3. Goals

1. Explain quickly what Goldplugdami sells, where it is based, and where it delivers.
2. Make product discovery simple across the five confirmed jewelry categories and the separate gold bar range.
3. Display the owner-provided daily selling rate per gram, with Karat and last-updated time.
4. Show accurate product availability and remaining quantity.
5. Let the owner update rate, prices, product photos, product information, and stock without editing code.
6. Convert interest into clear WhatsApp inquiries/orders.
7. Present verified hallmark and gold bar authentication ID information accurately.
8. Keep data and workflows ready for a future online cart and checkout.

## 4. Non-goals for the first release

- Online cart or checkout, until the later phase.
- Automated payments or cryptocurrency.
- Claims of independent assay, certification, guarantee, insurance, or testing that Goldplugdami cannot substantiate.
- Automated live pricing from a market feed unless the rate source and calculation method are later specified.
- Custom jewelry design services unless Goldplugdami confirms it offers them.
- Displaying public authentication ID codes that could expose or duplicate a unique code before purchase.

## 5. Users and needs

### Shopper

- Wants gold jewelry or a gold bar and needs to compare type, Karat, weight, price, and stock.
- Needs confidence that the item and authenticity information are real.
- Wants to know how delivery/payment works and how to visit the Lagos shop.
- Prefers to confirm the current item price and availability on WhatsApp.

### Owner or staff member

- Needs to publish today’s selling rate and timestamp.
- Needs to add/update product photos and details, adjust inventory, and mark products sold out/restocked.
- Needs alerts when a product becomes low in stock or sells out.
- Needs inventory to remain accurate across online inquiries and shop sales.

## 6. First-release customer journey

1. Customer lands on the site from Search, social media, or a shared link.
2. Hero immediately identifies Goldplugdami as a gold jewelry and gold bar store based at Yaba Tejuosho, with delivery across Nigeria.
3. Customer chooses Jewelry, Gold Bars, or Today’s Gold Rate.
4. Customer browses categories/products and sees full-word Karat, weight, calculated price, stock quantity, and trust details.
5. Customer opens an item or uses the weight estimator; estimate is clearly distinguished from a final confirmed order price if needed.
6. Customer taps WhatsApp CTA. A prepared message identifies the product and asks to confirm current price, availability, and delivery to the customer’s city/state.
7. Staff confirms stock/price, records a reservation/order and payment outcome in the shared inventory workspace, and then dispatches after bank transfer is confirmed.
8. For a shop visit, customer sees the Yaba Tejuosho location/visit details and can pay at the shop upon arrival.

## 7. Information architecture

- Home
- Jewelry catalog
  - Earrings
  - Gold Rings
  - Bangles
  - Pendants
  - Gold Necklaces
- Gold Bars
- Gold Rate Today
- How to Buy
- Authenticity / Hallmark information
- Delivery and payment
- Visit the Yaba Tejuosho shop
- Frequently asked questions
- Contact / WhatsApp
- Policies and privacy information

## 8. Functional requirements

### 8.1 Storefront content and navigation

- **FR-01:** The home page must identify the brand as Goldplugdami and summarize the real product range and delivery area.
- **FR-02:** Main navigation must expose Jewelry, Gold Bars, Gold Rate, How to Buy, Visit Us, and WhatsApp.
- **FR-03:** The catalog must support earrings, rings, bangles, bracelets, necklaces, pendants, and gold bars. The home page may feature a curated subset based on actual photos and stock.
- **FR-04:** Gold bars must have a distinct path because their product and authenticity details differ from jewelry.
- **FR-05:** All public-facing Karat labels must spell “Karat” in full. Examples: “18 Karat,” “22 Karat,” “24 Karat.” Never display the single-letter abbreviation.
- **FR-06:** Public content must describe delivery across Nigeria and the Yaba Tejuosho shop accurately.

### 8.2 Daily selling rate and price calculation

- **FR-07:** An authorized owner/staff user must be able to enter four separate selling rates per gram each day: 18 Karat, 21 Karat, 22 Karat, and 24 Karat.
- **FR-08:** The site must display the rate in Nigerian naira per gram, with the Karat written in full and the last-updated date/time in West Africa Time.
- **FR-09:** The final item price must be calculated as the selling rate per gram for that item’s Karat multiplied by the item’s weight in grams.
- **FR-10:** The owner must be able to preview recalculated prices before publishing a rate change.
- **FR-11:** The storefront must distinguish the per-gram Karat rate from the calculated item price. A weight estimator must show the rate multiplied by the entered weight and identify the Karat used.
- **FR-12:** If the owner has not published that day’s rates by the configured freshness cutoff, the site must not label previous rates as current; it must show the actual timestamp and prompt the customer to confirm the current price.
- **FR-13:** Rate history must be retained for operational review.

### 8.3 Product catalog and inventory

- **FR-14:** Owner/staff must be able to create/edit/archive a product without code changes.
- **FR-15:** Each product record must support name, SKU, accessory type/category, design/style where known, photos, Karat, exact weight in grams, size/length where relevant, price calculation inputs, public price or quote state, stock quantity, and active/sold-out state.
- **FR-15a:** When the admin uploads a product image and enters its accessory type, design, Karat, weight, and stock, the admin workspace should prepare a factual product title and description draft from those fields for admin review before publishing. It must not infer Karat, weight, authenticity, or other product facts from the image.
- **FR-15b:** The product description must show the applicable Karat, weight in grams, calculated price using the current rate snapshot, stock status, and relevant customer next step. Any missing details must remain blank or be flagged for admin completion rather than invented.
- **FR-16:** Gold bar records must additionally support weight, stated purity, maker/refinery if known, documentation details, and authentication guidance.
- **FR-17:** Storefront cards and detail pages must show product image, name, Karat, weight, price or clear quote state, and quantity available.
- **FR-18:** Product stock must be tracked by SKU/variant where a product has different sizes, Karats, or lengths.
- **FR-19:** If available quantity reaches zero, the site must show “Sold out” and disable the order action for that SKU. Customers may be offered an “Ask when available” action.
- **FR-20:** Owner/staff must be able to update quantities for restock, damage, shop sale, WhatsApp sale, and count correction. Each change should record who changed it, when, and why.
- **FR-21:** The site must show exact remaining quantity as currently requested, using the same inventory source as the admin workspace.
- **FR-22:** A low-stock threshold should be configurable per product or globally; the admin receives an alert at low stock and at sold out. The delivery channel remains to be selected.
- **FR-23:** The storefront must never invent urgency or show inaccurate quantity.

**Example product entry and draft copy:**

- Admin input: `Necklace | Twist design | 18 Karat | 10 grams | quantity: entered by admin | uploaded product image`
- Draft title: **18 Karat Gold Twist Necklace — 10 grams**
- Draft description: “18 Karat gold necklace in a twist design. Weight: 10 grams. Calculated price: current 18 Karat selling rate per gram × 10 grams. Stock: [current quantity/status]. Contact Goldplugdami on WhatsApp to confirm availability and arrange delivery or a visit to Tejuosho, Yaba, Lagos.”

This is a content-generation requirement for the admin workflow, not a claim that the feature is implemented. Admin reviews and approves the draft before it is public. The actual price is calculated from the current rate, not copied from this example.

### 8.4 WhatsApp ordering

- **FR-24:** Each in-stock product must provide an item-specific WhatsApp action.
- **FR-25:** Prefilled text must include product name/SKU, Karat written in full, weight, displayed price or estimate, rate timestamp, and a prompt for availability/delivery confirmation.
- **FR-26:** Delivery order information must state that bank transfer is required before dispatch.
- **FR-27:** An inquiry alone must not decrement inventory. Staff must record a reservation or confirmed paid sale in the inventory workspace.
- **FR-28:** The product must offer a fallback contact method if WhatsApp does not open.
- **FR-29:** After checkout launches, WhatsApp must remain available for questions and assisted orders.

### 8.5 Trust and authenticity

- **FR-30:** Jewelry detail pages must show verified hallmark information and, where available, a clear real close-up image.
- **FR-31:** Gold bar details must explain the authentication ID process.
- **FR-32:** Full unique gold bar authentication IDs must not be exposed on public listings unless Goldplugdami confirms that public display is safe; a masked example or post-purchase instructions may be used.
- **FR-33:** The site must distinguish a purchase receipt from an assay certificate or independent test report.
- **FR-34:** The exact scope of any purity/authenticity guarantee must be approved before publishing guarantee language.
- **FR-43:** The purchase receipt must include the authenticity/hallmark information supplied for the purchased item. For a gold bar, include its authentication ID on the receipt; document how a customer can use that ID before describing it as independently verified.

### 8.6 Shop and delivery

- **FR-35:** The site must provide the Yaba Tejuosho shop location, address/landmark, hours, and walk-in/appointment procedure once approved for public display.
- **FR-36:** The delivery section must describe Lagos and nationwide delivery, payment before dispatch, and actual delivery cost/timing/handling after those are confirmed.
- **FR-37:** In-shop payment options must be named once confirmed; bank transfer is confirmed for delivery orders.

### 8.7 Future checkout

- **FR-38:** The data model and product URLs should support future cart and checkout without re-entering catalog data.
- **FR-39:** Checkout must validate stock and reserve/commit inventory to prevent concurrent purchase of the last item.
- **FR-40:** Checkout must show the final price and disclose rate/quote validity before payment; rate changes must not silently change a price after customer confirmation.
- **FR-41:** Paid online orders must update inventory automatically. Shop and WhatsApp sales must also update the same inventory source through point-of-sale synchronization or a staff action.
- **FR-42:** Payment provider selection and online checkout requirements are deferred until the next phase.

## 9. Design-system and experience requirements

- Use the proposed “Modern Lagos Gold House” direction in the strategy: Aubergine Ink, Warm Chalk, Lagoon Teal, Clay Red, Aged Brass, and a separate WhatsApp Deep Green action color. Final tokens must be checked against the supplied logo.
- Use true-to-life product imagery; do not recolor gold or use generic imagery as product evidence.
- Use an editorial display face for short headings and a legible sans-serif for prices, product facts, navigation, and forms.
- Meet WCAG 2.2 AA contrast targets, provide visible keyboard focus, semantic controls, descriptive image text, and reduced-motion support.
- Use restrained transitions that confirm an interaction; no scroll-jacking, required hover behavior, or animation that delays WhatsApp.
- Full Karat spelling applies to all public-facing strings and metadata.

## 10. Admin requirements

- An admin-only, password-protected section with secure sign-in; public visitors must not be able to access rate or inventory editing.
- Mobile-friendly rate update, rate preview, publish, product/photo editing, quantity changes, and order/reservation recording.
- Inventory event history and previous rate history.
- Notifications to the admin for low stock and sold out; alert channel and threshold remain to be selected.
- Rate and stock changes should show the effective timestamp and responsible user.
- A single inventory source of truth must be shared between the storefront and shop workflow. If no point-of-sale integration is available, provide a fast mobile workflow for recording physical sales.

## 11. Non-functional requirements

- **Mobile-first:** usable on common phones and slower mobile networks.
- **Performance:** optimize product images and avoid heavy third-party scripts; target Core Web Vitals “good” thresholds where field data is available.
- **Availability/data accuracy:** clearly timestamp rate data and prevent stale data from appearing current.
- **Security:** HTTPS, limited admin permissions, strong authentication, backups, and protected customer/order data.
- **Accessibility:** keyboard support, focus visibility, appropriate contrast, text labels, touch-friendly controls, and reduced motion.
- **SEO:** crawlable category/product copy, descriptive titles and headings, product metadata, accurate shop details, structured data where eligible, and Search Console/sitemap setup.
- **Privacy:** collect only required customer information, explain its use, and do not place private personal data in WhatsApp link parameters.

## 12. Success measures

- Product page visits and category engagement.
- Gold-rate module views and estimate interactions.
- WhatsApp click-throughs by category/product.
- Qualified WhatsApp inquiries, confirmed orders, and fulfilled deliveries.
- Rate-update freshness and inventory accuracy.
- Number of oversells/stock discrepancies.
- Low-stock and sold-out alert delivery.
- Search impressions/clicks for Goldplugdami brand and relevant Lagos/Nigeria product queries.
- Shop direction/contact actions if the physical address is published.

Do not set numeric targets until a traffic and sales baseline exists.

## 13. Acceptance criteria for first release

The first release is ready for launch planning when:

1. Admin can enter separate daily rates for 18 Karat, 21 Karat, 22 Karat, and 24 Karat, preview prices calculated as rate per gram multiplied by item weight, and publish the rate set.
2. Public rate rows show full Karat spelling, Nigerian naira per gram, and a truthful timestamp.
3. Owner can add/edit product photos/details and update quantities from a phone or desktop.
4. Product pages display correct Karat, weight, price/quote state, and quantity.
5. A stock change to zero produces the sold-out state and an owner alert.
6. WhatsApp actions carry the correct product information and open the intended business number.
7. Shop/WhatsApp sales can be recorded in the same inventory source.
8. Hallmark and gold bar authentication copy is approved and accurate.
9. Payment/delivery/shop facts are stated accurately and no unsupported promise is shown.
10. Mobile, accessibility, privacy, performance, SEO, and contact-path reviews are complete.

## 14. Open decisions

1. The daily input pattern is confirmed: owner enters a separate per-gram selling rate for 18 Karat, 21 Karat, 22 Karat, and 24 Karat. Still define who publishes updates, the daily freshness cutoff, and what customers see after rates expire.
2. The final-price formula is confirmed as Karat selling rate per gram multiplied by weight in grams. Define rounding/decimal precision and how weight is recorded.
3. Exact hallmark verification process and what documentation/guarantee the customer receives.
4. Exact gold bar authentication ID lookup process. The ID will be written on the purchase receipt; define what the customer can check with it.
5. Shop area is Tejuosho, Yaba. Exact public address/landmark, hours, and walk-in or appointment policy remain to be confirmed.
6. In-shop payment methods; bank transfer is confirmed for delivery orders.
7. Delivery costs, time ranges, tracking/insurance, and returns/exchange procedure.
8. Admin is the alert recipient. Alert channel (email/app/WhatsApp) and low-stock threshold remain to be selected.
9. Whether exact stock count is public for every product or only at low stock; first-release assumption is exact public count.
10. How long WhatsApp-confirmed orders should reserve stock while payment is pending.
11. Goldplugdami will provide the images. Which initial products, weights, Karats, and quantities will populate the catalog remains to be collected.
12. Whether a shop point-of-sale/inventory system already exists.
13. Future online checkout payment provider(s) and price validity behavior.

## 15. Phased delivery

### Phase 0 — Requirements and assets

Resolve open decisions; inspect logo and photos; verify product data, rate formula, authentication evidence, location details, policies, and WhatsApp account.

### Phase 1 — WhatsApp-first catalog

Design system, responsive storefront, rate board/estimator, five category paths, product catalog, owner rate/product/inventory workflow, stock alerts, shop/delivery trust content, SEO foundations, analytics, and WhatsApp ordering.

### Phase 2 — Checkout

Add cart, payment provider, delivery selection, order confirmations, inventory reservation and release, shop stock synchronization, and price validity handling.

### Phase 3 — Optimization

Review product/WhatsApp funnel, search/local performance, inventory discrepancies, and customer questions; refine content, categories, rate display, alerts, and checkout.

## 16. Design inspiration approach

Use Mobbin to inspect real product discovery, filter, product detail, sold-out, cart, and checkout flows. Use Pinterest to collect art direction, product photography, crop, and editorial color references. Save references to an annotated board under brand mood, shopping interaction, and photography. Record what each reference teaches and adapt it to Goldplugdami rather than copying layouts or assets.

## 17. Supporting documents

- [Goldplugdami landing-page strategy](Goldplugdami-Landing-Page-Strategy.md)
- [Mobbin](https://mobbin.com/)
- [Google Business Profile guidelines](https://support.google.com/business/answer/3038177?hl=en)
- [Google LocalBusiness structured data guidance](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [W3C WCAG 2.2 contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [Shopify inventory management](https://help.shopify.com/en/manual/products/inventory)
- [Shopify checkout inventory checks](https://help.shopify.com/en/manual/checkout-settings)
