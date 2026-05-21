/**
 * Shared Motion variant factories for the design system and future pages.
 * All variants accept `reduced: boolean` (from useReducedMotion()) so every
 * animation respects the user's prefers-reduced-motion preference.
 */

/* ── Easing curve shared across variants ─────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Container — triggers staggered children ─────────────────── */
export const makeBlockAnim = (delayChildren = 0.15, staggerChildren = 0.06) => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});

/* ── Generic child — fade + gentle slide up ──────────────────── */
export const makeItemAnim = (reduced: boolean) => ({
  hidden: { opacity: 0, y: reduced ? 0 : 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: reduced ? 0 : 0.4, ease: EASE },
  },
});

/* ── Scale child — for swatches, icons, buttons ──────────────── */
export const makeScaleAnim = (reduced: boolean) => ({
  hidden: { opacity: 0, scale: reduced ? 1 : 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: reduced
      ? { duration: 0 }
      : ({ type: 'spring', stiffness: 180, damping: 18 } as const),
  },
});

/* ── Bar child — scaleX from left (spacing / duration bars) ───── */
export const makeBarAnim = (reduced: boolean) => ({
  hidden: { scaleX: reduced ? 1 : 0 },
  show: {
    scaleX: 1,
    transition: { duration: reduced ? 0 : 0.55, ease: EASE },
  },
});

/* ── Row child — slide in from left (typography rows) ────────── */
export const makeRowAnim = (reduced: boolean) => ({
  hidden: { opacity: 0, x: reduced ? 0 : -14 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: reduced ? 0 : 0.4, ease: EASE },
  },
});
