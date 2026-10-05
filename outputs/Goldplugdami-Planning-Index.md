# Goldplugdami Planning Pack

**Version:** 0.1 — planning draft  
**Date:** 3 October 2026  
**Status:** Planning only. No website, mockup, or production code has been built.

This index is the entry point for planning the Goldplugdami website. Read the PRD for scope, the strategy for research and page direction, and the readiness audit for decisions and risks. The supporting documents translate those decisions into data, flows, SEO, and technical plans.

## Business facts currently confirmed

- Brand name: **Goldplugdami**.
- Business: gold jewelry and gold bars; categories include earrings, rings, bangles, bracelets, necklaces, pendants, and gold bars.
- Based at **Tejuosho, Yaba, Lagos**; delivers nationwide in Nigeria.
- Owner enters a separate daily selling rate per gram for **18 Karat, 21 Karat, 22 Karat, and 24 Karat**.
- Item final price = applicable Karat selling rate per gram × item weight in grams.
- Example: 18 Karat at ₦180,000 per gram × 2 grams = ₦360,000. This is illustrative, not a current rate.
- First release is a WhatsApp-assisted storefront; online checkout is a later phase.
- Delivery order payment is by bank transfer before dispatch. Shop visitors can pay on arrival; accepted in-shop methods need confirmation.
- Admin-only workspace manages rates, catalog, and stock. Stock alerts go to the admin; alert channel/threshold are undecided.
- Receipts include hallmark/authenticity details; gold bar receipts include the authentication ID.
- Owner will provide logo and product images.
- All customer-facing copy spells **Karat** in full; never abbreviate it.

## Document set

| Document | Purpose | State |
|---|---|---|
| [Product Requirements Document](Goldplugdami-PRD.md) | Product scope, requirements, acceptance criteria, phases | Draft |
| [Landing Page Strategy](Goldplugdami-Landing-Page-Strategy.md) | Research, competitor lessons, conversion strategy, page and interaction plan | Draft; historical research needs careful labeling |
| [Readiness Audit](Goldplugdami-Readiness-Audit.md) | Risks, gaps, priorities, and next steps | Draft |
| [Design System](Goldplugdami-Design-System.md) | Visual tokens, contrast, typography, components, motion, accessibility | Proposed; lock after logo/photo review |
| [Product Catalog Template](Goldplugdami-Product-Catalog-Template.md) | Product, rate, price, stock, image, and authenticity data schema | Draft template |
| [Product Image Intake — Earrings](Goldplugdami-Product-Image-Intake.md) | Preliminary register of the 12 supplied earring photos and fields to confirm | Pending owner review |
| [Product Image Intake — Twist Necklace](Goldplugdami-Product-Image-Intake-Necklace.md) | Two provisional necklace records from the supplied photos | Pending owner review |
| [Product Image Intake — Franco Necklaces](Goldplugdami-Product-Image-Intake-Franco-Necklaces.md) | Two separate 18 Karat Franco necklace records from the supplied photos | Pending quantity and pendant detail |
| [User Flows](Goldplugdami-User-Flows.md) | Shopper, WhatsApp, shop sale, admin, inventory, and future checkout journeys | Draft |
| [SEO and Content Plan](Goldplugdami-SEO-Content-Plan.md) | Site structure, local SEO, content, metadata, measurement | Draft |
| [Technical Plan](Goldplugdami-Technical-Plan.md) | Platform decision, architecture, data, security, integration, launch | Options only; no stack selected |

## Planning gates

1. **Business facts:** confirm product data, rate rounding/freshness, authenticity verification, shop details, delivery and returns.
2. **Content and assets:** collect logo, product images, WhatsApp number, real product weights/Karat/stock, receipt example, shop details.
3. **Experience:** approve design direction, page architecture, wireframes, and interaction states.
4. **Technology:** compare options against daily pricing, stock across sales channels, admin usability, and future Nigeria-compatible checkout.
5. **Build authorization:** begin implementation only after scope, content, operational rules, and platform are approved.

## Open decisions to resolve next

- Weight measurement precision and naira price rounding.
- Daily rate update cutoff, who publishes, and stale-rate behavior.
- Whether exact stock counts are public and how/when an item is held during WhatsApp sales.
- Admin notification channel and low-stock threshold.
- Who issues/validates hallmark and gold bar authentication IDs; customer lookup process.
- Exact public shop address/landmark, hours, and visit policy.
- Nationwide delivery fees, delivery windows, tracking/insurance, returns, and damage/loss handling.
- Shop payment methods and business WhatsApp number.
- First product data, actual photos, and quantities.

## Change control

When a business rule changes, update the PRD first, then the affected flow, catalog schema, design/content/SEO, and technical plan. Mark decisions **Confirmed**, **Proposed**, or **Open** to avoid presenting assumptions as facts.
