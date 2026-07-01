# ⚡ PASAN.HANSAKA // SECURE_SHELL_PORTFOLIO

> **SYS_STATUS:** `ONLINE` // **PORTAL_VERSION:** `v1.0.0` // **STYLING:** `CYBERPUNK GLASSMORPHISM`
> A high-performance, ultra-futuristic developer portfolio engineered in pure Vanilla JS, CSS3, and HTML5. Built to deliver an immersive, interactive experience resembling a secure tactical terminal.

---

## 🛰️ Interactive Core Features

### 🖥️ Dropdown CLI Terminal (Quake Console)
Press the **backtick key (\`)** or click **`[CLI_]`** in the navbar to slide down a fully interactive virtual developer shell. Use this interface to query my skills, inspect selected repositories, swap display themes, or toggle the Matrix simulation.

### 🧬 Physics-Based Particle Network (Attraction/Repulsion)
The background features an interactive constellation node canvas. 
- Particles are repelled by the mouse, creating a fluid bubble around the pointer.
- Clicking the screen triggers a glowing shockwave ripple and particle spark burst.
- Line connection opacities scale dynamically as the cursor moves close to midpoints.

### 🔋 Cybernetic Diagnostics HUD
Displays live browser runtime diagnostics in the bottom-left corner:
- **FPS:** Custom requestAnimationFrame frame rate counter.
- **PING:** Simulated server connection latency.
- **BATT:** Hardware integration reading battery level via the HTML5 Battery Status API.

### 🎚️ Local Sci-Fi Audio Synthesizer
Generates satisfying click, hover, boot, error, and keystroke beeps on-the-fly using the **HTML5 Web Audio API**.
- Synthesizes waves (sine/triangle/sawtooth sweeps) directly in the browser.
- **Zero audio file downloads required**—highly lightweight and instant.
- A toggle button in the navbar allows muting the system sound effects.

### 🎨 Theme Sync & Persistent State
- High-contrast **Dark Mode (Void)** and **Light Mode (Elysium)**.
- Color palettes, grid overlays, node lines, and typography morph smoothly.
- **GitHub Contribution Tracker:** Dynamically swaps the SVG source path between light and dark theme snake SVGs based on theme preference.
- State is preserved inside the browser's `localStorage` across page sessions.

---

## 🛠️ Command Shell Reference

| Command | Action | Description |
|:---|:---|:---|
| `help` | Display Reference Panel | Shows the console manual and commands summary. |
| `about` | Print Profile | Displays background, degree, and current role. |
| `skills` | View Technical Arsenal | Lists languages, databases, tooling, and backend/frontend stack. |
| `projects` | Index Repository List | Lists selected public repositories with reference indexes. |
| `open <1-8>` | Launch Link | Opens the specified repository index in a new browser tab. |
| `theme` | Toggle Theme Mode | Toggles current stylesheet variables between Dark & Light themes. |
| `matrix` | Toggle Code Rain | Switches background canvas into a cascading green binary matrix rain. |
| `clear` | Wipe Logs | Clears current terminal buffer output history. |
| `exit` | Terminate Session | Slides the terminal panel out of view. |

---

## 📂 Project Architecture

```
├── .github/          # GitHub workflow schedules
├── index.html        # Main structures, HUD modules & SVG icons
├── style.css         # Cyber variables, glassmorphic styles, glitch keyframes
├── script.js        # Synthesizer, canvas physics engine, CLI commands
└── README.md         # Terminal system guide & technical details
```

---

## 🚀 Setup & Launch

To launch the portal locally, clone the repository and run any HTTP server in the directory.

### Quick Start with Node:
```bash
# Install http-server globally if needed
npm install -g http-server

# Spin up local terminal instance
http-server .
```

### Alternatively (Using Python):
```bash
# Python 3
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

---
*Synthesized by Pasan Hansaka — Kalutara, Sri Lanka.*