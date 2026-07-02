<div align="center">

# PASAN HANSAKA

### This is my portfolio — and this is how I built it

**[→ Visit the live site](https://pasanhansaka.github.io/Portfolio/)**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)

</div>

---

## 👋 Hey, I'm Pasan

I'm a Software Engineering Intern at **Synapse Solutions**, currently building out the Facebook Marketing Campaign feature on the **dwesk Social CRM** platform — wiring the Meta Marketing API into a Java Spring MVC / AngularJS stack. Outside of that, I hold a BSc (Hons) in Software Engineering from the Java Institute for Advanced Technology (affiliated with Birmingham City University, UK).

This repository is my portfolio site — not a template, not a starter kit, just the actual code behind [pasanhansaka.github.io/Portfolio](https://pasanhansaka.github.io/Portfolio/). I wanted a portfolio that didn't feel like a static résumé you skim for ten seconds. So instead of a normal landing page, it boots up like a system, drops you into a reactive particle background, and lets you dig through my work the way I'd actually want to explore someone else's — scroll through it, or drop into a terminal and type your way around.

Everything on the site — the boot sequence, the particle physics, the sound design, the CLI shell — I built by hand, in plain HTML/CSS/JS, with no frameworks and no build step.

---

## ✨ What's on the site

| Feature | Description |
|---|---|
| 🖥️ **Boot Sequence** | A simulated system boot animation plays on load, complete with progress bar and typewriter-style log lines |
| ⌨️ **Interactive CLI Terminal** | Press <kbd>`</kbd> or click `[CLI_]` to open a real virtual shell — supports `about`, `skills`, `projects`, `open <#>`, `theme`, `matrix`, `clear`, and more |
| 🌌 **Physics-Based Particle Network** | A canvas-rendered node network reacts to mouse movement with repulsion physics, click-triggered sparks, and shockwave ripples |
| 🟢 **Matrix Rain Mode** | Toggle a full digital-rain easter egg straight from the terminal |
| 🌗 **Dark / Light Theme** | Persisted theme switch that dynamically re-themes the canvas, GitHub Snake SVG, and every design token |
| 🔊 **Web Audio Sound Design** | Procedurally synthesized UI sounds (hover, click, boot, success, error) generated live via the Web Audio API — no audio files |
| 🖱️ **Custom Cursor** | A magnetic dot-and-ring cursor with contextual labels (`VIEW`, `OPEN`, `DRAG`, etc.) on desktop |
| 📊 **Live GitHub Integration** | Auto-updating GitHub stats, top languages, contribution graph, and a snake-eats-contributions animation |
| 🗂️ **Draggable Project Deck** | A horizontally scrollable, pointer-draggable showcase of projects with 3D tilt-on-hover cards |
| 📈 **Scroll-Synced Timeline** | Experience section fills a progress line as you scroll through it |
| 🔒 **Accessibility-Aware** | Full `prefers-reduced-motion` support — disables animations, cursor effects, and particle motion for users who need it |
| 📱 **Fully Responsive** | Custom cursor, side HUD rails, and diagnostics panel gracefully hide below the relevant breakpoints |

---

## 🛠️ Tech Stack

- **Structure & Style:** Semantic HTML5, CSS3 (custom properties for theming, no preprocessor)
- **Animation:** [GSAP](https://gsap.com/) + ScrollTrigger for boot sequence & reveals
- **Interactivity:** Vanilla JavaScript (ES6+) — IIFE modules for cursor, sound, terminal, canvas FX
- **Audio:** Web Audio API (oscillator-based procedural sound synthesis)
- **Graphics:** HTML5 Canvas for the particle network & matrix rain
- **Fonts:** Space Grotesk, Plus Jakarta Sans, JetBrains Mono (Google Fonts)
- **Live Data:** [github-readme-stats](https://github.com/anuraghazra/github-readme-stats), [github-readme-activity-graph](https://github.com/Ashutosh00710/github-readme-activity-graph), [platane/snk](https://github.com/Platane/snk)

---

## 📁 How It's Put Together

```
Portfolio/
├── index.html      # Markup & content
├── style.css        # Design tokens, theming, layout, animations
├── script.js         # Boot sequence, terminal, canvas FX, theme & sound managers
└── README.md
```

No bundler, no build step, no npm install — I kept it to three files on purpose so the whole thing stays easy to reason about and easy to keep evolving as I add more to it.

If you want to poke around it locally:

```bash
git clone https://github.com/pasanhansaka/Portfolio.git
cd Portfolio
# just open index.html — or serve it:
npx serve .
```

---

## 📬 Get in Touch

Open to freelance work, collaborations, or just talking shop about engineering and design.

- 💼 LinkedIn: [linkedin.com/in/pasanhansaka](https://linkedin.com/in/pasanhansaka)
- 📧 Email: [pasanhansaka31@gmail.com](mailto:pasanhansaka31@gmail.com)
- 🌐 Portfolio: [pasanhansaka.github.io/Portfolio](https://pasanhansaka.github.io/Portfolio/)

---

<div align="center">

<sub>Designed & built by Pasan Hansaka, from Kalutara, Sri Lanka.</sub>

</div>
