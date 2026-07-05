# Design

Sistema visual de miloagudelo.com. Fuente de verdad viva: `/design-system` (página) + `src/styles/global.css` (tokens). Este archivo es el resumen; ante conflicto, ganan los tokens.

## Theme

Claro, cálido y atmosférico. Fondo off-white con gradientes radiales azulados sutiles (`.ds-bg`), ruido fractal (`.ds-noise`) y burbujas de vidrio interactivas (`Bubbles`). Materiales glass (blur + gradientes blancos translúcidos) reservados para superficies elevadas: botones, pills, cards.

## Color

Estrategia: restrained con un acento comprometido. OKLCH en todos los tokens.

| Rol | Token | Hex equivalente |
|---|---|---|
| Acento "Voltio" | `--primary` | `#0040FF` |
| Tinta hover | `--ring` | `#0035D9` |
| Fondo | `--background` | `#F5F6F4` |
| Superficie | `--superficie` | `#FBFBFA` |
| Niebla (azul suave) | `--niebla` | `#DCE7F2` |
| Humo | `--humo` | `#EEF2F5` |
| Borde | `--border` | `#E5E7E0` |
| Texto primario | `--foreground` | `#111827` |
| Texto secundario | `--muted-foreground` | `#5F6B7A` |
| Texto terciario | `--text-tertiary` | `#94A3B8` |

Regla: nunca hex hardcodeado en componentes; siempre `var(--*)` o clases Tailwind de token.

## Typography

- **Satoshi Variable** (`--font-sans`, 300–900): display y cuerpo. Display en peso 900, tracking -0.03 a -0.05em.
- **JetBrains Mono** (`--font-mono`, 400/500): etiquetas, captions, código. Nunca >500 de peso (faux-bold).
- Escala de referencia: Display 900 / H1 700 / Body 400 (lh 1.6) / Caption mono 10px tracking 0.14em.

## Components

- Botones glass: `.btn-glass-primary` / `.btn-glass-secondary`, h-11, rounded-full, texto bold 14px.
- Pills: `.glass-pill` (badge translúcido con inset highlight).
- Inputs: `.input-glass` (focus ring Voltio 3px al 10%).
- Frames de imagen: radius 24px, borde 2px blanco, `--sombra-elevada`.
- Cards bento: rounded-[28px], borde white/70, gradiente blanco 95→75, `--sombra-suave` + `--sombra-glass`.
- Sombras: `--sombra-suave`, `--sombra-elevada`, `--sombra-glass` (nunca sombras ad-hoc).

## Motion (estándar emil-anim)

- Easings: Entrada `cubic-bezier(0.22,1,0.36,1)` · Suave `(0.4,0,0.2,1)` · Rebote `(0.34,1.56,0.64,1)` solo menú/tooltips.
- Duraciones: 150ms hover/focus · 280ms transiciones · 500ms entradas. Nada >1s total.
- Stagger 30–60ms. Entradas: fade + rise (y:10) o scale desde 0.94 (nunca <0.9).
- Press: `scale: 0.97`. Animar solo transform/opacity (nunca left/width/height).
- `prefers-reduced-motion` obligatorio: variants con `reduced` (ver `src/lib/motion-variants.ts`) + fallback CSS global.

## Layout

- Contenedor máx 1200px, padding lateral 1rem→2rem, gap 1rem.
- Espaciado: escala 4/8/12/16/24/32/48/64.
- Grid responsive 1→2→3 columnas (640/1024).

## Iconography

HugeIcons stroke 1.5. Patrón personal decorativo: iconos scout/fotografía (cámara, carpa, montaña, brújula, pin, binoculares) a opacidad ~0.08 (`PagePattern`).
