const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- SCI-FI SOUND SYNTHESIZER (Web Audio API) ---------- */
const SoundManager = (function sound() {
  let audioCtx = null;
  let muted = localStorage.getItem('sound-muted') === 'true';

  function init() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  function playTone(freqStart, freqEnd, duration, type = 'sine', gainStart = 0.1) {
    if (muted) return;
    try {
      init();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freqStart, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, audioCtx.currentTime + duration);

      gainNode.gain.setValueAtTime(gainStart, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("AudioContext tone generation blocked/failed:", e);
    }
  }

  const soundLibrary = {
    hover: () => playTone(320, 480, 0.07, 'sine', 0.02),
    click: () => playTone(520, 260, 0.12, 'triangle', 0.05),
    boot: () => {
      playTone(110, 330, 0.35, 'sine', 0.08);
      setTimeout(() => playTone(220, 660, 0.45, 'sine', 0.05), 120);
    },
    success: () => {
      playTone(330, 660, 0.08, 'sine', 0.04);
      setTimeout(() => playTone(660, 1320, 0.12, 'sine', 0.04), 60);
    },
    error: () => {
      playTone(150, 75, 0.3, 'sawtooth', 0.04);
    },
    type: () => playTone(700 + Math.random() * 250, 500, 0.02, 'sine', 0.015)
  };

  function isMuted() { return muted; }

  function toggleMute() {
    muted = !muted;
    localStorage.setItem('sound-muted', muted);
    updateToggleUI();
    if (!muted) {
      soundLibrary.success();
    }
    return muted;
  }

  function updateToggleUI() {
    const btn = document.getElementById('soundToggle');
    if (!btn) return;
    if (muted) {
      btn.classList.add('muted');
    } else {
      btn.classList.remove('muted');
    }
  }

  return {
    play: (name) => { if (soundLibrary[name]) soundLibrary[name](); },
    isMuted,
    toggleMute,
    init,
    updateToggleUI
  };
})();

/* ---------- BOOT SEQUENCE & LOADING ---------- */
let loaderTimer = null;
function startApp() {
  if (loaderTimer) clearTimeout(loaderTimer);
  const boot = document.getElementById('boot');
  if (boot) boot.classList.add('hidden');
  startPageAnims();
  SoundManager.play('boot');
}

(function bootInit() {
  const boot = document.getElementById('boot');
  if (!boot) return;

  if (REDUCED) {
    boot.classList.add('hidden');
    document.addEventListener('DOMContentLoaded', startApp);
    return;
  }

  // Fail-safe: force load after 3 seconds
  loaderTimer = setTimeout(() => {
    console.warn("Boot sequence took too long, triggering fail-safe loading.");
    startApp();
  }, 3000);

  const lines = document.querySelectorAll('.boot-line');
  const bar = document.getElementById('boot-bar');
  lines.forEach((l) => { l.innerHTML = l.dataset.t; });

  let lineIndex = 0;
  function showNextLine() {
    if (lineIndex < lines.length) {
      lines[lineIndex].classList.add('show');
      lineIndex++;
      const progressPct = (lineIndex / lines.length) * 100;
      if (bar) {
        if (window.gsap) {
          gsap.to(bar, { width: progressPct + '%', duration: .2, ease: 'power1.out' });
        } else {
          bar.style.width = progressPct + '%';
        }
      }
      setTimeout(showNextLine, 220);
    } else {
      setTimeout(startApp, 350);
    }
  }

  // Trigger boot sequence when interactive
  if (document.readyState !== 'loading') {
    setTimeout(showNextLine, 150);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(showNextLine, 150);
    });
  }
})();

/* ---------- THEME MANAGEMENT & PERSISTENCE ---------- */
const ThemeManager = (function theme() {
  let activeTheme = localStorage.getItem('theme') || 'dark';

  function apply(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
    activeTheme = themeName;
    updateAssets(themeName);
  }

  function toggle() {
    const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
    apply(nextTheme);
    SoundManager.play('click');
  }

  function updateAssets(themeName) {
    // Canvas background
    if (window.fxController && typeof window.fxController.setTheme === 'function') {
      window.fxController.setTheme(themeName);
    }
    // GitHub Snake SVG
    const snakeImg = document.getElementById('snakeImg');
    if (snakeImg) {
      if (themeName === 'light') {
        snakeImg.src = 'https://raw.githubusercontent.com/pasanhansaka/portfolio/output/github-snake.svg';
      } else {
        snakeImg.src = 'https://raw.githubusercontent.com/pasanhansaka/portfolio/output/github-snake-dark.svg';
      }
    }
  }

  function init() {
    apply(activeTheme);
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', toggle);
    }
  }

  return { init, current: () => activeTheme, apply };
})();

document.addEventListener('DOMContentLoaded', ThemeManager.init);

/* ---------- CUSTOM CURSOR ---------- */
if (!REDUCED && window.matchMedia('(min-width:861px)').matches) {
  const dot = document.getElementById('cdot');
  const ring = document.getElementById('cring');
  const label = document.getElementById('clabel');
  const bgspot = document.getElementById('bgspot');
  
  if (dot && ring && label) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    let cursorStarted = false;

    dot.style.opacity = '0';
    ring.style.opacity = '0';
    dot.style.transition = 'opacity 0.3s ease';
    ring.style.transition = 'opacity 0.3s ease, width 0.2s, height 0.2s, background 0.2s';

    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;

      if (!cursorStarted) {
        cursorStarted = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
    });

    function lerpCursor() {
      // Lerping speed
      rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
      
      // Update custom cursor transforms to avoid layout reflows (lag-free)
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      label.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(18px, -6px)`;

      // Update background spotlight position directly on bgspot element
      if (bgspot) {
        bgspot.style.setProperty('--mx', mx + 'px');
        bgspot.style.setProperty('--my', my + 'px');
      }

      requestAnimationFrame(lerpCursor);
    }
    lerpCursor();

    // Attach hover events
    function bindCursorEffects() {
      document.querySelectorAll('a, button, .chip, .p-card, .btn, .magnetic-btn, #deck, .hologram-projector').forEach(el => {
        if (el.dataset.cursorBound) return;
        el.dataset.cursorBound = "true";

        el.addEventListener('mouseenter', () => {
          ring.classList.add('big');
          SoundManager.play('hover');
          const txt = el.dataset.cursor;
          if (txt) { label.textContent = txt; label.classList.add('show'); }
        });
        el.addEventListener('mouseleave', () => {
          ring.classList.remove('big');
          label.classList.remove('show');
        });
        el.addEventListener('click', () => {
          SoundManager.play('click');
        });
      });
    }
    
    // Bind on start and watch DOM
    document.addEventListener('DOMContentLoaded', () => {
      bindCursorEffects();
      
      // Hide custom cursor and restore default browser cursor inside PDF iframe
      const cvBody = document.querySelector('.cv-body');
      if (cvBody) {
        cvBody.addEventListener('mouseenter', () => {
          dot.style.opacity = '0';
          ring.style.opacity = '0';
          label.classList.remove('show');
        });
        cvBody.addEventListener('mouseleave', () => {
          dot.style.opacity = '1';
          ring.style.opacity = '1';
        });
      }
    });
    window.bindCursorEffects = bindCursorEffects;
  }
}

/* ---------- SYSTEM DIAGNOSTICS HUD ---------- */
(function diagnostics() {
  const fpsEl = document.getElementById('diag-fps');
  const pingEl = document.getElementById('diag-ping');
  const battEl = document.getElementById('diag-battery');

  // FPS Monitor
  let lastFrameTime = performance.now();
  let frameCount = 0;
  function updateFps() {
    frameCount++;
    const now = performance.now();
    if (now >= lastFrameTime + 1000) {
      if (fpsEl) fpsEl.textContent = Math.round((frameCount * 1000) / (now - lastFrameTime));
      frameCount = 0;
      lastFrameTime = now;
    }
    requestAnimationFrame(updateFps);
  }
  requestAnimationFrame(updateFps);

  // Ping simulation
  setInterval(() => {
    if (pingEl) {
      const ping = Math.floor(Math.random() * 12) + 9;
      pingEl.textContent = ping + 'ms';
    }
  }, 4000);

  // Battery status API
  if (navigator.getBattery) {
    navigator.getBattery().then(battery => {
      function updateBattery() {
        if (battEl) {
          const pct = Math.round(battery.level * 100);
          const statusSuffix = battery.charging ? ' ⚡' : '';
          battEl.textContent = pct + '%' + statusSuffix;
        }
      }
      updateBattery();
      battery.addEventListener('levelchange', updateBattery);
      battery.addEventListener('chargingchange', updateBattery);
    }).catch(() => {
      if (battEl) battEl.textContent = '100% (AC)';
    });
  } else {
    if (battEl) battEl.textContent = '100% (AC)';
  }
})();

/* ---------- SRI LANKA HUD CLOCK ---------- */
function tickClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const now = new Date();
  const opts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Colombo' };
  el.textContent = new Intl.DateTimeFormat('en-GB', opts).format(now) + ' LKT';
}
tickClock();
setInterval(tickClock, 1000);

/* ---------- THROTTLED SCROLL PROGRESS & NAV TRANSITION & TIMELINE FILL & REVEALS ---------- */
let scrollTicker = false;
function handleScroll() {
  const vh = window.innerHeight || document.documentElement.clientHeight;

  // 1. Scroll Progress Bar & Nav Transition
  const h = document.documentElement;
  const progressPercent = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  const bar = document.getElementById('scroll-progress');
  if (bar) bar.style.width = progressPercent + '%';

  const nav = document.querySelector('nav');
  if (nav) {
    if (window.scrollY > 20) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  }

  // 2. Timeline Progress Fill
  const tl = document.querySelector('.timeline');
  const tlBar = document.getElementById('tlProgress');
  if (tl && tlBar) {
    const r = tl.getBoundingClientRect();
    const total = r.height;
    const visible = Math.min(Math.max(vh * 0.7 - r.top, 0), total);
    tlBar.style.height = (visible / total * 100) + '%';
  }

  // 3. Scroll Reveals (Reveal & Hide on Scroll)
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    // Reveal if any part enters the viewport (with a 40px buffer)
    if (rect.top < vh - 40 && rect.bottom > 40) {
      el.classList.add('in');
    } else {
      el.classList.remove('in');
    }
  });

  scrollTicker = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTicker) {
    requestAnimationFrame(handleScroll);
    scrollTicker = true;
  }
}, { passive: true });

// Run once initially to align everything on load
handleScroll();

/* ---------- TEXT DECRYPTION EFFECT ---------- */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*_-+=01';
function decryptEl(el, onDone) {
  const final = el.dataset.text || el.textContent;
  const len = final.length;
  let frame = 0;
  const totalFrames = len * 3 + 15;
  const revealAt = Array.from({ length: len }, (_, i) => Math.floor(i * (totalFrames / len)) + Math.random() * 5);
  function render() {
    let out = '';
    for (let i = 0; i < len; i++) {
      if (final[i] === ' ') { out += ' '; continue; }
      if (frame >= revealAt[i]) { out += final[i]; }
      else { out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]; }
    }
    el.textContent = out;
    frame++;
    if (frame <= totalFrames) { requestAnimationFrame(render); }
    else { el.textContent = final; if (onDone) onDone(); }
  }
  if (REDUCED) { el.textContent = final; if (onDone) onDone(); return; }
  render();
}

function startPageAnims() {
  // Trigger initial reveals on start
  handleScroll();

  const decryptObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.decrypting) {
        entry.target.dataset.decrypting = '1';
        decryptEl(entry.target, () => { delete entry.target.dataset.decrypting; });
        decryptObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.decrypt').forEach(el => decryptObserver.observe(el));

  // Counter Increments
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        let cur = 0;
        const duration = 1400;
        const start = performance.now();
        
        // Preserve any suffix elements (like <span>+</span>)
        const span = el.querySelector('span');
        const spanHtml = span ? span.outerHTML : '';
        
        function step(t) {
          const progress = Math.min((t - start) / duration, 1);
          cur = Math.floor(progress * target);
          
          if (span) {
            el.innerHTML = cur + spanHtml;
          } else {
            el.textContent = cur;
          }
          
          if (progress < 1) requestAnimationFrame(step);
          else {
            if (span) {
              el.innerHTML = target + spanHtml;
            } else {
              el.textContent = target;
            }
          }
        }
        requestAnimationFrame(step);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.stat-num').forEach(el => countObserver.observe(el));
}

/* ---------- MARQUEE DRAGGABLE CAROUSEL ---------- */
(function marquee() {
  const wrap = document.getElementById('marquee');
  const track = document.getElementById('marqueeTrack');
  if (!wrap || !track) return;
  let pos = 0, speed = 0.6, dragging = false, lastX = 0;
  function loop() {
    if (!dragging) { pos -= speed; }
    const w = track.scrollWidth / 2;
    if (Math.abs(pos) >= w) { pos = 0; }
    track.style.transform = `translateX(${pos}px)`;
    requestAnimationFrame(loop);
  }
  if (!REDUCED) loop(); else track.style.transform = 'translateX(0)';
  wrap.addEventListener('mousedown', e => { dragging = true; lastX = e.clientX; });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dx = e.clientX - lastX; lastX = e.clientX; pos += dx;
    const w = track.scrollWidth / 2;
    if (pos > 0) pos -= w; if (pos < -w) pos += w;
  });
  window.addEventListener('mouseup', () => dragging = false);
})();

/* ---------- INTERACTIVE BACKGROUND FX (Physics Particle Network & Matrix Rain) ---------- */
const fxController = (function fx() {
  const canvas = document.getElementById('fx-canvas');
  if (!canvas) return {};
  const ctx = canvas.getContext('2d');
  if (!ctx) return {};
  let W, H, DPR;

  let matrixMode = false;
  let nodes = [];
  let sparks = [];
  let ripples = [];
  let mouse = { x: -9999, y: -9999, active: false };

  let lineRGB = '124,92,255';
  let nodeRGB = '210,200,255';
  let matrixRGB = '#35f0c9';

  // Matrix variables
  let columns = 0;
  let drops = [];

  function setTheme(theme) {
    if (theme === 'light') {
      lineRGB = '90,60,200'; nodeRGB = '90,60,200'; matrixRGB = '#0b8f7c';
    } else {
      lineRGB = '124,92,255'; nodeRGB = '210,200,255'; matrixRGB = '#35f0c9';
    }
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    buildNodes();

    // Rebuild matrix structure
    columns = Math.floor(W / 15);
    drops = Array(columns).fill().map(() => Math.floor(Math.random() * -30));
  }

  function buildNodes() {
    // Increased particle density for both mobile and desktop to make it more noticeable
    const density = window.innerWidth < 720 ? 18000 : 10000;
    const count = Math.min(120, Math.round((W * H) / density));
    nodes = Array.from({ length: count }, () => {
      const vx = (Math.random() - 0.5) * 0.45;
      const vy = (Math.random() - 0.5) * 0.45;
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: vx,
        vy: vy,
        baseVx: vx,
        baseVy: vy,
        // Larger and more noticeable nodes/stars
        r: Math.random() * 1.8 + 1.2
      };
    });
  }

  // Setup
  resize();
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 150);
  });
  setTheme(document.documentElement.getAttribute('data-theme') || 'dark');

  // Input listeners
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true; });
  window.addEventListener('mouseleave', () => { mouse.active = false; });
  window.addEventListener('touchmove', e => {
    if (e.touches && e.touches[0]) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; mouse.active = true; }
  }, { passive: true });

  // Mouse Click Ripple & Spark Emission
  window.addEventListener('click', e => {
    if (REDUCED) return;
    const x = e.clientX;
    const y = e.clientY;

    // Ripple
    ripples.push({ x, y, r: 0, maxR: 160, opacity: 1 });

    // Sparks
    const sparkCount = Math.floor(Math.random() * 10) + 12;
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.5 + 1.2;
      sparks.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: Math.random() * 0.03 + 0.02,
        color: Math.random() > 0.5 ? 'magenta' : 'cyan'
      });
    }
  });

  const LINK_DIST = 140;
  const MOUSE_REPULSION_RADIUS = 160;

  function step() {
    if (REDUCED) {
      ctx.clearRect(0, 0, W, H);
      return;
    }

    if (matrixMode) {
      // Draw cascading matrix rain
      ctx.fillStyle = ThemeManager.current() === 'light' ? 'rgba(246, 244, 251, 0.15)' : 'rgba(5, 2, 8, 0.15)';
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = matrixRGB;
      ctx.font = '11px JetBrains Mono';

      for (let i = 0; i < columns; i++) {
        const char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const x = i * 15;
        const y = drops[i] * 15;

        ctx.fillText(char, x, y);

        if (y > H && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    } else {
      // Particle Network
      ctx.clearRect(0, 0, W, H);

      // 1. Repulsion physics
      for (const n of nodes) {
        if (mouse.active) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_REPULSION_RADIUS) {
            const force = (MOUSE_REPULSION_RADIUS - dist) / MOUSE_REPULSION_RADIUS;
            n.vx += (dx / dist) * force * 0.5;
            n.vy += (dy / dist) * force * 0.5;
          }
        }

        // Apply friction & damp velocity
        n.vx *= 0.94;
        n.vy *= 0.94;

        // Blend back natural float vector
        n.vx += n.baseVx * 0.06;
        n.vy += n.baseVy * 0.06;

        n.x += n.vx;
        n.y += n.vy;

        // Bouncing constraints
        if (n.x < 0) { n.x = 0; n.vx *= -1; n.baseVx *= -1; }
        if (n.x > W) { n.x = W; n.vx *= -1; n.baseVx *= -1; }
        if (n.y < 0) { n.y = 0; n.vy *= -1; n.baseVy *= -1; }
        if (n.y > H) { n.y = H; n.vy *= -1; n.baseVy *= -1; }
      }

      // 2. Draw lines between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            // Increased line opacity from 0.16 to 0.35 to make the network noticeably visible
            let opacity = (1 - d / LINK_DIST) * 0.35;

            // Extra line glow when mouse is close to the connection midpoint
            if (mouse.active) {
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2;
              const mdx = mx - mouse.x, mdy = my - mouse.y;
              const md = Math.sqrt(mdx * mdx + mdy * mdy);
              if (md < 120) {
                opacity += (1 - md / 120) * 0.35;
              }
            }

            ctx.strokeStyle = `rgba(${lineRGB},${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }

      // 3. Draw nodes
      for (const n of nodes) {
        // Increased node/star opacity from 0.6 to 0.85 for stronger contrast
        ctx.fillStyle = `rgba(${nodeRGB},0.85)`;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      }
    }

    // 4. Handle explosion sparks
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;

      if (s.life <= 0) {
        sparks.splice(i, 1);
      } else {
        const rgb = s.color === 'magenta' ? '255, 63, 168' : '53, 240, 201';
        ctx.fillStyle = `rgba(${rgb}, ${s.life * 0.8})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, 2, 0, Math.PI * 2); ctx.fill();
      }
    }

    // 5. Handle expanding shockwave ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.r += (r.maxR - r.r) * 0.12;
      r.opacity = 1 - (r.r / r.maxR);

      if (r.opacity <= 0.01) {
        ripples.splice(i, 1);
      } else {
        ctx.strokeStyle = `rgba(${lineRGB}, ${r.opacity * 0.45})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx.stroke();
      }
    }

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);

  function toggleMatrix() {
    matrixMode = !matrixMode;
    return matrixMode;
  }

  return { setTheme, toggleMatrix, isMatrix: () => matrixMode };
})();
window.fxController = fxController;

/* ---------- PORTFOLIO DECK (DRAG / SCROLL) ---------- */
(function deckScroll() {
  const deck = document.getElementById('deck');
  if (!deck) return;
  const thumb = document.getElementById('deckProgressThumb');
  const pctEl = document.getElementById('deckProgressPct');
  let isDown = false, startX = 0, startScroll = 0, moved = false;

  function updateProgress() {
    if (!thumb || !pctEl) return;
    const max = deck.scrollWidth - deck.clientWidth;
    if (max <= 0) { thumb.style.width = '100%'; pctEl.textContent = '100%'; return; }
    const ratio = Math.min(deck.scrollLeft / max, 1);
    const pct = Math.round(ratio * 100);
    thumb.style.width = pct + '%';
    pctEl.textContent = String(pct).padStart(2, '0') + '%';
  }

  deck.addEventListener('pointerdown', e => {
    isDown = true; moved = false;
    startX = e.clientX; startScroll = deck.scrollLeft;
    deck.setPointerCapture(e.pointerId);
    deck.style.cursor = 'grabbing';
    deck.classList.add('dragging');
  });
  deck.addEventListener('pointermove', e => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    deck.scrollLeft = startScroll - dx;
  });
  function endDrag(e) {
    isDown = false;
    deck.style.cursor = 'grab';
    deck.classList.remove('dragging');
    if (moved && e) { e.preventDefault(); }
  }
  deck.addEventListener('pointerup', endDrag);
  deck.addEventListener('pointerleave', () => { isDown = false; deck.style.cursor = 'grab'; deck.classList.remove('dragging'); });
  deck.addEventListener('pointercancel', () => { isDown = false; deck.style.cursor = 'grab'; deck.classList.remove('dragging'); });

  deck.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);

  deck.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      deck.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, { passive: false });

  deck.addEventListener('scroll', updateProgress, { passive: true });
  deck.style.cursor = 'grab';
  // Initialize on load
  requestAnimationFrame(updateProgress);
})();

/* ---------- PROJECT CARD 3D HOVER TILT ---------- */
document.querySelectorAll('.p-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    if (REDUCED) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0)';
  });
});

/* ---------- TIMELINE PROGRESS FILL (Handled by global throttled scroll listener) ---------- */

/* ---------- RETRO-CLI VIRTUAL SHELL (Terminal Module) ---------- */
const TerminalConsole = (function shell() {
  const overlay = document.getElementById('terminal-overlay');
  const trigger = document.getElementById('terminalTrigger');
  const closeBtn = document.getElementById('terminalClose');
  const input = document.getElementById('terminalInput');
  const output = document.getElementById('terminalOutput');
  const body = document.getElementById('terminalBody');

  const history = [];
  let historyIdx = -1;

  const projectLinks = [
    "https://github.com/pasanhansaka/AnyDown",
    "https://github.com/pasanhansaka/GorillaFit",
    "https://github.com/pasanhansaka/HelaChat",
    "https://github.com/pasanhansaka/GlobeMed-Hospital-Management-System",
    "https://github.com/pasanhansaka/GreenBasket-Fresh-Produce-Online-Store",
    "https://github.com/pasanhansaka/Hela_Bank",
    "https://github.com/pasanhansaka/2D-Adventure-Game",
    "https://github.com/pasanhansaka/Key-Code-Finder-Interactive-Keyboard-Code-Helper"
  ];

  function toggle() {
    if (!overlay) return;
    const isHidden = overlay.classList.contains('terminal-hidden');
    if (isHidden) {
      overlay.classList.remove('terminal-hidden');
      SoundManager.play('success');
      setTimeout(() => { if (input) input.focus(); }, 100);
    } else {
      overlay.classList.add('terminal-hidden');
      SoundManager.play('click');
    }
  }

  function printLine(text, className = '') {
    if (!output) return;
    const line = document.createElement('div');
    line.className = 'terminal-line ' + className;
    line.innerHTML = text;
    output.appendChild(line);
    body.scrollTop = body.scrollHeight;
  }

  function runCmd(cmdStr) {
    const raw = cmdStr.trim();
    if (!raw) return;
    history.push(raw);
    historyIdx = history.length;

    printLine('pasan.sys&gt; ' + raw, 'user-cmd');

    const args = raw.split(' ');
    const cmd = args[0].toLowerCase();

    switch (cmd) {
      case 'help':
        printLine('Available Terminal Commands:');
        printLine('  help      - Show this reference panel');
        printLine('  about     - Read software engineer profile');
        printLine('  skills    - View technical core competencies');
        printLine('  projects  - Show indexed github repositories');
        printLine('  open <#>  - Open project repository link (1-8) in new tab');
        printLine('  resume    - Launch interactive resume viewer module');
        printLine('  theme     - Toggle light / dark display theme');
        printLine('  matrix    - Toggle green matrix digital rain mode');
        printLine('  clear     - Wipe shell logs');
        printLine('  exit      - Close secure session link');
        break;

      case 'cv':
      case 'resume':
        printLine('SYS :: Launching interactive CV Viewer module...', 'success-msg');
        SoundManager.play('success');
        setTimeout(() => {
          toggle(); // Close terminal overlay
          if (window.openCVModal) window.openCVModal(); // Open CV Modal
        }, 350);
        break;

      case 'about':
        printLine('Engineer: Pasan Hansaka');
        printLine('Degree: BSc (Hons) Software Engineering (Java Institute / BCU)');
        printLine('Status: Software Engineering Intern @ Synapse Solutions Pvt. Ltd.');
        printLine('Focus: Java Enterprise, Spring, Node.js, and Modern JS frameworks.');
        printLine('Bio: Shipping dwesk CRM capabilities and API database systems.');
        break;

      case 'skills':
        printLine('--- Technical Arsenal ---', 'success-msg');
        printLine('Backend:  Java, Spring Boot, Node.js, Express, PHP, MySQL, MongoDB, Firebase');
        printLine('Frontend: JS (ES6), TypeScript, React, Next.js, AngularJS, Tailwind, HTML/CSS');
        printLine('Mobile:   React Native, Android Studio');
        printLine('DevOps:   Docker, Git, Linux command line');
        break;

      case 'projects':
        printLine('--- selected github work ---', 'success-msg');
        printLine('  [1] AnyDown (React, Node, FFmpeg) - platform video downloader');
        printLine('  [2] GorillaFit (React 19, Tailwind) - modern gym landing page');
        printLine('  [3] HelaChat (React Native, Firebase) - real-time messaging');
        printLine('  [4] GlobeMed (Java) - enterprise hospital system');
        printLine('  [5] GreenBasket (React, Node) - produce e-commerce page');
        printLine('  [6] Hela Bank (Java) - secure core banking platform');
        printLine('  [7] 2D Adventure Game (Vanilla JavaScript) - level collision physics');
        printLine('  [8] Key Code Finder (JavaScript) - keystroke inspector tool');
        printLine('Type "open <1-8>" to inspect code in browser.');
        break;

      case 'open':
        const index = parseInt(args[1], 10);
        if (isNaN(index) || index < 1 || index > 8) {
          printLine('Error: Invalid project index. Must be a number between 1 and 8.', 'error-msg');
          SoundManager.play('error');
        } else {
          const url = projectLinks[index - 1];
          printLine('Launching link to repository [' + index + ']...', 'success-msg');
          SoundManager.play('success');
          window.open(url, '_blank');
        }
        break;

      case 'theme':
        ThemeManager.toggle();
        printLine('System settings updated: theme changed to ' + ThemeManager.current() + '.', 'success-msg');
        break;

      case 'matrix':
        const mode = fxController.toggleMatrix();
        printLine('Matrix Code Rain Mode ' + (mode ? 'ENABLED' : 'DISABLED') + '.', 'success-msg');
        SoundManager.play('success');
        break;

      case 'clear':
        if (output) output.innerHTML = '';
        break;

      case 'exit':
        toggle();
        break;

      default:
        printLine('sys: Command not found: "' + cmd + '". Type "help" for reference list.', 'error-msg');
        SoundManager.play('error');
        break;
    }
  }

  function init() {
    if (trigger) trigger.addEventListener('click', toggle);
    if (closeBtn) closeBtn.addEventListener('click', toggle);

    if (input) {
      input.addEventListener('keydown', e => {
        // Synthesise typing click
        if (e.key.length === 1) {
          SoundManager.play('type');
        }

        if (e.key === 'Enter') {
          const val = input.value;
          input.value = '';
          runCmd(val);
        } else if (e.key === 'ArrowUp') {
          if (historyIdx > 0) {
            historyIdx--;
            input.value = history[historyIdx];
          }
          e.preventDefault();
        } else if (e.key === 'ArrowDown') {
          if (historyIdx < history.length - 1) {
            historyIdx++;
            input.value = history[historyIdx];
          } else {
            historyIdx = history.length;
            input.value = '';
          }
          e.preventDefault();
        }
      });
    }

    // Toggle terminal using backtick (`) key
    window.addEventListener('keydown', e => {
      if (e.key === '`' || e.key === 'Backquote') {
        if (document.activeElement === input) return;
        e.preventDefault();
        toggle();
      }
    });
  }

  return { init, toggle };
})();

/* ---------- INTERACTIVE CV VIEWER (Modal Module) ---------- */
const CVViewer = (function cvViewer() {
  const overlay = document.getElementById('cv-overlay');
  const closeBtn = document.getElementById('cvClose');
  const triggers = document.querySelectorAll('.resume-trigger');

  function openModal() {
    if (!overlay) return;
    overlay.classList.remove('cv-hidden');
    SoundManager.play('success');
    document.body.style.overflow = 'hidden'; // Disable background scrolling
    
    // Re-bind custom cursor effects to elements inside the modal
    if (window.bindCursorEffects) {
      window.bindCursorEffects();
    }
  }

  function closeModal() {
    if (!overlay) return;
    overlay.classList.add('cv-hidden');
    SoundManager.play('click');
    document.body.style.overflow = ''; // Re-enable background scrolling
  }

  function init() {
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    triggers.forEach(t => t.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    }));

    // Close when clicking outside container
    if (overlay) {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) {
          closeModal();
        }
      });
    }

    // Escape key to close
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });
  }

  return { init, open: openModal, close: closeModal };
})();
window.openCVModal = CVViewer.open;
window.closeCVModal = CVViewer.close;
/* ---------- TOAST NOTIFICATION UTILITY ---------- */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconSym = type === 'success' ? '✓' : '✕';
  const titleText = type === 'success' ? 'SYS_OK :: TRANSMISSION SECURED' : 'SYS_ERR :: LINK FAILURE';

  toast.innerHTML = `
    <div class="toast-icon ${type}">${iconSym}</div>
    <div class="toast-content">
      <div class="toast-title">${titleText}</div>
      <div class="toast-msg">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  // Auto remove toast after 4s
  const timeoutId = setTimeout(() => {
    toast.classList.add('hiding');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 4000);

  // Close toast on click
  toast.addEventListener('click', () => {
    clearTimeout(timeoutId);
    toast.classList.add('hiding');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  });
}

/* ---------- CONTACT FORM AJAX SUBMISSION & VALIDATION ---------- */
const ContactForm = (function contactFormModule() {
  async function printLogs(logsArray) {
    const logsBox = document.getElementById('formConsoleLogs');
    const logLines = document.getElementById('formLogLines');
    if (!logsBox || !logLines) return;

    logsBox.style.display = 'block';
    logLines.innerHTML = '';

    for (const line of logsArray) {
      const lineEl = document.createElement('div');
      lineEl.className = `log-line ${line.type || ''}`;
      lineEl.textContent = `> ${line.text}`;
      logLines.appendChild(lineEl);
      
      // Auto scroll to bottom
      logsBox.scrollTop = logsBox.scrollHeight;
      
      // Short delay to simulate real computations
      await new Promise(resolve => setTimeout(resolve, line.delay || 150));
    }
  }

  function init() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const msgInput = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');

    // Reset validation errors on input change and play typing/click sounds
    [nameInput, emailInput, msgInput].forEach(input => {
      if (input) {
        input.addEventListener('focus', () => {
          SoundManager.play('click');
        });
        input.addEventListener('keypress', () => {
          SoundManager.play('type');
        });
        input.addEventListener('input', () => {
          const group = input.closest('.form-group-cyber');
          if (group) group.classList.remove('invalid');
        });
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      let hasError = false;
      const logs = [];

      // Reset previous error outlines
      document.querySelectorAll('.form-group-cyber').forEach(el => el.classList.remove('invalid'));

      logs.push({ text: 'SYSTEM: INITIATING UPLINK PROTOCOL...', type: 'system', delay: 100 });
      logs.push({ text: 'SYSTEM: RUNNING LOCAL DATA INTEGRITY CHECKS...', type: 'system', delay: 150 });

      // Validate Name
      if (!nameInput || !nameInput.value.trim()) {
        hasError = true;
        if (nameInput) nameInput.closest('.form-group-cyber').classList.add('invalid');
        logs.push({ text: 'ERR: IDENTIFIER (FLD_01) IS EMPTY OR CORRUPTED.', type: 'error', delay: 100 });
      } else {
        logs.push({ text: `FLD_01 (IDENTIFIER) = [${nameInput.value.trim().substring(0, 16)}] ... OK`, type: 'success', delay: 100 });
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput || !emailInput.value.trim()) {
        hasError = true;
        if (emailInput) emailInput.closest('.form-group-cyber').classList.add('invalid');
        logs.push({ text: 'ERR: RETURN_ROUTE (FLD_02) IS REQUIRED.', type: 'error', delay: 100 });
      } else if (!emailRegex.test(emailInput.value.trim())) {
        hasError = true;
        emailInput.closest('.form-group-cyber').classList.add('invalid');
        logs.push({ text: 'ERR: INVALID EMAIL ROUTING SYNTAX (FLD_02).', type: 'error', delay: 100 });
      } else {
        logs.push({ text: `FLD_02 (RETURN_ROUTE) = [${emailInput.value.trim().substring(0, 20)}...] ... OK`, type: 'success', delay: 100 });
      }

      // Validate Message
      if (!msgInput || !msgInput.value.trim()) {
        hasError = true;
        if (msgInput) msgInput.closest('.form-group-cyber').classList.add('invalid');
        logs.push({ text: 'ERR: MESSAGE_BODY (FLD_03) CONTAINS NO PAYLOAD DATA.', type: 'error', delay: 100 });
      } else {
        logs.push({ text: `FLD_03 (PAYLOAD) = [${msgInput.value.trim().length} BYTES] ... OK`, type: 'success', delay: 100 });
      }

      if (hasError) {
        logs.push({ text: 'ERR: TRANSACTION ABORTED. RESOLVE VALIDATION CONSTRAINTS.', type: 'error', delay: 100 });
        SoundManager.play('error');
        await printLogs(logs);
        showToast('Form validation failed. Check terminal readouts.', 'error');
        return;
      }

      // Prepare submission logs
      logs.push({ text: 'SYSTEM: ESTABLISHING SECURE GATEWAY TUNNEL...', type: 'system', delay: 200 });
      logs.push({ text: 'SYSTEM: ENCRYPTING DATA WITH SSL/AES-256...', type: 'system', delay: 250 });
      logs.push({ text: 'SYSTEM: DISPATCHING TRANSMISSION TO FORMSUBMIT_GATEWAY...', type: 'system', delay: 300 });

      // Disable inputs and buttons
      if (submitBtn) submitBtn.disabled = true;
      [nameInput, emailInput, msgInput].forEach(inp => { if (inp) inp.disabled = true; });

      // Start printing logs
      const logPromise = printLogs(logs);
      
      const formData = new FormData(form);
      const payload = {};
      formData.forEach((value, key) => { payload[key] = value; });

      try {
        const responsePromise = fetch('https://formsubmit.co/ajax/pasanhansaka31@gmail.com', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const [response, _] = await Promise.all([responsePromise, logPromise]);
        const json = await response.json();

        const endLogs = [];
        if (response.status === 200 && json.success) {
          SoundManager.play('success');
          endLogs.push({ text: 'SYSTEM: UPLINK RECEIVED AND ACKNOWLEDGED.', type: 'success', delay: 150 });
          endLogs.push({ text: `SYSTEM: TX_HASH = [${Math.random().toString(16).substring(2, 10).toUpperCase()}_${Date.now().toString().substring(8)}]`, type: 'success', delay: 150 });
          endLogs.push({ text: 'SYSTEM: DISCONNECTING. UPLINK SECURED.', type: 'success', delay: 100 });
          await printLogs(endLogs);
          
          showToast('Inquiry packet transmitted successfully.', 'success');
          form.reset();
        } else {
          SoundManager.play('error');
          endLogs.push({ text: `ERR: SERVER REJECTED PAYLOAD. MSG: [${json.message || 'UNKNOWN'}]`, type: 'error', delay: 200 });
          await printLogs(endLogs);
          showToast(json.message || 'Server rejected transmission.', 'error');
        }
      } catch (err) {
        SoundManager.play('error');
        const errLogs = [{ text: 'ERR: NETWORK DISRUPTION. GATEWAY UNREACHABLE.', type: 'error', delay: 200 }];
        await printLogs(errLogs);
        showToast('Connection interrupted. Please verify connection and retry.', 'error');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        [nameInput, emailInput, msgInput].forEach(inp => { if (inp) inp.disabled = false; });
      }
    });
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  TerminalConsole.init();
  CVViewer.init();
  ContactForm.init();
});
