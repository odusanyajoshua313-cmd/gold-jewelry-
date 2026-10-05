# Goldplugdami storefront — pre-change UI and code audit

**Date:** 5 October 2026  
**Scope:** Full read-through of the storefront HTML, CSS, JavaScript, local preview server, asset inventory, existing storefront audit, and design/technical planning notes. Read-only review of the running local preview at `http://127.0.0.1:4173/`, including the phone-width hero and catalog cards.  
**Status:** Findings recorded before creating a separate visual mock. The production storefront source (`index.html`, `styles.css`, and `app.js`) has not been changed in this review.

## Executive summary

The page has a distinctive warm-paper, teal, clay, and aubergine identity; it communicates Lagos location, nationwide delivery, item Karat and gram weight, and the rate-times-weight pricing model. Product cards have a consistent structural stack and aligned inquiry actions. At the tested phone width, however, the supporting card text and button labels are notably small, while the product photos devote substantial space to the weighing scale. The page is still a WhatsApp-first prototype: its business number is empty, rates and inventory are placeholders, and no checkout/admin workflow exists.

The highest-value next step is a separate, reviewable mock that tightens catalog information hierarchy, improves button/icon alignment and touch targets, and checks responsive spacing while retaining the existing brand colors and all product facts. Do not treat the mock as a production change.

## Findings by priority

### P0 — WhatsApp handoff is not connected

`app.js` has an empty `BUSINESS_WHATSAPP` value (line 13). When it is empty, the CTA opens an in-page copy dialog instead of WhatsApp. Header, footer, floating and product inquiries therefore do not yet complete the intended booking/contact journey.

**Action before launch:** Add the owner-provided WhatsApp number in international digits and verify every intent-specific message on mobile and desktop. Until then, describe the action as preparing/copying an inquiry rather than implying a direct chat.

### P0 — Current rate and stock data are not real-time

The four rate cells say “Rate to be updated” (`index.html`, lines 60–65); cards ask customers to confirm rate and availability. No admin, rate publication, stock count, sold-out notice, or shared store/online inventory exists in this frontend.

**Action before launch:** Implement and secure the owner-facing rate and stock workflow, including per-Karat rates, timestamp, item weight, calculated price, stock quantity, and sold-out alerts. Keep the current honest placeholders until that system is actually connected.

### P1 — Product-card detail text and controls are too small on phone

At the preview’s roughly 400-pixel viewport, the two-column cards remain side-by-side. The card facts, price/availability lines, and “Check price & stock” labels render around 10–11 CSS pixels from the current `0.60–0.68rem` rules (styles near lines 182–220). In the browser view, the buttons fit, but the text is cramped and the facts are visually subordinate. The weight is also presented on a new line on mobile, increasing card height without adding much clarity.

**Mock direction:** Test larger mobile text and icon sizing, more deliberate title/facts/price hierarchy, stable CTA alignment, and a one-column fallback only when the available card width is too narrow. Preserve full Karat wording and exact gram values.

### P1 — Product photographs are evidence-rich but jewelry-light

The catalog uses full scale photos with `object-fit: contain`, which preserves weight evidence and avoids misleading crops. At phone width, the weighing scale/background claims much of the image area and the jewelry itself appears small. The image assets are approximately 34 KB–1.8 MB each; two necklace PNGs exceed 1 MB.

**Mock direction:** Keep the supplied photos unaltered and test a more intentional fixed image stage, image/background framing, and consistent image-to-card spacing. If approved later, create responsive compressed derivatives while retaining originals and clear weight evidence.

### P1 — Button system is present but not fully coherent

Primary/secondary buttons, text actions, product inquiry buttons, filter chips, footer actions, and dialog controls each have partially separate styles. Base corners begin at 3 pixels and later change to 8 pixels; component rules and interaction selectors are distributed across multiple appended blocks. The hero arrow is aligned inline, and the product WhatsApp mark is now present, but its optical alignment and label spacing should be validated in a larger, more legible card control. There is no single documented button sizing/state contract in the code.

**Mock direction:** Compare a consistent 44–48 pixel minimum action height, 8 pixel radius, shared icon size/gap, even horizontal padding, and unmistakable hover, pressed, focus-visible, and disabled states. Keep navigation links as links and in-page actions as buttons.

### P1 — “Karat” preference is not applied consistently

Most product names and rate cells spell out “Karat,” but the trust strip compresses the options to “18, 21, 22 & 24 Karat,” and supporting text similarly groups the numbers before one suffix (`index.html`, lines 50, 58, and 88). The stated preference is to write “Karat” in full each time, so these labels do not fully follow the brand content rule.

**Action:** In a later approved content edit, use “18 Karat · 21 Karat · 22 Karat · 24 Karat” wherever each option is listed. Do not use “K” as shorthand.

### P1 — Accessibility and responsive behavior need a focused pass

- The mobile menu exposes `aria-expanded` and closes after a nav link; Escape-key and outside-click closure are not implemented (`app.js`, lines 117–131).
- Smooth scrolling is enabled globally in CSS, while the reduced-motion media query only disables selected transitions. Respect reduced-motion for scrolling too.
- The product grid stays at two columns on narrow phones. Confirm the smallest supported width (320 pixels), zoom, focus visibility, and no horizontal overflow.
- Filter buttons update `aria-pressed`; add an explicit announced result count if the catalog later becomes dynamic.
- Check actual contrast for muted small text and gold decorative SVG strokes; do not rely on color alone for stock or error state.

### P2 — CSS cascade is hard to safely maintain

`styles.css` is 262 lines but many foundational selectors are compressed into very long lines, followed by repeated refinement blocks for buttons, product cards, About, footer, and breakpoints. The effective values are consequently difficult to audit from source order. Multiple responsive blocks repeat 950, 800, 700, and 390-pixel breakpoints.

**Action:** After the visual direction is approved, consolidate the stylesheet by tokens, base/layout, components, states, responsive rules, and motion. Preserve the current colors and compare screenshots before/after.

### P2 — SEO foundations are partial

The document has a useful title, Nigerian-English language, viewport, and meta description. The source has no canonical URL, Open Graph/social share tags, structured business/product data, `robots.txt`, or `sitemap.xml`; none can be finalized correctly until the public domain and verified business profile details are known. There is no live price or stock source, so adding product offer markup now would risk inaccurate search snippets.

**Action:** Once a public domain and exact shop/contact details are confirmed, add canonical/social metadata, crawlable category/product content, LocalBusiness data based only on verified facts, sitemap/robots, Search Console, and a Google Business Profile tied to the real customer-facing location. Do not promise a top Google position.

### P2 — Image/network loading and external font dependency

The hero image has no explicit intrinsic dimensions; product images use lazy loading, but the main hero can still shift layout while loading. Google Fonts is an external dependency. Optimize approved image derivatives, set width/height or aspect ratio for every image, preload only the hero asset if performance data supports it, and provide robust local fallbacks.

### P2 — Preview server safety/operational boundaries

`preview-server.cjs` correctly resolves requested paths within its own folder, binds only to `127.0.0.1`, and labels itself local-only in `PREVIEW.md`. It is a basic static development server without production TLS, headers beyond MIME/nosniff, logging/monitoring, or deployment configuration. Keep it for local review only.

## What is working

- The existing colors remain recognizable and have strong primary-action contrast (white on teal and teal on warm paper); no palette replacement is recommended.
- Desktop/mobile navigation is semantic and keyboard-aware at a basic level; skip link, accessible labels, visible focus selectors, and reduced-motion reveal handling are present.
- Product records are separate, identify the two twist necklaces and two Franco necklaces distinctly by measured weights, and correctly state that the Franco necklaces have no pendant.
- Product titles include full Karat and photo alt text describes the actual object/scale.
- Four independent Karat rate slots and the agreed rate-per-gram × product weight calculation are clear.
- Card CTAs are anchored using a flex column and currently line up in the rendered mobile grid.
- Current rates, price, stock, and WhatsApp limitations are represented honestly; no fabricated checkout or live inventory is implied.
- Contrast calculations for the existing palette: white on Lagoon Teal **8.84:1**, Lagoon Teal on Warm Chalk **7.79:1**, Muted Ink on Warm Chalk **6.01:1**, and the dark-footer text pairs are above **9:1**. Keep these pairings; gold decorative strokes should remain decorative rather than carrying small text.

## Browser check record

- Local storefront loaded successfully at `http://127.0.0.1:4173/`.
- Phone-width hero: the two CTA buttons stack; icon and “Explore the collection” label sit on one line; copy wraps cleanly. The first view is text-led and puts the hero image below the fold.
- Phone-width catalog: two product cards share a row; card content and buttons align, but secondary text/button text appear small and jewelry occupies a modest share of the scale-heavy photos.
- The category counts reflect four earrings and four necklaces (eight total).
- No production source files were edited for this audit.

## Mock approval scope

The next artifact is a separate local-only mock page. It may demonstrate revised alignment, card typography/spacing, button geometry/icon pairing, and responsive behavior. It must retain Goldplugdami’s existing palette, use only supplied product images and confirmed facts, and remain outside the production `index.html`, `styles.css`, and `app.js` until reviewed.

## Separate mock browser check

- Created `outputs/goldplugdami-site/mock-preview.html`; it is marked “VISUAL MOCK ONLY” and is separate from production storefront files.
- Opened and reviewed it at the available phone-width browser viewport. The mock has an aligned two-column card grid, shared text gutters and price/status rows, full “18 Karat” product titles rather than photo badges, a consistent WhatsApp logo/label row, and a 48-pixel minimum product action.
- The longer product action wraps to two centered text lines at phone width while the WhatsApp mark remains aligned at the left; card actions remain aligned along the card bottoms, with no horizontal overflow in the observed viewport.
- Clicked the mock category filter: the selected state changed, unrelated cards hid, and the status announcement updated. Clicked a mock product CTA: it announced that WhatsApp is not configured and did not open/send an external message.
- The available browser viewport was phone-sized; intermediate tablet and desktop widths still need review before approving a production implementation.
- This mock is ready for visual feedback. The original storefront source remains unchanged.

## Header and footer follow-up — 5 October 2026

- Reviewed the phone-width announcement/header. The header logo and Menu control sit on one line; the announcement was too location-heavy and small. Shortened it to “Gold jewelry & gold bars · Delivery nationwide” and increased its small-screen size.
- Rewrote the About and footer brand copy to describe Goldplugdami as a Lagos gold trader and list the actual jewelry categories and gold bars.
- Kept “Tejuosho, Yaba” only in the footer’s **Our location** group; removed it from the announcement, hero, About copy, and visit inquiry template.
- Reduced the footer to one WhatsApp inquiry action, removed the adjacent About visit action, and grouped its links into Explore, Gold details, and Our location.
- Footer grouping was informed by the direct service/location groupings on Mejuri and VENUS; this implementation uses only Goldplugdami’s supplied contact/location facts and keeps the requested single contact action.
- Browser check: phone-width announcement stays on one line; footer copy, link groups, and location stack cleanly. `node --check app.js` passed and the local preview returned HTTP 200. The WhatsApp number is still unconfigured, so the button retains the copy-inquiry fallback.
