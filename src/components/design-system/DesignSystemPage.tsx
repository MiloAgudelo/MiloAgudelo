import { useState, useEffect, createContext, useContext } from 'react';
import { motion } from 'motion/react';
import { Bubbles } from './Bubbles';
import '@/styles/design-system.css';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  Home01Icon,
  Mail01Icon,
  CodeIcon,
  User02Icon,
  Calendar01Icon,
  FolderOpenIcon,
  ArrowRight01Icon,
  Briefcase01Icon,
  StarIcon,
  GridViewIcon,
  Link01Icon,
  PaintBrush01Icon,
  Globe02Icon,
  Search01Icon,
  Layers01Icon,
  Chat01Icon,
  Camera01Icon,
  BinocularsIcon,
  MountainIcon,
  TentIcon,
  Compass01Icon,
  MapPinIcon,
} from '@hugeicons/core-free-icons';

/* ── i18n ────────────────────────────────────────────────────── */

const STRINGS = {
  es: {
    tagline: 'Pienso como diseñador. Construyo como ingeniero.',
    colors: 'Colores',
    typography: 'Tipografía',
    display_sample: 'Ingeniería con criterio visual',
    h1_sample: 'Del primer commit al Lighthouse en verde',
    body_sample: 'Abordo cada proyecto con doble lente: diseñador e ingeniero en partes iguales. Código limpio, arquitectura sólida y una interfaz que la gente disfruta usar.',
    buttons: 'Botones',
    primary: 'Primario',
    secondary: 'Secundario',
    icon_text: 'Icono + texto',
    ghost: 'Ghost',
    icon: 'Icono',
    view_projects: 'Ver proyectos',
    home: 'Inicio',
    about: 'Sobre mí',
    iconography: 'Iconografía',
    personal_pattern: 'Patrón personal',
    images: 'Imágenes',
    border: 'Borde',
    shadow: 'Sombra',
    motion: 'Movimiento',
    inputs: 'Formularios',
    input_name: 'Nombre completo',
    input_email: 'tu@empresa.com',
    input_message: 'Cuéntame sobre tu proyecto...',
    input_focused: 'Estado: foco activo',
    input_disabled: 'Campo deshabilitado',
  },
  en: {
    tagline: 'I think like a designer. I build like an engineer.',
    colors: 'Colors',
    typography: 'Typography',
    display_sample: 'Engineering with visual precision',
    h1_sample: 'From first commit to Lighthouse in the green',
    body_sample: 'I approach every project as both designer and engineer in equal measure. Clean code, solid architecture, and an interface people actually enjoy using.',
    buttons: 'Buttons',
    primary: 'Primary',
    secondary: 'Secondary',
    icon_text: 'Icon + text',
    ghost: 'Ghost',
    icon: 'Icon',
    view_projects: 'View projects',
    home: 'Home',
    about: 'About me',
    iconography: 'Iconography',
    personal_pattern: 'Personal pattern',
    images: 'Images',
    border: 'Border',
    shadow: 'Shadow',
    motion: 'Motion',
    inputs: 'Forms',
    input_name: 'Full name',
    input_email: 'you@company.com',
    input_message: 'Tell me about your project...',
    input_focused: 'State: focused',
    input_disabled: 'Disabled field',
  },
} as const;

type Strings = typeof STRINGS.es;
const LocaleCtx = createContext<Strings>(STRINGS.es);
const useS = () => useContext(LocaleCtx);

/* ── Animation ───────────────────────────────────────────────── */

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
});

/* ── Bento card shell ────────────────────────────────────────── */

function BentoCard({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative h-full overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-b from-white/95 to-white/75 p-6 backdrop-blur-sm ${className}`}
      style={{ boxShadow: 'var(--sombra-suave), var(--sombra-glass)', ...style }}
    >
      {children}
    </div>
  );
}

/* ── Card label ──────────────────────────────────────────────── */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PERSONAL ICON PATTERN — HugeIcons scout/photography set
═══════════════════════════════════════════════════════════════ */

const PERSONAL_ICONS = [
  Camera01Icon,
  TentIcon,
  MountainIcon,
  Compass01Icon,
  MapPinIcon,
  BinocularsIcon,
];

/* Checkerboard — icons assigned by (r*3 + ci) % 6 so rows and cols properly alternate */
const PERSONAL_PLACEMENTS = (() => {
  const COLS = 18;
  const ROWS = 12;
  const slotW = 100 / COLS;
  const slotH = 100 / ROWS;
  const out: { Icon: (typeof PERSONAL_ICONS)[0]; x: number; y: number }[] = [];
  for (let r = 0; r < ROWS; r++) {
    const y = (r + 0.5) * slotH;
    const startCol = r % 2 === 0 ? 0 : 1;
    for (let c = startCol; c < COLS; c += 2) {
      out.push({ Icon: PERSONAL_ICONS[(Math.floor(r / 2) + c) % PERSONAL_ICONS.length], x: (c + 0.5) * slotW, y });
    }
  }
  return out;
})();

/* ═══════════════════════════════════════════════════════════════
   MOTION BLOCK CONSTANTS
═══════════════════════════════════════════════════════════════ */

const EASING_DEFS = [
  { name: 'Entrada', css: 'cubic-bezier(0.22, 1, 0.36, 1)', svgPath: 'M 0 72 C 15.84 0 25.92 0 72 0' },
  { name: 'Suave',   css: 'cubic-bezier(0.4, 0, 0.2, 1)',   svgPath: 'M 0 72 C 28.8 72 14.4 0 72 0' },
  { name: 'Rebote',  css: 'cubic-bezier(0.34, 1.56, 0.64, 1)', svgPath: 'M 0 72 C 24.48 -40.32 46.08 0 72 0' },
] as const;

const DURATION_DEFS = [
  { name: 'Rápido', ms: 150, use: 'Hover · Focus' },
  { name: 'Base',   ms: 280, use: 'Transiciones' },
  { name: 'Lento',  ms: 500, use: 'Entradas' },
] as const;

/* ═══════════════════════════════════════════════════════════════
   BENTO BLOCKS
═══════════════════════════════════════════════════════════════ */

/* ── 1. Profile — 4:5 ────────────────────────────────────────── */

function ProfileBlock({ profileSrc }: { profileSrc: string }) {
  const s = useS();
  return (
    <div
      className="relative overflow-hidden rounded-[28px]"
      style={{ boxShadow: 'var(--sombra-elevada)', aspectRatio: '4/5', width: '100%' }}
    >
      <img
        src={profileSrc}
        alt="Milo Agudelo"
        className="absolute inset-0 h-full w-full object-cover object-top"
        loading="eager"
        decoding="async"
      />
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col justify-end px-6 pb-6 pt-20"
        style={{ background: 'linear-gradient(to top, rgba(5,10,25,0.82) 0%, rgba(5,10,25,0.4) 55%, transparent 100%)' }}
      >
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
          Design System · v1.0
        </div>
        <div className="text-[36px] font-black leading-none tracking-[-0.04em] text-white">
          Milo<span style={{ color: '#5E80F8' }}>.</span>
        </div>
        <div className="mt-1.5 text-[13px] leading-snug text-white/65">
          {s.tagline}
        </div>
      </div>
    </div>
  );
}

/* ── 2. Colors ───────────────────────────────────────────────── */

const ACCENTS = [
  { name: 'Voltio',  hex: '#0040FF', dark: true },
  { name: 'Tinta',   hex: '#002BB0', dark: true },
  { name: 'Niebla',  hex: '#DCE7F2', dark: false },
  { name: 'Humo',    hex: '#EEF2F5', dark: false },
];

const NEUTRALS = [
  { name: 'Fondo',         hex: '#F5F6F4' },
  { name: 'Superficie',    hex: '#FBFBFA' },
  { name: 'Borde',         hex: '#E5E7E0' },
  { name: 'T. Primario',   hex: '#111827' },
  { name: 'T. Secundario', hex: '#5F6B7A' },
  { name: 'T. Terciario',  hex: '#94A3B8' },
];

function ColorsBlock() {
  const s = useS();
  return (
    <BentoCard>
      <Label>{s.colors}</Label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ACCENTS.map(c => (
          <div key={c.name} className="overflow-hidden rounded-[18px] border border-border/60" style={{ boxShadow: 'var(--sombra-suave)' }}>
            <div className="h-[72px]" style={{ background: c.hex, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)' }} />
            <div className="bg-white/80 px-3 py-2">
              <div className="text-[12px] font-bold text-foreground">{c.name}</div>
              <div className="font-mono text-[10px] text-muted-foreground">{c.hex}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
        {NEUTRALS.map(n => (
          <div key={n.name} className="flex items-center gap-2">
            <div className="size-7 shrink-0 rounded-[8px]" style={{ background: n.hex, border: '1px solid rgba(17,24,39,0.07)' }} />
            <div>
              <div className="text-[11px] font-semibold leading-none text-foreground">{n.name}</div>
              <div className="mt-0.5 font-mono text-[9.5px] text-muted-foreground">{n.hex}</div>
            </div>
          </div>
        ))}
      </div>
    </BentoCard>
  );
}

/* ── Typing code block ───────────────────────────────────────── */

const CODE_TOKENS: { t: string; c: string }[] = [
  { t: 'const ',             c: '#c792ea' },
  { t: 'milo',               c: '#82aaff' },
  { t: ' = {\n',             c: '#cdd6f4' },
  { t: '  rol',              c: '#89dceb' },
  { t: ': ',                 c: '#cdd6f4' },
  { t: '"Full Stack Dev"',   c: '#a6e3a1' },
  { t: ',\n',                c: '#cdd6f4' },
  { t: '  stack',            c: '#89dceb' },
  { t: ': [',                c: '#cdd6f4' },
  { t: '"Astro"',            c: '#a6e3a1' },
  { t: ', ',                 c: '#cdd6f4' },
  { t: '"React"',            c: '#a6e3a1' },
  { t: ', ',                 c: '#cdd6f4' },
  { t: '"TypeScript"',       c: '#a6e3a1' },
  { t: '],\n',               c: '#cdd6f4' },
  { t: '  impacto',          c: '#89dceb' },
  { t: ': ',                 c: '#cdd6f4' },
  { t: '"real"',             c: '#a6e3a1' },
  { t: ',\n',                c: '#cdd6f4' },
  { t: '  disponible',       c: '#89dceb' },
  { t: ': ',                 c: '#cdd6f4' },
  { t: 'true',               c: '#fab387' },
  { t: ',\n',                c: '#cdd6f4' },
  { t: '};',                 c: '#cdd6f4' },
];

const CHARS = CODE_TOKENS.flatMap(tok => [...tok.t]);
const FULL_TEXT = CHARS.join('');

function TypingCode() {
  const [count, setCount]     = useState(0);
  const [erasing, setErasing] = useState(false);
  const [paused, setPaused]   = useState(false);

  useEffect(() => {
    if (paused) {
      const t = setTimeout(() => { setPaused(false); setErasing(true); }, 2200);
      return () => clearTimeout(t);
    }
    if (erasing) {
      if (count === 0) {
        const t = setTimeout(() => setErasing(false), 600);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setCount(c => c - 1), 16);
      return () => clearTimeout(t);
    }
    if (count < CHARS.length) {
      const t = setTimeout(() => setCount(c => c + 1), 44);
      return () => clearTimeout(t);
    } else {
      setPaused(true);
    }
  }, [count, erasing, paused]);

  const text = CHARS.slice(0, count).join('');

  return (
    <div className="mt-4 flex-1 overflow-hidden rounded-[14px] border border-border/60 bg-white/60">
      <div className="flex items-center gap-2 border-b border-border/40 px-4 py-2.5">
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground/40">Mono</span>
        <span className="font-mono text-[11px] text-muted-foreground/70">JetBrains Mono</span>
      </div>
      {/* Wrapper establece la altura con el texto completo invisible */}
      <div className="relative p-4">
        <pre className="font-mono text-[11.5px] leading-[1.75] whitespace-pre-wrap invisible"
          style={{ fontFamily: 'var(--font-mono)' }} aria-hidden>
          {FULL_TEXT}
        </pre>
        <pre className="absolute inset-0 p-4 font-mono text-[11.5px] leading-[1.75] text-foreground whitespace-pre-wrap"
          style={{ fontFamily: 'var(--font-mono)' }}>
          {text}<span className="ds-cursor" />
        </pre>
      </div>
    </div>
  );
}

/* ── 3. Typography ───────────────────────────────────────────── */

function TypographyBlock() {
  const s = useS();
  return (
    <BentoCard className="flex h-full flex-col">
      <Label>{s.typography}</Label>
      <div className="flex items-baseline gap-3 font-black leading-none tracking-[-0.05em]">
        <span className="text-[60px] sm:text-[88px]">Aa</span>
        <span className="text-[16px] font-semibold text-muted-foreground">Satoshi</span>
      </div>
      <div className="mt-4 flex flex-col divide-y divide-dashed divide-border">
        {[
          { role: 'Display', sample: s.display_sample,  style: { fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1 } },
          { role: 'H1',      sample: s.h1_sample,       style: { fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' } },
          { role: 'Body',    sample: s.body_sample,     style: { fontSize: 13, fontWeight: 400, color: '#5F6B7A', lineHeight: 1.6 } },
          { role: 'Caption', sample: 'REACT · TYPESCRIPT · ASTRO', style: { fontSize: 10, fontFamily: 'var(--font-mono)', color: '#94A3B8', letterSpacing: '0.14em' } },
        ].map(row => (
          <div key={row.role} className="flex items-baseline gap-4 py-[10px] first:pt-0">
            <span className="w-12 shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/40">{row.role}</span>
            <span style={row.style as React.CSSProperties}>{row.sample}</span>
          </div>
        ))}
      </div>
      <TypingCode />
    </BentoCard>
  );
}

/* ── 4. Buttons ──────────────────────────────────────────────── */

function ButtonsBlock() {
  const s = useS();
  return (
    <BentoCard className="flex h-full flex-col">
      <Label>{s.buttons}</Label>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/40">{s.primary}</span>
          <button className="btn-glass-primary flex h-11 w-fit items-center gap-2 rounded-full px-5 font-sans text-sm font-bold text-foreground cursor-pointer">
            <svg className="size-[18px] shrink-0" viewBox="0 0 87.5 72" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path fill="#00832d" d="M49.5 36l8.53 9.75 11.47-8.86V18.86L52.99 18z"/>
              <path fill="#0066da" d="M0 51.5V66c0 3.315 2.685 6 6 6h14.5l3-10.96-3-9.54H0z"/>
              <path fill="#e94235" d="M20.5 0L0 20.5l10.96 3 9.54-3V0z"/>
              <path fill="#2684fc" d="M20.5 20.5H0v31h20.5z"/>
              <path fill="#00ac47" d="M82.6 8.68L69.5 18.86v34.03l13.16 10.2c1.97 1.54 4.84.135 4.84-2.37V11c0-2.535-2.9-3.93-4.9-2.32z"/>
              <path fill="#ffba00" d="M49.5 36v15.5h-29V72h43c3.315 0 6-2.685 6-6V45.75z"/>
              <path fill="#00832d" d="M62.5 0h-43v20.5h29V36l17-13.14V6c0-3.315-2.685-6-6-6z"/>
            </svg>
            Book a Call
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </button>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-3">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/40">{s.secondary}</span>
            <button className="btn-glass-secondary flex h-11 w-fit items-center gap-2 rounded-full px-5 font-sans text-sm font-bold text-foreground cursor-pointer">
              {s.view_projects}
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/40">{s.icon_text}</span>
            <button className="btn-glass-secondary flex h-11 w-fit items-center gap-2 rounded-full px-5 font-sans text-sm font-bold text-foreground cursor-pointer">
              <HugeiconsIcon icon={Home01Icon} size={16} strokeWidth={1.5} />
              {s.home}
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/40">{s.ghost}</span>
          <button className="flex h-11 w-fit items-center gap-2 rounded-full px-2 font-sans text-sm font-bold text-foreground/50 cursor-pointer transition-colors hover:text-foreground">
            <HugeiconsIcon icon={User02Icon} size={16} strokeWidth={1.5} />
            {s.about}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/40">{s.icon}</span>
          <div className="flex gap-2.5">
            <button className="btn-glass-secondary flex size-11 items-center justify-center rounded-full cursor-pointer">
              <HugeiconsIcon icon={Mail01Icon} size={16} strokeWidth={1.5} />
            </button>
            <button className="btn-glass-secondary flex size-11 items-center justify-center rounded-full cursor-pointer">
              <HugeiconsIcon icon={Globe02Icon} size={16} strokeWidth={1.5} />
            </button>
            <button className="btn-glass-primary flex size-11 items-center justify-center rounded-full cursor-pointer">
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </BentoCard>
  );
}

/* ── 6. Iconography (wide) ───────────────────────────────────── */

const ICON_SET = [
  { Icon: Home01Icon,       name: 'Home' },
  { Icon: User02Icon,       name: 'User' },
  { Icon: Mail01Icon,       name: 'Mail' },
  { Icon: Calendar01Icon,   name: 'Calendar' },
  { Icon: Briefcase01Icon,  name: 'Briefcase' },
  { Icon: CodeIcon,         name: 'Code' },
  { Icon: Layers01Icon,     name: 'Layers' },
  { Icon: PaintBrush01Icon, name: 'Paint' },
  { Icon: FolderOpenIcon,   name: 'Folder' },
  { Icon: Globe02Icon,      name: 'Globe' },
  { Icon: Link01Icon,       name: 'Link' },
  { Icon: Search01Icon,     name: 'Search' },
  { Icon: StarIcon,         name: 'Star' },
  { Icon: GridViewIcon,     name: 'Grid' },
  { Icon: Chat01Icon,       name: 'Chat' },
  { Icon: ArrowRight01Icon, name: 'Arrow' },
];

function IconographyBlock() {
  const s = useS();
  return (
    <BentoCard className="flex flex-col">
      <div className="flex flex-col flex-1">
        <div className="flex items-end justify-between mb-5">
          <Label>{s.iconography}</Label>
          <span className="mb-5 font-mono text-[10px] text-muted-foreground/40">HugeIcons · Stroke 1.5</span>
        </div>

        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {ICON_SET.map(({ Icon, name }) => (
            <div key={name} className="flex flex-col items-center gap-2 rounded-[14px] border border-border/50 bg-white/50 py-3.5">
              <HugeiconsIcon icon={Icon} size={20} strokeWidth={1.5} className="text-foreground" />
              <span className="font-mono text-[8.5px] uppercase tracking-[0.08em] text-muted-foreground/50 text-center">{name}</span>
            </div>
          ))}
        </div>

        {/* Personal icon pattern */}
        <div className="mt-5 flex flex-col flex-1 gap-1.5">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/40">{s.personal_pattern}</span>
          </div>
          <div
            className="relative w-full overflow-hidden rounded-[14px] border border-border/40 bg-white/20"
            style={{ flex: '1 0 120px', minHeight: 120 }}
            aria-hidden="true"
          >
            {PERSONAL_PLACEMENTS.map((item, i) => (
              <div key={i} className="absolute text-foreground"
                style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -50%)', opacity: 0.09 }}>
                <HugeiconsIcon icon={item.Icon} size={16} strokeWidth={1.5} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </BentoCard>
  );
}

/* ── 7. Images ───────────────────────────────────────────────── */

function ImagesBlock() {
  const s = useS();
  return (
    <BentoCard className="flex h-full flex-col gap-5">
      <Label>{s.images}</Label>
      <div className="ds-frame flex items-center justify-center" style={{ aspectRatio: '16/10' }}>
        <div
          className="flex h-full w-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground/50"
          style={{ background: 'repeating-linear-gradient(135deg, rgba(17,24,39,0.03) 0 10px, transparent 10px 22px)' }}
        >
          Screenshot · 16:9
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {['UI 01', 'UI 02', 'UI 03'].map(l => (
          <div key={l} className="ds-frame" style={{ aspectRatio: '4/3' }}>
            <div
              className="flex h-full items-center justify-center font-mono text-[9px] text-muted-foreground/40"
              style={{ background: 'repeating-linear-gradient(135deg, rgba(17,24,39,0.03) 0 10px, transparent 10px 22px)' }}
            >
              {l}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 mt-auto">
        {[
          { label: 'Radius',   value: '24px' },
          { label: s.border,   value: '2px · white' },
          { label: s.shadow,   value: '0 20px 50px / 6%' },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between rounded-[10px] border border-border/50 bg-white/40 px-3 py-2">
            <span className="text-[12px] font-medium text-foreground">{item.label}</span>
            <span className="font-mono text-[10px] text-muted-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </BentoCard>
  );
}

/* ── 8. Motion ───────────────────────────────────────────────── */

function EasingRow({ name, css, svgPath }: { name: string; css: string; svgPath: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="flex items-center gap-3 py-1.5">
      {/* SVG curve preview */}
      <svg
        width={44}
        height={44}
        viewBox="-6 -18 84 96"
        overflow="visible"
        className="shrink-0"
      >
        {/* baseline */}
        <line x1={0} y1={72} x2={72} y2={72} stroke="rgba(17,24,39,0.08)" strokeWidth={1.5} />
        {/* top dashed line */}
        <line x1={0} y1={0} x2={72} y2={0} stroke="rgba(17,24,39,0.08)" strokeWidth={1.5} strokeDasharray="4 3" />
        {/* easing curve */}
        <path d={svgPath} fill="none" stroke="#0040FF" strokeWidth={2.2} strokeLinecap="round" />
      </svg>

      {/* Name + CSS formula */}
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-semibold text-foreground leading-none">{name}</div>
        <div className="mt-0.5 font-mono text-[9px] text-muted-foreground/50 truncate">{css}</div>
      </div>

      {/* Demo track */}
      <div
        className="relative h-5 w-20 rounded-full bg-foreground/5 shrink-0 overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-primary"
          style={{
            left: hovered ? 'calc(100% - 14px)' : '2px',
            transition: hovered ? `left 600ms ${css}` : 'left 0ms',
          }}
        />
      </div>
    </div>
  );
}

function DurationBar({ name, ms, use }: { name: string; ms: number; use: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 shrink-0">
        <div className="text-[11px] font-semibold text-foreground leading-none">{name}</div>
        <div className="mt-0.5 font-mono text-[9px] text-muted-foreground/50">{ms}ms</div>
      </div>
      <div className="flex-1 h-1.5 rounded-full bg-foreground/[0.06]">
        <div
          className="h-full rounded-full bg-primary/60"
          style={{ width: `${(ms / 500) * 100}%` }}
        />
      </div>
      <div className="w-20 text-right font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/40 shrink-0">
        {use}
      </div>
    </div>
  );
}

function MotionBlock() {
  const s = useS();
  return (
    <BentoCard className="flex h-full flex-col">
      <Label>{s.motion}</Label>
      {/* Easing curves */}
      <div className="flex flex-col divide-y divide-border/40">
        {EASING_DEFS.map(e => (
          <EasingRow key={e.name} name={e.name} css={e.css} svgPath={e.svgPath} />
        ))}
      </div>
      {/* Separator */}
      <div className="h-px bg-border/60 my-4" />
      {/* Durations */}
      <div className="flex flex-col gap-3">
        {DURATION_DEFS.map(d => (
          <DurationBar key={d.name} name={d.name} ms={d.ms} use={d.use} />
        ))}
      </div>
    </BentoCard>
  );
}

/* ── 9. Inputs ───────────────────────────────────────────────── */

function InputsBlock() {
  const s = useS();
  const [nameVal, setNameVal] = useState('');
  const [emailVal, setEmailVal] = useState('');
  const [msgVal, setMsgVal] = useState('');

  return (
    <BentoCard className="flex h-full flex-col gap-4">
      <Label>{s.inputs}</Label>

      {/* Texto */}
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/40">Texto</span>
        <input
          className="input-glass"
          placeholder={s.input_name}
          value={nameVal}
          onChange={e => setNameVal(e.target.value)}
        />
        <input
          className="input-glass"
          type="email"
          placeholder={s.input_email}
          value={emailVal}
          onChange={e => setEmailVal(e.target.value)}
        />
      </div>

      {/* Área de texto */}
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/40">Área de texto</span>
        <textarea
          className="input-glass resize-none"
          rows={3}
          placeholder={s.input_message}
          value={msgVal}
          onChange={e => setMsgVal(e.target.value)}
        />
      </div>

      {/* Estados */}
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/40">Estados</span>
        <input
          className="input-glass input-glass--focus"
          readOnly
          placeholder={s.input_focused}
        />
        <input
          className="input-glass"
          disabled
          placeholder={s.input_disabled}
        />
      </div>
    </BentoCard>
  );
}

/* ── Header ──────────────────────────────────────────────────── */

function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mb-6 flex flex-wrap items-center justify-between gap-3 sm:mb-8"
    >
      <div>
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/50 sm:text-[11px]">
          miloagudelo.com
        </div>
        <h1 className="text-[22px] font-black tracking-[-0.03em] text-foreground sm:text-[28px]">
          Design System<span className="text-primary">.</span>
        </h1>
      </div>
      <div className="glass-pill flex items-center gap-2 rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
        <span className="size-[6px] rounded-full bg-primary" style={{ boxShadow: '0 0 0 3px rgba(0,64,255,0.12)' }} />
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:text-[11px]">
          v1.0 · 2026
        </span>
      </div>
    </motion.header>
  );
}

/* ── Main export ─────────────────────────────────────────────── */

export function DesignSystemPage({ profileSrc = '', locale = 'es' }: { profileSrc?: string; locale?: 'es' | 'en' }) {
  return (
    <LocaleCtx.Provider value={STRINGS[locale]}>
    <div className="ds-bg ds-noise relative min-h-screen overflow-x-hidden antialiased" style={{ letterSpacing: '-0.005em' }}>
      <Bubbles />

      <div className="relative z-[2] mx-auto max-w-[1200px] px-4 py-10 pb-24 sm:px-6 sm:py-12 sm:pb-28 lg:px-8">
        <Header />

        {/*
          Bento grid — responsive:
          mobile  → 1 col stacked
          sm 640  → 2 cols
          lg 1024 → 3 cols (Profile | Buttons | Typography↕, Colors↔ | Typography↕, Icono↔ | Images)
        */}
        <div className="ds-grid">

          {/* Profile — 4:5 */}
          <motion.div {...fadeUp(0)} className="ds-area-profile">
            <ProfileBlock profileSrc={profileSrc} />
          </motion.div>

          {/* Buttons */}
          <motion.div {...fadeUp(1)} className="ds-area-buttons h-full">
            <ButtonsBlock />
          </motion.div>

          {/* Typography — tall anchor (spans 2 rows on lg) */}
          <motion.div {...fadeUp(2)} className="ds-area-typography h-full">
            <TypographyBlock />
          </motion.div>

          {/* Colors — wide */}
          <motion.div {...fadeUp(3)} className="ds-area-colors h-full">
            <ColorsBlock />
          </motion.div>

          {/* Iconography — wide */}
          <motion.div {...fadeUp(4)} className="ds-area-iconography h-full">
            <IconographyBlock />
          </motion.div>

          {/* Images */}
          <motion.div {...fadeUp(5)} className="ds-area-images h-full">
            <ImagesBlock />
          </motion.div>

          {/* Inputs */}
          <motion.div {...fadeUp(6)} className="ds-area-inputs h-full">
            <InputsBlock />
          </motion.div>

          {/* Motion */}
          <motion.div {...fadeUp(7)} className="ds-area-motion h-full">
            <MotionBlock />
          </motion.div>
        </div>
      </div>
    </div>
    </LocaleCtx.Provider>
  );
}
