# Goldplugdami footer and SEO audit

**Date:** 5 October 2026  
**Scope:** Footer hierarchy, phone-width rendering, content clarity, search-intent language, and contact-action count. The storefront retains its existing brand palette.

## Findings

### Footer actions

- There is now **one button inside the footer**: “Prepare a WhatsApp inquiry.”
- The footer also has five text navigation links under **Explore** and **Gold details**, plus a plain “Back to top” link. These are navigation links, not additional CTA buttons.
- The sticky “Message us” control used to be able to appear at the same time as the footer CTA on desktop. It now hides and leaves the keyboard tab order while the footer is visible. The footer therefore presents one contact action at a time.
- The separate “Ask about a shop visit” button was removed from the section immediately above the footer to reduce competing actions near the page end.

### Copy and search relevance

The footer brand paragraph now says:

> Goldplugdami is a Lagos gold trader selling gold jewelry and gold bars. Explore earrings, rings, bangles, pendants, necklaces, and bracelets in 18 Karat, 21 Karat, 22 Karat, and 24 Karat. Each item’s price is calculated from its Karat’s daily selling rate per gram and its weight in grams. Nationwide delivery is available across Nigeria.

This gives shoppers useful context while naturally covering the store name, Lagos, gold trader, gold jewelry, gold bars, product categories, Karat choices, pricing method, and nationwide delivery. It reads as a description rather than a repetitive keyword list. Tejuosho, Yaba appears only in **Our location**.

The remaining footer anchor text describes each destination: “Shop gold jewelry,” “Today’s gold rates,” “About Goldplugdami,” “How gold prices are calculated,” and “Hallmark and purchase receipts.” Each is a standard crawlable internal link to a matching section.

## SEO assessment

The footer is in good shape as a supporting page element; it is not a standalone ranking strategy. Google recommends natural, people-first copy and concise, descriptive link text, and warns against unnatural keyword repetition or keyword-heavy footer links. This version keeps the product and location terms inside real business copy and limits navigation to five relevant links.

The footer alone cannot establish a high Google ranking. The public domain, complete product pages, accurate page title and descriptions, Google Business Profile verification, consistent contact/location details, and Search Console setup remain necessary launch work. Do not add prices, inventory status, certifications, hours, or contact details that are not confirmed.

## Browser and code verification

- Reviewed the updated footer at phone width. The brand copy wraps cleanly, the single CTA is distinct, the text links remain plain navigation, and the location group sits apart from the buying links.
- Browser accessibility tree showed one footer button and five footer navigation links.
- Confirmed “Tejuosho” appears once in the public page source, in the footer’s **Our location** group.
- `node --check app.js` passed; the local preview returned HTTP 200.

## Current footer structure

1. **Brand:** Goldplugdami description and the one WhatsApp inquiry action.
2. **Explore:** Shop gold jewelry, today’s rates, About Goldplugdami.
3. **Gold details:** Pricing calculation and hallmark/receipt information.
4. **Our location:** Tejuosho, Yaba, Lagos.

## Sources

- [Google Search Central — SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google Search Central — Link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Google Search Central — Spam policies: keyword stuffing](https://developers.google.com/search/docs/essentials/spam-policies)
