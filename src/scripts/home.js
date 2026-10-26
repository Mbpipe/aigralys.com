// Home de agentes: consola compartida, hero y demos de cada caso.
// Los textos llegan en #i18n; el visor 3D de Bancor se carga aparte, cuando se acerca.

const T = JSON.parse(document.getElementById("i18n").textContent);
const LOC = T.lang === "en" ? "en-US" : "es-AR";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (n) => new Intl.NumberFormat(LOC).format(Math.round(n));
const dec = (n, d = 1) => n.toLocaleString(LOC, { minimumFractionDigits: d, maximumFractionDigits: d });
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const F = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => (o[k] ?? ""));
// Minúsculas y sin tildes, para entender pedidos escritos de cualquier forma.
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
// "40 mil", "40k", "40.000", "40,000", "4500" -> número
const parseNum = (t) => {
  const m = t.match(/(?<![a-z\d])(\d{1,3}(?:[.,]\d{3})+|\d+(?:[.,]\d+)?)\s*(mil|k|thousand)?(?![a-z\d])/);
  if (!m) return null;
  let n = /^\d{1,3}([.,]\d{3})+$/.test(m[1]) ? +m[1].replace(/[.,]/g, "") : +m[1].replace(",", ".");
  if (m[2]) n *= 1000;
  return n;
};
const HELP = /que (podes|sabes|haces|puedo)|ayuda|opciones|\bhelp\b|what can (you|i)|options/;
const onScreen = (el, cb, threshold = 0.05) => new IntersectionObserver(([e]) => cb(e.isIntersecting), { threshold }).observe(el);
const sizeCanvas = (c) => {
  const r = c.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
  if (c.width !== Math.round(r.width * d) || c.height !== Math.round(r.height * d)) { c.width = Math.round(r.width * d); c.height = Math.round(r.height * d); }
  const x = c.getContext("2d"); x.setTransform(d, 0, 0, d, 0, 0);
  return [x, r.width, r.height];
};
const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const flash = (el) => { el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); };
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Lleva el pedido que la demo no supo resolver al formulario de contacto.
function toLead(caseName, q) {
  const ta = document.getElementById("lead-msg");
  ta.value = F(T.agent.prefill, { name: caseName, q });
  const demo = document.querySelector("[data-demo]");
  if (demo) demo.value = caseName;
  document.getElementById("contacto").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  setTimeout(() => ta.focus({ preventScroll: true }), 700);
}

// ---------- Consola de agente compartida ----------
export function makeAgent(section, actions, opt = {}) {
  const root = section.querySelector(".console");
  const log = root.querySelector(".c-log");
  const form = root.querySelector(".c-input");
  const input = form.querySelector("input");
  const chips = root.querySelector(".chips");
  const st = { busy: false, auto: !reduce, visible: false, pending: null };
  input.placeholder = opt.placeholder || "";
  const add = (cls, content, asText) => {
    const p = document.createElement("p");
    p.className = cls;
    if (asText) p.textContent = content; else p.innerHTML = content;
    log.append(p);
    while (log.children.length > 6) log.firstElementChild.remove();
  };
  async function perform(a, typed) {
    st.busy = true;
    if (typed) {
      for (let i = 0; i <= a.ask.length; i++) {
        if (!st.auto) { st.busy = false; return next(); }
        input.value = a.ask.slice(0, i);
        await sleep(22 + Math.random() * 28);
      }
      await sleep(260);
      if (!st.auto) { st.busy = false; return next(); }
      input.value = "";
    }
    add("msg-u", a.ask, true);
    await sleep(380);
    await a.run.call(a);
    const steps = typeof a.steps === "function" ? a.steps() : a.steps;
    for (const s of steps) { add("msg-a", `<span class="ok">✓</span><span>${s}</span>`); await sleep(340); }
    st.busy = false;
    next();
  }
  function next() {
    if (st.pending) { const p = st.pending; st.pending = null; perform(p, false); }
  }
  const queue = (a) => { st.auto = false; if (st.busy) st.pending = a; else perform(a, false); };
  actions.forEach((a) => {
    const b = document.createElement("button");
    b.className = "chip"; b.type = "button"; b.textContent = a.chip;
    b.addEventListener("click", () => queue(a));
    chips.append(b);
  });

  // Pedido escrito a mano
  input.addEventListener("focus", () => { if (st.auto) { st.auto = false; input.value = ""; } });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim().slice(0, 400);
    if (!text) return;
    input.value = "";
    const t = norm(text);
    let a = null;
    if (HELP.test(t)) a = { run: () => {}, steps: [F(T.agent.help, { list: actions.map((x) => x.chip.toLowerCase()).join(", ") })] };
    else a = opt.interpret && opt.interpret(t, text);
    if (!a) a = {
      run: () => {},
      steps: [
        esc(F(T.agent.miss, { scope: opt.scope })),
        `${esc(T.agent.real)} <button class="lead-btn" type="button" data-q="${esc(text)}">${esc(T.agent.leadBtn)}</button>`,
      ],
    };
    queue({ ...a, ask: text });
  });
  log.addEventListener("click", (e) => {
    const b = e.target.closest(".lead-btn");
    if (b) toLead(opt.name, b.dataset.q);
  });

  onScreen(section, (v) => (st.visible = v), 0.3);
  (async () => {
    let i = 0;
    await sleep(opt.delay ?? 800);
    while (st.auto) {
      if (!st.visible) { await sleep(300); continue; }
      const sc = opt.script || actions;
      if (i > 0 && i % sc.length === 0 && opt.beforeCycle) opt.beforeCycle();
      await perform(sc[i % sc.length], true);
      i++;
      await sleep(opt.gap ?? 3400);
    }
  })();
  return { stop: () => (st.auto = false) };
}

// ---------- Hero: nube de puntos que un agente reconstruye ----------
(() => {
  const hero = document.getElementById("top");
  const c = document.getElementById("hero-c");
  const g = c.getContext("2d");
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  // Formas en un lienzo de 1,4 x 1. El tercer valor marca los puntos de acento.
  const mk = () => {
    const a = [];
    const P = (x, y, k = 0) => a.push([x, y, k]);
    const line = (x1, y1, x2, y2, k = 0, st = 0.006) => { const n = Math.max(1, Math.hypot(x2 - x1, y2 - y1) / st); for (let i = 0; i <= n; i++) P(x1 + ((x2 - x1) * i) / n, y1 + ((y2 - y1) * i) / n, k); };
    const rect = (x, y, w, h, k = 0, st = 0.008) => { line(x, y, x + w, y, k, st); line(x + w, y, x + w, y + h, k, st); line(x + w, y + h, x, y + h, k, st); line(x, y + h, x, y, k, st); };
    const fill = (x, y, w, h, k = 0, st = 0.01) => { for (let i = x; i <= x + w + 1e-6; i += st) for (let j = y; j <= y + h + 1e-6; j += st) P(i, j, k); };
    return { a, P, line, rect, fill };
  };
  const SHAPES = [
    { id: "bitewave", name: "Bitewave", agent: "edge-agent", gen() {
      const { a, P, rect, fill } = mk();
      rect(0.04, 0.3, 1.32, 0.4, 0, 0.012);
      for (let i = 0; i < 260; i++) P(0.04 + rnd() * 1.32, 0.3 + rnd() * 0.4, 0);
      for (let x = 0.04, imp = 0; x <= 1.36; x += Math.abs(imp) > 0.03 ? 0.0005 : 0.0022) {
        const ph = (x * 3.6) % 1;
        imp = Math.exp(-ph * 16) * Math.sin(ph * 70);
        const y = 0.5 - 0.12 * Math.sin(x * 2 * Math.PI * 5.2) - 0.3 * imp;
        P(x, y, Math.abs(imp) > 0.12 ? 1 : 0); P(x, y + 0.006, Math.abs(imp) > 0.12 ? 1 : 0);
      }
      fill(1.25, 0.08, 0.04, 0.04, 1, 0.008);
      for (let k = 0; k < 60; k++) { const t = (k / 60) * Math.PI * 2; P(1.27 + Math.cos(t) * 0.06, 0.1 + Math.sin(t) * 0.06, 1); }
      return a;
    } },
    { id: "bancor", name: "Bancor", agent: "render-agent", gen() {
      const { a, line, rect, fill } = mk();
      line(0, 0.93, 1.4, 0.93, 0, 0.012);
      for (let i = 0; i < 40; i++) line(0.1 + i * 0.03, i % 2 ? 0.17 : 0.21, 0.13 + i * 0.03, i % 2 ? 0.21 : 0.17, 0, 0.008);
      line(0.12, 0.2, 0.12, 0.88, 0, 0.008); line(1.28, 0.2, 1.28, 0.88, 0, 0.008);
      rect(0.12, 0.66, 1.16, 0.22, 0, 0.01);
      for (let x = 0.16; x < 1.26; x += 0.045) line(x, 0.69, x, 0.85, 0, 0.022);
      fill(0.62, 0.27, 0.16, 0.035, 1, 0.009);
      for (let r = 0; r < 3; r++) {
        const y = 0.36 + r * 0.1;
        line(0.14, y + 0.06, 0.6, y + 0.06, 0, 0.01); line(0.8, y + 0.06, 1.26, y + 0.06, 0, 0.01);
        for (let x = 0.17; x < 0.57; x += 0.058) fill(x, y, 0.034, 0.042, (Math.round(x * 100) + r) % 3 === 0 ? 1 : 0, 0.009);
        for (let x = 0.83; x < 1.23; x += 0.058) fill(x, y, 0.034, 0.042, (Math.round(x * 100) + r) % 3 === 1 ? 1 : 0, 0.009);
        line(0.64, y + 0.04, 0.76, y + 0.04, 0, 0.01);
      }
      line(0.03, 0.93, 0.03, 0.1, 0, 0.01); fill(0.015, 0.08, 0.05, 0.02, 1, 0.008);
      line(1.37, 0.93, 1.37, 0.1, 0, 0.01); fill(1.345, 0.08, 0.05, 0.02, 1, 0.008);
      return a;
    } },
    { id: "clearlit", name: "clearlit", agent: "cost-agent", gen() {
      const { a, P, line } = mk();
      line(0.1, 0.9, 1.36, 0.9, 0, 0.008); line(0.1, 0.08, 0.1, 0.9, 0, 0.008);
      for (const y of [0.3, 0.5, 0.7]) line(0.1, y, 1.36, y, 0, 0.03);
      for (let x = 0.1; x <= 1.36; x += 0.0035) {
        const u = (x - 0.1) / 1.26, y = 0.9 - 0.78 * Math.pow(u, 1.9);
        P(x, y, 1); P(x, y - 0.008, 1);
        P(x, 0.9 - 0.09 * u, 0);
        if (rnd() < 0.35) P(x, y + rnd() * (0.9 - y), 0);
      }
      for (let y = 0.1; y < 0.9; y += 0.04) line(0.73, y, 0.73, y + 0.018, 1, 0.006);
      return a;
    } },
    { id: "comolocobro", name: "comolocobro", agent: "cobro-agent", gen() {
      const { a, rect, fill } = mk();
      [0.46, 0.3, 0.8, 0.62].forEach((len, i) => {
        const y = 0.17 + i * 0.2, best = i === 2 ? 1 : 0;
        fill(0.06, y - 0.03, 0.2, 0.025, 0, 0.01); fill(0.06, y + 0.01, 0.13, 0.015, 0, 0.012);
        rect(0.34, y - 0.03, 0.82, 0.06, 0, 0.01);
        fill(0.34, y - 0.03, len, 0.06, best, 0.011);
        fill(1.22, y - 0.025, 0.13, 0.05, best, 0.01);
      });
      return a;
    } },
    { id: "crm", name: "CRM", agent: T.crm.con.name, gen() {
      const { a, rect, fill } = mk();
      [2, 3, 1, 1].forEach((n, i) => {
        const x = 0.04 + i * 0.335;
        rect(x, 0.08, 0.3, 0.84, 0, 0.012);
        fill(x + 0.025, 0.12, 0.15, 0.022, 0, 0.011);
        for (let j = 0; j < n; j++) {
          const y = 0.2 + j * 0.18, acc = i === 1 && j === 0 ? 1 : 0;
          rect(x + 0.02, y, 0.26, 0.14, acc, 0.01);
          fill(x + 0.04, y + 0.025, 0.14, 0.02, acc, 0.01);
          fill(x + 0.04, y + 0.065, 0.2, 0.012, 0, 0.012);
          fill(x + 0.04, y + 0.1, 0.09, 0.012, acc, 0.012);
        }
      });
      return a;
    } },
  ];

  let N = 0, pts = [], tgt = [], box = { x: 0, y: 0, w: 1, h: 1 }, W = 0, H = 0;
  function resample(arr) {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
    out.length = Math.min(out.length, N);
    while (out.length < N) { const p = arr[Math.floor(rnd() * arr.length)]; out.push([p[0] + (rnd() - 0.5) * 0.006, p[1] + (rnd() - 0.5) * 0.006, p[2]]); }
    return out.sort((p, q) => p[0] - q[0]);
  }
  function build() {
    N = innerWidth < 900 ? 1500 : 2600;
    seed = 7;
    tgt = SHAPES.map((s) => resample(s.gen()));
    pts = Array.from({ length: N }, () => ({ x: W * (0.4 + rnd() * 0.6), y: H * rnd(), vx: 0, vy: 0, k: 0, s: 0, ph: rnd() * 6.28 }));
  }
  function layout() {
    const r = c.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    c.width = Math.round(W * d); c.height = Math.round(H * d);
    g.setTransform(d, 0, 0, d, 0, 0);
    box = W < 900 ? { x: W * 0.05, y: H * 0.1, w: W * 0.9, h: H * 0.3 } : { x: W * 0.47, y: H * 0.14, w: W * 0.49, h: H * 0.5 };
  }
  const map = (p) => {
    const sc = Math.min(box.w / 1.4, box.h), ox = box.x + (box.w - 1.4 * sc) / 2, oy = box.y + (box.h - sc) / 2;
    return [ox + p[0] * sc, oy + p[1] * sc];
  };

  const idx = document.getElementById("hero-idx");
  SHAPES.forEach((s, i) => {
    const a = document.createElement("a");
    a.href = "#" + s.id; a.className = "hi";
    a.innerHTML = `<span>0${i + 1}</span>${s.name}<i><b></b></i>`;
    a.addEventListener("mouseenter", () => { hover = true; if (i !== cur) go(i); });
    a.addEventListener("mouseleave", () => { hover = false; tHold = performance.now(); });
    idx.append(a);
  });
  const agentEl = document.getElementById("hero-agent"), sayEl = document.getElementById("hero-say");
  let typeTok = 0;
  async function say(s) {
    const tok = ++typeTok, text = T.hero.say[s.id];
    agentEl.textContent = s.agent;
    if (reduce) { sayEl.textContent = text; return; }
    for (let i = 0; i <= text.length; i++) { if (tok !== typeTok) return; sayEl.textContent = text.slice(0, i); await sleep(18); }
  }

  const HOLD = 4600, SCAN = 1300;
  let cur = -1, scanning = false, tScan = 0, tHold = 0, hover = false, visible = true, running = false, mx = -1e4, my = -1e4;
  function go(i) {
    cur = i; scanning = true; tScan = performance.now();
    [...idx.children].forEach((a, j) => { a.classList.toggle("on", j === i); a.querySelector("b").style.width = "0"; });
    say(SHAPES[i]);
    if (reduce) { pts.forEach((p, k) => { p.s = cur + 1; p.k = tgt[cur][k][2]; const [x, y] = map(tgt[cur][k]); p.x = x; p.y = y; }); scanning = false; tHold = performance.now(); draw(performance.now()); }
  }

  hero.addEventListener("pointermove", (e) => { const r = c.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
  hero.addEventListener("pointerleave", () => { mx = my = -1e4; });
  onScreen(hero, (v) => { visible = v; if (v && !reduce && !running) { running = true; requestAnimationFrame(frame); } }, 0.02);
  new ResizeObserver(() => { layout(); if (reduce && cur >= 0) go(cur); }).observe(c);

  function draw(now) {
    const T0 = tgt[cur];
    let scanX = -1;
    if (scanning) {
      const u = Math.min(1, (now - tScan) / SCAN);
      scanX = box.x - 40 + u * (box.w + 80);
      if (u >= 1) { scanning = false; tHold = now; pts.forEach((p, i) => { if (p.s !== cur + 1) { p.s = cur + 1; p.k = T0[i][2]; } }); }
    } else if (!hover && !reduce && now - tHold > HOLD) go((cur + 1) % SHAPES.length);
    if (!scanning && !reduce) idx.children[cur].querySelector("b").style.width = Math.min(100, ((now - tHold) / HOLD) * 100) + "%";

    g.clearRect(0, 0, W, H);
    g.strokeStyle = "rgba(139,141,144,.45)"; g.lineWidth = 1;
    const br = 14, bx = box.x - 18, by = box.y - 18, bw = box.w + 36, bh = box.h + 36;
    g.beginPath();
    [[bx, by, 1, 1], [bx + bw, by, -1, 1], [bx, by + bh, 1, -1], [bx + bw, by + bh, -1, -1]].forEach(([x, y, sx, sy]) => { g.moveTo(x + sx * br, y + 0.5); g.lineTo(x + 0.5, y + 0.5); g.lineTo(x + 0.5, y + sy * br); });
    g.stroke();

    const R = 80, sz = W < 900 ? 1.6 : 1.8;
    for (let i = 0; i < N; i++) {
      const p = pts[i];
      if (p.x < scanX && p.s !== cur + 1) { p.s = cur + 1; p.k = T0[i][2]; p.vx += (Math.random() - 0.5) * 6; p.vy += (Math.random() - 0.5) * 6; }
      if (p.s && !reduce) {
        const [tx, ty] = map(tgt[p.s - 1][i]);
        const wob = Math.sin(now / 900 + p.ph) * 0.6;
        p.vx += (tx - p.x) * 0.05; p.vy += (ty + wob - p.y) * 0.05;
        const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
        if (d2 < R * R) { const d = Math.sqrt(d2) || 1, f = (1 - d / R) * 2.4; p.vx += (dx / d) * f; p.vy += (dy / d) * f; }
        p.vx *= 0.8; p.vy *= 0.8;
        p.x += p.vx; p.y += p.vy;
      }
    }
    g.fillStyle = "rgba(237,237,234,.55)";
    for (const p of pts) if (!p.k) g.fillRect(p.x, p.y, sz, sz);
    g.fillStyle = css("--maiz");
    for (const p of pts) if (p.k) g.fillRect(p.x - 0.2, p.y - 0.2, sz + 0.4, sz + 0.4);
    if (scanX > 0) {
      const gr = g.createLinearGradient(scanX - 60, 0, scanX, 0);
      gr.addColorStop(0, "rgba(242,194,48,0)"); gr.addColorStop(1, "rgba(242,194,48,.14)");
      g.fillStyle = gr; g.fillRect(scanX - 60, box.y - 18, 60, box.h + 36);
      g.fillStyle = css("--maiz"); g.fillRect(scanX, box.y - 18, 1, box.h + 36);
    }
  }
  function frame(now) {
    if (!visible) { running = false; return; }
    draw(now);
    requestAnimationFrame(frame);
  }

  layout(); build(); go(0);
})();

// ---------- Bitewave ----------
(() => {
  const B = T.bitewave;
  const section = document.getElementById("bitewave");
  const MODES = {
    normal: { amp: 0.42, h2: 0.08, imp: 0, mod: 0, noise: 0.06, rms: 2.1, score: 0.12, p: [0.94, 0.03, 0.02, 0.01] },
    desbalance: { amp: 0.92, h2: 0.1, imp: 0, mod: 0, noise: 0.06, rms: 4.6, score: 0.81, p: [0.08, 0.86, 0.04, 0.02], alert: true },
    rodamiento: { amp: 0.44, h2: 0.08, imp: 0.95, mod: 0, noise: 0.07, rms: 2.4, score: 0.88, p: [0.05, 0.04, 0.87, 0.04], alert: true },
    obstruccion: { amp: 0.4, h2: 0.22, imp: 0, mod: 0.65, noise: 0.24, rms: 3.0, score: 0.74, p: [0.1, 0.05, 0.06, 0.79], alert: true },
  };
  const probs = document.getElementById("bw-probs");
  B.probs.forEach((n) => { const li = document.createElement("li"); li.innerHTML = `<span>${esc(n)}</span><span class="pb"><i></i></span><b></b>`; probs.append(li); });
  const cur = { ...MODES.normal };
  let mode = "normal";
  const seg = document.getElementById("bw-modes");
  const toast = document.getElementById("bw-toast");
  const node = document.getElementById("bw-node");
  const rmsEl = document.getElementById("bw-rms");
  let rmsShown = 2.1;
  const pct = (v) => (T.lang === "en" ? Math.round(v * 100) + "%" : Math.round(v * 100) + " %");

  function setMode(m) {
    mode = m;
    const M = MODES[m];
    seg.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.m === m));
    document.getElementById("bw-diag").textContent = B.diag[m];
    const sc = document.getElementById("bw-score");
    sc.style.width = M.score * 100 + "%";
    sc.style.background = M.score >= 0.7 ? css("--bad") : css("--good");
    document.getElementById("bw-scorev").textContent = dec(M.score, 2);
    const top = M.p.indexOf(Math.max(...M.p));
    [...probs.children].forEach((li, i) => {
      li.classList.toggle("lead", i === top);
      li.querySelector("i").style.width = M.p[i] * 100 + "%";
      li.querySelector("b").textContent = pct(M.p[i]);
    });
    node.classList.toggle("alert", !!M.alert);
    if (M.alert) {
      document.getElementById("bw-tmsg").textContent = F(B.toast, { x: B.alert[m] });
      toast.hidden = false;
    } else toast.hidden = true;
  }
  seg.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { agent.stop(); setMode(b.dataset.m); } });

  // Marcador sobre el silo, según cómo recorta la imagen.
  const field = document.getElementById("bw-field");
  function placeNode() {
    const w = field.clientWidth, h = field.clientHeight;
    const s = Math.max(w / 1748, h / 560), dw = 1748 * s, dh = 560 * s;
    const x = 0.858 * dw - (dw - w) * 0.5, y = 0.43 * dh - (dh - h) * 0.4;
    node.style.left = x + "px"; node.style.top = y + "px";
    const tag = document.getElementById("bw-tag");
    tag.style.top = Math.max(8, y - 14) + "px";
    if (x > w * 0.55) { tag.style.left = ""; tag.style.right = w - x + 18 + "px"; } else { tag.style.right = ""; tag.style.left = x + 18 + "px"; }
  }
  new ResizeObserver(placeNode).observe(field);

  // Señal: rotor a ~1x, armónico, impactos de rodamiento, modulación por obstrucción.
  const canvas = document.getElementById("bw-canvas");
  let t = 0, vis = false, running = false, last = performance.now();
  onScreen(section, (v) => { vis = v; if (v && !running) { running = true; last = performance.now(); requestAnimationFrame(loop); } });
  const rnd = () => Math.random() * 2 - 1;
  function sample(tt) {
    let y = cur.amp * Math.sin(tt * 2 * Math.PI * 6) + cur.h2 * Math.sin(tt * 2 * Math.PI * 12 + 1);
    if (cur.imp > 0.01) { const ph = (tt * 9) % 1; y += cur.imp * Math.exp(-ph * 22) * Math.sin(ph * 180); }
    if (cur.mod > 0.01) y *= 1 + cur.mod * Math.sin(tt * 2 * Math.PI * 0.7);
    return y + cur.noise * rnd();
  }
  function loop(now) {
    if (!vis) { running = false; return; }
    const dt = Math.min((now - last) / 1000, 0.05); last = now; t += reduce ? 0 : dt;
    const M = MODES[mode], k = reduce ? 1 : Math.min(1, dt * 3);
    for (const key of ["amp", "h2", "imp", "mod", "noise"]) cur[key] += (M[key] - cur[key]) * k;
    rmsShown += (M.rms - rmsShown) * k + (reduce ? 0 : (Math.random() - 0.5) * 0.02);
    rmsEl.textContent = dec(rmsShown, 1) + " mm/s";
    const [g, w, h] = sizeCanvas(canvas);
    g.clearRect(0, 0, w, h);
    g.strokeStyle = css("--line"); g.lineWidth = 1;
    for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(0, (h * i) / 4 + 0.5); g.lineTo(w, (h * i) / 4 + 0.5); g.stroke(); }
    g.fillStyle = "rgba(91,208,138,.07)";
    g.fillRect(0, h / 2 - h * 0.25, w, h * 0.5);
    g.fillStyle = css("--dim"); g.font = "11px Archivo, system-ui, sans-serif";
    g.fillText(B.band, 8, h / 2 - h * 0.25 + 14);
    g.beginPath();
    const span = 1.2;
    for (let px = 0; px <= w; px += 1.5) {
      const y = h / 2 - sample(t - span + (px / w) * span) * h * 0.42;
      px === 0 ? g.moveTo(px, y) : g.lineTo(px, y);
    }
    g.strokeStyle = MODES[mode].alert ? css("--maiz") : css("--ink");
    g.lineWidth = 1.4; g.stroke();
    requestAnimationFrame(loop);
  }
  setMode("normal");

  const trad = document.getElementById("bw-trad");
  const runs = [() => setMode("normal"), () => setMode("rodamiento"), () => flash(trad), () => setMode("desbalance"), () => setMode("obstruccion")];
  const agent = makeAgent(section, B.actions.map((a, i) => ({ ...a, run: runs[i] })), {
    gap: 3800, name: "Bitewave", scope: B.con.scope, placeholder: B.con.placeholder,
    interpret: (t) => {
      const m = /rodamiento|ruleman|cojinete|bolilla|desgast|bearing|\bworn\b|\bwear/.test(t) ? "rodamiento"
        : /desbalanc|rotor|aspa|paleta|helice|imbalanc|unbalanc|\bblade|\bfan\b/.test(t) ? "desbalance"
        : /obstru|tapa|polvo|basura|tierra|entrada de aire|block|clog|dust|dirt|intake/.test(t) ? "obstruccion"
        : /normal|\bbien\b|sano|arregl|repar|\bfine\b|\bok\b|\bfix|healthy/.test(t) ? "normal" : null;
      const tradQ = /tradicional|comun|mm\/s|umbral|traditional|regular|common|threshold/.test(t);
      const infoQ = /bateria|lora|conexion|internet|nube|senal|como funciona|como sabe|aprend|battery|connection|cloud|signal|how does|how it works|learn/.test(t);
      if (!m && !tradQ && !infoQ) return null;
      return {
        run: () => { if (m) setMode(m); if (tradQ) flash(trad); },
        steps: () => {
          const out = m ? [...B.say[m]] : [];
          if (tradQ || (m && m !== "normal")) out.push(F(B.say.trad, { v: dec(MODES[m || mode].rms, 1) }));
          if (infoQ) out.push(...B.say.info);
          return out;
        },
      };
    },
  });
})();

// ---------- Bancor: el visor 3D se carga cuando la sección se acerca ----------
(() => {
  const section = document.getElementById("bancor");
  let started = false;
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting || started) return;
    started = true;
    io.disconnect();
    import("./bancor.js")
      .then((m) => m.init({ section, T, makeAgent }))
      .catch(() => {
        const l = document.getElementById("loading3d");
        if (l) l.textContent = "";
      });
  }, { rootMargin: "900px 0px" });
  io.observe(section);
})();

// ---------- clearlit ----------
(() => {
  const C = T.clearlit;
  const section = document.getElementById("clearlit");
  const PLAT = { lovable: { a: 5.4, b: 1.55, name: "Lovable" }, bolt: { a: 4.6, b: 1.5, name: "Bolt" }, v0: { a: 4.4, b: 1.45, name: "v0" } };
  const FIND = [
    { sev: "hi", share: 0.64 },
    { sev: "md", share: 0.23 },
    { sev: "md", share: 0.13 },
  ];
  const st = { p: "lovable", u: 25, du: 25, a: 5.4, b: 1.55 };
  const now = (u, a = st.a, b = st.b) => 5 + a * Math.pow(u, b);
  const fix = (u) => 5 + 2.8 * u;
  const r10 = (n) => (n < 200 ? Math.round(n / 5) * 5 : Math.round(n / 10) * 10);
  const canvas = document.getElementById("cl-canvas");
  const list = document.getElementById("cl-list");
  FIND.forEach((f, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="sev ${f.sev}">${esc(C.sev[f.sev])}</span><span><b>${esc(C.findings[i].t)}</b><small>${esc(C.findings[i].d)}</small></span><span class="imp"></span>`;
    list.append(li);
  });

  function numbers() {
    const n = r10(now(st.u, PLAT[st.p].a, PLAT[st.p].b)), x = r10(fix(st.u));
    document.getElementById("cl-u").textContent = fmt(st.u * 1000);
    document.getElementById("cl-now").textContent = "USD " + fmt(n);
    document.getElementById("cl-fix").textContent = "USD " + fmt(x);
    document.getElementById("cl-save").textContent = "USD " + fmt(Math.round(((n - x) * 12) / 100) * 100);
    [...list.children].forEach((li, i) => (li.querySelector(".imp").textContent = "−USD " + fmt(r10((n - x) * FIND[i].share))));
    return { n, x };
  }

  function draw() {
    const [g, w, h] = sizeCanvas(canvas);
    const L = 44, R = 22, Tp = 10, Bt = 22, ymax = 2500;
    const X = (u) => L + ((u - 1) / 49) * (w - L - R);
    const Y = (v) => Tp + (1 - Math.min(v, ymax) / ymax) * (h - Tp - Bt);
    g.clearRect(0, 0, w, h);
    g.font = "11px Archivo, system-ui, sans-serif";
    g.fillStyle = css("--dim"); g.strokeStyle = css("--line"); g.lineWidth = 1;
    for (let v = 0; v <= ymax; v += 500) {
      g.beginPath(); g.moveTo(L, Y(v) + 0.5); g.lineTo(w - R, Y(v) + 0.5); g.stroke();
      g.textAlign = "right"; g.fillText(fmt(v), L - 8, Y(v) + 4);
    }
    g.textAlign = "center";
    [1, 10, 20, 30, 40, 50].forEach((u) => g.fillText(F(C.thousand, { n: u }), X(u), h - 5));
    const curve = (fn) => { g.beginPath(); for (let u = 1; u <= 50; u += 0.5) { const p = [X(u), Y(fn(u))]; u === 1 ? g.moveTo(...p) : g.lineTo(...p); } };
    curve((u) => now(u));
    g.lineTo(X(50), Y(0)); g.lineTo(X(1), Y(0)); g.closePath();
    g.fillStyle = "rgba(229,87,74,.10)"; g.fill();
    g.lineWidth = 2.2;
    curve((u) => now(u)); g.strokeStyle = css("--bad"); g.stroke();
    curve(fix); g.strokeStyle = css("--good"); g.stroke();
    const mx = X(st.du);
    g.strokeStyle = css("--maiz"); g.lineWidth = 1; g.setLineDash([3, 3]);
    g.beginPath(); g.moveTo(mx, Tp); g.lineTo(mx, h - Bt); g.stroke(); g.setLineDash([]);
    [[now(st.du), css("--bad")], [fix(st.du), css("--good")]].forEach(([v, col]) => {
      g.beginPath(); g.arc(mx, Y(v), 4.5, 0, Math.PI * 2); g.fillStyle = col; g.fill();
      g.strokeStyle = css("--panel"); g.lineWidth = 2; g.stroke();
    });
  }

  let anim = false;
  function animate() {
    if (anim) return;
    anim = true;
    const step = () => {
      const t = PLAT[st.p];
      st.a += (t.a - st.a) * 0.14; st.b += (t.b - st.b) * 0.14; st.du += (st.u - st.du) * 0.16;
      draw();
      if (!reduce && (Math.abs(t.b - st.b) > 0.0005 || Math.abs(st.u - st.du) > 0.02)) requestAnimationFrame(step);
      else { st.a = t.a; st.b = t.b; st.du = st.u; draw(); anim = false; }
    };
    requestAnimationFrame(step);
  }
  const plat = document.getElementById("cl-plat");
  function setPlat(p) {
    st.p = p;
    plat.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.p === p));
    document.getElementById("cl-fixlbl").textContent = F(C.fixLbl, { p: PLAT[p].name });
    numbers(); animate();
  }
  const range = document.getElementById("cl-users");
  function setUsers(u) { st.u = u; range.value = u; numbers(); animate(); }
  async function tweenUsers(to) {
    const from = st.u, n = 14;
    for (let i = 1; i <= n; i++) { setUsers(Math.round(from + ((to - from) * i) / n)); await sleep(45); }
  }
  async function scan() {
    const lbl = document.getElementById("cl-scan");
    document.getElementById("cl-fixp").hidden = true;
    [...list.children].forEach((li) => li.classList.add("off"));
    for (const s of C.scanSteps) { lbl.textContent = s + "…"; await sleep(420); }
    for (const li of list.children) { li.classList.remove("off"); await sleep(260); }
    lbl.textContent = C.found;
  }
  function showFix() {
    const box = document.getElementById("cl-fixp");
    document.getElementById("cl-prompt").textContent = C.fix;
    box.hidden = false;
    flash(box);
  }

  plat.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { agent.stop(); setPlat(b.dataset.p); } });
  range.addEventListener("input", () => { agent.stop(); setUsers(+range.value); });
  new ResizeObserver(draw).observe(canvas);
  setPlat("lovable");

  const A = C.actions;
  const agent = makeAgent(section, [
    { ...A[0], run: async () => { setPlat("lovable"); await scan(); }, steps: () => { const r = numbers(); return [A[0].steps[0], A[0].steps[1], F(A[0].steps[2], { n: fmt(r.n), x: fmt(r.x) })]; } },
    { ...A[1], run: () => tweenUsers(40), steps: () => { const r = numbers(); return A[1].steps.map((s) => F(s, { n: fmt(r.n), x: fmt(r.x) })); } },
    { ...A[2], run: () => showFix() },
    { ...A[3], run: async () => { await tweenUsers(25); setPlat("bolt"); }, steps: () => { const r = numbers(); return A[3].steps.map((s) => F(s, { n: fmt(r.n) })); } },
  ], {
    gap: 3600, name: "clearlit", scope: C.con.scope, placeholder: C.con.placeholder,
    interpret: (t) => {
      const p = /lovable/.test(t) ? "lovable" : /\bbolt\b/.test(t) ? "bolt" : /\bv0\b|vercel/.test(t) ? "v0" : null;
      let n = parseNum(t), over = false;
      if (n != null) { if (n >= 1000) n /= 1000; over = n > 50; n = Math.max(1, Math.min(50, Math.round(n))); }
      const scanQ = /escane|analiz|revis|audit|scan|analy[sz]|review|check/.test(t);
      const fixQ = /arregl|fix|prompt|soluc|correg|como lo|solution|correct/.test(t);
      const costQ = /ahorr|cuanto|cost|factura|pago|sale|gast|save|how much|bill|\bpay|spend/.test(t);
      if (!p && n == null && !scanQ && !fixQ && !costQ) return null;
      return {
        run: async () => { if (p) setPlat(p); if (n != null) await tweenUsers(n); if (scanQ) await scan(); if (fixQ) showFix(); },
        steps: () => {
          const r = numbers(), out = [];
          if (over) out.push(C.say.over);
          if (scanQ) out.push(C.say.traps);
          if (p || n != null || scanQ || costQ || !fixQ) out.push(F(C.say.line, { p: PLAT[st.p].name, u: fmt(st.u * 1000), n: fmt(r.n), x: fmt(r.x) }));
          if (fixQ) out.push(C.say.fixReady);
          return out;
        },
      };
    },
  });
})();

// ---------- comolocobro ----------
(() => {
  const C = T.comolocobro;
  const section = document.getElementById("comolocobro");
  const ROUTES = [
    { id: "swift", fee: (m) => 45 + m * 0.006, rate: (mep) => mep * 0.965 },
    { id: "plat", fee: (m) => 10 + m * 0.03, rate: (mep) => mep * 0.985 },
    { id: "global", fee: (m) => 3 + m * 0.006, rate: (mep) => mep },
    { id: "cripto", fee: (m) => 8 + m * 0.0045, rate: (mep) => mep * 1.006 },
  ].map((r) => ({ ...r, ...C.routes[r.id] }));
  const st = { m: 2000, cur: "usd", mep: 1462, mark: null };
  const list = document.getElementById("cc-list");
  ROUTES.forEach((r) => {
    const li = document.createElement("li");
    li.dataset.id = r.id;
    li.innerHTML = `<span class="cc-name"><b>${esc(r.name)}</b><small>${esc(r.sub)}</small><em hidden>${esc(C.best)}</em></span><span class="cc-fee"><span class="fee"></span><span class="cc-bar"><i></i></span></span><span class="cc-net"></span>`;
    list.append(li);
  });
  function calc() {
    return ROUTES.map((r) => {
      const fee = r.fee(st.m), usd = st.m - fee, ars = usd * r.rate(st.mep);
      return { r, fee, usd, ars, v: st.cur === "usd" ? usd : ars };
    });
  }
  const money = (v) => (st.cur === "usd" ? "USD " + fmt(v) : C.arsSymbol + fmt(v));
  function render() {
    const rows = calc();
    const best = rows.reduce((a, b) => (b.v > a.v ? b : a));
    const worst = rows.reduce((a, b) => (b.v < a.v ? b : a));
    const maxFee = Math.max(...rows.map((x) => x.fee));
    rows.forEach((x) => {
      const li = list.querySelector(`[data-id=${x.r.id}]`);
      li.classList.toggle("best", x === best);
      li.classList.toggle("mark-w", st.mark === x.r.id && x !== best);
      li.querySelector("em").hidden = x !== best;
      li.querySelector(".fee").textContent = F(C.takes, { f: fmt(x.fee) }) + (x.r.id === "swift" && st.cur === "ars" ? C.official : "");
      li.querySelector(".cc-bar i").style.width = (x.fee / maxFee) * 100 + "%";
      li.querySelector(".cc-net").textContent = money(x.v);
    });
    document.getElementById("cc-amt").textContent = "USD " + fmt(st.m);
    document.getElementById("cc-best").textContent = money(best.v);
    document.getElementById("cc-bestname").textContent = best.r.short;
    const d = best.v - worst.v;
    document.getElementById("cc-diff").textContent = "+" + money(d);
    document.getElementById("cc-diffsub").textContent = F(C.perYear, { y: money(d * 12) });
    return { best, worst, rows };
  }
  const range = document.getElementById("cc-range");
  const curSeg = document.getElementById("cc-cur");
  function setCur(c) { st.cur = c; curSeg.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.c === c)); render(); }
  async function tweenAmt(to) {
    const from = st.m, n = 16;
    for (let i = 1; i <= n; i++) { st.m = Math.round((from + ((to - from) * i) / n) / 100) * 100; range.value = st.m; render(); await sleep(40); }
  }
  range.addEventListener("input", () => { agent.stop(); st.mark = null; st.m = +range.value; render(); });
  curSeg.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { agent.stop(); setCur(b.dataset.c); } });

  // Dólar en vivo: pequeña deriva mientras la sección está a la vista.
  const mepEl = document.getElementById("cc-mep"), varEl = document.getElementById("cc-var");
  let vis = false;
  onScreen(section, (v) => (vis = v));
  const showMep = () => (mepEl.textContent = C.arsSymbol + dec(st.mep, 2));
  setInterval(() => {
    if (!vis || reduce) return;
    const ch = (Math.random() - 0.48) * 0.003;
    st.mep = Math.max(1400, Math.min(1530, st.mep * (1 + ch)));
    showMep();
    varEl.textContent = (ch >= 0 ? "▲ " : "▼ ") + dec(Math.abs(ch * 100), 1) + (T.lang === "en" ? "%" : " %");
    varEl.className = ch >= 0 ? "c-good" : "c-bad";
    if (st.cur === "ars") render();
  }, 2600);
  showMep();
  render();

  const A = C.actions;
  const agent = makeAgent(section, [
    { ...A[0], run: async () => { st.mark = null; setCur("usd"); await tweenAmt(2000); }, steps: () => { const { best } = render(); return [A[0].steps[0], F(A[0].steps[1], { r: best.r.short, v: fmt(best.usd) })]; } },
    { ...A[1], run: () => setCur("ars"), steps: () => { const { best } = render(); return [F(A[1].steps[0], { mep: dec(st.mep, 2) }), F(A[1].steps[1], { r: best.r.short, v: fmt(best.ars) })]; } },
    { ...A[2], run: async () => { setCur("usd"); await tweenAmt(6000); }, steps: () => { const { best } = render(); return [A[2].steps[0], F(A[2].steps[1], { r: best.r.short, v: fmt(best.usd) })]; } },
    { ...A[3], run: async () => { st.mark = "swift"; setCur("usd"); await tweenAmt(2000); }, steps: () => { const { best, rows } = render(); const s = rows[0]; return [F(A[3].steps[0], { f: fmt(s.fee) }), F(A[3].steps[1], { y: fmt((best.usd - s.usd) * 12) })]; } },
  ], {
    gap: 3600, name: "comolocobro", scope: C.con.scope, placeholder: C.con.placeholder,
    interpret: (t) => {
      let amt = parseNum(t), clamp = false;
      if (amt != null) { const r = Math.max(500, Math.min(10000, Math.round(amt / 100) * 100)); clamp = r !== Math.round(amt / 100) * 100; amt = r; }
      const cur = /peso|\bars\b|\$/.test(t) ? "ars" : /dolar|dollar|\busd\b/.test(t) && amt == null ? "usd" : null;
      const mark = /swift|banco|transferencia|\bbank|wire/.test(t) ? "swift"
        : /cripto|crypto|usdt|stable|binance/.test(t) ? "cripto"
        : /plataforma|platform|freelanc|upwork|fiverr|workana/.test(t) ? "plat"
        : /cuenta global|global account|cuenta en (usd|dolares)|usd account|wise|payoneer/.test(t) ? "global" : null;
      const bestQ = /convien|mejor|recomend|cual|queda|neto|\bbest|which|keep|\bnet\b|recommend/.test(t);
      if (amt == null && !cur && !mark && !bestQ) return null;
      return {
        run: async () => { st.mark = mark; if (cur) setCur(cur); if (amt != null) await tweenAmt(amt); else render(); },
        steps: () => {
          const { best, rows } = render(), out = [];
          if (clamp) out.push(C.say.clamp);
          if (mark) { const x = rows.find((r) => r.r.id === mark); out.push(F(C.say.route, { r: x.r.short, f: fmt(x.fee), v: money(x.v) })); }
          out.push(F(C.say.best, { r: best.r.short, v: money(best.v) }));
          return out;
        },
      };
    },
  });
})();

// ---------- CRM ----------
(() => {
  const C = T.crm;
  const section = document.getElementById("crm");
  const P = C.products, U = C.units;
  const CAT = [
    { re: /glifosato|glyphosate/, name: P.glifosato, unit: U.l, u: "l", price: 4.2 },
    { re: /atrazin/, name: P.atrazina, unit: U.l, u: "l", price: 6.5 },
    { re: /\burea\b/, name: P.urea, unit: U.t, u: "t", price: 620 },
    { re: /fosfato|phosphate|\bmap\b|\bdap\b/, name: P.fosfato, unit: U.t, u: "t", price: 780 },
    { re: /maiz|\bcorn\b|maize/, name: P.maiz, unit: U.bolsas, u: "o", price: 210 },
    { re: /soja|\bsoy/, name: P.soja, unit: U.bolsas, u: "o", price: 38 },
    { re: /silo ?bolsa|silo ?bag/, name: P.silo, unit: U.u, u: "o", price: 560 },
    { re: /inoculant/, name: P.inoculante, unit: U.dosis, u: "o", price: 4.5 },
  ];
  const PLACES = ["Tandil", "Balcarce", "Azul", "Necochea", "Lobería", "Rauch", "Ayacucho", "Olavarría", "Benito Juárez", "Tres Arroyos", "Mar del Plata", "Gardey", "Barker"];
  const SELLER = { Balcarce: "Caro", "Mar del Plata": "Caro", Necochea: "Caro", Lobería: "Caro", Tandil: "Juan", Gardey: "Juan", Barker: "Juan", Rauch: "Pedro", Ayacucho: "Pedro", Azul: "Pedro", Olavarría: "Pedro" };
  const COLS = ["nueva", "cotizada", "nego", "cerrada"];
  let cards, msgs, cur, n = 0;
  const reset = () => {
    cards = C.seedCards.map((c) => ({ ...c }));
    msgs = C.seedMsgs.map((m) => ({ ...m, read: false }));
    cur = null;
    renderInbox(); renderPipe(); renderLead();
  };

  const W = "[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+";
  const CO = `((?:[Ll]a |[Ee]l |[Ll]os |[Ll]as )?${W}(?:\\s+${W})*)`;
  function extract(raw0, fromName) {
    const raw = raw0.normalize("NFC");
    const t = norm(raw);
    const prod = CAT.find((p) => p.re.test(t)) || null;
    let qty = null;
    const qm = t.match(/(\d[\d.,]*)\s*(mil)?\s*(litros|lts|liters?|litres?|l|toneladas|tons?|tonnes?|tn|t|bolsas|bags?|unidades|units?|u|dosis|doses?)\b/);
    if (qm) qty = parseNum(qm[1] + (qm[2] ? " mil" : ""));
    else if (prod) qty = parseNum(t);
    const nm = raw.match(new RegExp(`(?:[Ss]oy|[Hh]abla|[Ll]es escribe|[Tt]e escribe|[Tt]his is|I'm|I am)\\s+(${W})(?:\\s+(?:de|from)\\s+${CO})?`))
      || raw.match(new RegExp(`(${W})\\s+(?:de|from)\\s+${CO}\\s+(?:here|por ac[aá])`));
    const company = nm && nm[2] ? nm[2].replace(/^(la|el|los|las) /, (w) => w[0].toUpperCase() + w.slice(1)) : null;
    const person = (nm && nm[1]) || (fromName ? fromName.split(" ")[0] : null);
    const place = PLACES.find((p) => t.includes(norm(p))) || null;
    const wm = t.match(/hoy|manana|esta semana|la semana que viene|la proxima semana|fin de mes|antes del? \d{1,2}(?:\/\d{1,2})?|para el \d{1,2}(?:\/\d{1,2})?|today|tomorrow|this week|next week|end of the month|(?:before|by) the \d{1,2}(?:st|nd|rd|th)?/);
    const when = wm ? raw.slice(wm.index, wm.index + wm[0].length) : null;
    const urg = /urgent|\bya\b|hoy|manana|cuanto antes|asap|right away|today|tomorrow/.test(t) ? "alta" : when ? "media" : "normal";
    const usd = prod && qty ? qty * prod.price : null;
    return { who: company || fromName || person || (T.lang === "en" ? "New contact" : "Contacto nuevo"), person, prod, qty, place, when, urg, usd, seller: SELLER[place] || "Caro", temp: urg === "alta" ? "caliente" : "tibio" };
  }

  const inbox = document.getElementById("crm-inbox");
  function renderInbox() {
    inbox.innerHTML = msgs.map((m) => `<li class="${m.read ? "" : "unread"} ${cur && cur.msg === m.id ? "active" : ""}"><span class="row"><b>${esc(m.from || C.pasted)}</b><span class="chn">${esc(m.ch)} / ${esc(m.t)}</span></span><p>${esc(m.text)}</p></li>`).join("");
    const u = msgs.filter((m) => !m.read).length;
    document.getElementById("crm-unread").textContent = u ? F(C.unread, { n: u }) : C.upToDate;
  }
  const pipe = document.getElementById("crm-pipe");
  function renderPipe(hl = [], fresh = null) {
    pipe.innerHTML = COLS.map((id) => {
      const cs = cards.filter((c) => c.col === id);
      const tot = cs.reduce((a, c) => a + (c.usd || 0), 0);
      return `<div class="pcol"><h4>${esc(C.cols[id])} <small>${cs.length} / USD ${fmt(tot)}</small></h4>${cs.map((c) => `<div class="kc t-${c.temp} ${hl.includes(c.id) ? "hl" : ""} ${fresh === c.id ? "flash" : ""}"><b>${esc(c.who)}</b><span>${esc(c.what)}</span><span class="kc-f"><i></i>${c.usd ? "USD " + fmt(c.usd) : esc(C.toQuote)}</span><small>${esc(c.note)}</small></div>`).join("")}</div>`;
    }).join("");
  }
  const orderText = (L) => (L.qty ? `${fmt(L.qty)} ${L.prod.unit} ${C.of} ` : "") + L.prod.name;
  function renderLead() {
    const f = document.getElementById("crm-fields");
    document.getElementById("crm-draft").hidden = !(cur && cur.draft);
    if (!cur) { document.getElementById("crm-owner").textContent = ""; f.innerHTML = `<p class="dim" style="grid-column:1/-1">${esc(C.empty)}</p>`; return; }
    const L = cur.lead, FL = C.fields;
    document.getElementById("crm-owner").textContent = F(C.assigned, { s: L.seller });
    const fld = (k, v) => `<div class="field"><span class="lbl">${esc(k)}</span><b>${v}</b></div>`;
    const dim = (s) => `<span class="dim">${esc(s)}</span>`;
    f.innerHTML =
      fld(FL.client, esc(L.who) + (L.person && L.person !== L.who ? ` ${dim("/ " + L.person)}` : "")) +
      fld(FL.order, L.prod ? esc(orderText(L)) : dim(C.noProduct)) +
      fld(FL.delivery, [L.place, L.when].filter(Boolean).map(esc).join(", ") || dim(C.tbc)) +
      fld(FL.urgency, `<span class="${L.urg === "alta" ? "c-bad" : ""}">${esc(C.urg[L.urg])}</span>`) +
      fld(FL.value, L.usd ? "USD " + fmt(L.usd) : dim(C.toQuote)) +
      fld(FL.next, esc(L.prod ? (L.urg === "alta" ? C.next.today : C.next.later) : C.next.rep));
    if (cur.draft) document.getElementById("crm-draft-t").textContent = cur.draft;
  }

  function processMsg(m) {
    m.read = true;
    const L = extract(m.text, m.from);
    const id = "n" + ++n;
    cards.unshift({ id, col: "nueva", who: L.who, what: L.prod ? `${L.prod.name}${L.qty ? ", " + fmt(L.qty) + " " + L.prod.unit : ""}` : C.general, usd: L.usd, temp: L.temp, note: C.newNote });
    cur = { msg: m.id, card: id, lead: L, draft: null };
    renderInbox(); renderPipe([], id); renderLead();
    return L;
  }
  const S = C.say;
  const leadSteps = (L) => [
    esc(F(S.client, { who: L.who + (L.place ? ", " + L.place : "") })),
    L.prod ? esc(F(S.order, { o: orderText(L) + (L.usd ? ", USD " + fmt(L.usd) : "") })) : esc(S.noProduct),
    esc(F(L.urg === "alta" ? S.urgent : S.created, { s: L.seller })),
  ];
  let lastLead = null;
  const AC = C.actions;
  const A_PROCESS = {
    ...AC.process,
    run: () => { const m = msgs.find((x) => !x.read); lastLead = m ? processMsg(m) : null; },
    steps: () => (lastLead ? leadSteps(lastLead) : S.none),
  };
  let quoted = null;
  const A_QUOTE = {
    ...AC.quote,
    run: () => {
      quoted = null;
      if (!cur || !cur.lead.prod || !cur.lead.qty) return;
      const L = cur.lead, c = cards.find((x) => x.id === cur.card);
      c.col = "cotizada"; c.note = C.quotedNote;
      cur.draft = F(C.draft, {
        p: L.person || "", q: fmt(L.qty), u: L.prod.unit, prod: L.prod.name, v: fmt(L.usd),
        place: L.place ? F(C.draftPlace, { x: L.place }) : "", when: L.when ? ", " + L.when : "",
      }).replace(/ ,/, ",");
      quoted = L;
      renderPipe([], c.id); renderLead();
    },
    steps: () => quoted
      ? [F(S.price, { p: dec(quoted.prod.price, quoted.prod.price < 10 ? 2 : 0), u: C.unitWord[quoted.prod.u === "o" ? "other" : quoted.prod.u] }), ...S.quoted]
      : [cur ? S.missing : S.first],
  };
  const stale = () => cards.filter((c) => c.stale && c.col !== "cerrada");
  const A_CALL = {
    ...AC.call,
    run: () => renderPipe(stale().map((c) => c.id)),
    steps: () => [...stale().map((c) => esc(`${c.who}: ${c.note}`)), S.reminder],
  };
  const A_SUM = {
    ...AC.sum,
    run: () => renderPipe(),
    steps: () => {
      const open = cards.filter((c) => c.col === "cotizada" || c.col === "nego");
      const un = msgs.filter((m) => !m.read).length;
      return [F(S.sum1, { n: cards.length, o: open.length }), F(S.sum2, { v: fmt(open.reduce((a, c) => a + (c.usd || 0), 0)) }), un ? F(S.sum3, { m: un }) : S.sum3none];
    },
  };

  reset();
  makeAgent(section, [A_PROCESS, A_QUOTE, A_CALL, A_SUM], {
    gap: 3600, name: "CRM", scope: C.con.scope, placeholder: C.con.placeholder,
    script: [A_PROCESS, A_QUOTE, A_CALL, A_PROCESS, A_QUOTE, A_SUM],
    beforeCycle: reset,
    interpret: (t) => {
      const looksMsg = t.length > 60 || (CAT.some((p) => p.re.test(t)) && /\d/.test(t));
      if (!looksMsg) {
        if (/cotiz|presupuest|\bquote/.test(t)) return A_QUOTE;
        if (/llam|seguimiento|enfri|pendiente|contactar|\bcall|follow|cold|pending/.test(t)) return A_CALL;
        if (/resumen|semana|como venimos|pipeline|embudo|vendimos|summary|week|how are we|funnel|\bsold/.test(t)) return A_SUM;
        if (/procesa|bandeja|nuevo|mensaje|process|inbox|\bnew\b|message/.test(t)) return A_PROCESS;
        if (t.length < 25) return null;
      }
      return {
        run: function () {
          const m = { id: "p" + ++n, ch: C.pastedCh, from: "", t: C.now, text: this.ask, read: false };
          msgs.unshift(m);
          lastLead = processMsg(m);
        },
        steps: () => leadSteps(lastLead),
      };
    },
  });
})();

// ---------- Formulario de contacto ----------
(() => {
  const form = document.getElementById("lead");
  if (!form) return;
  // Origen del lead: ?utm_source=flama, ?ref=..., o "directo".
  const params = new URLSearchParams(location.search);
  const origin = params.get("utm_source") || params.get("ref");
  const originInput = form.querySelector("[data-origin]");
  if (origin && originInput) originInput.value = origin.slice(0, 60);
  const status = form.querySelector("[data-status]");
  const button = form.querySelector("button[type=submit]");
  const label = button.textContent;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    button.disabled = true;
    button.textContent = form.dataset.sending ?? "…";
    status.textContent = "";
    status.removeAttribute("data-state");
    try {
      const res = await fetch(form.action, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === "false" || data.success === false) throw new Error();
      form.reset();
      status.textContent = form.dataset.ok ?? "";
      status.dataset.state = "ok";
    } catch {
      status.textContent = form.dataset.error ?? "";
      status.dataset.state = "error";
    } finally {
      button.disabled = false;
      button.textContent = label;
    }
  });
})();
