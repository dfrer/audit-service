# SHOGGOTH FULL REALIZATION -- COMPREHENSIVE IMPLEMENTATION PLAN

**Created:** 2026-04-06
**Target:** Complete rewrite of ShoggothCanvas.tsx, page.tsx refinements, full-page ASCII integration

---

## I. CURRENT IMPLEMENTATION AUDIT

### A. ShoggothCanvas.tsx -- What Exists, What's Broken

**What exists:**
- Single fixed-position canvas covering viewport (viewport-height, not page-height)
- Core body: circular-ish blob at (58%, 45%) of viewport with organic noise distortion
- 3 "eyes" rendered as pulsing char clusters
- 20 tendrils across 3 layers (ghost, mid, core-adjacent) using angle-based ray casting
- 11 ghost tendrils using straight-line paths
- 120 foreground wisps orbiting the core
- Mouse attraction via per-segment pull forces
- Scroll-based quadratic fade

**What's broken:**

1. **Animation speed is 3-5x too fast.** The `pick()` function reselects characters using `hsh(x*0.7, y*0.7, t*0.4)` at 60fps -- characters visibly change every 2-3 frames. Tendril waves use `t * waveFreq * 3` and `* 5` which creates rapid oscillation, not organic slithering. Core breathing frequencies (0.6, 1.1, 1.8 Hz) are visible, not subliminal.

2. **Character palette has broken emojis.** The `core` palette contains `🜏🝁🜚☠🜓🜔🜕🜖🜗🜘` -- alchemical symbols that render at variable widths in IBM Plex Mono, causing character grid misalignment. These need to be replaced with monospace-compatible Unicode.

3. **Viewport-relative positioning breaks on scroll.** `CORE_CENTER_NORM = {x: 0.58, y: 0.45}` is computed as `W * 0.58, H * 0.45` -- the core stays in the same screen position regardless of scroll. The scroll fade logic reduces *everything* (core + tendrils) as you scroll, instead of keeping the core alive and only fading tendrils.

4. **Tendrils are straight rays, not organic branches.** Current tendril rendering: `position = origin + cos(angle) * distance`. The "wave" is just a 0.025 radian angle offset. This produces lines that wiggle slightly, not real branching tendrils that fork, taper, and reconnect.

5. **No connection to page content.** Tendrils don't know where sections or cards are. They just shoot into the void at fixed angles.

6. **No ASCII icons at terminations.** There is no concept of tendril endpoints forming recognizable shapes.

7. **Core is too small.** `coreRCells = 14` at 11px per cell = ~154px physical diameter. Visually tiny.

8. **No z-index layering between shoggoth and page content.** Canvas is `z-index: 2` but page content has no z-index. The shoggoth should sit BEHIND text but its tendrils should appear to weave THROUGH sections.

9. **The font changes per cell in the render loop** (`ctx.font = fontSize + ...` inside the loop) -- this causes severe performance issues because changing font is an expensive canvas operation.

10. **No temporal coherence.** Each frame is computed independently -- there's no memory of previous states, so there's no smooth motion, only frame-to-frame position jumps.

---

## II. ARCHITECTURAL DESIGN

### A. New Component Structure

```
ShoggothCanvas (fixed, full-page-height canvas, z-index: 1)
├── BodyRenderer (core mass -- heavy, organic, slow)
├── TendrilSystem (branching tendril network)
│   ├── TendrilRoot[] (8-12 main branches off the core)
│   │   ├── TendrilSegment[] (per-root: 15-50 segments)
│   │   └── TendrilBranch[] (secondary offshoots, 0-3 per root)
│   └── TendrilTermination (ends at icon location)
├── IconRenderer (ASCII art icons at tendril endpoints)
├── IconSet (pre-designed 3x3 to 5x5 ASCII icons)
└── AmbientSystem (floating wisps, particles, micro-characters)
```

### B. Coordinate System

**Problem:** The current system is viewport-relative (`width * 0.58, height * 0.45`). For a full-page creature, we need page-relative coordinates.

**Solution:**
- Canvas height = `document.documentElement.scrollHeight` (full scrollable page height)
- Canvas position = `absolute` (not `fixed`), spanning top of page to bottom
- Core body stays at a fixed page position: approximately in the hero section area
- Tendrils extend downward using page coordinates
- For smooth rendering performance, the canvas will use `position: fixed` and translate its content based on scroll offset, creating the illusion of a full-page canvas without the memory cost of rendering pixels below the viewport

Actually, better approach: dual-canvas system.
- **Canvas 1 (fixed, full viewport):** Shoggoth core + upper tendrils. Always visible at top. Renders viewport-relative content.
- **Canvas 2 (absolute, full page height):** Tendril network that extends to icons. Renders only visible regions.

Even better -- single fixed canvas, but:
- Core is positioned relative to viewport (stays at top)
- Tendrils use DOM element positions (from `getBoundingClientRect` + scroll offset) to compute target coordinates in viewport space
- The canvas renders everything in viewport coordinates
- Scroll is handled by updating target positions from DOM elements

### C. DOM Element Tracking

Each connectable element on the page gets a `data-shoggoth` attribute:

```html
<div data-shoggoth="cta-audit" data-shoggoth-x="center" data-shoggoth-y="center">
  <!-- Get an Audit button -->
</div>
```

The ShoggothCanvas queries these elements, computes their center positions in page coordinates, then maps them to the core-relative coordinate space of the shoggoth for tendril pathfinding.

### D. Temporal Coherence

**Root cause of glitchy movement:** Each frame computes positions independently from sine functions with no memory.

**Solution:** Every segment stores its current position as state. Animation uses:
```
targetPosition = noiseFunction(t) 
currentPosition = lerp(currentPosition, targetPosition, damping)
```

Where `damping` is very low (0.02-0.08) for heavy, deliberate movement. This creates smooth, organic motion even when the noise function changes rapidly.

---

## III. ICON DESIGN LIBRARY

Each icon is a grid of characters. They are rendered at the terminus of tendrils. All use the amber color palette with varying alpha based on visibility.

### Icon: Briefcase (Business AI Operations)
```
  ┌─────┐
  │  ░░░│
  │  ░░░│
  └──┬──┘
     │
   ──┴──
```
5x6 grid, rendered at the "Business AI Operations" card termination point.

### Icon: Brain (Personal AI Workflows)
```
    ░░░
  ░░#░░░░
  ░░░░░░░
   ░█░█░
    ───
```
5x5 grid, uses `░ ▓ █ #` for density variation.

### Icon: Server (Local / Self-Hosted AI)
```
  ┌───┐
  │░░░│
  ├───┤
  │░░░│
  └───┘
```
5x5 grid, box-drawing characters.

### Icon: Code Bracket (AI Coding Workflows)
```
  ⟨ ░░░ ⟩
  │ ░░░ │
  └─────┘
```
5x3 grid.

### Icon: Target/Eye (Get an Audit CTA)
```
   ░░░
  ░◉◉◉░
   ░░░
```
3x3 grid with central ◉ character.

### Icon: Clock (Turnaround / Speed)
```
   ┌─┐
  │ │
  │→│
  │ │
   └─┘
```
3x5 grid.

### Icon: Dollar Sign (Pricing)
```
   ─
  $░$
   $
  $░$
   ─
```
3x5 grid.

### Icon: Diamond (Stats Section)
```
    ◆
   ░░░
  ░░░░░
   ░░░
    ◆
```
5x5 grid.

### Icon: Shield (Why This Works / Security)
```
  ┌───┐
  │░░░│
  │ ◉ │
  └───┘
```
5x4 grid.

### Icon: Question Mark (FAQ Section)
```
  ────
  │ ◉│
  └─┼─
    │
  ░░░
```
3x5 grid.

### Icon: Arrow/Target (Final CTA)
```
  →░░░→
   ░░░
  →░░░→
```
5x3 grid, pulsing.

---

## IV. TENDRIL KINEMATICS (Detailed Design)

### A. Anatomy of a Branch

Each tendril branch is a chain of N segments. Each segment has:
- `position: {x, y}` (current position in viewport space)
- `targetPosition: {x, y}` (where it wants to be, computed from noise)
- `damping: number` (0.02-0.08, controls speed of movement)
- `thickness: number` (1-2, how wide the rendered character cell is)
- `parent: Segment | null` (for branch structure)
- `children: Segment[]` (for branch structure)

### B. Movement Algorithm

Per frame, for each segment:
1. Compute target position from layered noise:
```
basePath = straight line from core to target icon
wave = sin(segmentIndex * frequency + time * slowRate) * amplitude
crossWave = cos(segmentIndex * freq2 + time * slowRate2) * amp2
target = basePath + perpendicular(wave) + crossWave
```

2. Lerp toward target:
```
position = position + (target - position) * damping * deltaTime
```

3. For mouse-influenced segments:
```
mouseInfluence = gaussian(mouseDistance / influenceRadius)
position += (mouse - position) * mouseInfluence * mouseDamping
```

### C. Branching Logic

Primary tendrils (8-12): Connect from core directly to page sections/icons.
- 4 tendrils to DIAGNOSE cards
- 1 tendril to CTA button ("Get an Audit")  
- 1 tendril to stats section
- Tendrils to PROCESS section cards (optional, based on visual density)
- Tendrils to PRICING section cards
- Tendrils to WHY section cards
- Tendrils to FAQ section
- Tendril to FINAL CTA

Secondary branches (offshoots): Spawn from primary tendrils at 40-60% extension, branch off at +/- 90-150 degrees, extend 10-20 segments, terminate in nothing (just fade). These create the "root system" look.

Tertiary wisps: Individual floating characters that orbit around tendril branches, creating atmospheric depth. Rendered as single chars with very low alpha.

### D. Character Selection

Characters change slowly (not every frame). Each segment has a `charChangeTimer` that counts down. When it reaches 0, the character is reselected from the palette, and the timer is reset to a random value between 30-120 frames.

Palette selection depends on:
- Distance from core (dense near core, sparse at tips)
- Layer type (ghost uses wisps, main tendrils use box-drawing, branches use mixed)
- Proximity to icon (blend into icon character near termination)

---

## V. ANIMATION TIMING SPECIFICATION

### Frequency Budget (all per-frame updates at 60fps)

| Component | Speed | Visual Effect |
|-----------|-------|---------------|
| Core breathing | 0.08 Hz (12s cycle) | Barely perceptible expansion/contraction |
| Core noise distortion | 0.15 Hz (6.7s cycle) | Organic boundary shifting |
| Character change (core) | Every 60-180 frames (1-3s) | Slow churning, not flickering |
| Character change (tendrils) | Every 30-120 frames (0.5-2s) | Gradual evolution |
| Tendril wave oscillation | 0.1-0.2 Hz (5-10s cycle) | Slow undulation |
| Tendril cross-wave | 0.15-0.3 Hz (3.3-6.7s cycle) | Secondary drift |
| Mouse attraction response | 0.3 Hz (3.3s response time) | Deliberate reach, not snap |
| Branch growth rate | 1-2 pixels/second | Almost imperceptible extension |
| Icon pulse | 0.25 Hz (4s cycle) | Subtle breathing |
| Icon character change | Every 120-300 frames (2-5s) | Slow morphing |
| Ambient wisp drift | 0.05-0.1 Hz (10-20s cycle) | Barely noticeable movement |

**Result:** The entire creature moves on timescales of seconds, not milliseconds. The viewer should feel a slow, deliberate presence, not a glitching animation.

---

## VI. PAGE STRUCTURE CHANGES (page.tsx)

### A. Data Attributes for Tendril Anchoring

Add `data-shoggoth` markers to target elements:

```tsx
// Hero CTA
<div data-shoggoth="cta-primary" id="hero-cta">
  <a>GET AN AUDIT</a>
</div>

// DIAGNOSE cards
{PILLARS.map((p) => (
  <div key={p.num} data-shoggoth={`diagnose-${p.num}`} className="...">
    ...
  </div>
))}

// Stats
{STATS.map((s, i) => (
  <div key={s.label} data-shoggoth={`stat-${i}`} className="...">
    ...
  </div>
))}

// PROCESS cards
{STEPS.map((s, i) => (
  <div key={s.step} data-shoggoth={`step-${i}`} className="...">
    ...
  </div>
))}

// PRICING cards
// WHY cards
// FAQ section
// Final CTA
```

### B. Z-Index Architecture

```
z-index: 0 -- AsciiBackground (fixed, full viewport)
z-index: 1 -- ShoggothCanvas (fixed, full viewport)
z-index: 10 -- Page content (all sections)
z-index: 50 -- Navigation
```

The shoggoth renders BEHIND all text content. Tendrils naturally appear to go "behind" the cards. However, icon renderings at tendril terminations can render AT or slightly ABOVE content level (z-index: 5) so the small ASCII icons are visible on/next to cards without being obscured.

### C. Card Styling Enhancement

Cards (diagnose, pricing, process, why, FAQ) need subtle enhancements:
- Slight transparency or glow when a tendril icon is near them
- The card gets a subtle amber tint on the border when a tendril icon is active
- This creates visual feedback connecting the shoggoth to the content

---

## VII. PERFORMANCE SPECIFICATION

### A. Rendering Budget

| Phase | Target Time | Notes |
|-------|------------|-------|
| DOM position query | < 2ms | Query every 500ms, cache results, interpolate between |
| Tendril physics | < 8ms | ~500 segments total, simple lerps |
| Cell collection | < 10ms | Batch by layer, skip below alpha threshold |
| Sorting | < 3ms | Insert sort for partially-sorted arrays |
| Canvas draw | < 15ms | ~2000-4000 fillText calls, batched font changes |
| Icon render | < 2ms | ~12 icons, each 15-25 chars |
| Total | < 40ms | Target 24fps minimum, ideally 30fps+ |

### B. Optimization Strategies

1. **Font batching:** Group all cells by their font size, change `ctx.font` once per group, then draw all matching cells.

2. **DOM query caching:** Query `getBoundingClientRect` for target elements every 500ms (not every frame). Interpolate positions between queries.

3. **Alpha culling:** Skip all cells below alpha 0.005 (invisible).

4. **Visibility culling:** Only render cells within the visible viewport (or slightly beyond). Skip cells more than 2 screen heights below or above the current scroll position.

5. **Dirty flag:** If nothing significant has changed (no scroll, no mouse movement), skip rendering entirely and reuse last frame.

6. **Offscreen buffer:** Render the shoggoth to an offscreen canvas at half resolution, then draw it onto the main canvas at full resolution with smoothing disabled. This halves the fillText call count. (Only if performance is insufficient.)

---

## VIII. IMPLEMENTATION ORDER

### Step 1: Core Rewrite -- ShoggothCanvas Foundation (NEW FILE)
- Create `ShoggothCanvasV2.tsx` -- complete rewrite
- Implement proper temporal coherence with per-segment state
- Set correct animation frequencies per the specification
- Fix character palette (remove emoji, use monospace-compatible only)
- Core body: increased radius, proper breathing, eye system
- Mouse interaction: smooth, heavy, deliberate response
- Canvas sizing: viewport-fixed, with page-relative coordinate mapping

### Step 2: Tendril System
- Implement Branch class with Segment[] array
- Implement physics: basePath + waves + mouse + lerp
- Implement character selection with timed changes (not per-frame)
- Primary tendrils: angle-based paths from core
- Secondary branches: offshoots at 40-60% extension
- Tertiary wisps: orbiting ambient characters
- Font batching for render optimization

### Step 3: DOM Integration
- Add `data-shoggoth` attributes to all target elements in page.tsx
- Implement DOM position tracking (query cache + interpolation)
- Implement tendril routing: compute paths from core to each target
- Implement visibility culling based on scroll position
- Implement scroll-aware tendril growth/fade

### Step 4: Icon System
- Define all 11 ASCII icons as character grids
- Implement icon renderer at tendril termination points
- Implement icon animation (slow pulse, morphing characters)
- Implement proximity glow on cards (amber border tint when tendril nearby)

### Step 5: Page Refinements (page.tsx)
- Add all `data-shoggoth` attributes
- Adjust card styling for tendril proximity effects
- Ensure text content z-index is above shoggoth
- Test layout with shoggoth rendered alongside

### Step 6: Polish & Performance
- Fine-tune all animation speeds
- Optimize font batching
- Add dirty flag for frame skipping
- Performance testing at various viewport sizes
- Edge case: narrow viewports, very wide viewports

### Step 7: Integration Testing
- Test: full page load, all tendrils reaching targets
- Test: scroll behavior (core stays, tendrils extend/retract)
- Test: mouse interaction (heavy, deliberate reach)
- Test: card proximity effects
- Test: icon visibility and animation
- Test: performance (frame rate, memory)

---

## IX. WHAT WILL NOT CHANGE

- AsciiBackground.tsx -- the ambient background remains as-is
- Page content/structure -- no content changes, only attribute additions
- Pricing, FAQ, process sections -- same content, just with shoggoth integration
- Color scheme -- amber/dark theme remains
- Business logic, API routes, database -- unaffected

---

## X. ESTIMATED COMPLEXITY

This is approximately a 600-900 line component with significant design and tuning work. The core challenge is not the code volume but the visual tuning -- getting animation speeds, character densities, tendril thicknesses, and icon appearances all to feel cohesive and natural.

The DOM integration and tendril routing add architectural complexity. The icon system requires careful character-by-character design to ensure readability and visual impact.
