// ═══════════════════════════════════════════════════════
// SAJAY WEDS AMRUSHA — script.js  "Moonlit Garden"
// ═══════════════════════════════════════════════════════

// ── LOADER ──────────────────────────────────────────────
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";
    setTimeout(() => {
      loader.style.display = "none";
      revealHero();
    }, 1000);
  }, 4200);
});

function revealHero() {
  document.querySelectorAll(".hero .reveal").forEach((el, i) => {
    setTimeout(() => el.classList.add("active"), i * 240);
  });
}

// ── SCROLL REVEAL ────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("active");
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));

// ── COUNTDOWN ────────────────────────────────────────────
const weddingDate = new Date("April 29, 2026 07:30:00").getTime();
function pad(n) { return String(n).padStart(2, "0"); }

function tick() {
  const diff = weddingDate - Date.now();
  if (diff <= 0) {
    ["days","hours","minutes","seconds"].forEach(id => {
      document.getElementById(id).textContent = "00";
    });
    return;
  }
  document.getElementById("days").textContent    = pad(Math.floor(diff / 86400000));
  document.getElementById("hours").textContent   = pad(Math.floor((diff % 86400000) / 3600000));
  document.getElementById("minutes").textContent = pad(Math.floor((diff % 3600000) / 60000));
  document.getElementById("seconds").textContent = pad(Math.floor((diff % 60000) / 1000));
}
tick();
setInterval(tick, 1000);

// ── FIREFLIES (Canvas) ───────────────────────────────────
const canvas = document.getElementById("fireflies");
const ctx    = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas, { passive: true });

const NUM_FF = 38;
const fireflies = [];

for (let i = 0; i < NUM_FF; i++) {
  fireflies.push({
    x:     Math.random() * window.innerWidth,
    y:     Math.random() * window.innerHeight,
    r:     1 + Math.random() * 2,
    vx:    (Math.random() - 0.5) * 0.4,
    vy:    (Math.random() - 0.5) * 0.4,
    pulse: Math.random() * Math.PI * 2,
    pulseS: 0.01 + Math.random() * 0.02,
    // Mostly sage-green, some gold, few blush
    hue:   Math.random() < 0.6 ? "sage" : (Math.random() < 0.7 ? "gold" : "blush"),
  });
}

function getColor(ff, alpha) {
  if (ff.hue === "sage")  return `rgba(122,171,138,${alpha})`;
  if (ff.hue === "gold")  return `rgba(212,168,83,${alpha})`;
  return `rgba(242,196,206,${alpha})`;
}

function animateFF() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fireflies.forEach(ff => {
    ff.pulse += ff.pulseS;
    ff.x += ff.vx + Math.sin(ff.pulse * 0.7) * 0.2;
    ff.y += ff.vy + Math.cos(ff.pulse * 0.5) * 0.15;

    // Wrap around edges
    if (ff.x < -10) ff.x = canvas.width + 10;
    if (ff.x > canvas.width + 10) ff.x = -10;
    if (ff.y < -10) ff.y = canvas.height + 10;
    if (ff.y > canvas.height + 10) ff.y = -10;

    const glowAlpha = 0.25 + Math.sin(ff.pulse) * 0.2;
    const coreAlpha = 0.5 + Math.sin(ff.pulse) * 0.4;

    // Outer glow
    const grd = ctx.createRadialGradient(ff.x, ff.y, 0, ff.x, ff.y, ff.r * 6);
    grd.addColorStop(0, getColor(ff, glowAlpha * 0.8));
    grd.addColorStop(1, getColor(ff, 0));
    ctx.beginPath();
    ctx.arc(ff.x, ff.y, ff.r * 6, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // Core dot
    ctx.beginPath();
    ctx.arc(ff.x, ff.y, ff.r, 0, Math.PI * 2);
    ctx.fillStyle = getColor(ff, coreAlpha);
    ctx.fill();
  });
  requestAnimationFrame(animateFF);
}
animateFF();

// ── GALLERY ───────────────────────────────────────────────
let gCurrent = 0;
const gSlides = document.querySelectorAll(".gallery-slide");
const gDots   = document.querySelectorAll(".gdot");

function gGoTo(n) {
  gSlides[gCurrent].classList.remove("active");
  gDots[gCurrent].classList.remove("active");
  gCurrent = (n + gSlides.length) % gSlides.length;
  gSlides[gCurrent].classList.add("active");
  gDots[gCurrent].classList.add("active");
}

let gTimer = setInterval(() => gGoTo(gCurrent + 1), 4800);

document.getElementById("galleryNext")?.addEventListener("click", () => {
  clearInterval(gTimer);
  gGoTo(gCurrent + 1);
  gTimer = setInterval(() => gGoTo(gCurrent + 1), 4800);
});
document.getElementById("galleryPrev")?.addEventListener("click", () => {
  clearInterval(gTimer);
  gGoTo(gCurrent - 1);
  gTimer = setInterval(() => gGoTo(gCurrent + 1), 4800);
});
gDots.forEach(dot => {
  dot.addEventListener("click", () => {
    clearInterval(gTimer);
    gGoTo(parseInt(dot.dataset.index));
    gTimer = setInterval(() => gGoTo(gCurrent + 1), 4800);
  });
});

// ── MUSIC ─────────────────────────────────────────────────
const music     = document.getElementById("bg-music");
const musicBtn  = document.getElementById("music-btn");
const iconPlay  = document.getElementById("icon-play");
const iconPause = document.getElementById("icon-pause");

function syncIcon() {
  iconPlay.style.display  = music.paused ? "block" : "none";
  iconPause.style.display = music.paused ? "none"  : "block";
}

window.addEventListener("load", () => {
  music.play().then(syncIcon).catch(() => {
    syncIcon();
    const go = () => { music.play().then(syncIcon); document.removeEventListener("click", go); };
    document.addEventListener("click", go);
  });
});

musicBtn.addEventListener("click", e => {
  e.stopPropagation();
  music.paused ? music.play().then(syncIcon) : (music.pause(), syncIcon());
});

// ── SUBTLE PARALLAX ───────────────────────────────────────
window.addEventListener("scroll", () => {
  const sy = window.scrollY;
  const moon = document.querySelector(".moon");
  if (moon) moon.style.transform = `translateX(-50%) translateY(${sy * 0.15}px)`;
  const corners = document.querySelectorAll(".corner-art");
  corners.forEach(c => {
    c.style.transform = `translateY(${sy * 0.08}px)`;
  });
}, { passive: true });
