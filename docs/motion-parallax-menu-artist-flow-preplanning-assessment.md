# Motion, Parallax, Menu, And Artist Flow Preplanning Assessment

Date: 2026-06-11

Status: assessment only. No implementation decisions are final in this document.

Current working branch observed: `staging-modern-ui`

Current local preview observed: `http://127.0.0.1:4178/`

## Purpose

This document captures observations and pre-planning notes for three possible follow-up tracks:

1. Parallax, scroll-snap, slide, and fade effects.
2. Hamburger menu sizing adjustments.
3. Artist-to-gallery flow redesign.

The goal is to decide whether these ideas are worth turning into implementation plans. This is not an implementation plan yet.

## Branch Naming Reality Check

The repo currently has a branch named `staging`. Because Git refs cannot be both a file and a directory, branches named like `staging/...` cannot be created while `staging` exists.

Requested conceptual branch names:

- `staging-modern-ui/parallax`
- `staging/staging-modern-ui/experimental-parallax`
- `staging/menu-adjustments`
- `staging/artist-flow-proposal`
- `staging/view-changes`

Repo-compatible branch names unless the branch namespace is changed:

- `staging-modern-ui-parallax`
- `staging-modern-ui-experimental-parallax`
- `staging-menu-adjustments`
- `staging-artist-flow-proposal`
- `staging-view-changes`

Recommendation: keep the existing `staging` branch intact and use hyphenated branch names for now. If the team strongly wants slash namespaces later, first rename or remove the local and remote `staging` branch and replace it with a namespace strategy such as `release/staging` plus `staging/...` feature branches. That is a larger Git workflow change and should not be mixed into visual experimentation.

## Current Observations

### Existing Motion System

The current modernization branch already has a restrained reveal system in `js/reveal.js`.

Observed behavior:

- It targets major sections and selected cards.
- It uses `IntersectionObserver`.
- It applies a simple fade plus `translateY(18px)`.
- It unobserves each element after first reveal.
- It respects `prefers-reduced-motion: reduce`.
- Its observer settings are `threshold: 0.12` and `rootMargin: 0px 0px -8% 0px`.

Assessment:

The current system is conservative and elegant. It is good baseline polish, but because it waits for intersection and reveals whole sections, the first image under "Our Work" can feel abrupt during moderate mobile scrolling. It is likely not a loading problem because thumbnails are already generated and the first observed image reports as complete with a valid natural width. It is more likely a reveal-timing and viewport-entry perception issue.

### Homepage Structure Relevant To Parallax

Current homepage order:

1. Promo bar.
2. Sticky header.
3. Hero.
4. Carousel showcase.
5. Stats strip.
6. Our Services.
7. Our Work preview grid.
8. Promotions / testimonials / CTA.

The proposed parallax moment around "Our Work" would happen after users have already passed a strong hero and a large carousel. That matters: adding another heavy scroll interaction here could feel premium, but it could also make the page feel like it keeps interrupting the user before they reach conversion actions.

### Our Work Image Entry

User observation:

The first image under "Our Work" appears abruptly and can feel delayed, especially when scrolling at a moderate pace.

Assessment:

This should be treated as a real polish issue independent of any parallax experiment. Even if full parallax is rejected, the "Our Work" image reveal should probably be tuned.

Likely low-risk refinements to evaluate later:

- Trigger the gallery preview reveal earlier.
- Stagger individual image reveals with shorter delays.
- Pre-mark the first row as visible once the section heading begins entering.
- Avoid hiding fully loaded gallery thumbnails until the image itself is mostly on screen.
- Consider no reveal on the first image row, with hover/tap polish doing the interaction work instead.

What to avoid:

- Making loaded images appear absent until they are centered in the viewport.
- Long opacity delays on mobile.
- Combining section-level reveal and item-level reveal in a way that doubles the wait.

## Parallax And Scroll-Snap Assessment

### Concept Under Review

When scrolling down to "Our Work" on mobile:

- Elements above the section may slow, pin, or stop moving.
- The image area slides upward.
- The image gently snaps into place.
- A swipe could snap to the next image, similar to a restrained reel.

### Fit For This Site

Good fit if:

- The interaction makes tattoo browsing feel more tactile.
- Users can still quickly bypass it.
- It highlights actual artwork rather than decorative motion.
- The gallery preview still points clearly to the full gallery and artist flow.

Bad fit if:

- It traps users who are trying to reach contact, hours, location, or aftercare.
- It turns a marketing homepage into a scroll-jacking experience.
- It competes with the existing carousel and gallery.
- It requires too much custom touch logic to feel reliable across iOS and Android.

### Recommended Direction

Do not start with a full-screen reels-style lock.

Preferred experiment: a soft sticky artwork rail.

Behavior:

- The "Our Work" heading and first artwork card enter normally.
- On mobile only, the artwork grid becomes a short sticky sequence for 2-3 highlighted images.
- Each image gently translates and scales as it approaches the center.
- The section uses normal page scroll, not custom wheel or touch hijacking.
- CSS `scroll-snap-type` may be used inside a contained horizontal or vertical rail, but the page itself should remain naturally scrollable.
- Provide a visible "View full gallery" path before and after the effect.

Why:

This keeps the premium feel without blocking fast navigation. It also reduces implementation risk compared with custom swipe interception.

### Skip / Escape Behavior

Concern:

If the experience requires extra swipes to reach the bottom or top, it may frustrate fast-moving users.

Assessment:

This is the largest risk. Tattoo shoppers may be casually browsing art, but they may also be trying to call, check location, compare artists, or show someone a piece quickly. Scroll effects should not behave like a modal unless the user explicitly opens a gallery viewer.

Preliminary rules:

- Do not prevent default page scrolling for the main document.
- Do not require one swipe per image to exit the section.
- If using snap points, keep the snap rail short.
- Allow high-velocity swipes to pass through the section.
- Provide a visible "Skip to full gallery" or "View all work" control if the section becomes sticky.
- Disable snap behavior under `prefers-reduced-motion`.
- Consider disabling the sticky version on short-height devices.

### Possible Interaction Models

#### Option A: Early Reveal Tuning Only

Description:

Keep the current layout and adjust reveal timing for "Our Work."

Assessment:

Best low-risk polish fix. Does not satisfy the full parallax idea, but likely fixes the current abrupt image appearance.

Risk:

Low.

#### Option B: Soft Sticky Artwork Rail

Description:

The "Our Work" section has a sticky image stage for a short scroll span. Artwork gently slides, scales, and fades as the section progresses. Page scroll remains native.

Assessment:

Best candidate for the experimental parallax branch.

Risk:

Medium. Needs mobile device QA.

#### Option C: Vertical Reels-Style Snap

Description:

Each artwork becomes a snap panel, and swipes move panel to panel.

Assessment:

Potentially engaging, but too intrusive for the homepage unless implemented as an explicit gallery mode. Better suited to a dedicated "browse work" experience than the main landing page.

Risk:

High.

#### Option D: Horizontal Swipe Rail

Description:

The homepage "Our Work" preview becomes a horizontal snap carousel with subtle parallax inside each card.

Assessment:

Likely safer than vertical page locking. However, the site already has a carousel above, so this could feel repetitive unless visually differentiated.

Risk:

Medium.

### Parallax Opportunities Beyond "Our Work"

#### Hero

Current state:

The hero already uses an image background and desktop-only fixed attachment.

Assessment:

Avoid heavy mobile parallax in the hero. Mobile browser background-attachment behavior is inconsistent and can perform poorly. If tested, use transform-based foreground/background layers, not `background-attachment: fixed`.

Candidate:

Subtle hero text and background drift on scroll for desktop only, with no mobile lock.

#### Carousel Showcase

Current state:

Large homepage carousel immediately follows hero.

Assessment:

Do not add competing scroll snap here yet. The carousel already has motion and lightbox behavior.

Candidate:

Micro-depth hover/focus on desktop cards only.

#### Our Services

User idea:

Service boxes slide from left and right to collide into current position.

Assessment:

The current gentle fade is more aligned with the brand than a collision effect. A collision animation risks feeling gimmicky. A better version would be alternating directional reveal with small horizontal offset, short duration, and no bounce.

Candidate:

Left/right staggered reveal at 12-18px offset, opacity 0 to 1, no overshoot. Keep current reveal as fallback.

#### Artist Cards

Assessment:

Artist cards are a good candidate for subtle directional reveal because they represent choices. Motion should help users perceive the set as a curated group.

Candidate:

Cards reveal with a small stagger and image zoom settling into place.

#### Contact / Conversion Panels

Assessment:

Avoid parallax. Conversion surfaces should feel stable and tappable.

Candidate:

Use restrained focus/hover/pressed states only.

## Hamburger Menu Adjustment Assessment

Requested future branch:

Conceptual: `staging/menu-adjustments`

Repo-compatible: `staging-menu-adjustments`

Requested changes:

- Reduce hamburger menu size by about 20%.
- Increase hamburger overlay item font size by about 20%.
- Increase spacing proportionally plus an extra 20%.

Current CSS baseline:

- `.hamburger` width: `49px`
- `.hamburger` height: `35px`
- `.hamburger` min-height: `var(--tap-target)`
- hamburger bar height: `4px`
- overlay item font size: `clamp(1.25rem, 5vw, 1.875rem)`
- overlay nav gap: `0.875rem`
- short-height override item font size: `clamp(1.05rem, 4.6vw, 1.35rem)`
- short-height override nav gap: `0.55rem`

Initial feasibility:

Easy technically, but it must be tested on short mobile heights. Prior mobile work specifically addressed fitting the hamburger menu on short screens, so a 20% font and spacing increase may reintroduce overflow pressure.

Preliminary implementation target if approved later:

- Hamburger width: about `39px`
- Hamburger visual height: about `28px`
- Preserve the minimum tap target at `44-48px`.
- Bar height: about `3px` or keep `4px` if visual clarity is better.
- Overlay item font: around `clamp(1.5rem, 6vw, 2.25rem)`.
- Overlay nav gap: around `1.25rem`.
- Short-height override should not increase as aggressively.

Important caution:

Do not reduce the actual clickable area by 20%. Only reduce the visual hamburger glyph. The tap target should remain accessible.

## Artist Flow Redesign Assessment

Requested future branch:

Conceptual: `staging/artist-flow-proposal`

Repo-compatible: `staging-artist-flow-proposal`

### Current Flow

Current modernization branch has:

- `artists.html` artist cards.
- Artist detail pages such as `artist-brian.html`, `artist-martin.html`, and `artist-tempt.html`.
- Gallery filtering by URL query such as `gallery.html?artist=martin`.
- Artist-specific gallery pages render only each artist's work.

### Proposed Flow

When clicking an artist:

- Automatically direct to the gallery filtered by that artist.
- Scroll so the artist's name is at the top of the viewport.
- Add a "Back to artists" button pinned near the header/top-left.
- As the user scrolls up past the artist name, the back button gently floats next to the artist name with acceleration/deceleration.
- Remove the need for a separate artist image filter as a redundant gallery.

### Assessment

The direction is coherent, but it changes the information architecture.

Potential benefits:

- Reduces duplicate artist portfolio pages.
- Makes the gallery the canonical artwork browsing surface.
- Keeps shoppers in one browsing context.
- Makes filtered gallery URLs more useful.
- Could make the site feel more app-like and intentional.

Potential risks:

- Artist detail pages currently provide profile context, specialty tags, and artist-specific calls to action. Removing or bypassing them could reduce trust if gallery filtering becomes purely visual.
- A pinned/floating back button with scroll-coupled animation could distract from artwork if overdone.
- If the user lands directly on `gallery.html?artist=martin`, the back button may imply a previous artists page even when there is no browser history.
- Header plus pinned back control plus mobile action bar may crowd mobile screens.

### Recommended Direction

Do not remove artist context outright.

Preferred experiment:

- Keep `artists.html` as the artist overview.
- Change artist card primary action to route to `gallery.html?artist=martin#artist-martin` or equivalent.
- In gallery, render artist sections with stable IDs.
- When an artist filter is active, show an artist context header above the filtered results:
  - artist name
  - specialty tags
  - short profile line
  - call CTA
  - back to artists link
- Pin the "Back to artists" control only after the gallery context header scrolls near the top.
- Avoid making it float beside the artist name until after basic pinned behavior is validated.

### Scroll Animation Proposal For Back Button

If implemented later:

- Use `position: sticky` first.
- Use a tiny transform transition for the float-in state.
- Use CSS easing such as `cubic-bezier(0.22, 1, 0.36, 1)` for decelerated arrival.
- Avoid manual scroll handlers unless needed.
- If a scroll handler is needed, throttle with `requestAnimationFrame`.
- Disable the float animation under reduced motion.

### Routing Questions To Resolve Before Implementation

- Should clicking the artist image go to filtered gallery or artist profile?
- Should "View work" and artist name behave differently?
- Should artist detail pages remain accessible for SEO and direct links?
- Should filtered gallery have an artist bio strip to replace detail-page context?
- Should style filters remain visible when an artist is active?
- Should a "Back to artists" button be shown when the user arrived from a direct URL?

## Combined Evaluation Branch

Question:

Can applicable feature branches be merged into a combined branch to evaluate how they tie together, while preserving separate branches for selective merging later?

Answer:

Yes, that is a good workflow.

Because of the current `staging` branch name conflict, use:

- `staging-view-changes`

Suggested workflow:

1. Keep each feature branch independent:
   - `staging-modern-ui-parallax`
   - `staging-menu-adjustments`
   - `staging-artist-flow-proposal`
2. Create `staging-view-changes` from the latest accepted modernization branch.
3. Merge feature branches into `staging-view-changes` for integrated review.
4. Use `staging-view-changes` only as an evaluation branch.
5. Do not treat `staging-view-changes` as the source of truth for production.
6. Selectively merge approved feature branches back into the main modernization path.

Important:

If two feature branches touch the same files, especially `index.html`, `css/index.css`, `css/nav.css`, `js/gallery.js`, or `js/reveal.js`, the combined branch may need conflict resolution that should not be copied blindly back into individual branches.

## Recommended Next Decision Points

### Parallax

Decision needed:

Choose one of:

- No parallax; tune reveal timing only.
- Soft sticky "Our Work" artwork rail.
- Horizontal snap rail.
- Dedicated full-screen gallery mode, not homepage scroll.

Recommendation:

Prototype soft sticky "Our Work" rail only if the team accepts that it must not block fast page scrolling.

### Menu

Decision needed:

Approve visual hamburger reduction and overlay type increase, with short-height QA as a hard acceptance criterion.

Recommendation:

This is worth a small branch. Keep tap target size unchanged.

### Artist Flow

Decision needed:

Choose whether artist cards should route directly to filtered gallery or continue through profile pages.

Recommendation:

Prototype gallery-first artist flow, but keep artist context in the filtered gallery view before removing or de-emphasizing artist detail pages.

## Assessment Summary

Highest-confidence change:

- Fix or tune the "Our Work" reveal timing.

Most promising experiment:

- Soft sticky artwork rail around "Our Work" on mobile, without scroll-jacking.

Highest-risk experiment:

- Vertical reels-style snap that requires one swipe per image before exiting.

Most straightforward branch:

- Menu sizing adjustment.

Most strategically important branch:

- Artist flow redesign, because it changes how shoppers discover and compare work.

Strongest caution:

Do not let motion block conversion. The site should feel more alive, but users must still be able to quickly reach gallery, artist, phone, location, promotions, aftercare, and contact.
