# Troopod Project Rules

## Purpose

This repository implements the Troopod AI Product Engineer assignment: rebuild the supplied Purelane homepage prototype as production Shopify sections on a clean Dawn theme.

Read `REFERENCE.md`, `DESIGNING_RULES.md`, `DATA.md`, and `STACK.md` before planning or editing.

## Non-negotiable rules

1. Build inside Shopify Dawn using Liquid, HTML, CSS, and vanilla JavaScript.
2. Do not replace the required theme with Next.js, React, Hono, Neon, a headless storefront, a premium theme, or a page builder.
3. Treat the rendered `purelane-homepage.html` as the visual specification. Its source code is reference material, not production code.
4. Do not redesign the page. Preserve layout, typography, colours, spacing, responsive behaviour, and interactions.
5. Prioritize the five required sections in this order:
   - Hero
   - Shop/product grid
   - Best-selling combos
   - Bundles
   - Reviews rail
6. Prefer fewer finished, production-quality sections over five incomplete or hardcoded sections.
7. Products, prices, availability, images, and URLs must come from Shopify.
8. Anything a marketing team could reasonably change must be configurable through the Theme Editor.
9. Repeated product UI must use shared snippets rather than duplicated markup.
10. All custom code must support multiple instances of a section on the same page.

## Agent workflow

Before editing, an agent must:

1. Inspect the current repository and `git status`.
2. Read all five project documents.
3. Inspect the prototype and relevant Dawn files.
4. Identify the exact section and acceptance criteria being addressed.
5. State the Shopify objects, settings, blocks, metafields, or metaobjects required.

After editing, report:

- Files changed
- Theme Editor settings added
- Shopify data dependencies
- Edge cases handled
- Verification performed
- Known gaps
- Suggested commit message

## Coding rules

- Keep changes focused and preserve unrelated Dawn functionality.
- Prefix custom classes with `purelane-` or scope them under a unique section wrapper.
- Use `section.id` to isolate section instances.
- Include `block.shopify_attributes` on block wrappers.
- Section schema must be valid JSON without comments or trailing commas.
- Do not hardcode merchant content or product records in Liquid.
- Use semantic elements and native buttons/links.
- Respect `prefers-reduced-motion`.
- JavaScript must reinitialize correctly in the Shopify Theme Editor.
- Never fabricate test, accessibility, performance, or deployment results.
- Document intentional deviations from the prototype.

## Git rules

- Preserve meaningful commit history.
- Use one focused commit per feature or fix.
- Do not submit one giant generated-code commit.
- Never commit credentials, storefront passwords, tokens, or local configuration secrets.

Suggested commits:

```text
chore: initialize Dawn assignment theme
docs: add prototype audit and implementation plan
feat: add merchant-editable Purelane hero
feat: add reusable Shopify product card
feat: build collection-backed product grid
fix: handle missing images and sold-out products
a11y: improve controls and reduced motion
perf: optimize responsive product images
docs: add build and AI workflow notes
```

## Definition of done

A section is complete only when it:

- Closely matches the prototype at 375px and desktop widths
- Uses real Shopify data where applicable
- Is configurable in the Theme Editor
- Handles missing and unusual data
- Survives add, remove, reorder, duplicate, and reconfigure operations
- Supports keyboard and visible focus states
- Respects reduced motion
- Avoids obvious performance regressions
- Has been verified and committed separately
- Can be explained by the candidate in an interview

