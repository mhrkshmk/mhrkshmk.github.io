# Portfolio

Single-page portfolio site using vanilla JavaScript modules and Tailwind utility classes (via CDN).

## Stack

- HTML + Tailwind classes in markup
- Modular ES modules (`type="module"`)
- Static data files for sections

## Project Structure

- `index.html`: page structure and section anchors
- `styles/main.css`: global styles, animations, and utility overrides
- `scripts/main.js`: app bootstrap/orchestration only
- `scripts/particlePortrait.js`: interactive particle portrait canvas
- `scripts/renderTechstack.js`: tech card rendering + filter behavior
- `scripts/renderWorkExperience.js`: experience tabs, panels, and active indicator
- `scripts/renderPetProjects.js`: project cards rendering
- `scripts/uiEffects.js`: typing, reveal, and ripple UI behaviors
- `data/techstack.js`: technical proficiencies data
- `data/workExperience.js`: work experience data
- `data/petProjects.js`: pet project data
- `assets/`: icons, logos, images

## How It Works

`scripts/main.js` initializes the app in this order:

1. Render data-driven sections (`techstack`, `experience`, `projects`)
2. Initialize interactions (filters, typing effect, section reveal, ripple)
3. Initialize particle portrait canvas

## Editing Content

- Update skills in `data/techstack.js`
- Update work timeline in `data/workExperience.js`
- Update project cards in `data/petProjects.js`
- Update layout/content blocks in `index.html`

## Notes

- Keep render modules focused on one section each.
- Keep data files as plain arrays/objects (no DOM logic).
- Keep `scripts/main.js` as a thin orchestrator.
