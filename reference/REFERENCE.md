# Assignment Reference

## Source

- Assignment page: <https://troopodaiengineerassignment.pages.dev/>
- Prototype file: `purelane-homepage.html`
- Brand: Purelane, a plant-based homecare brand
- Base theme: a clean installation of Shopify Dawn

The prototype is a single-file design mockup. Reproduce its rendered result, but replace fragile or inappropriate implementation details with production Shopify patterns.

## Required scope

Build these template sections:

| Priority | Section | Prototype selector |
|---:|---|---|
| 1 | Hero | `section.hero` |
| 2 | Shop/product grid | `#shop` |
| 3 | Best-selling combos | `#combos` |
| 4 | Bundles | `#bundles` |
| 5 | Reviews rail | `#reviews` |

Everything else is optional. Finish these five in order and favour quality over breadth.

## Evaluation criteria

- Pixel-accurate from 375px upward
- Merchant-editable
- Backed by real Shopify data
- Reusable implementation
- Stable inside the Theme Editor
- Fast and mindful of Core Web Vitals
- Accessible
- Clean code and meaningful commit history

The design is the specification; the original code is not. Fix semantics, accessibility, performance, and breakpoint logic without changing the intended appearance. Record important changes in build notes.

## Required store state

Create at least eight suitable products, including:

- One sold-out product
- One product without an image
- One product with a very long title
- At least five normal products

## Deliverables

1. Development-store URL and storefront password
2. GitHub repository with commit history intact
3. Metafield and metaobject definitions
4. Short build notes covering prototype issues, changes, reasons, gaps, and future improvements
5. Short AI-workflow notes covering delegated work, failures, verification, and opportunities to systematize

## Deadline

Two days from the assignment email. The assignment explicitly says all five sections are not expected; submit polished work and disclose gaps honestly.

## Submission recipients

The recruiter email and assignment page conflict:

- Recruiter email: `foundersoffice@pushstart.in`
- Recruiter CC: `rahul.bhola@pushstart.in`
- Assignment page: `nj@troopod.io`

Unless clarified by Troopod, prepare the final submission for all listed recipients.

Subject:

```text
AI Product Engineer Assignment - Abhishek Negi
```

## Reference audit procedure

Before implementation:

1. Render the original HTML locally.
2. Capture reference screenshots at 375px, 768px, 1024px, and a wide desktop width.
3. Record fonts, colours, maximum widths, spacing, radii, shadows, and breakpoints.
4. Record hover, focus, scroll, slider, and reduced-motion behaviour.
5. Identify hardcoded data and repeated card patterns.
6. Identify accessibility, performance, semantic, and responsive defects.
7. Map prototype content to Shopify-native data or justified custom fields.

