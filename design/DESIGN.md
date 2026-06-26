---
name: Aerospace Industrial
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#383939'
  surface-container-lowest: '#0d0e0f'
  surface-container-low: '#1b1c1c'
  surface-container: '#1f2020'
  surface-container-high: '#292a2a'
  surface-container-highest: '#343535'
  on-surface: '#e3e2e2'
  on-surface-variant: '#c0c7d5'
  inverse-surface: '#e3e2e2'
  inverse-on-surface: '#303031'
  outline: '#8a919f'
  outline-variant: '#404753'
  surface-tint: '#a3c9ff'
  primary: '#a3c9ff'
  on-primary: '#00315d'
  primary-container: '#1493ff'
  on-primary-container: '#002a51'
  inverse-primary: '#0060ab'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#c8c6c5'
  on-tertiary: '#313030'
  tertiary-container: '#929090'
  on-tertiary-container: '#2a2a2a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d3e3ff'
  primary-fixed-dim: '#a3c9ff'
  on-primary-fixed: '#001c39'
  on-primary-fixed-variant: '#004883'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#121414'
  on-background: '#e3e2e2'
  surface-variant: '#343535'
typography:
  headline-display:
    fontFamily: Inter
    fontSize: 72px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  mono-data:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 80px
  section-gap: 160px
---

## Brand & Style
The design system is rooted in the high-stakes, precision-oriented world of aerospace engineering. It reflects the aesthetic of modern space exploration: functional, stark, and uncompromisingly efficient. The interface is designed to feel like a premium flight deck—focused on mission-critical data with zero decorative noise.

The style is **Minimalist-Industrial**. It prioritizes "blackspace" to create a sense of vastness and clarity, using high-contrast typography and razor-thin architectural lines to define structure. The emotional response is one of authority, technical excellence, and future-forward reliability. It draws inspiration from the utility of hardware and the elegance of orbital mechanics.

## Colors
The palette is dominated by an absolute pitch-black (#000000) background to maximize OLED efficiency and visual depth. 

- **Primary:** An electric, technical blue used sparingly for interactive triggers and status indicators.
- **Surface:** Subtle grays create a hierarchy of depth without breaking the monochromatic theme.
- **Borders:** Low-opacity, hairline strokes define the architecture of the UI, mimicking the paneling of a spacecraft.
- **Contrast:** Pure white is reserved for primary information, ensuring maximum legibility against the void.

## Typography
The typography system utilizes **Inter** for its neutral, highly legible characteristic at all scales. For technical data and labels, a monospaced-leaning font like **Geist** is introduced to evoke code and telemetry.

Headlines are tight and impactful, often set in bold weights with negative letter-spacing to create a "locked-in" industrial feel. Body text maintains generous line heights to ensure readability against the dark background. Labels are frequently uppercase with increased tracking to serve as structural markers within the layout.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a strict 4px baseline shift. It prioritizes extreme vertical breathing room (section gaps) to isolate different concepts, echoing the vacuum of space.

- **Desktop:** A 12-column grid with wide 80px margins. Content is often centered or offset to create dynamic asymmetry.
- **Mobile:** A 4-column grid with 20px margins. Section gaps scale down to 80px.
- **Alignment:** Elements are strictly aligned to the grid to maintain an engineered, structural integrity.

## Elevation & Depth
In this design system, depth is achieved through **Tonal Layering** and **Outline Definition** rather than traditional shadows.

1.  **Level 0 (Background):** Pure #000000.
2.  **Level 1 (Cards/Containers):** Deep charcoal (#0A0A0A) with a subtle 1px border (#222222).
3.  **Level 2 (Popovers/Modals):** Dark gray (#121212) with a slightly brighter border and a very soft, high-ratio black shadow to separate it from the surface.

Interactive elements do not use glow or blur; they use sharp color transitions or hairline borders to signal state changes.

## Shapes
The shape language is **Sharp**. Right angles convey precision, engineering, and stability. 

While the system is primarily 0px radius, small exceptions are made for "pill" style status badges or primary action buttons to create a high-contrast visual focus against the otherwise rectangular framework. All containers, input fields, and structural dividers must remain sharp-edged.

## Components

### Buttons
- **Primary:** High-contrast blue background with white text. Sharp corners. No gradients.
- **Secondary:** Transparent background with a 1px white border. 
- **Ghost:** White text only, shifting to a subtle gray underline on hover.

### Input Fields
- **Default:** Transparent background with a 1px bottom border (#333333). Label set in `label-caps` above the field.
- **Focus:** Border color shifts to Primary Blue.

### Cards
- Rigid containers with #0A0A0A background. 
- No padding between the card edge and internal images to emphasize the industrial "block" feel.

### Status Indicators
- Small, circular dots or `label-caps` text inside a pill shape. Use Primary Blue for active, Neutral Gray for inactive, and Signal Red for alerts.

### Dividers
- Hairline (0.5px or 1px) strokes in #222222. Used to separate sections without adding visual weight.