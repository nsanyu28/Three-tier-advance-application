# AWS 3-Tier Architecture Visualizer — Implementation Plan

## Scope
Build a static, framework-free educational website that visualizes Ravi's AWS three-tier web application architecture. The project must run from a simple static server and remain suitable for GitHub Pages.

## Implementation approach
- Use a semantic HTML shell with a compact sidebar, responsive header, explanatory content cards, glossary drawer, and inline SVG diagram.
- Keep architecture data in `js/architecture.js`, step copy/state in `js/steps.js`, packet and SVG motion behavior in `js/animations.js`, and UI orchestration in `js/app.js`.
- Render one stable SVG `viewBox="0 0 1400 850"` with boundaries and labels. Step state toggles SVG groups rather than rebuilding the diagram, keeping animation paths stable and easy to audit.
- Encode traffic paths with dedicated hidden SVG paths and `animateMotion`/`mpath` packets. Add a reduced-motion media-query fallback that disables motion and retains directional arrows.
- Use CSS variables for the page theme while keeping the architecture canvas dark navy. CSS grid/flex layouts handle desktop and horizontally-scrollable mobile navigation/diagram.
- Use only local HTML/CSS/vanilla JS plus an inline favicon; no packages, backend, database, or paid APIs.

## Design direction

### Design movement
**Cloud operations control-room / editorial engineering dashboard**: the calm precision of an AWS runbook with the warmth of a guided classroom.

### Core principles
1. Make system boundaries and traffic direction legible before adding decoration.
2. Pair every technical label with a human analogy and a reason it exists.
3. Treat the diagram as a spatial story: reveal complexity progressively, never all at once.
4. Use motion as a teaching cue, not as ambient noise.

### Color philosophy
A dark navy diagram makes the architecture feel like a live observability board. Teal marks the trust boundary, gold signals internet-facing surfaces, purple marks private application paths, blue-violet distinguishes data, orange calls attention to traffic, and green communicates healthy secure links. The page shell can switch between bright paper and midnight themes without weakening the dark canvas.

### Layout paradigm
A command rail on the left anchors the learning journey while the diagram occupies a wide, scrollable stage. The explanation card sits below the stage like a runbook note, with utility controls clustered above it. On mobile, the sidebar becomes a horizontal step strip and the diagram retains a minimum readable width.

### Signature elements
- Thin luminous route lines behind softly elevated resource cards.
- Numbered step rail with a vertical progress spine.
- A small “packet telemetry” legend that makes animated symbols feel like a live system feed.

### Interaction philosophy
Every control changes the teaching state, not just the styling: selecting a step reveals only the relevant architecture, mode changes the language of the explanation, traffic flow runs the complete request journey, and failure mode makes resilience visible without implying universal automatic failover.

### Animation
Packets travel on dedicated paths behind labels. Group reveals use short opacity/translate transitions. The failure simulation uses a restrained dimmed/blocked treatment. `prefers-reduced-motion` disables looping motion and leaves static arrow cues and accessible text.

### Typography system
Use Bricolage Grotesque from a system-safe stack, with compact uppercase eyebrow labels, large high-contrast section titles, and readable 14–16px explanatory copy. Monospace is reserved for CIDRs and route labels.

### Brand essence
**A visual runbook for understanding resilient AWS web systems.** Precise, friendly, confidence-building.

### Brand voice
Headlines are direct and useful: “Trace the request.” Microcopy reduces fear: “You can pause the story at any layer.”

### Wordmark & logo
A small “A3” monogram inside a rounded square, paired with a route-line motif that suggests packets crossing a campus.

### Signature brand color
Signal teal `#38d9c6`, used for trust boundaries, active progress, and healthy secure relationships.

## Project structure
- `index.html`: page shell, controls, explanation card, glossary dialog, and complete inline SVG stage.
- `css/style.css`: design tokens, page themes, responsive layout, SVG component styles, and motion/accessibility rules.
- `js/architecture.js`: canonical architecture nodes, subnets, traffic paths, glossary entries, and diagram render helpers.
- `js/steps.js`: the nine learning-step definitions, progressive reveal map, and explanation copy.
- `js/animations.js`: packet animation helpers, traffic-flow sequence, reduced-motion handling, and failure-state helpers.
- `js/app.js`: application state, controls, theme/mode switching, step rendering, summary, and glossary search.
- `assets/favicon.svg`: local monogram favicon.
- `manus-routes.json`: static route manifest for the single-page site.
- `README.md`, `LICENSE`: handoff and licensing.

## Delivery workflow
Implement the static project, run JavaScript syntax checks, serve it on port 3000 for Preview, verify the route manifest and key interactive states, inspect a desktop/mobile render, and package the complete folder as `aws-3tier-visualizer.zip` at the workspace root.
