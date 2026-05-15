// ---------- cursor sparkle trail ----------
{
  const SPARKLE_GIFS = ["star.gif", "star2.gif", "star3.gif", "star4.gif"];
  const SPAWN_MS = 100;
  const LIFE_MS = 700;
  const MAX_LIVE = 8;
  let lastSpawn = 0;
  let live = 0;
  window.addEventListener("mousemove", (e) => {
    const now = performance.now();
    if (now - lastSpawn < SPAWN_MS || live >= MAX_LIVE) return;
    lastSpawn = now;
    live++;
    const s = document.createElement("img");
    s.src = SPARKLE_GIFS[(Math.random() * SPARKLE_GIFS.length) | 0];
    s.className = "cursor-sparkle";
    s.style.left = e.clientX + "px";
    s.style.top = e.clientY + "px";
    s.style.setProperty("--sox", `${(Math.random() - 0.5) * 24}px`);
    s.style.setProperty("--soy", `${8 + Math.random() * 16}px`);
    document.body.appendChild(s);
    setTimeout(() => { s.remove(); live--; }, LIFE_MS);
  });
}

// ---------- footer: fill with a grid of link spam ----------
{
  const footer = document.getElementById("learn-more-footer");
  if (footer) {
    const TOTAL = 120;
    const FIGMA_URL = "https://www.figma.com/design/GRIYFsLTRHhgq3EYTxBkFH/Abnormal-Mfers?node-id=57-9&t=ACEPgHhcc7YzueAN-1";
    // half "Learn more" → opensea, half "See More" → Figma, shuffled for chaos
    const entries = [];
    for (let i = 0; i < TOTAL; i++) {
      if (i < TOTAL / 2) {
        entries.push({ text: "Learn more", href: "https://docs.abnormalmfers.com/" });
      } else {
        entries.push({ text: "See More", href: FIGMA_URL });
      }
    }
    entries.sort(() => Math.random() - 0.5);
    const frag = document.createDocumentFragment();
    for (const e of entries) {
      const a = document.createElement("a");
      a.href = e.href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = e.text;
      frag.appendChild(a);
    }
    footer.appendChild(frag);
  }
}

// ---------- floating gifs ----------
const FLOATERS = [
  { src: "star.gif",     size: [24, 48] },
  { src: "star2.gif",    size: [30, 66] },
  { src: "star3.gif",    size: [24, 48] },
  { src: "star4.gif",    size: [24, 48] },
  { src: "smiley.gif",   size: [36, 66] },
  { src: "diamond1.gif", size: [30, 60] },
  { src: "diamond2.gif", size: [30, 60] },
  { src: "fire1.gif",    size: [36, 70] },
  { src: "tv.gif",       size: [40, 80] },
  { src: "globe.gif",    size: [40, 80] },
  { src: "money1.gif",   size: [40, 80] },
  { src: "pikachu.gif",  size: [40, 80] },
  { src: "windows.gif",  size: [40, 80] },
  { src: "dice.gif",     size: [40, 80] },
];

// Counts: was 14 types × 2 copies = 28 on home. 20% less = 22.
// Section 2 now matches at 22 with the full variety (not just star2).
const HOME_FLOATER_COUNT = 22;
const SECTION2_FLOATER_COUNT = 12;

const layer = document.getElementById("float-layer");

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function spawnGifs(count) {
  layer.innerHTML = "";
  const isMobile = window.innerWidth < 640;
  const sizeMult = isMobile ? 0.55 : 1;
  const adjustedCount = isMobile ? Math.round(count * 0.5) : count;
  const pool = FLOATERS.slice().sort(() => Math.random() - 0.5);
  for (let i = 0; i < adjustedCount; i++) {
    const { src, size } = pool[i % pool.length];
    const img = document.createElement("img");
    img.src = src;
    img.className = "floater";
    const s = rand(size[0], size[1]) * sizeMult;
    img.style.width = `${s}px`;
    img.style.height = "auto";
    img.style.left = `${rand(2, 92)}vw`;
    img.style.top = `${rand(2, 88)}vh`;
    img.style.setProperty("--dur", `${rand(4, 9)}s`);
    img.style.setProperty("--delay", `${rand(0, 4)}s`);
    img.style.transform = `rotate(${rand(-12, 12)}deg)`;
    layer.appendChild(img);
  }
}

function spawnFloaters() {
  spawnGifs(HOME_FLOATER_COUNT);
}

let inSection2 = false;
spawnFloaters();
window.addEventListener("resize", () => {
  if (inSection2) spawnSection2Stars();
  else spawnFloaters();
});

// ---------- explosion on ENTER ----------
const enterBtn = document.getElementById("enter-btn");
const stage = document.getElementById("stage");

function explode() {
  // collect every visible piece: logo, framed gif, enter btn, floaters
  const pieces = [
    document.querySelector(".logo"),
    document.querySelector(".home-frame"),
    document.getElementById("enter-btn"),
    ...document.querySelectorAll(".floater"),
  ].filter(Boolean);

  pieces.forEach((el) => {
    const tx = rand(-window.innerWidth, window.innerWidth);
    const ty = rand(-window.innerHeight, window.innerHeight);
    const tr = `${rand(-720, 720)}deg`;
    el.style.setProperty("--tx", `${tx}px`);
    el.style.setProperty("--ty", `${ty}px`);
    el.style.setProperty("--tr", tr);
    el.classList.add("exploding");
  });

  // after explosion settles: unlock scroll, hide NEW banner, scroll down,
  // then once at section 2 remove the stage entirely so you can't scroll back.
  setTimeout(() => {
    document.body.classList.remove("locked");
    document.getElementById("new-banner")?.classList.add("hidden");
    const next = document.getElementById("section-2");
    if (next) next.scrollIntoView({ behavior: "smooth", block: "start" });

    // Smooth scroll ~500-700ms; wait it out, then drop the stage + spawn stars.
    setTimeout(() => {
      stage.classList.add("gone");
      window.scrollTo({ top: 0, behavior: "auto" });
      inSection2 = true;
      spawnSection2Stars();
      setTimeout(revealDnp, 4000);
    }, 800);
  }, 900);
}

// ---------- section 4: trait sticker chaos ----------
const TRAITS = [
  "Layer_32 1.png","Layer_32-1 3 1.png","Layer_32-2 3 1.png","Layer_32-4 2 2.png","MNGA 1.png",
  "bama 1.png","bandana 1.png","bateman 1.png","beanie 1.png","big_blue 1.png",
  "big_boy 1.png","big_green 1.png","big_hat 1.png","big_jean 1.png","bill 1.png",
  "black_hoodie 1.png","black_tee 1.png","black_tie 1.png","bleached_tips 1.png","blue_bucket 1.png",
  "blue_cap 1.png","bomber 1.png","bowl_cut 1.png","bravo 1.png","chad 1.png",
  "chain 1.png","cool_guy 1.png","cubano 1.png","cursor_crown 1.png","dark_hoodie 1.png",
  "dexter 1.png","disco_stu 1.png","dishevled_wojak 1.png","dreads 1.png","esse 1.png",
  "fat_eastern_european 1.png","fat_fisher 1.png","full_metal_jacket 1.png","green_hat 1.png","green_tips 1.png",
  "headband 1.png","hipster 1.png","holy_halo 1.png","jean_jacket 1.png","jordan 1.png",
  "layers 1.png","luigi 1.png","mario 1.png","matrix 1.png","merlin 1.png",
  "mickey 1.png","music 1.png","mustaaaaaaard 1.png","nerd 1.png","padres 1.png",
  "perry 1.png","phones 1.png","pollak_hair 1.png","potato_head 1.png","punk 2.png",
  "rugby_shirt 1.png","runes_crown 1.png","saudi 1.png","shaq 1.png","shy_guy 1.png",
  "skater 1.png","skull 1.png","smart_wojak 1.png","smol_cap 1.png","smol_merlin 1.png",
  "speedster 1.png","suit 1.png","sweater 1.png","tee 1.png","the_hut 1.png",
  "the_wolf 1.png","track_suit 1.png","turtleneck 1.png","ur_drug_dealer 1.png","vaca 1.png",
  "waldo 1.png","wife_beater 1.png","wizard 1.png","y2k 1.png","y2k_headphones 1.png","yellow 5.png",
];

const s4Stage = document.getElementById("s4-stage");
let s4Spawned = false;

function spawnTraits() {
  if (s4Spawned) return;
  s4Spawned = true;

  const isMobile = window.innerWidth < 640;
  // On mobile, use ~a quarter of the traits so the pile is light and tight.
  const pool = isMobile
    ? TRAITS.slice().sort(() => Math.random() - 0.5).slice(0, Math.ceil(TRAITS.length / 4))
    : TRAITS;

  // Shuffle so the order of appearance feels random.
  const order = pool.slice().sort(() => Math.random() - 0.5);

  order.forEach((file, i) => {
    const wrap = document.createElement("div");
    wrap.className = "trait-wrap";

    const img = document.createElement("img");
    img.src = `traits/${encodeURIComponent(file)}?v=2`;
    img.className = "trait";

    const size = isMobile ? 68 : 120;
    img.style.width = `${size}px`;
    img.style.height = "auto";

    // cluster sits just left of viewport center; frame is just right of it.
    const cx = 35;
    const cy = isMobile ? 6 : 32; // higher in section 4 on mobile so the gap closes
    const spreadX = isMobile ? 18 : 12;
    const spreadY = isMobile ? 4 : 20; // very tight vertical band on mobile
    const bx = ((Math.random() + Math.random()) / 2 - 0.5) * 2;
    const by = ((Math.random() + Math.random()) / 2 - 0.5) * 2;
    wrap.style.left = `calc(${cx + bx * spreadX}vw - ${size / 2}px)`;
    wrap.style.top = `${cy + by * spreadY}vh`;
    wrap.style.zIndex = String(Math.floor(rand(1, 100)));

    const rot = rand(-22, 22);
    img.style.setProperty("--end-transform", `rotate(${rot}deg)`);
    img.style.animationDelay = `${i * 0.03}s`;

    wrap.appendChild(img);
    s4Stage.appendChild(wrap);
  });

  startStickerPhysics();
}

// ---------- mouse bump physics ----------
let mouseX = -9999, mouseY = -9999;
let physicsRunning = false;

let physicsActive = false; // ticks only while section 4 is visible
function startStickerPhysics() {
  if (physicsRunning) return;
  physicsRunning = true;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    mouseX = -9999;
    mouseY = -9999;
  });

  // Only tick when section 4 is in view — getBoundingClientRect × 86 each frame
  // is the most expensive loop on the page.
  const s4 = document.getElementById("section-4");
  if (s4 && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const wasActive = physicsActive;
          physicsActive = e.isIntersecting;
          if (physicsActive && !wasActive) requestAnimationFrame(tick);
        }
      },
      { threshold: 0 },
    );
    io.observe(s4);
  } else {
    physicsActive = true;
    requestAnimationFrame(tick);
  }

  const RADIUS = 110;
  const MAX_PUSH = 22;

  function tick() {
    if (!physicsActive) return; // pause loop when offscreen
    const wraps = s4Stage.querySelectorAll(".trait-wrap");
    wraps.forEach((wrap) => {
      const rect = wrap.getBoundingClientRect();
      const wcx = rect.left + rect.width / 2;
      const wcy = rect.top + rect.height / 2;
      const dx = wcx - mouseX;
      const dy = wcy - mouseY;
      const dist = Math.hypot(dx, dy);
      if (dist < RADIUS && dist > 0) {
        const strength = (1 - dist / RADIUS);
        const push = strength * MAX_PUSH;
        const nx = (dx / dist) * push;
        const ny = (dy / dist) * push;
        wrap.style.setProperty("--bx", `${nx}px`);
        wrap.style.setProperty("--by", `${ny}px`);
      } else {
        wrap.style.setProperty("--bx", `0px`);
        wrap.style.setProperty("--by", `0px`);
      }
    });
    requestAnimationFrame(tick);
  }
}

const section4 = document.getElementById("section-4");
if (section4 && "IntersectionObserver" in window) {
  const io4 = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          spawnTraits();
          startPictureCycle();
          io4.disconnect();
        }
      }
    },
    { threshold: 0.15 },
  );
  io4.observe(section4);
}

// ---------- picture frame cycler ----------
const PICTURE_FILES = [
  "HAeuPm9WwAAFqC_.jpeg","HB7st2OWsAAg67q.jpeg","HBXuFtebcAIDW8b.jpeg","HCManKaXsAA3U_C.jpeg","HDTrFNZWsAA7plO.jpeg",
  "HG13bPgbMAE33v9.jpeg","HG6xH_DaIAAk4Xx.jpeg","HGD4nReX0AAWtJM.jpeg","HGHLexQaIAA0T8b.jpeg","HGRIXg7WwAA3sGU.jpeg",
  "HGnulnOXUAAcEX-.jpeg","HGrMsqmXwAAdeUX.jpeg","HGxPl7MagAASLpI.jpeg","HH9fJqLXAAI15N8.jpeg","HHUQoS3W0AA8JEy.jpeg",
  "HHZXOOvXsAAvZzj.jpeg","HHenb3aWAAAKEY0.jpeg","HHkJpygXcAIgxJI.jpeg","HHo2PHXXkAI4x9E.jpeg","HHuu6OsXkAk9BH5.jpeg",
  "HIDMo6FXwAAmpaS.jpeg","HIM26ANWYAEX_DM.jpeg","HIM280lWUAAGXlv.jpeg","HIM3RvwWEAAPZWq.jpeg","HIM607XWUAAdMPp.jpeg",
  "mfer_4774 1.png","mfer_4775 1.png","mfer_4781 1.png","mfer_4784 1.png","mfer_4785 1.png",
  "mfer_4786 1.png","mfer_4788 1.png","mfer_4792 1.png","mfer_4798 1.png","mfer_4864 1.png",
  "mfer_4865 1.png","mfer_4867 1.png","mfer_4868 1.png","mfer_4869 1.png","mfer_4885 1.png",
  "mfer_4888 1.png","mfer_4891 1.png","mfer_4892 1.png","mfer_4894 1.png","mfer_4896 1.png",
  "mfer_4904 1.png",
];
const PICTURE_PATHS = PICTURE_FILES.map(
  (f) => `traits/picture/${encodeURIComponent(f)}`,
);

let pictureCycleStarted = false;
function startPictureCycle() {
  if (pictureCycleStarted) return;
  pictureCycleStarted = true;

  // Defer preload until 2s after start so it doesn't compete with initial render.
  setTimeout(() => {
    PICTURE_PATHS.forEach((p) => {
      const im = new Image();
      im.src = p;
    });
  }, 2000);

  // auto-cycle only the .auto-cycle ones (e.g. home page).
  const autoImgs = document.querySelectorAll(".auto-cycle");
  if (autoImgs.length > 0) {
    let i = 0;
    autoImgs.forEach((el) => (el.src = PICTURE_PATHS[0]));
    setInterval(() => {
      i = (i + 1) % PICTURE_PATHS.length;
      autoImgs.forEach((el) => (el.src = PICTURE_PATHS[i]));
    }, 90);
  }

  // section 4 frame: static, advances manually via the GENERATE button.
  const s4Img = document.getElementById("s4-cycle");
  const genBtn = document.getElementById("s4-generate");
  const buildBtn = document.getElementById("s4-build");
  const buildOverlay = document.getElementById("s4-build-overlay");
  const frameEl = document.querySelector(".s4-frame");
  let idx = Math.floor(Math.random() * PICTURE_PATHS.length);
  let buildMode = false;

  function setFrameToCycle() {
    buildMode = false;
    buildBtn?.classList.remove("active");
    buildOverlay?.classList.remove("active");
    if (buildOverlay) buildOverlay.innerHTML = "";
    if (s4Img) s4Img.src = PICTURE_PATHS[idx];
  }
  function setFrameToBuild() {
    buildMode = true;
    buildBtn?.classList.add("active");
    buildOverlay?.classList.add("active");
    if (s4Img) s4Img.src = "normalguy.png";
  }

  if (s4Img && genBtn) {
    s4Img.src = PICTURE_PATHS[idx];
    genBtn.addEventListener("click", () => {
      // GENERATE exits build mode and advances the cycle.
      idx = (idx + 1) % PICTURE_PATHS.length;
      setFrameToCycle();
    });
  }

  if (buildBtn) {
    buildBtn.addEventListener("click", () => {
      if (buildMode) {
        // Toggle off: clear placed traits but keep normalguy showing.
        if (buildOverlay) buildOverlay.innerHTML = "";
      } else {
        setFrameToBuild();
      }
    });
  }

  // Drag-and-drop: any trait can be dragged in build mode and dropped on the frame.
  if (frameEl && buildOverlay) {
    let drag = null;

    function startDrag(traitImg, ev) {
      if (!buildMode) return;
      ev.preventDefault();
      const clone = document.createElement("img");
      clone.src = traitImg.src;
      clone.className = "trait-drag-clone";
      clone.style.left = ev.clientX + "px";
      clone.style.top = ev.clientY + "px";
      document.body.appendChild(clone);
      drag = { clone, src: traitImg.src };
      window.addEventListener("pointermove", onDragMove);
      window.addEventListener("pointerup", onDragEnd, { once: true });
    }

    function onDragMove(ev) {
      if (!drag) return;
      drag.clone.style.left = ev.clientX + "px";
      drag.clone.style.top = ev.clientY + "px";
    }

    function onDragEnd(ev) {
      if (!drag) return;
      const r = frameEl.getBoundingClientRect();
      const inside =
        ev.clientX >= r.left && ev.clientX <= r.right &&
        ev.clientY >= r.top && ev.clientY <= r.bottom;
      if (inside) {
        const overlayRect = buildOverlay.getBoundingClientRect();
        const placed = document.createElement("img");
        placed.src = drag.src;
        placed.className = "trait-placed";
        // size in px so we can center on cursor
        const sizePx = overlayRect.width * 0.6;
        placed.style.width = sizePx + "px";
        placed.style.left = (ev.clientX - overlayRect.left - sizePx / 2) + "px";
        placed.style.top = (ev.clientY - overlayRect.top - sizePx / 2) + "px";
        buildOverlay.appendChild(placed);
      }
      drag.clone.remove();
      window.removeEventListener("pointermove", onDragMove);
      drag = null;
    }

    // Event delegation on the sticker stage so we catch all 86 traits
    // (including ones that haven't been added yet at script-load time).
    s4Stage.addEventListener("pointerdown", (ev) => {
      const t = ev.target.closest(".trait");
      if (t) startDrag(t, ev);
    });
  }
}

// start the picture cycle immediately so the home-page frame is live on load
startPictureCycle();

function spawnSection2Stars() {
  spawnGifs(SECTION2_FLOATER_COUNT);
}

enterBtn.addEventListener("click", (e) => {
  e.preventDefault();
  // guard against double-clicks during the animation
  if (enterBtn.dataset.fired === "1") return;
  enterBtn.dataset.fired = "1";
  explode();
});

// ---------- section 2: trigger element appear animations on first reveal ----------
{
  const s2 = document.getElementById("section-2");
  if (s2 && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            s2.classList.add("in-view");
            io.disconnect();
          }
        }
      },
      { threshold: 0.15 },
    );
    io.observe(s2);
  }
}

// ---------- typewriter effect for section 2 + section 3 text boxes ----------
function setupTypewriter(el, sectionEl, delayMs, speedMs) {
  if (!el || !sectionEl || !("IntersectionObserver" in window)) return;
  const full = el.textContent.trim().replace(/\s+/g, " ");
  // Lock the final rendered height first so layout doesn't jitter while typing.
  el.style.minHeight = el.offsetHeight + "px";
  el.textContent = "";

  let played = false;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !played) {
          played = true;
          setTimeout(() => {
            let i = 0;
            (function tick() {
              if (i < full.length) {
                el.textContent = full.slice(0, ++i);
                setTimeout(tick, speedMs);
              }
            })();
          }, delayMs);
          io.disconnect();
        }
      }
    },
    { threshold: 0.2 },
  );
  io.observe(sectionEl);
}

setupTypewriter(
  document.querySelector(".concentric-content .s2-text"),
  document.getElementById("section-2"),
  1400, // wait for concentric box pop-in to settle
  13,
);
setupTypewriter(
  document.querySelector("#section-3 .s2-text"),
  document.getElementById("section-3"),
  400,
  13,
);

// ---------- section 3: real 3D sphere face that tracks the mouse ----------
const faceContainer = document.getElementById("s3-face");
if (faceContainer && window.THREE) {
  const THREE = window.THREE;

  // build the face texture on a 2D canvas (equirectangular-mapped)
  const TX_W = 1024, TX_H = 512;
  const txCanvas = document.createElement("canvas");
  txCanvas.width = TX_W; txCanvas.height = TX_H;
  const tctx = txCanvas.getContext("2d");
  tctx.fillStyle = "#ffffff";
  tctx.fillRect(0, 0, TX_W, TX_H);

  // Eyes — slightly above texture equator, equidistant from center.
  tctx.fillStyle = "#000000";
  const eyeY = 235;
  const eyeRx = 18, eyeRy = 28;
  tctx.beginPath();
  tctx.ellipse(478, eyeY, eyeRx, eyeRy, 0, 0, Math.PI * 2);
  tctx.fill();
  tctx.beginPath();
  tctx.ellipse(560, eyeY, eyeRx, eyeRy, 0, 0, Math.PI * 2);
  tctx.fill();

  // Flat mouth — short horizontal line below the eyes.
  tctx.strokeStyle = "#000000";
  tctx.lineWidth = 9;
  tctx.lineCap = "round";
  tctx.beginPath();
  tctx.moveTo(495, 320);
  tctx.lineTo(545, 320);
  tctx.stroke();

  const tex = new THREE.CanvasTexture(txCanvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;

  const scene = new THREE.Scene();

  const W0 = faceContainer.clientWidth || 420;
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
  camera.position.set(0, 0, 3.6);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W0, W0, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  faceContainer.appendChild(renderer.domElement);

  const geo = new THREE.SphereGeometry(1, 96, 96);
  // Default UV mapping puts the texture's center (u=0.5) on +X (the right side).
  // Rotate the geometry -90° around Y so that lands on +Z (front, toward camera).
  geo.rotateY(-Math.PI / 2);
  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.45,
    metalness: 0,
  });
  const sphere = new THREE.Mesh(geo, mat);

  // Cartoon outline as a child of the sphere mesh so it follows along.
  const outlineGeo = new THREE.SphereGeometry(1.04, 96, 96);
  const outlineMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.BackSide,
  });
  const outline = new THREE.Mesh(outlineGeo, outlineMat);
  sphere.add(outline);

  // Group holds the roll-in animation (slide + spin) so it doesn't
  // fight with the per-mesh mouse-tracking yaw/pitch.
  const sphereGroup = new THREE.Group();
  sphereGroup.add(sphere);
  scene.add(sphereGroup);

  // Brighter lighting overall.
  scene.add(new THREE.AmbientLight(0xffffff, 0.95));
  const key = new THREE.DirectionalLight(0xffffff, 1.35);
  key.position.set(-2.2, 2.0, 3.0);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.55);
  fill.position.set(2.5, -1.0, 1.5);
  scene.add(fill);

  // Mouse-tracked rotation targets.
  let targetYaw = 0, targetPitch = 0;
  window.addEventListener("mousemove", (e) => {
    const rect = renderer.domElement.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    // normalize by half the viewport so corners of the screen reach near max.
    const nx = (e.clientX - cx) / (window.innerWidth * 0.5);
    const ny = (e.clientY - cy) / (window.innerHeight * 0.5);
    const MAX = 0.7; // ~40 degrees max rotation each axis
    targetYaw = Math.max(-MAX, Math.min(MAX, nx * MAX));
    targetPitch = Math.max(-MAX, Math.min(MAX, ny * MAX));
  });

  function resizeFace() {
    const w = faceContainer.clientWidth;
    if (w > 0) renderer.setSize(w, w, false);
  }
  window.addEventListener("resize", resizeFace);

  // Roll-in: starts off-screen right, slides + spins into place when
  // section 3 enters the viewport.
  const ROLL_START_X = 5;
  const ROLL_DURATION_MS = 1100;
  const ROLL_SPINS = 2;
  let rollState = "pending"; // pending → rolling → done
  let rollStartedAt = 0;
  sphereGroup.position.x = ROLL_START_X;
  sphereGroup.rotation.y = ROLL_SPINS * Math.PI * 2;

  const section3El = document.getElementById("section-3");
  if (section3El && "IntersectionObserver" in window) {
    const io3 = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && rollState === "pending") {
            rollState = "rolling";
            rollStartedAt = performance.now();
            io3.disconnect();
          }
        }
      },
      { threshold: 0.25 },
    );
    io3.observe(section3El);
  } else {
    // No observer support — just start the roll immediately.
    rollState = "rolling";
    rollStartedAt = performance.now();
  }

  // Only render while section 3 is in view.
  let faceActive = false;
  if (section3El && "IntersectionObserver" in window) {
    const ioFace = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const wasActive = faceActive;
          faceActive = e.isIntersecting;
          if (faceActive && !wasActive) requestAnimationFrame(faceTick);
        }
      },
      { threshold: 0 },
    );
    ioFace.observe(section3El);
  } else {
    faceActive = true;
    requestAnimationFrame(faceTick);
  }

  function faceTick() {
    if (!faceActive) return;
    if (rollState === "rolling") {
      const t = Math.min(1, (performance.now() - rollStartedAt) / ROLL_DURATION_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      sphereGroup.position.x = ROLL_START_X * (1 - eased);
      sphereGroup.rotation.y = ROLL_SPINS * Math.PI * 2 * (1 - eased);
      if (t >= 1) {
        sphereGroup.position.x = 0;
        sphereGroup.rotation.y = 0;
        rollState = "done";
      }
    }
    sphere.rotation.y += (targetYaw - sphere.rotation.y) * 0.12;
    sphere.rotation.x += (targetPitch - sphere.rotation.x) * 0.12;
    renderer.render(scene, camera);
    requestAnimationFrame(faceTick);
  }
}

// ---------- DO NOT PRESS button: wandering + reload on click ----------
const dnp = document.getElementById("do-not-press");
let dnpRevealed = false;

function wanderDnp() {
  if (!dnp || !dnpRevealed) return;
  const SIZE = window.innerWidth < 640 ? 48 : 60;
  const x = rand(8, window.innerWidth - SIZE - 8);
  const y = rand(8, window.innerHeight - SIZE - 8);
  dnp.style.setProperty("--dnp-x", `${x}px`);
  dnp.style.setProperty("--dnp-y", `${y}px`);
}

function revealDnp() {
  if (!dnp || dnpRevealed) return;
  dnpRevealed = true;
  dnp.classList.add("revealed");
  // kick off the first wander on the next frame so opacity transition can settle
  requestAnimationFrame(wanderDnp);
}

if (dnp) {
  dnp.addEventListener("transitionend", (e) => {
    // only re-wander on the transform transition, not opacity
    if (e.propertyName === "transform") wanderDnp();
  });
  dnp.addEventListener("click", () => {
    const overlay = document.createElement("div");
    overlay.id = "nooo-overlay";
    const text = document.createElement("div");
    text.className = "nooo-text";
    text.textContent = "N";
    overlay.appendChild(text);
    document.body.appendChild(overlay);

    const TOTAL_OS = 32;
    const STEP_MS = 28;
    const HOLD_MS = 200;
    const GLITCH_MS = 550;
    let i = 0;
    const typeInterval = setInterval(() => {
      text.textContent += "O";
      i++;
      if (i >= TOTAL_OS) clearInterval(typeInterval);
    }, STEP_MS);

    const typedAt = TOTAL_OS * STEP_MS;
    // brief hold, then trigger the pixelated glitch meltdown, then reload
    setTimeout(() => overlay.classList.add("glitching"), typedAt + HOLD_MS);
    setTimeout(() => window.location.reload(), typedAt + HOLD_MS + GLITCH_MS);
  });
}

