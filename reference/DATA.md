# Shopify Data Model

## Principle

Use Shopify-native commerce data before introducing custom data. Products, prices, images, URLs, and availability must never be duplicated as hardcoded Liquid settings.

## Required products

Seed at least eight products suitable for Purelane:

1. Plant-Based Kitchen Degreaser
2. Foaming Dish Cleaner
3. Natural Laundry Detergent
4. Non-Toxic Toilet Cleaner
5. Gentle Liquid Handwash
6. Washing Machine Cleaner and Descaler
7. Magic Cleaning Eraser
8. Hard Water and Limescale Remover with an intentionally very long descriptive product title

Required states:

- Mark one product sold out by setting its available inventory to zero.
- Leave one product without product media.
- Give one product a deliberately long title.
- Keep at least five products in ordinary available states.

## Collections

Create and populate:

| Collection | Purpose |
|---|---|
| Shop | General product grid |
| Best Sellers | Best-selling product section |
| Combos | Combo products or grouped offers |
| Bundles | Dedicated bundle products |

Prefer merchant-selected collection settings over hardcoded collection handles.

## Native Shopify fields

Use these first:

- `product.title`
- `product.description`
- `product.featured_image`
- `product.media`
- `product.price`
- `product.compare_at_price`
- `product.available`
- `product.url`
- `product.vendor`
- `product.type`
- `product.collections`
- Selected variant information where relevant

## Proposed metafields

Only create fields that the design requires and Shopify does not natively provide.

| Owner | Namespace and key | Type | Purpose |
|---|---|---|---|
| Product | `custom.subtitle` | Single-line text | Compact subtitle beneath a product title |
| Product | `custom.badge` | Single-line text | Optional label such as “Best seller” |
| Product | `custom.short_benefit` | Single-line text | Short card-level benefit |
| Product | `custom.ingredients` | Multi-line text | Ingredient or formulation details if displayed |

All metafield access must include a fallback when the value is missing.

## Reviews

For the assignment, reviews may use section blocks because they are simple, editable, reorderable, and do not require an application backend.

Suggested review block settings:

- Quote
- Customer name
- Rating
- Customer image
- Verified-purchase toggle
- Optional product reference

Use a review metaobject only if reviews must be reused across multiple templates or managed centrally. If used, suggested fields are:

- `quote`: multi-line text
- `customer_name`: single-line text
- `rating`: integer
- `customer_image`: file reference
- `verified`: boolean
- `product`: product reference

## Bundle modelling

For a short theme assignment, prefer dedicated Shopify products representing each purchasable bundle. This preserves real pricing, availability, product URLs, and cart behaviour.

Do not display fake multi-product cart behaviour. If constituent-product bundling cannot be implemented correctly, use dedicated bundle products and document that decision.

## Section-to-data mapping

| Section | Primary data | Configuration |
|---|---|---|
| Hero | Selected product/image plus text settings | Product picker, image picker, text, CTAs |
| Shop grid | Shopify collection | Collection picker and product limit |
| Best-selling combos | Shopify collection or selected products | Prefer collection picker |
| Bundles | Dedicated bundle-product collection | Collection picker and product limit |
| Reviews | Section blocks or metaobjects | Add/remove/reorder reviews |

## Required fallbacks

- Missing product image: render a stable accessible placeholder.
- Missing metafield: omit the optional element without leaving empty spacing.
- Empty collection: show a Theme Editor-friendly empty state, not broken markup.
- Sold-out product: show the state and prevent misleading purchase actions.
- Missing review image: retain a balanced text-only card.
- Long titles: wrap and preserve card layout.

## Documentation requirement

Record every created metafield or metaobject definition, its type, purpose, and where it is consumed. Do not include store tokens, passwords, or private identifiers in the repository.

