import { createContext, useContext } from 'react';
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'motion/react';
import { Bubbles } from '@/components/design-system/Bubbles';
import { PagePattern } from '@/components/design-system/PagePattern';
import '@/styles/design-system.css';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowRight01Icon,
  FolderOpenIcon,
  MapPinIcon,
  Globe02Icon,
  CodeIcon,
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
    availability: 'Disponible para proyectos',
    h1_line1: 'Pienso como diseñador.',
    h1_line2: 'Construyo como ingeniero.',
    sub: 'Diseño y construyo webs y productos digitales de punta a punta: del primer trazo en Figma al deploy en producción.',
    see_projects: 'Ver proyectos',
    signal_location: 'Colombia · GMT-5',
    signal_remote: 'Trabajo remoto',
    signal_stack: 'Astro · React · TypeScript',
    photo_alt: 'Milo Agudelo, desarrollador full stack',
  },
  en: {
    nav_work: 'Work',
    nav_about: 'About',
    nav_stack: 'Stack',
    nav_contact: 'Contact',
    book_call: 'Book a call',
    book_call_short: 'Book',
    availability: 'Available for projects',
    h1_line1: 'I think like a designer.',
    h1_line2: 'I build like an engineer.',
    sub: 'I design and build websites and digital products end to end: from the first Figma sketch to production deploy.',
    see_projects: 'See projects',
    signal_location: 'Colombia · GMT-5',
    signal_remote: 'Remote work',
    signal_stack: 'Astro · React · TypeScript',
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

/* ── Navbar ──────────────────────────────────────────────────── */

const NAV_LINKS = [
  { id: 'work',    key: 'nav_work' },
  { id: 'about',   key: 'nav_about' },
  { id: 'stack',   key: 'nav_stack' },
  { id: 'contact', key: 'nav_contact' },
] as const;

function Navbar({ reduced }: { reduced: boolean }) {
  const s = useS();
  return (
    <motion.header
      {...enter(reduced, 0)}
      className="flex items-center justify-between gap-4 py-6 sm:py-8"
    >
      <a href="/" className="text-[22px] font-black tracking-[-0.03em] text-foreground select-text">
        Milo<span className="text-primary">.</span>
      </a>

      <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
        {NAV_LINKS.map(link => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className="rounded-full px-4 py-2 text-sm font-semibold text-foreground/55 transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {s[link.key]}
          </a>
        ))}
      </nav>

      <motion.a
        href="#"
        className="btn-glass-primary flex h-10 items-center gap-2 rounded-full px-4 font-sans text-sm font-bold text-foreground"
        whileTap={reduced ? {} : { scale: 0.97 }}
      >
        <MeetLogo className="size-4 shrink-0" />
        <span className="hidden sm:inline">{s.book_call}</span>
        <span className="sm:hidden">{s.book_call_short}</span>
      </motion.a>
    </motion.header>
  );
}

/* ── Availability badge ──────────────────────────────────────── */

function AvailabilityBadge() {
  const s = useS();
  return (
    <div className="glass-pill inline-flex items-center gap-2.5 rounded-full px-4 py-2">
      <span className="relative flex size-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
      </span>
      <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {s.availability}
      </span>
    </div>
  );
}

/* ── Signal row — real facts, no invented metrics ────────────── */

const SIGNALS = [
  { Icon: MapPinIcon,     key: 'signal_location' },
  { Icon: Globe02Icon,    key: 'signal_remote' },
  { Icon: CodeIcon,       key: 'signal_stack' },
] as const;

function SignalRow() {
  const s = useS();
  return (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-border pt-5">
      {SIGNALS.map(({ Icon, key }) => (
        <div key={key} className="flex items-center gap-2 text-muted-foreground">
          <HugeiconsIcon icon={Icon} size={14} strokeWidth={1.5} aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em]">{s[key]}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Photo card ──────────────────────────────────────────────── */

function PhotoCard({ profileSrc, reduced }: { profileSrc: string; reduced: boolean }) {
  const s = useS();

  // Subtle mouse parallax, mirrors the design-system profile block
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const imgX = useTransform(mx, [-0.5, 0.5], [-7, 7]);
  const imgY = useTransform(my, [-0.5, 0.5], [-7, 7]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    animate(mx, 0, { type: 'spring', stiffness: 180, damping: 22 });
    animate(my, 0, { type: 'spring', stiffness: 180, damping: 22 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : 0.15, ease: EASE }}
      className="relative w-full max-w-[380px] overflow-hidden rounded-[24px] border-2 border-white sm:max-w-[420px] lg:max-w-none"
      style={{
        aspectRatio: '4/4.6',
        background: 'linear-gradient(180deg, var(--humo), var(--niebla))',
        boxShadow: '0 0 0 1px var(--border), var(--sombra-elevada)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.img
        src={profileSrc}
        alt={s.photo_alt}
        className="absolute inset-0 h-full w-full object-cover object-top"
        style={{ x: imgX, y: imgY, scale: 1.06 }}
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
    </motion.div>
  );
}

/* ── Hero ────────────────────────────────────────────────────── */

function Hero({ profileSrc, reduced }: { profileSrc: string; reduced: boolean }) {
  const s = useS();
  return (
    <section className="grid items-center gap-10 pb-16 pt-6 sm:pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-24">
      <div className="flex flex-col items-start">
        <motion.div {...enter(reduced, 0.05)}>
          <AvailabilityBadge />
        </motion.div>

        <h1
          className="mt-6 text-[clamp(2.375rem,6.5vw,4.25rem)] font-black leading-[1.04] tracking-[-0.04em]"
          style={{ textWrap: 'balance' }}
        >
          <motion.span {...enter(reduced, 0.1)} className="block text-foreground">
            {s.h1_line1}
          </motion.span>
          <motion.span {...enter(reduced, 0.16)} className="block text-primary">
            {s.h1_line2}
          </motion.span>
        </h1>

        <motion.p
          {...enter(reduced, 0.24)}
          className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground sm:text-base"
          style={{ textWrap: 'pretty' }}
        >
          {s.sub}
        </motion.p>

        <motion.div {...enter(reduced, 0.3)} className="mt-8 flex flex-wrap items-center gap-3">
          <motion.a
            href="#"
            className="btn-glass-primary group/btn flex h-12 items-center gap-2.5 rounded-full px-6 font-sans text-sm font-bold text-foreground"
            whileTap={reduced ? {} : { scale: 0.97 }}
          >
            <MeetLogo />
            {s.book_call}
            <span className="transition-transform duration-150 group-hover/btn:translate-x-1">
              <HugeiconsIcon icon={ArrowRight01Icon} size={15} aria-hidden="true" />
            </span>
          </motion.a>
          <motion.a
            href="#work"
            className="btn-glass-secondary flex h-12 items-center gap-2.5 rounded-full px-6 font-sans text-sm font-bold text-foreground"
            whileTap={reduced ? {} : { scale: 0.97 }}
          >
            <HugeiconsIcon icon={FolderOpenIcon} size={16} strokeWidth={1.5} aria-hidden="true" />
            {s.see_projects}
          </motion.a>
        </motion.div>

        <motion.div {...enter(reduced, 0.38)} className="mt-10 w-full">
          <SignalRow />
        </motion.div>
      </div>

      <div className="flex justify-center lg:justify-end">
        <PhotoCard profileSrc={profileSrc} reduced={reduced} />
      </div>
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

        <div className="relative z-[2] mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8">
          <Navbar reduced={reduced} />
          <Hero profileSrc={profileSrc} reduced={reduced} />
        </div>
      </div>
    </LocaleCtx.Provider>
  );
}
