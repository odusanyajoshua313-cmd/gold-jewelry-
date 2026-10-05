# Goldplugdami Design System — Planning Draft

**Version:** 0.1  
**Status:** Proposed system; do not treat tokens as final until the supplied logo and product photos are reviewed. Planning only.

## 1. Design intent

Create a distinctive Lagos gold house: editorial, welcoming, product-led, and precise about weight, Karat, price, stock, delivery, and authenticity. Avoid generic black-and-metallic luxury styling and avoid gold-colored text for important information. Real product photos and verifiable product facts should carry the trust.

## 2. Principles

1. Product truth before decoration: exact item, Karat, weight, calculated price, and stock are easy to scan.
2. Clear next action: browse products or start a product-specific WhatsApp inquiry.
3. Trust is specific: show the actual hallmark evidence, receipt, location, and delivery policy without unsupported certification claims.
4. Mobile first: rate and product controls work with touch and narrow screens.
5. Calm motion: motion signals state changes and supports orientation; it never delays the CTA or hides facts.
6. Spell **Karat** in full in all visible copy.

## 3. Proposed color tokens

The palette is intentionally not the expected black-and-gold luxury cliché. Brass is an accent only; text and controls use tested dark/light pairs.

| Token | Hex | Use |
|---|---|---|
| Aubergine Ink | `#261B24` | Primary text, dark footer, dark surfaces |
| Warm Chalk | `#F5F0E7` | Main page background |
| Clean Ivory | `#FFFCF7` | Cards and form fields |
| Lagoon Teal | `#145257` | Primary action, rate panel, links on light background |
| Clay Red | `#94412F` | Secondary emphasis, error/attention with icon and label |
| Aged Brass | `#77551F` | Small decorative/accent details only |
| WhatsApp Green | `#075E54` | WhatsApp action only, paired with white |
| Muted Ink | `#5D555A` | Secondary text on light surfaces |
| Border Stone | `#D8D0C5` | Dividers and input outlines |
| Success Forest | `#245A3E` | Success state |
| Error Garnet | `#8B2C31` | Error state |

### Contrast rules

- Use Aubergine Ink on Warm Chalk/Clean Ivory for body and headings.
- Use white on Lagoon Teal, Aubergine Ink, or WhatsApp Green buttons.
- Use Lagoon Teal text on light backgrounds for links and focus accents.
- Never use Aged Brass as small text on Warm Chalk; reserve it for non-text strokes, icons, or large decorative surfaces after contrast review.
- Target WCAG 2.2 AA: at least 4.5:1 for normal text and 3:1 for large text and meaningful UI boundaries. Confirm every actual pairing with a contrast checker before approval.
- Do not encode stock/error/success using color alone; pair with text/icon.

## 4. Typography and layout

- **Display:** expressive editorial serif for short headings, selected after logo/photo review.
- **Interface/body:** neutral sans-serif optimized for Nigerian English and numerals.
- Use tabular numerals for selling rates, product weights, and prices.
- Minimum body size target: 16 CSS px. Product facts and controls should not be smaller than 14 CSS px.
- 8 px spacing rhythm; desktop content width around 1200 px; readable copy measure 60–70 characters.
- 12-column desktop grid; mobile uses a 4-column base grid and 16–20 px page gutters.
- Product-card image ratio 4:5; use consistent crop and avoid cropping hallmark/ID evidence.
- Use responsive type with restrained line lengths; headline must wrap cleanly at 320 px viewport width.

## 5. Components and states

### Header/navigation

Logo, Shop, Gold Rate Today, About/Trust, Visit/Delivery, and a clear WhatsApp action. On mobile, retain a compact header and a non-obstructive bottom WhatsApp action. Provide visible focus and menu expanded/collapsed states.

### Hero

Editorial split layout on desktop; stacked on mobile. Headline names gold jewelry and gold bars, with Lagos base and nationwide Nigeria delivery in supporting copy. Use owner-provided imagery. Primary CTA: browse collection; secondary CTA: view today’s rate. WhatsApp remains a clear utility action.

### Rate board and calculator

Four explicit rows/cards: 18 Karat, 21 Karat, 22 Karat, and 24 Karat. Each row shows NGN per gram and the shared last-updated timestamp. Optional weight input calculates rate × weight. Validate positive numeric input, announce result accessibly, format NGN consistently, and disclose rate timestamp/validity. Do not abbreviate Karat.

### Product card/detail

Show actual image, name, full Karat label, measured weight, calculated item price, available quantity/status, and WhatsApp CTA. Provide Sold out state at zero and do not accept an order action for unavailable stock. Detail includes gallery, hallmark/authenticity explanation, delivery/shop information, and image text alternatives.

### Inputs and feedback

Labels remain visible; placeholders are examples, not labels. Use inline validation, preserve entered values on error, identify required fields, and announce status changes to assistive technology. Admin forms show draft/saved/published states and confirm destructive stock changes.

## 6. Interaction and motion specification

| Interaction | Behavior | Motion |
|---|---|---|
| Initial load | Headline and primary action render immediately; no splash screen | Optional image fade, 180–240 ms |
| Anchor/section navigation | Smooth scroll only when reduced motion is off; keep URL/keyboard behavior accessible | 250–400 ms, no forced scroll trapping |
| Product card hover | Subtle elevation or alternate detail image; all facts/action already visible | 2–3 px lift, 180–220 ms |
| Product gallery | Tap/click image, thumbnails, next/previous, swipe on touch, close and image count | 160–220 ms transitions |
| Rate refresh | Update values and timestamp together; never animate misleading number count | brief 150–200 ms opacity transition |
| WhatsApp CTA | Opens product-specific message; announce destination/hand-off and provide copy-number fallback | Button press state 100–150 ms |
| Add/update stock in admin | Save confirmation, clear changed quantity, alert status | Immediate feedback; no decorative animation |
| Validation/error | Inline message beside field, focus first invalid field | No shake animation |

Honor `prefers-reduced-motion`; disable nonessential movement. No parallax, autoplay video with sound, scroll hijacking, or long sequential reveals. Keep page usable when animation does not run.

## 7. Responsive behavior

- Mobile: 2-column product grid where cards remain readable; filters open as an accessible sheet; rate rows stack; CTAs use 44×44 px minimum hit targets.
- Tablet: 2–3 product columns; hero image/copy stack or use a narrow split based on content.
- Desktop: 3–4 product columns; full rate board and filter sidebar where useful.
- Avoid horizontal scrolling for price, stock, and rate data.

## 8. Accessibility and quality bar

- WCAG 2.2 AA contrast, keyboard access, visible focus, semantic headings, descriptive links, alt text, labels, live announcements, and reduced motion.
- Do not make hover the only route to information.
- Use text as well as icons for stock state and validation.
- Test at 320 px, 375 px, 768 px, and desktop; zoom to 200%; test keyboard-only and screen-reader announcements.
- Product photography must not alter the apparent gold color or imply a different product.

## 9. Approval dependencies

Before tokens are locked: inspect logo files and sample product imagery; select actual fonts; check token contrast programmatically; confirm the exact shop/WhatsApp copy, price rounding, stale-rate behavior, stock visibility, and authenticity wording. Then create the annotated reference board and responsive wireframes as separate approval artifacts. No visual mockup is included in this planning document.
