# Approved Stack and Architecture

## Required stack

- Shopify Partner development store
- Clean Shopify Dawn theme
- Shopify CLI for local theme development
- Shopify Liquid
- HTML5
- CSS
- Vanilla JavaScript
- Shopify products, variants, collections, metafields, and metaobjects as needed
- Git and GitHub

## Explicitly out of scope

- Next.js or React storefront
- Hono, Express, or another custom backend
- Neon, PostgreSQL, or another custom product database
- Hydrogen/headless Shopify
- Premium themes
- Page builders
- Custom authentication
- A separate CMS

No backend or external database is necessary because Shopify already owns the catalogue, pricing, availability, media, merchandising data, and Theme Editor.

## Architecture

```text
Shopify Development Store
└── Dawn theme
    ├── assets/
    │   ├── purelane.css
    │   └── purelane.js
    ├── sections/
    │   ├── purelane-hero.liquid
    │   ├── purelane-product-grid.liquid
    │   ├── purelane-combos.liquid
    │   ├── purelane-bundles.liquid
    │   └── purelane-reviews.liquid
    ├── snippets/
    │   ├── purelane-product-card.liquid
    │   ├── purelane-price.liquid
    │   ├── purelane-image.liquid
    │   └── purelane-icons.liquid
    ├── templates/
    │   └── index.json
    └── docs/
        ├── BUILD_NOTES.md
        ├── AI_WORKFLOW.md
        ├── SHOPIFY_DATA_MODEL.md
        └── SUBMISSION.md
```

## Responsibility mapping

| Application concern | Owner |
|---|---|
| Catalogue and variants | Shopify products |
| Pricing and sold-out state | Shopify variants/inventory |
| Product grouping | Shopify collections |
| Custom product attributes | Shopify metafields |
| Reusable structured content | Shopify metaobjects when justified |
| Merchant configuration | Section schema and blocks |
| Server-rendered storefront UI | Liquid |
| Styling and responsive layout | CSS |
| Rails, animation, editor lifecycle | Vanilla JavaScript |
| Cart and product routes | Existing Dawn/Shopify behaviour |

## Liquid equivalents for React developers

| React/JavaScript | Shopify Liquid |
|---|---|
| `{product.title}` | `{{ product.title }}` |
| `items.map(...)` | `{% for item in items %}` |
| `{condition && ...}` | `{% if condition %}` |
| Component | Section or snippet |
| Component props | `render` arguments or section settings |
| CMS configuration | Section schema and blocks |
| API/database product | Shopify product object |
| Utility transformation | Liquid filter |

## Reuse strategy

- Sections are independently configurable page modules.
- Snippets contain repeated rendering primitives.
- A shared product-card snippet is used by grids, combos, and bundles.
- CSS is shared but class-scoped.
- JavaScript initialises each section instance separately.
- Native Dawn functionality is reused for cart and established accessibility behaviour where possible.

## Environment and secrets

- Use the Shopify CLI authentication flow for development.
- Never commit storefront passwords, access tokens, session files, or private store credentials.
- Store submission credentials outside GitHub and provide them only in the final email.

## Verification stack

Use browser developer tools and available Shopify checks to verify:

- Responsive behaviour
- Theme Editor add/remove/reorder lifecycle
- Keyboard and focus behaviour
- Reduced-motion behaviour
- Product edge cases
- Console errors
- Network and image loading
- Lighthouse accessibility and performance indicators

Only report checks that were actually run.

## Optional local MCP role

An MCP server may expose assignment documentation and workflow prompts to Codex or Claude, but it is a development assistant only. It must not become a runtime dependency of the Shopify storefront.

Recommended MCP resources:

- `troopod://rules`
- `troopod://reference`
- `troopod://designing-rules`
- `troopod://data`
- `troopod://stack`

Agents must read all five resources before planning or editing the project.
