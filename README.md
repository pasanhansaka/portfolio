
<div align="center">

# ⚡ PASAN.SYS

### A cinematic, terminal-inspired developer portfolio

**[Live Demo](https://pasanhansaka.github.io/Portfolio/)** · Built with vanilla JS, GSAP & Canvas — no frameworks, no build step

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)

</div>

---

## 🎬 Overview

This is my personal developer portfolio — designed to feel less like a static résumé and more like **booting into a system**. It opens with a terminal boot sequence, drops you into a reactive particle-network background, and lets you explore my work through a scroll-driven interface *or* a fully functional retro CLI shell.

Everything here — the physics, the sound design, the terminal emulator, the theming — is hand-built in a single-file architecture with **zero frontend frameworks**.

---

## ✨ Key Features

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

## 📁 Project Structure

```
Portfolio/
├── index.html      # Markup & content
├── style.css        # Design tokens, theming, layout, animations
├── script.js         # Boot sequence, terminal, canvas FX, theme & sound managers
└── README.md
```

Single-file-per-concern architecture — no bundler, no build step. Clone it and open `index.html`, or serve it with any static server.

---

## 🚀 Running Locally

```bash
git clone https://github.com/pasanhansaka/Portfolio.git
cd Portfolio
# then just open index.html in a browser, or serve it:
npx serve .
```

---

## 🧑‍💻 About Me

I'm **Pasan Hansaka**, a Software Engineering Intern at Synapse Solutions Pvt. Ltd., working on the *dwesk Social CRM* platform. I hold a BSc (Hons) in Software Engineering from the Java Institute for Advanced Technology, affiliated with Birmingham City University, UK.

- 🌐 Portfolio: [pasanhansaka.github.io/Portfolio](https://pasanhansaka.github.io/Portfolio/)
- 💼 LinkedIn: [linkedin.com/in/pasanhansaka](https://linkedin.com/in/pasanhansaka)
- 📧 Email: [pasanhansaka31@gmail.com](mailto:pasanhansaka31@gmail.com)

---

<div align="center">

**⭐ If this inspired your own portfolio build, a star is always appreciated!**

</div>
