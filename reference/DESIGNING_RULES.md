# Designing and UI Implementation Rules

## Design principle

This is a faithful implementation, not a redesign. Match the prototype's rendered output while improving its production structure.

## Responsive requirements

- Build mobile-first and support widths from 375px upward.
- Verify at 375px, 768px, 1024px, and wide desktop.
- Do not assume only mobile and desktop states; intermediate widths must remain stable.
- Avoid fixed heights when merchant content can grow.
- Long headings and product titles must wrap without collisions.
- Horizontal rails must communicate scrollability and remain keyboard-operable.

## Visual fidelity

Match:

- Font family, weight, size, line height, and letter spacing
- Colour palette and gradients
- Container widths and alignment
- Section spacing and card gaps
- Border radius, border colour, and shadows
- Product-card proportions
- Background and glass effects
- Hover, focus, scroll, and entrance behaviour
- Mobile stacking and overflow behaviour

Do not introduce new gradients, colours, components, layouts, or animation styles unless required to correct a functional defect.

## CSS architecture

- Place shared styling in `assets/purelane.css`.
- Prefix classes with `purelane-`.
- Scope per-instance custom properties under `#PurelaneSection-{{ section.id }}`.
- Avoid broad selectors that alter Dawn globally.
- Avoid repeated inline styles and unnecessary `!important`.
- Prefer CSS custom properties for colour and spacing settings.
- Use modern layout primitives without breaking supported storefront browsers.
- Reserve space for media to prevent layout shift.

Example wrapper:

```liquid
<section
  id="PurelaneHero-{{ section.id }}"
  class="purelane-hero color-{{ section.settings.color_scheme }}"
>
```

## Theme Editor requirements

Merchant-editable settings should include relevant:

- Headings and descriptions
- Button labels and URLs
- Images or product selections
- Collections and product limits
- Alignment or colour scheme where the prototype supports variation
- Animation enable/disable controls where useful

Use blocks for repeatable content such as reviews. A section must tolerate empty selections, removed blocks, duplication, and reordering.

## Product-card rules

Use one reusable product-card snippet across product-based sections. It must handle:

- Featured image
- Missing-image fallback
- Long title
- Price and compare-at price
- Sold-out state
- Optional badge or subtitle
- Accessible product link
- Responsive image sizes

Do not hardcode product names, prices, images, availability, or URLs.

## Animation rules

- Prefer CSS when possible.
- Only animate `transform` and `opacity` for most effects.
- Avoid animation that continuously triggers layout or expensive painting.
- Pause timers or animations when the section is off-screen when practical.
- Respect `prefers-reduced-motion: reduce`.
- Never make essential information dependent on animation.
- Autoplay interactions must pause appropriately and remain manually operable.

## JavaScript and section lifecycle

- Initialise within a section root, not across the whole document.
- Support multiple instances of each section.
- Avoid duplicated global listeners.
- Clean up timers, observers, and listeners on section unload.
- Reinitialise on Shopify Theme Editor section load.
- Do not assume a full page reload after an editor change.
- Use buttons with accessible names for carousel controls.

## Accessibility

- Maintain a logical heading hierarchy.
- Use semantic landmarks, lists, articles, buttons, and links.
- Provide meaningful image alternative text; hide decorative graphics from assistive technology.
- Keep every interaction keyboard-operable.
- Provide visible focus states with sufficient contrast.
- Do not rely on hover, colour, or motion alone.
- Avoid focus traps.
- Expose sold-out and disabled states clearly.
- Ensure DOM order matches visual and reading order.

## Performance

- Use Shopify responsive image filters and `image_tag`.
- Lazy-load below-the-fold images.
- Do not lazy-load the likely LCP hero image.
- Supply width/height or aspect-ratio information.
- Avoid unnecessary libraries and third-party scripts.
- Limit collection rendering to the configured count.
- Keep custom JavaScript small and section-aware.

## Visual QA checklist

- Compare Shopify screenshots beside the prototype at identical viewport sizes.
- Check spacing, typography, alignment, card sizes, overflow, and animation.
- Test missing images, sold-out products, long titles, empty collections, and fewer-than-expected items.
- Test mouse, touch, keyboard, reduced motion, and Theme Editor operations.
- Document intentional differences and their production justification.

