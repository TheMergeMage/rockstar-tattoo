# Rockstar Tattoo Post-Polished Static To Full Modernization Spec

Status: Planning and implementation specification only. Do not execute from this document without creating the intended implementation branch.

Recommended implementation branch in concept: `staging/modern-ui`, created from the currently aligned `staging` branch.

Implementation note: Git cannot create `staging/modern-ui` in this repository while a branch named `staging` already exists, because refs cannot be both a file and a directory. The modernization run uses `staging-modern-ui` as the equivalent isolated implementation branch.

## Modernization Goal

Modernize Rockstar Tattoo as a static, high-conversion tattoo portfolio site for mobile-first art shoppers. The run should improve perceived quality, artwork discovery, trust, and contact friction without turning the site into an over-animated showcase.

The modernization should preserve the site's static deployment simplicity while making the experience feel more image-led, useful, polished, and conversion-ready.

## Primary Outcomes

1. Make the first viewport image-led and credible.
2. Help shoppers find work by artist and style.
3. Make every artwork path lead naturally to an artist or contact action.
4. Improve mobile conversion through call, directions, gallery, and Instagram actions.
5. Add tasteful motion only where it clarifies hierarchy or improves perceived quality.
6. Preserve static-site simplicity and fast loading.

## Non-Goals

- No backend rewrite.
- No CMS unless content editing becomes a blocker.
- No heavy WebGL or Three.js.
- No decorative animation that does not improve clarity.
- No fake urgency, fake review counts, or invented credentials.
- No broad rebrand away from the current black, red, silver, and tattoo-shop identity.

## Context From Current Audit

The current site is a static HTML, CSS, and JavaScript site. It already has a strong foundation:

- Sticky desktop header.
- Mobile navigation overlay.
- Gallery lightbox.
- Homepage carousel.
- Artist filtering on the gallery page.
- Aftercare tabs.
- Basic focus-visible styling.
- Reduced-motion variables.

The main gap is that the experience still feels closer to a polished static brochure than a guided tattoo shopping and conversion journey. The site has strong tattoo imagery, but the interaction model, artist detail pages, contact flow, promotion system, and mobile conversion affordances are still underdeveloped.

## Phase 0: Branch And Baseline

### Scope

- Create `staging-modern-ui` from current `staging` in this repository. If the branch namespace is cleaned up later, `staging/modern-ui` is the intended naming convention.
- Preserve current live-aligned state.
- Capture baseline screenshots before edits.

### Baseline Pages

- `index.html`
- `gallery.html`
- `artists.html`
- `artist-brian.html`
- `artist-martin.html`
- `artist-tempt.html`
- `aftercare.html`
- `promotions.html`
- `contact.html`

### Baseline Viewports

- 360 x 740
- 390 x 844
- 768 x 1024
- 1280 x 720
- 1440 x 900

### Acceptance Criteria

- Branch exists.
- No unrelated file churn.
- Baseline screenshots are captured outside source or in a clearly named audit folder if desired.
- Current static pages continue to return `200` locally before work begins.

## Phase 1: Visual System Foundation

### Likely Files

- `css/variables.css`
- `css/typography.css`
- `css/header.css`
- `css/index.css`
- `css/gallery.css`
- `css/artists.css`
- `css/contact.css`
- `css/promotions.css`
- `css/aftercare.css`

### Specification

Add richer design tokens:

- Surface colors:
  - base
  - raised
  - inset
  - overlay
- Border colors:
  - subtle
  - strong
  - active
- Shadow tokens for restrained dark UI.
- Section spacing scale for mobile and desktop.
- Button sizing and touch target tokens.
- Focus ring token.

Preserve the current brand direction:

- Keep the black, red, silver, and white palette.
- Avoid beige, pastel, generic SaaS blue, or decorative gradient-heavy themes.
- Use red as an action/accent color, not a full-page wash.

Standardize surfaces:

- Cards should use consistent border, background, hover, and focus states.
- Keep border radius at the existing restrained 4px style unless a component has a strong reason to differ.
- Do not place cards inside other cards.
- Avoid floating section cards; reserve cards for repeated items, artist cards, promo cards, contact panels, and tool-like surfaces.

Typography:

- Keep Oswald for headings.
- Keep Inter for body copy.
- Preserve uppercase tattoo-shop identity, but avoid overusing large uppercase blocks in dense content.
- Make compact panels use compact heading sizes.
- Avoid scaling font size directly with viewport width beyond controlled `clamp()` usage already established.

Icons:

- Replace emoji service icons with consistent inline SVG or lucide-style icon assets.
- Icons should be decorative only when text already names the action.
- Icon-only buttons require accessible labels.

### Acceptance Criteria

- No text overflow at 360px width.
- Buttons have consistent height and focus states.
- Cards feel related across home, gallery, artists, promo, contact, and aftercare.
- Focus states are visible on all interactive elements.
- Visual system remains recognizably Rockstar Tattoo.

## Phase 2: Homepage Hero And First Viewport

### Current Problem

The CSS references `assets/images/hero-bg.jpg`, but that asset is missing. The homepage hero currently appears as a black text block rather than an image-led tattoo brand moment.

### Specification

Add an optimized real image hero:

- Use existing tattoo/shop imagery or a curated new brand image.
- Prefer WebP with JPG fallback if needed.
- Preload only the hero image.
- Keep the hero image specific and inspectable, not abstract or atmospheric.

Hero layout:

- Maintain the brand headline.
- Keep phone CTA as the primary action.
- Keep "View Our Work" as the secondary action.
- Add subtle image overlay for readability.
- Keep a hint of the next section visible on common desktop and mobile viewports where practical.

Optional tasteful enhancement:

- Very slow background image scale or opacity reveal.
- Disabled under `prefers-reduced-motion`.

### Acceptance Criteria

- Hero image renders locally and in deployed build.
- Hero image returns `200`.
- First viewport shows brand, CTA, and a clear tattoo/shop signal.
- Text remains readable over image.
- No material performance regression from the hero asset.

## Phase 3: Mobile Conversion Layer

### Current Problem

Mobile users must scroll or navigate to act. Tattoo shoppers are likely comparing artists and calling from a phone, so conversion actions should remain easy to reach.

### Specification

Add a sticky bottom mobile CTA bar below `768px`.

Actions:

- Call
- Directions
- Gallery
- Instagram

Behavior:

- Use icons plus accessible labels.
- Respect iOS safe-area inset.
- Hide, compress, or sit below the mobile nav overlay when the overlay is open.
- Do not cover important final CTA or footer content.
- On desktop, keep the existing header/footer actions instead of showing the mobile bar.

Implementation options:

- Add repeated HTML consistently across pages.
- Or inject a shared mobile action bar with a small JS module.

If using JS injection:

- Content should still have core phone/contact links elsewhere if JS fails.
- Avoid making the mobile bar the only conversion path.

### Acceptance Criteria

- Touch targets are at least 44px.
- Actions are keyboard reachable.
- Labels are announced clearly by screen readers.
- Works on home, gallery, artists, artist detail, contact, promotions, and aftercare.
- Does not create horizontal overflow.

## Phase 4: Gallery Discovery Upgrade

### Current Problem

Artist filtering works. Style data exists in `gallery-data.js`, and hidden style filter markup exists, but shoppers cannot currently filter visibly by style.

### Specification

Expose style filters with counts:

- All
- Color
- Black & Grey
- Traditional
- Realism
- Geometric

Support combined filtering:

- Artist plus style.
- Example: Brian plus Color.

URL state:

- Support query parameters such as `gallery.html?artist=brian&style=color`.
- Initialize filters from URL on page load.
- Update URL without full reload when filters change.

UI states:

- Active filter summary.
- Clear filters button.
- Empty state:
  - "No pieces match this filter. View all work."

Gallery item overlays:

- Artist name.
- Style tag.
- "View" affordance on hover and focus.
- Keep images dominant; overlays should not obscure tattoo details by default.

### Likely Files

- `gallery.html`
- `js/gallery.js`
- `js/gallery-data.js`
- `css/gallery.css`

### Acceptance Criteria

- Filters work with mouse, touch, and keyboard.
- Combined filters work predictably.
- Filter state can be deep-linked.
- Lightbox still works after filtering.
- No layout shift when filters change.
- Empty states are useful and accessible.

## Phase 5: Lightbox Context Upgrade

### Current Problem

Images open in the lightbox without enough sales or discovery context.

### Specification

Add GLightbox captions:

- Artwork alt/title.
- Artist.
- Style.
- Link to artist page.
- Optional "Call about this style" or "Ask about similar work" CTA.

Caption behavior:

- Desktop: caption can appear below or alongside image if supported without clutter.
- Mobile: caption should sit below the image and not overlay critical artwork.
- Captions should be keyboard reachable.

Data requirements:

- Ensure each `galleryImages` item has enough metadata for useful captions.
- Do not invent artwork names if the source only has descriptive alt text.

### Acceptance Criteria

- Every opened image has useful context.
- Keyboard navigation remains intact.
- CTA links are accessible.
- Image remains the visual priority.
- Lightbox does not trap focus incorrectly.

## Phase 6: Artist Page Redesign

### Current Problem

The artist listing page has strong images, but artist detail pages are sparse portfolio-only pages with limited conversion guidance.

### Artist Listing Specification

Improve `artists.html`:

- Add quick tags per artist.
- Preserve strong image cards.
- Add "View portfolio" and "Call / Ask about this artist" actions.
- Equalize card layout without forcing identical bio length.
- Keep bios specific and grounded.

### Artist Detail Page Specification

Improve:

- `artist-brian.html`
- `artist-martin.html`
- `artist-tempt.html`

Each artist page should include:

- Artist hero/profile section:
  - artist name
  - specialties
  - experience if verified
  - short bio
  - primary CTA
  - secondary CTA
- Portfolio section:
  - artist-specific gallery
  - optional style filters if enough items exist
  - lightbox captions
- Trust/conversion section:
  - walk-ins welcome where true
  - phone CTA
  - contact/directions link
- Related navigation:
  - back to artists
  - view all gallery
  - optionally related artist cards

### Likely Files

- `artists.html`
- `artist-brian.html`
- `artist-martin.html`
- `artist-tempt.html`
- `css/artists.css`
- `js/artist-brian.js`
- `js/artist-martin.js`
- `js/artist-tempt.js`
- `js/gallery-data.js`

### Acceptance Criteria

- Each artist detail page has a clear next action.
- Portfolio remains image-first.
- No invented availability or unsupported claims.
- CTA text is artist-specific where useful.
- Artist pages are useful even if only a few images exist.

## Phase 7: Contact And Conversion UX

### Current Problem

The contact page has address, phone, and hours only. It lacks a map, directions button, consult path, and richer mobile actions.

### Specification

Add a conversion panel:

- Call.
- Directions.
- Instagram.
- Optional SMS if desired and supported.

Add map support:

- Embedded map or static map image linking to Google Maps.
- If embedding, keep performance and privacy implications in mind.
- If using static image, link clearly to directions.

Add short inquiry flow only if destination is decided:

- Name.
- Phone or email.
- Tattoo or piercing.
- Preferred artist optional.
- Idea or placement.
- Image upload only if a backend supports it.

If no backend is available:

- Use a clear mailto or call-based fallback.
- Do not create a fake form submission.
- Do not show a success toast unless a real action occurred.

### Likely Files

- `contact.html`
- `css/contact.css`
- optional `js/contact.js`

### Acceptance Criteria

- Contact page supports immediate mobile action.
- Directions open correctly.
- Phone link works.
- If form exists, validation is inline and accessible.
- No dead-end form.
- No fake confirmation state.

## Phase 8: Promotions Upgrade

### Current Problem

The promo data model exists, but the current active promo has a title only. The promotions page becomes a thin static card.

### Specification

Extend the `promo` object:

- `title`
- `description`
- `terms`
- `image`
- `ctaText`
- `ctaLink`
- `startDate`
- `endDate`
- `badge`

Promo page:

- Richer offer card.
- CTA to call, contact, or relevant page.
- Terms shown in small readable text.
- Optional promo image.

Promo bar:

- Short text only.
- Link to promotions page.

Countdown:

- Only show countdown when there is a real end date.
- Do not fake urgency.

### Likely Files

- `js/promos.js`
- `js/countdown.js`
- `promotions.html`
- `css/promotions.css`

### Acceptance Criteria

- Promo page never looks empty when active.
- Promo bar and promo page stay in sync.
- Promo CTA works.
- Countdown appears only with a valid real `endDate`.
- Terms are readable and not hidden.

## Phase 9: Aftercare Usability

### Current Problem

Aftercare has useful tabbed content, but it is still a long static article. On mobile, users may need faster scanning and revisiting.

### Specification

Improve aftercare navigation:

- Sticky in-page section nav on desktop.
- Accordion-style sections on mobile, with the first critical sections open.
- Keep important safety guidance visible and easy to find.

Add utility actions:

- "Call the shop" guidance block where appropriate.
- "Seek medical attention" guidance block where appropriate.
- Print/share affordance if useful.

Preserve:

- Tattoo/piercing tabs.
- Query param deep-link behavior.
- Full text accessibility.

### Likely Files

- `aftercare.html`
- `js/aftercare.js`
- `css/aftercare.css`

### Acceptance Criteria

- Tattoo/piercing tabs still deep-link via query param.
- Long content is easier to scan on mobile.
- Critical safety info is not hidden behind unclear UI.
- Accordions are keyboard accessible.
- No medical claims are added beyond appropriate care guidance.

## Phase 10: Motion And Interaction Polish

### Motion Principle

Use motion sparingly. The site should feel alive, not theatrical.

### Allowed Motion

- Subtle card and image reveal on scroll.
- Hover lift and image scale.
- Sticky header compression.
- Lightbox transition refinement.
- Active filter transitions.
- Promo/card entrance.

### Disallowed Or Discouraged Motion

- Scroll-jacking.
- Custom cursor.
- Heavy canvas or WebGL effects.
- Over-staggered text reveals.
- Effects that delay access to information.
- Parallax that makes mobile reading harder.

### Implementation

Add small `js/reveal.js` using `IntersectionObserver`.

Behavior:

- Apply `.reveal` only to sections/cards where helpful.
- If JS fails, content must remain visible.
- Under `prefers-reduced-motion`, disable transform/opacity reveal behavior.

Motion timing:

- Generally 150ms to 300ms.
- Avoid long decorative delays.

### Acceptance Criteria

- Site feels livelier without slowing task completion.
- Reduced-motion mode is calm.
- No content is invisible if JS fails.
- No animation creates horizontal overflow.

## Phase 11: Accessibility Hardening

### Must Fix

- Mobile nav focus should move into dialog on open.
- Escape should close mobile nav.
- Background should not be reachable while dialog is open.
- Focus should return to hamburger on close.
- All icon-only controls need accessible names.
- Gallery filter state should use `aria-pressed` or a tabs pattern consistently.
- Lightbox captions and CTAs must be keyboard reachable.

### Additional Checks

- Keyboard-only pass through every page.
- Touch target pass at 360px and 390px.
- Contrast pass on red text over dark surfaces.
- Verify focus rings on all CTAs.
- Verify mobile CTA bar is accessible.

### Acceptance Criteria

- Keyboard users can complete primary flows.
- Focus never disappears.
- Dialog behavior is predictable.
- Screen reader labels are meaningful.
- Reduced-motion preference is respected.

## Phase 12: Performance And Asset Pass

### Current Risk

Some image assets are large, and the site relies on external CDN assets for Swiper, GLightbox, and Google Fonts.

### Specification

Images:

- Compress large images, especially 1MB+ assets.
- Generate responsive image sizes for gallery thumbnails.
- Prefer WebP/AVIF where appropriate.
- Use JPG fallback when needed.
- Use `loading="lazy"` for non-critical images.
- Use `decoding="async"` where appropriate.
- Preload only the hero image.

Dependencies:

- Keep Swiper and GLightbox if still valuable.
- Consider pinned local vendoring if CDN dependency risk becomes a deployment concern.
- Do not add new heavy animation libraries unless justified.

Asset cleanup:

- Remove duplicated homepage-gallery assets if no longer needed.
- Or document why duplicates exist.

### Acceptance Criteria

- No missing image references.
- No large unnecessary first-load images.
- All local routes return `200`.
- Hero image returns `200`.
- No console errors.
- Performance remains appropriate for mobile shoppers.

## Suggested Implementation Order

1. Create `staging-modern-ui` and capture baseline screenshots.
2. Fix hero media and visual tokens.
3. Add mobile CTA bar.
4. Upgrade gallery filters and lightbox captions.
5. Redesign artist detail pages.
6. Upgrade contact page.
7. Upgrade promotions.
8. Improve aftercare navigation.
9. Add restrained reveal motion.
10. Run accessibility and performance QA.
11. Run final browser QA.
12. Merge `staging-modern-ui` into `staging` only after review.

## QA Matrix

### Pages

- `index.html`
- `gallery.html`
- `artists.html`
- `artist-brian.html`
- `artist-martin.html`
- `artist-tempt.html`
- `aftercare.html`
- `promotions.html`
- `contact.html`

### Viewports

- 360 x 740
- 390 x 844
- 768 x 1024
- 1280 x 720
- 1440 x 900

### Functional Checks

- No horizontal overflow.
- Header and navigation usable.
- Mobile CTA does not cover content.
- Gallery filters work.
- Gallery URL filter state works.
- Lightbox works.
- Lightbox captions and CTAs work.
- Artist page CTAs work.
- Contact actions work.
- Promotion states render correctly.
- Aftercare tabs and section navigation work.

### Accessibility Checks

- Keyboard navigation works across pages.
- Mobile nav focus trap works.
- Escape closes dialogs/overlays.
- Focus returns predictably.
- Focus rings are visible.
- Icon-only controls have names.
- Reduced motion works.

### Performance Checks

- Local static pages return `200`.
- Hero image returns `200`.
- No missing assets.
- No console errors.
- Large images are optimized.
- No unnecessary first-load JavaScript added.

## Definition Of Done

The modernization run is done when the site feels image-led, mobile-ready, and conversion-oriented while remaining static, fast, accessible, and easy to maintain.

The most important proof is not animation volume. The proof is whether a tattoo shopper can quickly find relevant work, trust the shop, and take the next action.
