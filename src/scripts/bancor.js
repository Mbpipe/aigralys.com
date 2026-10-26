// Visor 3D de la tribuna de Bancor Arena, manejado por el agente de render.
// Se importa recién cuando la sección se acerca, para no cargar three.js de entrada.
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const COLOR_MAP = {
  SeatBlue: { hex: "#1f5fc9", metal: 0, rough: 0.45 }, SeatGreen: { hex: "#3ea641", metal: 0, rough: 0.45 },
  ContainerSteel: { hex: "#8f959b", metal: 0.35, rough: 0.55 }, DeckSteel: { hex: "#3b4045", metal: 0.6, rough: 0.5 },
  FrameSteel: { hex: "#232528", metal: 0.7, rough: 0.5 }, IronBeam: { hex: "#26282b", metal: 0.7, rough: 0.5 },
  BeamAlu: { hex: "#9a9ea3", metal: 0.9, rough: 0.4 }, BaseSlab: { hex: "#b7b6b0", metal: 0, rough: 0.9 },
  StairStep: { hex: "#6e7175", metal: 0.2, rough: 0.8 }, Railing: { hex: "#26282b", metal: 0.6, rough: 0.5 },
  PoleMetal: { hex: "#26282b", metal: 0.6, rough: 0.5 }, SeatFrame: { hex: "#1c1d20", metal: 0.5, rough: 0.5 },
};

export async function init({ section, T, makeAgent }) {
  const B = T.bancor;
  const mount = document.getElementById("viewer");
  const stLight = document.getElementById("st-light"), stCam = document.getElementById("st-cam"), stFps = document.getElementById("st-fps");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 1000);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x2f4a2a, 1);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffffff, 2.6);
  sun.position.set(8, 11, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0004;
  Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 60 });
  scene.add(sun, sun.target);
  const rim = new THREE.DirectionalLight(0x9ec8ff, 0.5);
  rim.position.set(-7, 4, -6);
  scene.add(rim);

  const groundMat = new THREE.MeshStandardMaterial({ color: 0x3a5a34, roughness: 1 });
  const ground = new THREE.Mesh(new THREE.CircleGeometry(60, 64), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  const grid = new THREE.GridHelper(60, 60, 0xffffff, 0xffffff);
  grid.material.transparent = true;
  grid.material.opacity = 0.05;
  grid.position.y = 0.002;
  scene.add(grid);

  const draco = new DRACOLoader();
  draco.setDecoderPath("/draco/");
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);
  const logoTex = new THREE.TextureLoader().load("/models/logo-white.png");
  logoTex.colorSpace = THREE.SRGBColorSpace;

  const gltf = await loader.loadAsync("/models/tribuna.glb");
  const model = gltf.scene;
  const emissives = [];
  const seatMats = {};
  let logoMesh = null;
  const makeLogoMat = () => {
    const t = logoTex.clone();
    t.needsUpdate = true;
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.center.set(0.5, 0.5);
    t.repeat.set(1, -1);
    const m = new THREE.MeshStandardMaterial({ map: t, emissiveMap: t, emissive: 0xffffff, transparent: true, depthWrite: false, side: THREE.DoubleSide, emissiveIntensity: 1.4 });
    m.userData.base = 1.4;
    emissives.push(m);
    return m;
  };
  model.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = o.receiveShadow = true;
    if (o.name === "LogoDecal") { o.material = makeLogoMat(); logoMesh = o; return; }
    if (o.name === "LogoDecalBack") { o.material = makeLogoMat(); return; }
    [].concat(o.material).forEach((m) => {
      const cm = m && COLOR_MAP[m.name];
      if (cm) { m.color.setStyle(cm.hex); m.metalness = cm.metal; m.roughness = cm.rough; }
      if (m && (m.name === "SeatBlue" || m.name === "SeatGreen")) seatMats[m.name] = m;
      if (m && m.emissive && m.emissive.r + m.emissive.g + m.emissive.b > 0.02) {
        m.userData.base ??= m.emissiveIntensity ?? 1;
        if (!emissives.includes(m)) emissives.push(m);
      }
    });
  });
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  model.scale.setScalar(7 / Math.max(size.x, size.y, size.z));
  scene.add(model);
  model.updateMatrixWorld(true);
  const sb = new THREE.Box3().setFromObject(model);
  const sc = sb.getCenter(new THREE.Vector3());
  model.position.set(-sc.x, -sb.min.y, -sc.z);
  model.updateMatrixWorld(true);
  const gb = new THREE.Box3().setFromObject(model);
  const gc = gb.getCenter(new THREE.Vector3());
  const R = Math.max(gb.max.x - gb.min.x, gb.max.z - gb.min.z);
  sun.target.position.set(0, gc.y * 0.5, 0);

  const streets = [];
  model.traverse((o) => {
    if (o.isMesh && /LED[LR]_(head|lens)/i.test(o.name)) {
      const p = o.getWorldPosition(new THREE.Vector3());
      const s = new THREE.SpotLight(0xffd9a0, 0, 22, Math.PI / 4, 0.5, 1.2);
      s.position.copy(p).add(new THREE.Vector3(0, 0.15, 0));
      s.target.position.set(p.x, 0, p.z);
      scene.add(s, s.target);
      streets.push(s);
    }
  });

  document.getElementById("loading3d")?.remove();
  mount.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.minPolarAngle = Math.PI * 0.16;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.autoRotateSpeed = 0.6;

  const logoPos = logoMesh ? logoMesh.getWorldPosition(new THREE.Vector3()) : new THREE.Vector3(0, gc.y, 0);
  const POSES = {
    tres: { pos: new THREE.Vector3(R * 0.74, gc.y + R * 0.36, -(R * 1.12 + 1.8)), tgt: new THREE.Vector3(0, gc.y * 0.5, 0) },
    cancha: { pos: new THREE.Vector3(R * 0.1, 0.55, -(R * 0.82)), tgt: new THREE.Vector3(0, gc.y * 0.75, 0) },
    logo: { pos: logoPos.clone().add(new THREE.Vector3(R * 0.18, 0.35, -R * 0.62)), tgt: logoPos.clone() },
    aerea: { pos: new THREE.Vector3(-R * 0.75, gc.y + R * 0.75, -R * 0.55), tgt: new THREE.Vector3(0, gc.y * 0.4, 0) },
  };
  let goal = null;
  function goTo(name) {
    goal = POSES[name];
    controls.autoRotate = false;
    stCam.textContent = B.poses[name];
  }
  camera.position.copy(POSES.tres.pos);
  controls.target.copy(POSES.tres.tgt);

  const MODES = {
    dia: { bg: 0x9fb7cc, env: 1, hemi: 1, sun: 2.6, rim: 0.5, ground: 0x3a5a34, street: 0, emis: 1, exp: 1 },
    noche: { bg: 0x0d1117, env: 0.12, hemi: 0.1, sun: 0.1, rim: 0.12, ground: 0x15201a, street: 90, emis: 6, exp: 1.08 },
    atardecer: { bg: 0xd9895a, env: 0.55, hemi: 0.55, sun: 1.6, rim: 0.3, ground: 0x34452c, street: 20, emis: 2.4, exp: 1.02 },
  };
  const cur = { ...MODES.noche, bgc: new THREE.Color(MODES.noche.bg), gcol: new THREE.Color(MODES.noche.ground) };
  let tgtMode = MODES.noche;
  scene.background = cur.bgc.clone();
  function setMode(n) {
    tgtMode = MODES[n];
    stLight.textContent = B.modeNames[n];
  }

  function resize() {
    const w = mount.clientWidth, h = mount.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(mount);
  resize();

  // Solo renderiza mientras la sección está a la vista.
  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.02 }).observe(section);

  let last = performance.now(), frames = 0, fpsT = 0;
  const tmpC = new THREE.Color();
  renderer.setAnimationLoop(() => {
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!visible) return;
    const k = reduce ? 1 : Math.min(1, dt * 3);
    for (const key of ["env", "hemi", "sun", "rim", "street", "emis", "exp"]) cur[key] += (tgtMode[key] - cur[key]) * k;
    cur.bgc.lerp(tmpC.set(tgtMode.bg), k);
    cur.gcol.lerp(tmpC.set(tgtMode.ground), k);
    scene.environmentIntensity = cur.env;
    hemi.intensity = cur.hemi;
    sun.intensity = cur.sun;
    rim.intensity = cur.rim;
    scene.background.copy(cur.bgc);
    groundMat.color.copy(cur.gcol);
    renderer.toneMappingExposure = cur.exp;
    streets.forEach((s) => (s.intensity = cur.street));
    emissives.forEach((m) => (m.emissiveIntensity = (m.userData.base || 1) * cur.emis));
    if (goal) {
      const g = reduce ? 1 : Math.min(1, dt * 2.2);
      camera.position.lerp(goal.pos, g);
      controls.target.lerp(goal.tgt, g);
      if (camera.position.distanceTo(goal.pos) < 0.02) goal = null;
    }
    controls.update();
    renderer.render(scene, camera);
    frames++; fpsT += dt;
    if (fpsT > 0.5) { stFps.textContent = Math.round(frames / fpsT); frames = 0; fpsT = 0; }
  });

  const S = B.say;
  const runs = [
    () => { setMode("noche"); goTo("tres"); },
    () => goTo("cancha"),
    () => setMode("atardecer"),
    () => goTo("logo"),
    () => { setMode("dia"); goTo("aerea"); setTimeout(() => (controls.autoRotate = !reduce), 1800); },
  ];
  // Colores que entiende en ES y EN; el nombre que muestra sale del idioma de la página.
  const PAL = [/roj|\bred\b/, /azul|(?<!light )\bblue/, /verde|green/, /amarill|yellow/, /blanc|white/, /negr|black/, /naranj|orange/, /violet|lila|purple/, /celest|light blue|sky blue/, /gris|\bgr[ae]y\b/];
  const HEX = ["#c8323a", "#1f5fc9", "#3ea641", "#f2c230", "#e4e4df", "#1b1c1f", "#e8762b", "#6b3fb8", "#6fb6e8", "#8a8d91"];
  makeAgent(section, B.actions.map((a, i) => ({ ...a, run: runs[i] })), {
    delay: 600, gap: 3200, name: "Bancor Arena", scope: B.con.scope, placeholder: B.con.placeholder,
    interpret: (t) => {
      const L = /noche|nocturn|\bluces\b|\bled|night|lights on/.test(t) ? "noche"
        : /atardecer|\btarde\b|ocaso|dorad|sunset|dusk|golden/.test(t) ? "atardecer"
        : /\bdia\b|diurn|\bsol\b|mediodia|\bday|daylight|\bnoon|sunny/.test(t) ? "dia" : null;
      const C = /cancha|abajo|\bnivel|a ras|del piso|pitch|field|ground|\blow\b|below/.test(t) ? "cancha"
        : /logo|cartel|marca|\bsign\b|close.?up/.test(t) ? "logo"
        : /aere|arriba|dron|cenital|desde lo alto|aerial|above|drone|\btop\b|bird/.test(t) ? "aerea"
        : /general|lejos|complet|entera|3\/4|tres cuartos|\bwide\b|whole|full view|three.quarter/.test(t) ? "tres" : null;
      const rot = /\bgir|rot|vuelta|orbit|spin|\bturn/.test(t);
      const cols = PAL.map((re, i) => [t.search(re), HEX[i], S.colors[i]]).filter((c) => c[0] >= 0).sort((a, b) => a[0] - b[0]);
      const reset = /original|como estaba|de antes|reset|default/.test(t);
      if (!L && !C && !rot && !cols.length && !reset) return null;
      return {
        run: () => {
          if (L) setMode(L);
          if (C) goTo(C);
          if (cols.length) { seatMats.SeatBlue?.color.setStyle(cols[0][1]); seatMats.SeatGreen?.color.setStyle((cols[1] || cols[0])[1]); }
          if (reset) { seatMats.SeatBlue?.color.setStyle(COLOR_MAP.SeatBlue.hex); seatMats.SeatGreen?.color.setStyle(COLOR_MAP.SeatGreen.hex); }
          if (rot && !reduce) setTimeout(() => (controls.autoRotate = true), C ? 1800 : 0);
        },
        steps: () => {
          const out = [];
          if (L) out.push(S.light[L]);
          if (C) out.push(S.cam.replace("{pose}", B.poses[C]));
          if (cols.length) out.push(S.seats.replace("{cols}", cols.slice(0, 2).map((c) => c[2]).join(S.and)));
          if (reset) out.push(S.reset);
          if (rot) out.push(S.orbit);
          return out;
        },
      };
    },
  });
}
