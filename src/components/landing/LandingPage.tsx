import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from 'motion/react';
import { Bubbles } from '@/components/design-system/Bubbles';
import { PagePattern } from '@/components/design-system/PagePattern';
import '@/styles/design-system.css';

import logoMark from '@/assets/avatar-mark.svg';
import profileCutout from '@/assets/profile-cutout.webp';
import { HugeiconsIcon } from '@hugeicons/react';

// Astro may resolve an asset import to a URL string or an ImageMetadata object.
const asSrc = (m: unknown): string =>
  typeof m === 'string' ? m : (m as { src: string }).src;
const LOGO_SRC = asSrc(logoMark);
const CUTOUT_SRC = asSrc(profileCutout);
import {
  ArrowRight01Icon,
  FolderOpenIcon,
  MapPinIcon,
  Layout01Icon,
} from '@hugeicons/core-free-icons';

/* ── i18n ────────────────────────────────────────────────────── */

const STRINGS = {
  es: {
    nav_work: 'Trabajo',
    nav_about: 'Sobre mí',
    nav_stack: 'Stack',
    nav_contact: 'Contacto',
    book_call: 'Agenda una llamada',
    book_call_short: 'Agendar',
    metric: '+10 empresas como la tuya confían en mi trabajo',
    h1_line1: 'Hola, soy Milo.',
    h1_line2_accent: 'Convierto ideas',
    h1_line2_tail: 'en productos que funcionan.',
    sub: 'Diseño y construyo sitios web, tiendas online y software a la medida. De principio a fin, cuidando los detalles.',
    see_projects: 'Ver proyectos',
    signal_location: 'Colombia · GMT-5',
    signal_stack: 'Landing Pages · E-commerce · Software a la medida',
    photo_alt: 'Milo Agudelo, desarrollador full stack',
  },
  en: {
    nav_work: 'Work',
    nav_about: 'About',
    nav_stack: 'Stack',
    nav_contact: 'Contact',
    book_call: 'Book a call',
    book_call_short: 'Book',
    metric: '10+ companies like yours trust my work',
    h1_line1: "Hey, I'm Milo.",
    h1_line2_accent: 'I turn ideas',
    h1_line2_tail: 'into products that work.',
    sub: 'I design and build websites, online stores and custom software. End to end, minding every detail.',
    see_projects: 'See projects',
    signal_location: 'Colombia · GMT-5',
    signal_stack: 'Landing pages · E-commerce · Custom software',
    photo_alt: 'Milo Agudelo, full stack developer',
  },
} as const;

type Strings = typeof STRINGS.es;
const LocaleCtx = createContext<Strings>(STRINGS.es);
const useS = () => useContext(LocaleCtx);

/* ── Motion ──────────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as const;

/** Page-load entrance: fade + rise, orchestrated by delay. Runs once on mount. */
const enter = (reduced: boolean, delay = 0) => ({
  initial: { opacity: 0, y: reduced ? 0 : 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: reduced ? 0 : 0.5, delay: reduced ? 0 : delay, ease: EASE },
});

/* ── Google Meet mark (same as design system primary button) ── */

function MeetLogo({ className = 'size-[18px] shrink-0' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 87.5 72" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#00832d" d="M49.5 36l8.53 9.75 11.47-8.86V18.86L52.99 18z"/>
      <path fill="#0066da" d="M0 51.5V66c0 3.315 2.685 6 6 6h14.5l3-10.96-3-9.54H0z"/>
      <path fill="#e94235" d="M20.5 0L0 20.5l10.96 3 9.54-3V0z"/>
      <path fill="#2684fc" d="M20.5 20.5H0v31h20.5z"/>
      <path fill="#00ac47" d="M82.6 8.68L69.5 18.86v34.03l13.16 10.2c1.97 1.54 4.84.135 4.84-2.37V11c0-2.535-2.9-3.93-4.9-2.32z"/>
      <path fill="#ffba00" d="M49.5 36v15.5h-29V72h43c3.315 0 6-2.685 6-6V45.75z"/>
      <path fill="#00832d" d="M62.5 0h-43v20.5h29V36l17-13.14V6c0-3.315-2.685-6-6-6z"/>
    </svg>
  );
}

/* ── Magnetic CTA — kree8-style pull that reaches past the pill ──
   Each button tracks the global pointer and pulls when it enters a FIELD-px
   halo around the pill. Because every button decides independently (no shared
   hit target), two adjacent buttons both react when the cursor sits between
   them. The offset is normalised to −1..1 and capped in px, so the pill leans
   subtly and the content — which rides a little further — can never spill out
   past the pill's padding. */

const MAGNET_SPRING = { stiffness: 220, damping: 20, mass: 0.5 } as const;
const FIELD = 28; // px halo around the pill where the pull activates
const PILL_MAX = 3; // px, the pill barely leans
const CONTENT_MAX = 7; // px total for the content — bounded well inside the padding

function MagneticLink({
  href,
  className,
  contentClassName,
  reduced,
  children,
}: {
  href: string;
  className?: string;
  contentClassName?: string;
  reduced: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  // Normalised pointer offset within the halo, −1..1 on each axis
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const pillX = useSpring(useTransform(nx, v => v * PILL_MAX), MAGNET_SPRING);
  const pillY = useSpring(useTransform(ny, v => v * PILL_MAX), MAGNET_SPRING);
  // Content's own travel is the remainder; it inherits the pill, so its total
  // visual travel is CONTENT_MAX — more than the pill, but still capped.
  const contentX = useSpring(useTransform(nx, v => v * (CONTENT_MAX - PILL_MAX)), MAGNET_SPRING);
  const contentY = useSpring(useTransform(ny, v => v * (CONTENT_MAX - PILL_MAX)), MAGNET_SPRING);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const reachX = r.width / 2 + FIELD;
      const reachY = r.height / 2 + FIELD;
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      if (Math.abs(dx) <= reachX && Math.abs(dy) <= reachY) {
        nx.set(Math.max(-1, Math.min(1, dx / reachX)));
        ny.set(Math.max(-1, Math.min(1, dy / reachY)));
      } else {
        nx.set(0);
        ny.set(0);
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduced, nx, ny]);

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={{ x: pillX, y: pillY }}
      whileTap={reduced ? {} : { scale: 0.97 }}
    >
      <motion.span className={contentClassName} style={{ x: contentX, y: contentY }}>
        {children}
      </motion.span>
    </motion.a>
  );
}

/* ── Navbar ──────────────────────────────────────────────────── */

const NAV_LINKS = [
  { id: 'work',    key: 'nav_work' },
  { id: 'about',   key: 'nav_about' },
  { id: 'stack',   key: 'nav_stack' },
  { id: 'contact', key: 'nav_contact' },
] as const;

/* ── Mobile-only navbar intro ─────────────────────────────────────
   On phones (<md) the brand types out the full greeting ("Hola, soy
   Milo."), holds, then collapses "Hola, soy " away to leave just
   "Milo.". While it types, the book button is icon-only; once it settles
   the label returns. Desktop / reduced-motion skip straight to rest, so
   the greeting stays in the hero there (see the sr-only H1 line). */

const TYPE_MS = 72; // per character
const HOLD_MS = 850; // pause on the full greeting before it collapses
const RETRACT_MS = 520; // duration of the "Hola, soy " collapse
const BUTTON_DELAY_MS = 480; // extra beat before the book-button label returns

type IntroPhase = 'typing' | 'retract' | 'rest';

// useLayoutEffect on the client (flip into the intro before first paint,
// no "Milo." flash), useEffect on the server (no-op, avoids the SSR warning).
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Reading-cue timings (mobile only): after the navbar greeting settles the
// metric shines, then a beat later the hero statement over the photo does.
const READCUE_METRIC_MS = 3400;
const READCUE_CAPTION_MS = 5400;

/** One-shot reading-cue shine on phones: toggles the .readcue-shine class
    after `delay`, then clears it once the 1.5s animation has played. No-op
    on desktop / reduced-motion. */
function useReadingCue(delay: number, reduced: boolean) {
  const [shine, setShine] = useState(false);
  useIsoLayoutEffect(() => {
    if (reduced || !window.matchMedia('(max-width: 767px)').matches) return;
    const on = setTimeout(() => setShine(true), delay);
    const off = setTimeout(() => setShine(false), delay + 1600);
    return () => {
      clearTimeout(on);
      clearTimeout(off);
    };
  }, [delay, reduced]);
  return shine;
}

function Navbar({ reduced }: { reduced: boolean }) {
  const s = useS();

  const full = s.h1_line1; // "Hola, soy Milo." / "Hey, I'm Milo."
  const prefix = full.split('Milo')[0]; // "Hola, soy " / "Hey, I'm "
  const P = prefix.length;
  const CORE = 'Milo';
  const total = P + CORE.length + 1; // + the trailing dot

  // SSR + first client render land on the resting state so hydration
  // matches; the layout effect flips into the intro before the first paint.
  const [phase, setPhase] = useState<IntroPhase>('rest');
  const [typed, setTyped] = useState(total);
  const [animateButton, setAnimateButton] = useState(false);
  const [buttonReady, setButtonReady] = useState(true);

  useIsoLayoutEffect(() => {
    const mobile = window.matchMedia('(max-width: 767px)').matches;
    if (reduced || !mobile) return; // desktop / reduced: stay at rest

    setAnimateButton(true);
    setButtonReady(false);
    setPhase('typing');
    setTyped(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    let i = 0;
    const tick = () => {
      i += 1;
      setTyped(i);
      if (i < total) {
        timers.push(setTimeout(tick, TYPE_MS));
        return;
      }
      timers.push(
        setTimeout(() => {
          setPhase('retract');
          timers.push(
            setTimeout(() => {
              setPhase('rest');
              timers.push(setTimeout(() => setButtonReady(true), BUTTON_DELAY_MS));
            }, RETRACT_MS),
          );
        }, HOLD_MS),
      );
    };
    timers.push(setTimeout(tick, 350)); // let the header entrance settle first
    return () => timers.forEach(clearTimeout);
  }, [reduced, total]);

  const collapsed = phase !== 'typing';
  const prefixVisible = prefix.slice(0, Math.min(typed, P));
  const coreVisible = CORE.slice(0, Math.max(0, Math.min(typed - P, CORE.length)));
  const dotVisible = typed >= total ? '.' : '';

  return (
    <motion.header
      {...enter(reduced, 0)}
      className="flex items-center justify-between gap-4 py-4 sm:py-5 xl:py-6"
    >
      <a
        href="/"
        aria-label="Milo — Inicio"
        className="group flex cursor-pointer items-center gap-2.5 text-[20px] font-black tracking-[-0.03em] text-foreground select-text sm:text-[22px] xl:gap-3 xl:text-[26px]"
      >
        <motion.img
          src={LOGO_SRC}
          alt=""
          aria-hidden="true"
          className="size-8 shrink-0 rounded-[9px] shadow-[0_1px_3px_rgba(17,24,39,0.12)] xl:size-9"
          width={32}
          height={32}
          whileHover={reduced ? {} : { scale: 1.08 }}
          whileTap={reduced ? {} : { scale: 1.16 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        />
        {/* Decorative animated greeting — the link's name comes from aria-label. */}
        <span aria-hidden="true" className="inline-flex items-baseline whitespace-nowrap">
          <motion.span
            className="inline-block overflow-hidden"
            style={{ whiteSpace: 'pre' }}
            initial={false}
            animate={collapsed ? { maxWidth: 0, opacity: 0 } : { maxWidth: '16ch', opacity: 1 }}
            transition={{ duration: collapsed ? RETRACT_MS / 1000 : 0, ease: EASE }}
          >
            {prefixVisible}
          </motion.span>
          <span>
            {coreVisible}
            <span className="text-primary">{dotVisible}</span>
          </span>
          {phase === 'typing' && <span className="ds-cursor ml-[2px]" aria-hidden="true" />}
        </span>
      </a>

      <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
        {NAV_LINKS.map(link => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className="rounded-full px-4 py-2 text-sm font-semibold text-foreground/55 transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary xl:px-5 xl:text-[15px]"
          >
            {s[link.key]}
          </a>
        ))}
      </nav>

      <MagneticLink
        href="#"
        reduced={reduced}
        className="btn-glass-primary flex h-10 items-center rounded-full px-4 font-sans text-sm font-bold text-foreground xl:h-11 xl:px-5 xl:text-[15px]"
        contentClassName="flex items-center gap-2"
      >
        <MeetLogo className="size-4 shrink-0 xl:size-[18px]" />
        {buttonReady && (
          <motion.span
            className="inline-flex items-center overflow-hidden whitespace-nowrap"
            initial={animateButton ? { width: 0, opacity: 0 } : false}
            animate={{ width: 'auto', opacity: 1 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <span className="hidden sm:inline">{s.book_call}</span>
            <span className="sm:hidden">{s.book_call_short}</span>
          </motion.span>
        )}
      </MagneticLink>
    </motion.header>
  );
}

/* ── Signal row — real facts, no invented metrics ────────────── */

function SignalRow() {
  const s = useS();
  return (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-border pt-5 md:justify-center lg:justify-start">
      <div className="flex items-center gap-2 text-muted-foreground">
        <HugeiconsIcon icon={MapPinIcon} size={14} strokeWidth={1.5} aria-hidden="true" />
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] xl:text-[11px]">{s.signal_location}</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <HugeiconsIcon icon={Layout01Icon} size={14} strokeWidth={1.5} aria-hidden="true" />
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] xl:text-[11px]">{s.signal_stack}</span>
      </div>
    </div>
  );
}

/* ── Photo card ──────────────────────────────────────────────── */

const PHOTO_SPRING = { stiffness: 150, damping: 20, mass: 0.4 } as const;

function PhotoCard({
  profileSrc,
  reduced,
  caption,
}: {
  profileSrc: string;
  reduced: boolean;
  caption?: React.ReactNode;
}) {
  const s = useS();
  const captionShine = useReadingCue(READCUE_CAPTION_MS, reduced);

  // Normalised pointer position, −0.5..0.5 on each axis
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const lift = useMotionValue(0); // 0 at rest, 1 while hovering

  // A single shared transform drives BOTH layers, so the cut-out and the
  // background stay locked together — no ghosting from mismatched motion.
  // On hover the image lifts and scales a touch, which pushes the hair up.
  const x = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), PHOTO_SPRING);
  const y = useSpring(
    useTransform<number[], number>([my, lift], ([m, l]) => m * 10 - l * 8),
    PHOTO_SPRING,
  );
  const scale = useSpring(useTransform(lift, [0, 1], [1.06, 1.11]), PHOTO_SPRING);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseEnter = () => {
    if (!reduced) lift.set(1);
  };
  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
    lift.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : 0.15, ease: EASE }}
      className="relative w-full max-w-[380px] rounded-[24px] border-[6px] border-white sm:max-w-[420px] md:max-w-none md:w-[min(480px,max(340px,calc((100dvh_-_600px)*0.87)))] lg:w-[min(475px,calc((100dvh_-_190px)*0.87))] 2xl:w-[min(520px,calc((100dvh_-_190px)*0.87))]"
      style={{
        aspectRatio: '4/4.6',
        background: 'linear-gradient(180deg, var(--humo), var(--niebla))',
        boxShadow: '0 0 0 1px var(--border), var(--sombra-elevada)',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background photo — clipped to the rounded frame on every side. */}
      <div className="absolute inset-0 overflow-hidden rounded-[18px]">
        <motion.img
          src={profileSrc}
          alt={s.photo_alt}
          className="absolute inset-0 h-full w-full object-cover object-top"
          style={{ x, y, scale }}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </div>

      {/* Cut-out subject on top — SAME transform as the background (locked, no
          ghosting). The clip lives on this NON-transformed wrapper, so sides and
          bottom are cut off exactly at the frame (unaffected by the image scale)
          while the top stays open for the hair to break past the edge. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ clipPath: 'inset(-160px 0px 0px 0px round 0px 0px 18px 18px)' }}
      >
        <motion.img
          src={CUTOUT_SRC}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-top"
          style={{ x, y, scale }}
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Caption over the photo — mobile only. Desktop shows this line in the
          headline column instead, so it's hidden here at lg. */}
      {caption && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] rounded-b-[18px] bg-gradient-to-t from-black/75 via-black/35 to-transparent px-5 pb-5 pt-24 md:hidden"
        >
          <p
            className={`text-[clamp(1.6rem,7.5vw,2.15rem)] font-bold leading-[1.12] tracking-[-0.02em] text-white${captionShine ? ' readcue-shine' : ''}`}
            style={{ textWrap: 'balance', ['--readcue-glow' as never]: 'rgba(255,255,255,0.85)' }}
          >
            {caption}
          </p>
        </div>
      )}
    </motion.div>
  );
}

/* ── Hero ────────────────────────────────────────────────────── */

function Hero({ profileSrc, reduced }: { profileSrc: string; reduced: boolean }) {
  const s = useS();
  const metricShine = useReadingCue(READCUE_METRIC_MS, reduced);
  return (
    <section
      className="grid grid-cols-1 gap-y-5 pb-16 pt-6 sm:pt-9 md:flex-1 md:[align-content:safe_center] md:gap-y-6 lg:content-normal lg:grid-cols-[1.05fr_0.95fr] lg:grid-rows-[0fr_auto_auto_auto_auto_1fr] lg:gap-x-14 lg:gap-y-4 lg:pb-8 lg:pt-12 2xl:grid-rows-[1fr_auto_auto_auto_auto_1fr] 2xl:pb-24"
    >
      {/* Heading — metric kicker + the big statement. On mobile the second
          line ("Convierto ideas…") is hidden here and shown over the photo. */}
      <div className="flex flex-col items-start md:items-center md:text-center lg:col-start-1 lg:row-start-2 lg:items-start lg:text-left">
        {/* Desktop eyebrow — sits above the headline. Hidden on mobile, where
            the same metric is shown smaller below the H1 (see below). */}
        <motion.p
          {...enter(reduced, 0.05)}
          className="hidden text-[11px] font-semibold uppercase tracking-[0.09em] text-muted-foreground lg:block"
        >
          {s.metric}
        </motion.p>
        <motion.h1
          {...enter(reduced, 0.12)}
          className="text-[clamp(2rem,4.6vw,3.5rem)] font-bold leading-[1.14] tracking-[-0.025em] md:text-[2.25rem] lg:mt-4 lg:text-[clamp(2rem,4.6vw,3.5rem)]"
          style={{ textWrap: 'balance' }}
        >
          {/* On phones the greeting is shown (animated) in the navbar instead;
              kept here sr-only so the H1 still carries it for SEO / a11y. */}
          <span className="sr-only text-foreground md:not-sr-only md:block">{s.h1_line1}</span>
          <span className="hidden md:block">
            <span className="text-primary">{s.h1_line2_accent}</span>{' '}
            <span className="text-foreground">{s.h1_line2_tail}</span>
          </span>
        </motion.h1>
        {/* Mobile-only metric — small, tucked between the H1 and the photo. */}
        <motion.p
          {...enter(reduced, 0.18)}
          style={{ ['--readcue-glow' as never]: 'rgba(0,64,255,0.34)' }}
          className={`mt-2.5 text-[9px] font-medium uppercase tracking-[0.1em] text-muted-foreground md:mt-3 md:text-[10px] lg:hidden${metricShine ? ' readcue-shine' : ''}`}
        >
          {s.metric}
        </motion.p>
      </div>

      {/* Photo — sits right on desktop, between headline and text on mobile.
          On mobile it carries the "Convierto ideas…" line as an overlay. */}
      <div className="flex justify-center lg:col-start-2 lg:row-start-1 lg:row-span-6 lg:justify-end lg:self-start 2xl:self-center">
        <PhotoCard
          profileSrc={profileSrc}
          reduced={reduced}
          caption={
            <>
              <span className="text-[oklch(0.8_0.12_264)]">{s.h1_line2_accent}</span>{' '}
              <span>{s.h1_line2_tail}</span>
            </>
          }
        />
      </div>

      <motion.p
        {...enter(reduced, 0.24)}
        className="max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground sm:text-base md:mx-auto md:text-center lg:col-start-1 lg:row-start-3 lg:mx-0 lg:text-left"
        style={{ textWrap: 'pretty' }}
      >
        {s.sub}
      </motion.p>

      <motion.div
        {...enter(reduced, 0.3)}
        className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center md:justify-center lg:col-start-1 lg:row-start-4 lg:justify-start"
      >
        <MagneticLink
          href="#"
          reduced={reduced}
          className="btn-glass-primary group/btn flex h-12 w-full items-center justify-center rounded-full px-6 font-sans text-sm font-bold text-foreground sm:w-auto xl:h-[52px] xl:px-7 xl:text-[15px]"
          contentClassName="flex items-center gap-2.5"
        >
          <MeetLogo />
          {s.book_call}
          <span className="transition-transform duration-150 group-hover/btn:translate-x-1">
            <HugeiconsIcon icon={ArrowRight01Icon} size={15} aria-hidden="true" />
          </span>
        </MagneticLink>
        <MagneticLink
          href="#work"
          reduced={reduced}
          className="btn-glass-secondary flex h-12 w-full items-center justify-center rounded-full px-6 font-sans text-sm font-bold text-foreground sm:w-auto xl:h-[52px] xl:px-7 xl:text-[15px]"
          contentClassName="flex items-center gap-2.5"
        >
          <HugeiconsIcon icon={FolderOpenIcon} size={16} strokeWidth={1.5} aria-hidden="true" />
          {s.see_projects}
        </MagneticLink>
      </motion.div>

      <motion.div
        {...enter(reduced, 0.38)}
        className="w-full lg:col-start-1 lg:row-start-5"
      >
        <SignalRow />
      </motion.div>
    </section>
  );
}

/* ── Main export ─────────────────────────────────────────────── */

export function LandingPage({ profileSrc = '', locale = 'es' }: { profileSrc?: string; locale?: 'es' | 'en' }) {
  const reduced = useReducedMotion() ?? false;

  return (
    <LocaleCtx.Provider value={STRINGS[locale]}>
      <div className="ds-bg ds-noise relative min-h-screen overflow-x-hidden antialiased" style={{ letterSpacing: '-0.005em' }}>
        <Bubbles />
        <PagePattern />

        <div className="relative z-[2] mx-auto flex min-h-[100dvh] max-w-[1200px] flex-col px-5 sm:px-6 lg:px-8 2xl:max-w-[1440px]">
          <Navbar reduced={reduced} />
          <Hero profileSrc={profileSrc} reduced={reduced} />
        </div>
      </div>
    </LocaleCtx.Provider>
  );
}
