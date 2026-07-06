/* Scattered icon pattern — top-left and bottom-right corners only.
   Icons are laid out as a right triangle with the right angle in the
   corner (legs along the screen edges, hypotenuse running diagonally).
   The fade toward the hypotenuse is done with a single mask-image
   gradient PER CLUSTER — not per icon — so the triangle's edge softly
   loses opacity as a whole. */

type IconDef = { d: string | string[]; x: number; y: number; rot: number; size?: number };

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

/* ── Top-left cluster — right angle at the top-left corner.
   Rows get shorter going down (6→5→4→3→2→1), so the icons fill a
   triangle whose hypotenuse runs from the top-right down to the left. ── */
const TOP_LEFT: IconDef[] = [
  { d: P.camera,   x:  14, y:   8, rot: -8, size: 18 },
  { d: P.code,     x:  70, y:   4, rot:  6, size: 18 },
  { d: P.tent,     x: 128, y:  10, rot: -4, size: 20 },
  { d: P.pen,      x: 186, y:   3, rot: 10, size: 16 },
  { d: P.aperture, x: 242, y:   9, rot: -6, size: 18 },
  { d: P.layers,   x: 296, y:   5, rot:  4, size: 18 },
  { d: P.mountain, x:  10, y:  56, rot:  6, size: 20 },
  { d: P.laptop,   x:  66, y:  52, rot: -5, size: 20 },
  { d: P.compass,  x: 124, y:  58, rot:  7, size: 18 },
  { d: P.mappin,   x: 182, y:  54, rot: -8, size: 16 },
  { d: P.code,     x: 240, y:  60, rot:  5, size: 18 },
  { d: P.pen,      x:   8, y: 104, rot: 11, size: 16 },
  { d: P.tent,     x:  64, y: 108, rot: -6, size: 20 },
  { d: P.camera,   x: 122, y: 102, rot:  7, size: 18 },
  { d: P.aperture, x: 180, y: 110, rot: -9, size: 18 },
  { d: P.layers,   x:  12, y: 152, rot: -5, size: 18 },
  { d: P.mountain, x:  68, y: 156, rot:  8, size: 20 },
  { d: P.compass,  x: 126, y: 150, rot: -3, size: 18 },
  { d: P.laptop,   x:  10, y: 200, rot:  4, size: 20 },
  { d: P.code,     x:  66, y: 204, rot: -7, size: 18 },
  { d: P.mappin,   x:  14, y: 248, rot: 10, size: 16 },
];

/* ── Bottom-right cluster — right angle at the bottom-right corner
   (offsets are from bottom-right). Mirror of the top-left triangle. ── */
const BOTTOM_RIGHT: IconDef[] = [
  { d: P.layers,   x:  14, y:   8, rot:  7, size: 18 },
  { d: P.aperture, x:  70, y:   4, rot: -5, size: 18 },
  { d: P.laptop,   x: 128, y:  10, rot:  9, size: 20 },
  { d: P.mappin,   x: 186, y:   3, rot: -8, size: 16 },
  { d: P.code,     x: 242, y:   9, rot:  4, size: 18 },
  { d: P.camera,   x: 296, y:   5, rot: -6, size: 18 },
  { d: P.compass,  x:  10, y:  56, rot: -4, size: 18 },
  { d: P.tent,     x:  66, y:  52, rot:  6, size: 20 },
  { d: P.pen,      x: 124, y:  58, rot: -7, size: 16 },
  { d: P.mountain, x: 182, y:  54, rot:  5, size: 20 },
  { d: P.layers,   x: 240, y:  60, rot: -5, size: 18 },
  { d: P.camera,   x:   8, y: 104, rot:  7, size: 18 },
  { d: P.code,     x:  64, y: 108, rot: -4, size: 18 },
  { d: P.aperture, x: 122, y: 102, rot:  8, size: 18 },
  { d: P.laptop,   x: 180, y: 110, rot: -6, size: 20 },
  { d: P.tent,     x:  12, y: 152, rot:  8, size: 20 },
  { d: P.pen,      x:  68, y: 156, rot: -5, size: 16 },
  { d: P.mountain, x: 126, y: 150, rot:  4, size: 20 },
  { d: P.compass,  x:  10, y: 200, rot: -7, size: 18 },
  { d: P.mappin,   x:  66, y: 204, rot:  9, size: 16 },
  { d: P.camera,   x:  14, y: 248, rot: -4, size: 18 },
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

/* Triangle bounding box + the diagonal fade mask (one per cluster). The
   gradient's iso-lines run parallel to the hypotenuse, so opacity is full
   at the corner and fades out toward — and past — the triangle's edge. */
const CLUSTER_W = 330;
const CLUSTER_H = 290;
const BASE_OPACITY = 0.1;
const MASK_TL = 'linear-gradient(to bottom right, #000 0%, #000 28%, transparent 82%)';
const MASK_BR = 'linear-gradient(to top left, #000 0%, #000 28%, transparent 82%)';

export function PagePattern() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }} aria-hidden="true">
      {/* Top-left triangle */}
      <div
        className="absolute left-0 top-0 text-foreground"
        style={{
          width: CLUSTER_W,
          height: CLUSTER_H,
          opacity: BASE_OPACITY,
          WebkitMaskImage: MASK_TL,
          maskImage: MASK_TL,
        }}
      >
        {TOP_LEFT.map((ic, i) => (
          <div key={`tl-${i}`} className="absolute"
            style={{ left: ic.x, top: ic.y, transform: `rotate(${ic.rot}deg)` }}>
            <Icon d={ic.d} size={ic.size} />
          </div>
        ))}
      </div>

      {/* Bottom-right triangle */}
      <div
        className="absolute bottom-0 right-0 text-foreground"
        style={{
          width: CLUSTER_W,
          height: CLUSTER_H,
          opacity: BASE_OPACITY,
          WebkitMaskImage: MASK_BR,
          maskImage: MASK_BR,
        }}
      >
        {BOTTOM_RIGHT.map((ic, i) => (
          <div key={`br-${i}`} className="absolute"
            style={{ right: ic.x, bottom: ic.y, transform: `rotate(${ic.rot}deg)` }}>
            <Icon d={ic.d} size={ic.size} />
          </div>
        ))}
      </div>
    </div>
  );
}
