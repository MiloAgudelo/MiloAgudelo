---
name: responsive-web-design
description: Audit and fix responsive layout across the full device range (small phones → 4K). Use when reviewing responsiveness, checking that nothing clips/overflows/has dead space, or hardening breakpoints. Local, no telemetry.
---

# Responsive Web Design Audit

A systematic pass to guarantee a layout holds from the smallest phone to a 4K monitor with **no clipping, no horizontal scroll, no dead space, and no awkward line breaks**.

## Breakpoints to test (width × height)

Test every one — bugs hide between the common presets.

| Class            | Size        | Why it matters |
|------------------|-------------|----------------|
| Tiny phone       | 320 × 568   | iPhone SE 1 / smallest realistic. Worst case for overflow. |
| Small phone      | 360 × 800   | Android baseline (most common worldwide). |
| Standard phone   | 390 × 844   | iPhone 14/15. |
| Large phone      | 430 × 932   | iPhone Pro Max. |
| Phone landscape  | 844 × 390   | Short viewport — vertical space is the constraint. |
| Tablet portrait  | 768 × 1024  | iPad. Common "neither mobile nor desktop" break. |
| Tablet landscape | 1024 × 768  | Where `lg:` usually kicks in. |
| Laptop           | 1280 × 800  | Baseline desktop. |
| Desktop          | 1440 × 900  | Common. |
| Full HD          | 1920 × 1080 | Most common desktop resolution. |
| QHD              | 2560 × 1440 | Check `max-w` container isn't lost in dead space. |
| 4K               | 3840 × 2160 | Content must stay centered/bounded, not stranded or stretched. |

## What to check at each size

1. **No horizontal overflow.** `document.documentElement.scrollWidth <= clientWidth`. The #1 responsive bug. Usual causes: fixed widths, negative margins, `100vw` (ignores scrollbar), un-wrapped long strings, oversized images without `max-width:100%`, absolute/transform elements spilling out.
2. **Nothing clipped.** Text truncated unintentionally, buttons cut off, `overflow:hidden` eating content, fixed heights clipping wrapped text, focus rings clipped.
3. **No dead space.** Huge empty gaps, content stranded left/top while the rest is blank, an unbounded container leaving oceans of whitespace on ultra-wide, or a `max-w` too small for 4K.
4. **Text.** No overflow; line length stays readable (~45–75ch) — cap with `max-w-prose`/`ch`. No orphan single words; use `text-wrap: balance` for headings, `pretty` for body. `clamp()` for fluid type. Check the *longest* string in each language.
5. **Tap targets.** ≥ 44×44px on touch. Enough spacing between adjacent links/buttons.
6. **Images/media.** `max-width:100%; height:auto`, correct `object-fit`, no distortion, art-directed where needed, sensible `aspect-ratio`.
7. **Grid/flex reflow.** Columns collapse sensibly; `min-width:0` on flex/grid children so they can shrink (prevents blowout); `flex-wrap` where needed; no row with one lonely orphan item.
8. **Sticky/fixed/nav.** Header height doesn't eat small landscape viewports; mobile menu works; nothing overlaps content; `100dvh` not `100vh` for full-height (mobile URL bar).
9. **Spacing scales.** Padding/margins shouldn't feel cramped on mobile or bloated on desktop — scale with breakpoints or `clamp()`.
10. **Zoom & reflow (a11y).** 200% browser zoom must not clip or force horizontal scroll (WCAG 1.4.10).

## Method

1. Start the dev server; open the preview.
2. For each breakpoint above: resize → screenshot → run the overflow check → inspect suspect elements. Test **both light and dark** if themed, and **every locale** (translated strings differ in length).
3. Log each issue with: breakpoint, element, symptom, cause.
4. Fix at the source (CSS/markup), not with one-off magic numbers. Prefer fluid primitives: `clamp()`, `min()`/`max()`, `minmax()`, `auto-fit`/`auto-fill`, container queries, logical properties.
5. Re-test the fixed breakpoint **and** the neighbours (fixes often shift the break).

## Quick overflow probe (paste in console / preview_eval)

```js
[...document.querySelectorAll('*')]
  .filter(el => el.offsetWidth > document.documentElement.clientWidth + 1
             || el.scrollWidth  > document.documentElement.clientWidth + 1)
  .map(el => ({ tag: el.tagName, cls: el.className, w: el.scrollWidth }))
```

Empty result = no element wider than the viewport. Non-empty = there's your overflow culprit.

## Common fixes

- Container: `w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8` — bounded, centered, padded, never edge-to-edge on wide screens.
- Root guard while hunting: `overflow-x: hidden` on the wrapper is a band-aid — find the real culprit first, keep it as backstop.
- Flex/grid children that overflow: add `min-w-0` (and `min-h-0` for vertical).
- Fluid type: `font-size: clamp(1rem, 2.5vw, 1.5rem)`.
- Responsive grid without media queries: `grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr))`.
- Full height on mobile: `min-h-[100dvh]` not `100vh`.
