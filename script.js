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

// how many of each gif to spawn
const COPIES_PER_GIF = 2;

const layer = document.getElementById("float-layer");

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function spawnFloaters() {
  layer.innerHTML = "";
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  FLOATERS.forEach(({ src, size }) => {
    for (let i = 0; i < COPIES_PER_GIF; i++) {
      const img = document.createElement("img");
      img.src = src;
      img.className = "floater";

      const s = rand(size[0], size[1]);
      img.style.width = `${s}px`;
      img.style.height = "auto";

      // random position, keep away from extreme edges
      img.style.left = `${rand(2, 92)}vw`;
      img.style.top  = `${rand(2, 88)}vh`;

      // randomize drift duration + delay so each one feels independent
      img.style.setProperty("--dur",   `${rand(4, 9)}s`);
      img.style.setProperty("--delay", `${rand(0, 4)}s`);

      // a tiny base rotation for variety
      img.style.transform = `rotate(${rand(-12, 12)}deg)`;

      layer.appendChild(img);
    }
  });
}

spawnFloaters();
window.addEventListener("resize", spawnFloaters);

// ---------- explosion on ENTER ----------
const enterBtn = document.getElementById("enter-btn");
const stage = document.getElementById("stage");

function explode() {
  // collect every visible piece: characters, logo, welcome box, enter btn, floaters
  const pieces = [
    ...document.querySelectorAll(".char-group"),
    document.querySelector(".logo"),
    document.querySelector(".welcome-box"),
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

  // after explosion, reset
  setTimeout(reset, 1100);
}

function reset() {
  // remove explosion classes + inline transforms
  document.querySelectorAll(".exploding").forEach((el) => {
    el.classList.remove("exploding");
    el.style.removeProperty("--tx");
    el.style.removeProperty("--ty");
    el.style.removeProperty("--tr");
  });
  // respawn floaters in new random positions
  spawnFloaters();
}

enterBtn.addEventListener("click", (e) => {
  e.preventDefault();
  explode();
});
