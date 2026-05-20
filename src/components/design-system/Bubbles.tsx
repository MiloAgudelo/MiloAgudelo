import { useCallback, useEffect, useRef, useState } from 'react';
import { useAnimationFrame } from 'motion/react';

const DEFS = [
  /* ── top-right cluster ─────────────────────────────── */
  { r: 130, bx: (w: number) => w + 20, by: () =>   0, force: 0.30, phase: 0.0, cycle: 8400, scrollFactor: -0.04 },
  { r:  90, bx: (w: number) => w - 80, by: () => 195, force: 0.45, phase: 1.8, cycle: 7100, scrollFactor: -0.07 },
  { r:  55, bx: (w: number) => w - 60, by: () => 330, force: 0.62, phase: 3.1, cycle: 6200, scrollFactor: -0.10 },
  /* ── bottom-left cluster ───────────────────────────── */
  { r: 120, bx: () => -20, by: (h: number) => h + 20, force: 0.38, phase: 0.7, cycle: 9000, scrollFactor:  0.03 },
  { r:  80, bx: () =>  55, by: (h: number) => h - 120, force: 0.52, phase: 2.3, cycle: 7500, scrollFactor:  0.06 },
  { r:  50, bx: () =>  60, by: (h: number) => h - 240, force: 0.68, phase: 1.1, cycle: 5800, scrollFactor:  0.09 },
] as const;

type Refs<T> = React.MutableRefObject<(T | null)[]>;

export function Bubbles() {
  const [vp, setVp] = useState({ w: 1280, h: 800 });

  useEffect(() => {
    setVp({ w: window.innerWidth, h: window.innerHeight });
    const fn = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', fn, { passive: true });
    return () => window.removeEventListener('resize', fn);
  }, []);

  /* ── Element refs ───────────────────────────────────── */
  const circleRefs: Refs<SVGCircleElement>  = useRef([]);
  const causticRefs: Refs<SVGCircleElement> = useRef([]);
  const glossRefs: Refs<SVGEllipseElement>  = useRef([]);
  const hitRefs: Refs<SVGCircleElement>     = useRef([]);

  /* ── Animation state ────────────────────────────────── */
  const drifts      = useRef(DEFS.map(() => ({ x: 0, y: 0 })));
  const dragOffsets = useRef(DEFS.map(() => ({ x: 0, y: 0 })));
  const computed    = useRef(DEFS.map((d) => ({ cx: d.bx(1280), cy: d.by(800) })));

  /* ── Input state ────────────────────────────────────── */
  const pointer    = useRef({ nx: 0, ny: 0 });
  const pointerRaw = useRef({ x: 0, y: 0 });
  const scrollY    = useRef(0);
  const drag = useRef<{
    active: boolean; index: number;
    grabOffsetX: number; grabOffsetY: number;
  }>({ active: false, index: -1, grabOffsetX: 0, grabOffsetY: 0 });

  /* ── Mouse tracking ─────────────────────────────────── */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current = {
        nx: (e.clientX / window.innerWidth  - 0.5) * 2,
        ny: (e.clientY / window.innerHeight - 0.5) * 2,
      };
      pointerRaw.current = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => stopDrag();
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseup',   onUp,   { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  /* ── Touch tracking ─────────────────────────────────── */
  useEffect(() => {
    const onMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      pointer.current = {
        nx: (t.clientX / window.innerWidth  - 0.5) * 2,
        ny: (t.clientY / window.innerHeight - 0.5) * 2,
      };
      pointerRaw.current = { x: t.clientX, y: t.clientY };
    };
    const onEnd = () => stopDrag();
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend',  onEnd,  { passive: true });
    return () => {
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, []);

  /* ── Scroll tracking ────────────────────────────────── */
  useEffect(() => {
    const fn = () => { scrollY.current = window.scrollY; };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* ── Drag handlers ──────────────────────────────────── */
  const startDrag = useCallback((clientX: number, clientY: number, i: number) => {
    drag.current = {
      active: true,
      index: i,
      grabOffsetX: clientX - computed.current[i].cx,
      grabOffsetY: clientY - computed.current[i].cy,
    };
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }, []);

  const stopDrag = useCallback(() => {
    drag.current.active = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  /* ── Animation frame ────────────────────────────────── */
  useAnimationFrame((time) => {
    DEFS.forEach((d, i) => {
      const circle  = circleRefs.current[i];
      const caustic = causticRefs.current[i];
      const gloss   = glossRefs.current[i];
      const hit     = hitRefs.current[i];
      if (!circle) return;

      const bx = d.bx(window.innerWidth);
      const by = d.by(window.innerHeight);

      const idleX = 4 * Math.cos((time / d.cycle) * Math.PI * 2 + d.phase + 1.2);
      const idleY = 9 * Math.sin((time / d.cycle) * Math.PI * 2 + d.phase);
      const max   = d.force * 18;

      drifts.current[i].x += (pointer.current.nx * max - drifts.current[i].x) * 0.05;
      drifts.current[i].y += (pointer.current.ny * max - drifts.current[i].y) * 0.05;

      const scrollOffset = scrollY.current * d.scrollFactor;
      const naturalCx = bx + idleX + drifts.current[i].x;
      const naturalCy = by + idleY + drifts.current[i].y + scrollOffset;

      /* Drag: pull to cursor. Release: spring back. */
      if (drag.current.active && drag.current.index === i) {
        const targetCx = pointerRaw.current.x - drag.current.grabOffsetX;
        const targetCy = pointerRaw.current.y - drag.current.grabOffsetY;
        dragOffsets.current[i].x += (targetCx - naturalCx - dragOffsets.current[i].x) * 0.18;
        dragOffsets.current[i].y += (targetCy - naturalCy - dragOffsets.current[i].y) * 0.18;
      } else {
        dragOffsets.current[i].x *= 0.995;
        dragOffsets.current[i].y *= 0.995;
      }

      const cx = naturalCx + dragOffsets.current[i].x;
      const cy = naturalCy + dragOffsets.current[i].y;

      computed.current[i] = { cx, cy };

      circle.setAttribute('cx', String(cx));
      circle.setAttribute('cy', String(cy));
      if (caustic) { caustic.setAttribute('cx', String(cx)); caustic.setAttribute('cy', String(cy)); }
      if (gloss)   { gloss.setAttribute('cx', String(cx - d.r * 0.16)); gloss.setAttribute('cy', String(cy - d.r * 0.22)); }
      if (hit)     { hit.setAttribute('cx', String(cx)); hit.setAttribute('cy', String(cy)); }
    });
  });

  return (
    <>
      {/* ── Visual SVG — z-index 1, behind content ───────── */}
      <svg
        style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 1, pointerEvents: 'none', overflow: 'visible' }}
        aria-hidden="true"
      >
        <defs>
          <filter id="glass-deform" x="-40%" y="-40%" width="180%" height="180%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="shape" />
            <feComposite in="SourceGraphic" in2="shape" operator="in" />
          </filter>

          <radialGradient id="glass-fill" cx="32%" cy="26%" r="74%">
            <stop offset="0%"   stopColor="white"             stopOpacity="0.92" />
            <stop offset="14%"  stopColor="white"             stopOpacity="0.40" />
            <stop offset="48%"  stopColor="white"             stopOpacity="0.03" />
            <stop offset="78%"  stopColor="rgba(200,200,200)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="rgba(180,180,180)" stopOpacity="0.20" />
          </radialGradient>

          <radialGradient id="glass-caustic" cx="50%" cy="56%" r="50%">
            <stop offset="0%"   stopColor="transparent" />
            <stop offset="78%"  stopColor="transparent" />
            <stop offset="90%"  stopColor="white"       stopOpacity="0.10" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <linearGradient id="glass-stroke" x1="18%" y1="0%" x2="82%" y2="100%">
            <stop offset="0%"   stopColor="white"             stopOpacity="0.85" />
            <stop offset="40%"  stopColor="white"             stopOpacity="0.20" />
            <stop offset="100%" stopColor="rgba(160,160,160)" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        <g filter="url(#glass-deform)">
          {DEFS.map((d, i) => (
            <circle key={i} ref={el => { circleRefs.current[i] = el; }}
              cx={d.bx(vp.w)} cy={d.by(vp.h)} r={d.r}
              fill="url(#glass-fill)" stroke="url(#glass-stroke)" strokeWidth="1.2"
            />
          ))}
        </g>

        <g style={{ mixBlendMode: 'screen' }}>
          {DEFS.map((d, i) => (
            <circle key={i} ref={el => { causticRefs.current[i] = el; }}
              cx={d.bx(vp.w)} cy={d.by(vp.h)} r={d.r}
              fill="url(#glass-caustic)"
            />
          ))}
        </g>

        {DEFS.map((d, i) => (
          <ellipse key={i} ref={el => { glossRefs.current[i] = el; }}
            cx={d.bx(vp.w) - d.r * 0.16} cy={d.by(vp.h) - d.r * 0.22}
            rx={d.r * 0.26} ry={d.r * 0.15}
            fill="white" opacity="0.80"
            style={{ transform: 'rotate(-20deg)', transformBox: 'fill-box', transformOrigin: 'center' }}
          />
        ))}
      </svg>

      {/* ── Hit SVG — z-index 99, transparent drag handles ── */}
      <svg
        style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 99, pointerEvents: 'none', overflow: 'visible' }}
        aria-hidden="true"
      >
        {DEFS.map((d, i) => (
          <circle
            key={i}
            ref={el => { hitRefs.current[i] = el; }}
            cx={d.bx(vp.w)}
            cy={d.by(vp.h)}
            r={d.r}
            fill="transparent"
            style={{ pointerEvents: 'all', cursor: 'grab' }}
            onMouseDown={e => { e.preventDefault(); startDrag(e.clientX, e.clientY, i); }}
            onTouchStart={e => { const t = e.touches[0]; if (t) startDrag(t.clientX, t.clientY, i); }}
          />
        ))}
      </svg>
    </>
  );
}
