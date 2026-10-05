# Goldplugdami Product Catalog and Rate Template

**Version:** 0.1 — planning template. No live inventory is represented here.

Use one row per sellable item/SKU. Many individual gold pieces may be unique, so do not combine pieces with different weight, Karat, or authenticity evidence into one row. Keep private authentication identifiers out of public product fields.

## 1. Product fields

| Field | Required? | Notes |
|---|---|---|
| SKU / item ID | Yes | Unique internal identifier; never reuse |
| Public name | Yes | Plain descriptive name |
| Category | Yes | Earrings, Rings, Bangles, Bracelets, Necklaces, Pendants, Gold Bars |
| Design/style | Recommended | e.g. twist design; use the seller's description, do not infer from image |
| Karat | Yes, if applicable | Store numeric value; render as “18 Karat” etc. |
| Weight in grams | Yes | Record scale precision and measurement source |
| Selling rate ID | Yes | Points to the applicable published Karat rate snapshot |
| Calculated price in NGN | Yes | Rate per gram × weight; retain calculation snapshot |
| Quantity available | Yes | Integer; use item-level quantity for unique pieces |
| Stock status | Yes | Draft, Available, Reserved, Sold out, Archived |
| Size/length | Conditional | Ring size, chain length, bangle size |
| Product description | Yes | Build from owner-provided type, design, Karat, weight, and confirmed product facts; no unsupported claims |
| Product images | Yes for publication | Owner-provided originals; front, detail, scale where possible |
| Hallmark information | Conditional | What is visibly marked and evidence/verification basis |
| Gold bar attributes | Conditional | Weight, stated purity, refiner/brand, seal/docs, private auth ID |
| Last updated | Yes | Timestamp and admin actor |

## 2. Daily rate table

One daily rate record per Karat and effective period.

| Date/time (WAT) | Karat | NGN per gram | Status | Entered by | Published by | Notes |
|---|---|---:|---|---|---|---|
| To be supplied | 18 Karat | — | Draft | — | — | — |
| To be supplied | 21 Karat | — | Draft | — | — | — |
| To be supplied | 22 Karat | — | Draft | — | — | — |
| To be supplied | 24 Karat | — | Draft | — | — | — |

## 3. Price rule

**Confirmed:** `final item price = applicable Karat selling rate per gram × item weight in grams`.

Example format (illustrative only; no real rate/weight supplied):

```text
Karat rate: NGN [rate] per gram
Item weight: [weight] grams
Calculated item price: NGN [rate × weight], using approved rounding rule
Rate timestamp: [date/time WAT]
```

Confirmed example supplied by the owner: **18 Karat rate ₦180,000 per gram × 2 grams = ₦360,000**. Treat this as an example of the formula, not a current rate or live product listing.

Do not enter fake sample prices as actual catalog content. Open rules: scale precision, currency rounding, rate publish cutoff, and stale-rate behavior.

## 4. Stock movement log

| Timestamp | SKU | Change (+/-) | Reason | Channel | Related order/reference | Admin |
|---|---|---:|---|---|---|---|
| — | — | — | Restock / shop sale / WhatsApp sale / correction / damage / reservation | — | — | — |

Keep an append-only movement history rather than silently replacing past stock values. A WhatsApp inquiry alone does not reduce stock; define the hold/reservation moment and expiry before implementation.

## 5. Image intake checklist

- Owner supplies original files and confirms permission to publish.
- At least one clean product image; detail and scale/on-person images where available.
- Keep true gold hue, visible craftsmanship, and hallmark detail; do not fabricate details or alter product color.
- Record image filename, SKU, view/angle, alt-text draft, and crop notes.

## 6. Example blank rows

| SKU | Name | Category | Karat | Weight (g) | Rate snapshot | Calculated NGN | Qty | Status | Images |
|---|---|---|---:|---:|---|---:|---:|---|---|
| — | — | — | — | — | — | — | — | Draft | — |

## 7. Product upload and description format

When adding an item, the owner uploads its image and provides:

1. Accessory type/category: earrings, bangles, bracelet, necklace, pendant, ring, or gold bar.
2. Design/style name or short design description, if known.
3. Karat: 18 Karat, 21 Karat, 22 Karat, or 24 Karat.
4. Weight in grams.
5. Quantity available (or one unique piece).
6. Any confirmed details customers need, such as size, length, closure, hallmark, or gold bar authenticity information.

The product entry can generate a plain, factual draft description from these fields, but the owner should review it before publishing. Never infer Karat, weight, purity, or authenticity from the photo.

**Example input:** `Necklace | Twist design | 18 Karat | 10 grams | quantity: [owner enters]`

**Example draft title:** `18 Karat Gold Twist Necklace — 10 grams`

**Example draft description:** `18 Karat gold necklace in a twist design. Weight: 10 grams. Calculated price: current 18 Karat selling rate per gram × 10 grams. Stock: [current quantity/status]. Contact Goldplugdami on WhatsApp to confirm availability and arrange delivery or a visit to Tejuosho, Yaba, Lagos.`

The system must use the current 18 Karat rate snapshot to calculate the price. The example contains no actual price because the live daily rate and stock have not been supplied.
