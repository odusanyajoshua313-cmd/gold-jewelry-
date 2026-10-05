# Goldplugdami Storefront — Product and Software Audit

**Date:** 4 October 2026  
**Scope:** Read-only product design, interaction, layout, and frontend implementation review of `outputs/goldplugdami-site/`.  
**Status:** Audit only. No storefront files were changed during this review. The current color palette is retained; no color redesign is proposed.

## Executive assessment

The page has a recognizable brand direction, real product photography, an understandable rate × weight explanation, and a mobile navigation pattern. It is still a visual prototype rather than a functioning sales storefront. The largest conversion and product gaps are that WhatsApp actions do not open a WhatsApp chat, several different intents lead to the same generic message, and product rate/stock values are placeholders. The next revision should improve hierarchy, action context, icon consistency, photo composition, and component consistency while preserving the existing palette.

## Priority findings

### P0 — WhatsApp actions do not reach WhatsApp

The header, visit, footer, floating, and general contact actions open the same dialog. The dialog instructs the customer to copy a message and paste it into WhatsApp; no business number is configured. As a result, “Message us” currently adds friction and does not complete the intended contact action.

**Recommendation:** Once the business number is supplied, make the main contact actions open a `wa.me` link with an intent-specific prefilled message. Keep a copy-message fallback only if the WhatsApp handoff fails. Do not label a copy dialog as a direct WhatsApp action.

### P0 — Rates and inventory are not live product data

All rate cells show “Rate to be updated”; every card shows “Price to be confirmed” and “Availability to be confirmed.” There is no connected admin workflow, price calculation from published rates, stock source, or stock status. The site is transparent about this, but the collection does not yet let customers make a confident buying decision.

**Recommendation:** Connect real daily rates and item data before launch. Keep a purposeful empty-rate state with one update timestamp and a clear contact action. Do not show guessed rates, prices, or inventory.

### P1 — WhatsApp icon treatment is not consistent or recognizable as the WhatsApp brand

Message controls use several variations of a generic hand-drawn chat bubble. The header/floating controls include a phone-like stroke, while the visit and footer controls show only an outline bubble. None is a consistent WhatsApp mark. The site also uses arrows for non-WhatsApp actions, with differing visual weight.

**Recommendation:** Use the same recognizable WhatsApp logo mark for every WhatsApp action. Keep it at one optical size and alignment, paired with the same label spacing. Use separate, consistent arrow icons only for navigation actions. Preserve the current colors; color is not the main icon issue.

### P1 — Similar contact buttons have identical behavior despite different intent

The product-card action correctly includes a product reference. However, “Ask about a visit,” “Ask us a question,” “Message us,” and footer “WhatsApp” all produce a generic jewelry/rates inquiry. The visit button does not ask about directions or appointment details, and the general contact action does not preserve its source/context.

**Recommendation:** Define button intent before implementation:

| Action | Intended result |
|---|---|
| Product inquiry | Include product reference, Karat, weight, and ask for current price/availability |
| Rate inquiry | Ask for today’s four Karat-specific rates |
| Visit inquiry | Ask about visiting Tejuosho, Yaba and request hours/directions |
| General WhatsApp | Open a short general greeting |
| Browse / rate links | Navigate to the relevant section; do not open a contact dialog |

Use one visual style per action hierarchy, while letting each button preserve its intent.

### P1 — Button hierarchy and component rules are fragmented

The page has primary and secondary buttons, but also custom product buttons, text links rendered as buttons, footer text buttons, dark/light variants, filter chips, and dialog controls. Their size, border, icon placement, and interaction feedback are not fully governed by one component rule. Hover, pressed, focus, and selected states exist, but they are implemented across different selectors.

**Recommendation:** Establish a compact button set: primary action, secondary action, quiet text action, icon-only control, and filter chip. Define minimum height, horizontal padding, corner radius, icon size/gap, hover, pressed, focus-visible, disabled, and loading states. Keep links for navigation and buttons for actions.

### P1 — Product imagery and cards spend too much area on the scale/background

The source photos are useful evidence for weight, but the scale and surrounding surface occupy much of each image. In the two-column mobile grid, the jewelry can appear small and card titles repeat “18 Karat” already shown in the badge. This reduces the visual impact of the products and creates redundant content.

**Recommendation:** Use owner-approved, true-color product crops as the main card image and keep the scale/weight photo as a secondary detail image or proof view. Do not digitally change the gold color. Remove repeated facts from either the title or badge, and use a stable layout for title, design, weight, price, status, and action.

### P1 — Some content blocks feel spacious without adding hierarchy

The hero, rate area, product section, and trust section use generous vertical spacing, but the page does not always fill that space with meaningful product or trust content. A large rate explainer and repeated placeholder states can make the page feel sparse while the key collection details remain visually secondary.

**Recommendation:** Preserve the editorial whitespace, but make each section earn its height: bring product cards and one clear action forward, group price/weight facts compactly, and use a single shared timestamp/status instead of repeating empty states. Align section headings, descriptions, grids, and CTAs to a consistent content edge.

### P2 — The stylesheet is difficult to maintain and audit

The stylesheet contains compressed, long rule lines and multiple appended override blocks. The same breakpoints and components are restated in different places (including repeated mobile and reduced-motion rules). This makes it difficult to identify the final applied style and increases the chance of accidental regressions.

**Recommendation:** Reformat and organize CSS into tokens, base/type, layout, components, states, responsive rules, and motion. Consolidate each breakpoint and component rule into one authoritative location. Keep the palette tokens as-is while removing duplicated literal values only after visual approval.

### P2 — Responsive behavior needs a wider breakpoint review

The narrow mobile view has a collapsed menu and a two-column product grid. Hiding the floating message button on mobile avoids overlapping cards. However, the hero’s two CTAs are side-by-side between 391–700 px and switch to stacked at 390 px; the tight range may produce a cramped or wrapped row. Product facts also switch to stacked only at 390 px while cards remain narrow above that breakpoint.

**Recommendation:** Review the actual layout at 320, 375, 430, 768, 1024, and wide desktop widths. Let available width determine when hero actions stack; keep product fact labels readable and prevent wrapping from misaligning card actions. Confirm desktop navigation, grid density, image crops, and sticky-header offsets at each size.

### P2 — Existing card/filter behavior needs clearer state feedback

Category filters correctly update the grid and pressed state. The active filter count is hard-coded as “08” for all pieces, while category filters do not show counts. Filter changes replace card content but have no clear empty/loading state if the data later becomes dynamic. Product CTA action and filter feedback are visually similar to generic buttons.

**Recommendation:** Derive counts from actual data, clearly distinguish the selected filter, and add an empty state for categories with no available products. Keep sold-out state separate from an empty catalog and do not imply live availability until the inventory source is connected.

## What is working

- The palette has good brand distinction and should remain unchanged in this revision.
- Karat is written in full in the public content.
- The rate × weight calculation is explained transparently.
- Product cards include item-specific Karat, weight, and product reference in the inquiry message.
- The responsive mobile menu exposes section navigation and closes after a section is selected.
- Scroll reveals respect reduced-motion preferences; buttons have pressed/focus feedback, and navigation has an active-section state.
- Stock and prices are labeled as unconfirmed rather than fabricated.

## Recommended order for the next revision

1. Supply the business WhatsApp number and implement direct, intent-specific WhatsApp handoffs.
2. Establish the button/icon component rules and use one consistent WhatsApp mark.
3. Connect rates and inventory or define a launch-safe state that does not show repeated placeholder cards as ready-to-buy stock.
4. Improve product image presentation and remove duplicated Karat labels.
5. Refactor CSS into one maintainable component/responsive system without changing the approved palette.
6. Review the layout and interactions across mobile, tablet, and desktop widths, including keyboard and reduced-motion behavior.

## Audit limits

This is a frontend-only review. No backend, protected admin, rate entry, stock sync, live WhatsApp routing, payment flow, or deployed production environment is present to audit. The app was not edited as part of this report.

## Follow-up implementation — 4 October 2026

The requested storefront fixes have been applied after this read-only audit:

- Standardized message controls on the WhatsApp brand mark and added contextual prefilled inquiries for general questions, today’s rates, product questions, hallmark/receipt questions, and a shop visit.
- Added a WhatsApp handoff path that becomes active when the owner’s number is configured. Until then, the page clearly offers the copy-message fallback.
- Replaced the fixed category total with counts calculated from the current product list.
- Clarified product-card copy to ask customers to confirm the current rate and stock, rather than implying that live pricing or inventory already exists.
- Tightened responsive action widths, product details, button states, focus visibility, spacing, and icon sizing while keeping the established palette.
- The daily-rate and stock admin system is still not implemented; the site must not be presented as having live inventory, payments, or checkout yet.

JavaScript syntax was checked with node --check. Visual browser QA was not completed in this pass.

## Browser comment refinements — 4 October 2026

- Replaced the announcement bar with the product-value message: “Know the Karat. See the weight. Ask us about each piece.”
- Gave the secondary rates link a clay-colored pressed state and explicit focus treatment.
- Kept the hero arrow and label in a single non-wrapping flex row.
- Replaced the trust-strip pictograms with custom gold-detail spot illustrations.
- Aligned product-card content using consistent title, detail, and price areas, with the inquiry button anchored at the bottom of each card.

## Catalog card and SEO refinements — 4 October 2026

- Put the full Karat value in every product title (for example, “18 Karat Gold Hoop Earrings”) and removed the overlaid Karat and item-count badges from product photos.
- Standardized card image proportions, text gutters, title space, detail rows, pricing/availability prompts, and CTA placement across responsive breakpoints.
- Replaced the repetitive card action with “Check price & stock” and kept each WhatsApp inquiry tied to the correct product, weight, and design.
- Improved the collection heading, page description, and product image alt text with accurate product and Lagos/Nigeria delivery context. No made-up live pricing, stock, or Product offer structured data was added.
- Kept full scale-and-weight photos visible by using contain-fit product images and disabling hover zoom crop.
- The local file preview could not be reopened through the browser due to its URL security policy; the changes still need visual review at mobile and desktop sizes.

## About Us section update — 4 October 2026

- Replaced the visit-led panel with an About Goldplugdami section focused on its Tejuosho, Yaba location, gold jewelry and bar offering, rate-times-grams pricing, receipts with hallmark numbers, and nationwide delivery.
- Renamed the header and footer links to “About us” and moved the shop-visit WhatsApp action into supporting copy.
- Used a responsive text-and-highlights layout instead of the decorative monogram panel.

## SEO copy and footer revision — 5 October 2026

- Rewrote the hero, rates, collection, trust, About Us, and footer copy around real search intent: gold jewelry in Lagos, Tejuosho/Yaba, full Karat names, weights in grams, daily rate × weight pricing, and nationwide delivery.
- Replaced the one-row footer with grouped Explore, Buying gold, and Visit our shop links plus a brand/contact block and a compact copyright/back-to-top row.
- Used established retailer patterns for navigation grouping and direct help options, without adding newsletter, social, policy, address, or phone details that Goldplugdami has not supplied.
- Did not add product price/availability schema because daily rates and live stock are not connected.
