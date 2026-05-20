/* Scattered icon pattern — top-left and bottom-right corners only */

type IconDef = { d: string | string[]; x: number; y: number; rot: number; size?: number; op?: number };

const P = {
  camera: [
    'M8 5H16L18 7H21C21.55 7 22 7.45 22 8V18C22 18.55 21.55 19 21 19H3C2.45 19 2 18.55 2 18V8C2 7.45 2.45 7 3 7H6Z',
    'M12 9.5C10.07 9.5 8.5 11.07 8.5 13C8.5 14.93 10.07 16.5 12 16.5C13.93 16.5 15.5 14.93 15.5 13C15.5 11.07 13.93 9.5 12 9.5Z',
  ],
  mountain: 'M2 20.5L8.5 8L13 14L16.5 9.5L22 20.5H2Z',
  tent: [
    'M2 21.5L12 4L22 21.5H2Z',
    'M12 4V21.5',
    'M8.5 21.5L12 14L15.5 21.5',
  ],
  mappin: [
    'M12 2C8.69 2 6 4.69 6 8C6 12.5 12 22 12 22C12 22 18 12.5 18 8C18 4.69 15.31 2 12 2Z',
    'M12 10.5C10.62 10.5 9.5 9.38 9.5 8C9.5 6.62 10.62 5.5 12 5.5C13.38 5.5 14.5 6.62 14.5 8C14.5 9.38 13.38 10.5 12 10.5Z',
  ],
  code: ['M8 7L2 12L8 17', 'M16 7L22 12L16 17'],
  pen: ['M17.5 2.5L21.5 6.5L7 20L2 22L4 17L17.5 2.5Z', 'M15.5 4.5L19.5 8.5'],
  laptop: [
    'M4 6C4 4.9 4.9 4 6 4H18C19.1 4 20 4.9 20 6V14H4V6Z',
    'M1.5 16H22.5L20.5 19H3.5L1.5 16Z',
  ],
  layers: ['M12 2L2 7L12 12L22 7L12 2Z', 'M2 12L12 17L22 12', 'M2 17L12 22L22 17'],
  aperture: [
    'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z',
    'M12 8V16', 'M8 10L16 14', 'M8 14L16 10',
  ],
  compass: [
    'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z',
    'M16.24 7.76L13.12 13.12L7.76 16.24L10.88 10.88Z',
  ],
};

/* ── Top-left cluster ────────────────────────────────────────── */
const TOP_LEFT: IconDef[] = [
  { d: P.camera,   x:  12, y:  10, rot: -8,  size: 18 },
  { d: P.code,     x:  65, y:   8, rot:  5,  size: 18 },
  { d: P.tent,     x: 130, y:  14, rot: -4,  size: 20 },
  { d: P.pen,      x: 185, y:   6, rot: 10,  size: 16 },
  { d: P.mountain, x:  30, y:  58, rot:  6,  size: 20 },
  { d: P.aperture, x:  95, y:  55, rot: -7,  size: 18 },
  { d: P.laptop,   x: 155, y:  60, rot:  4,  size: 20 },
  { d: P.layers,   x: 210, y:  52, rot: -5,  size: 18 },
  { d: P.mappin,   x:   8, y: 108, rot: 12,  size: 16 },
  { d: P.compass,  x:  68, y: 110, rot: -3,  size: 18 },
  { d: P.camera,   x: 130, y: 105, rot:  7,  size: 18, op: 0.06 },
  { d: P.code,     x: 192, y: 112, rot: -9,  size: 18 },
  { d: P.tent,     x:  35, y: 158, rot: -6,  size: 20, op: 0.06 },
  { d: P.pen,      x: 100, y: 162, rot:  8,  size: 16 },
  { d: P.mountain, x: 158, y: 155, rot: -4,  size: 20 },
];

/* ── Bottom-right cluster (offsets from bottom-right, will be flipped via CSS) ── */
const BOTTOM_RIGHT: IconDef[] = [
  { d: P.layers,   x:  14, y:  12, rot:  7,  size: 18 },
  { d: P.aperture, x:  68, y:   8, rot: -5,  size: 18 },
  { d: P.laptop,   x: 128, y:  14, rot:  9,  size: 20 },
  { d: P.mappin,   x: 186, y:   5, rot: -8,  size: 16 },
  { d: P.code,     x:  30, y:  58, rot: -4,  size: 18 },
  { d: P.compass,  x:  90, y:  55, rot:  6,  size: 18 },
  { d: P.camera,   x: 150, y:  60, rot: -7,  size: 18 },
  { d: P.tent,     x: 208, y:  52, rot:  4,  size: 20 },
  { d: P.pen,      x:  10, y: 108, rot: 11,  size: 16 },
  { d: P.mountain, x:  68, y: 110, rot: -5,  size: 20 },
  { d: P.layers,   x: 128, y: 105, rot:  3,  size: 18, op: 0.06 },
  { d: P.aperture, x: 188, y: 112, rot: -10, size: 18 },
  { d: P.camera,   x:  38, y: 158, rot:  7,  size: 18, op: 0.06 },
  { d: P.code,     x:  98, y: 162, rot: -4,  size: 18 },
  { d: P.tent,     x: 158, y: 155, rot:  8,  size: 20 },
];

function Icon({ d, size = 18 }: { d: string | string[]; size?: number }) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

export function PagePattern() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }} aria-hidden="true">
      {/* Top-left */}
      {TOP_LEFT.map((ic, i) => (
        <div key={`tl-${i}`} className="absolute text-foreground"
          style={{ left: ic.x, top: ic.y, transform: `rotate(${ic.rot}deg)`, opacity: ic.op ?? 0.08 }}>
          <Icon d={ic.d} size={ic.size} />
        </div>
      ))}

      {/* Bottom-right */}
      {BOTTOM_RIGHT.map((ic, i) => (
        <div key={`br-${i}`} className="absolute text-foreground"
          style={{ right: ic.x, bottom: ic.y, transform: `rotate(${ic.rot}deg)`, opacity: ic.op ?? 0.08 }}>
          <Icon d={ic.d} size={ic.size} />
        </div>
      ))}
    </div>
  );
}
