# CONTEXT — aigralys.com

## v3 (2026-10-23, noche) — estado vigente
- Cada caso tiene una escena animada propia, armada con código (no capturas): `src/components/scenes/`.
  - Barra común de agente (`SceneBar`): nombre del agente, tarea en curso por paso del scroll y reloj.
  - Bancor (`render-agent`): render por tiles en "clay" que se completa con el scroll + panel de Cycles; después día → atardecer → noche.
  - clearlit (`cost-agent`): árbol de archivos escaneado, curva de costo hoy vs. con arreglos, 3 hallazgos y el arreglo tipeándose.
  - comolocobro (`payout-agent`): USD 2.000 fluyendo por 4 rutas de cobro, netos que cuentan, dólar en vivo, gana la mejor ruta.
  - Bitewave (`bitewave-pipeline`): loop de 14 s con señal en vivo, foto del río con anillos y notas en la punta, clasificador tinyML y partitura (pez / vos / banda).
- Sección "La misma base, en el campo" (`src/components/Agro.astro`): 10 aplicaciones IoT + IA local para el agro derivadas de Bitewave.
- Fuentes autoalojadas con @fontsource (sin Google Fonts).
- OG image nueva con el claim actual, apple-touch-icon, JSON-LD de Organization.
- Contacto con panel y fondo de puntos; números de "Cómo trabajamos" en contorno.

## v2 (2026-10-23, tarde)
- Sin menú de servicios: sección abierta "La IA puede…" con frases que se tipean solas + marquee de capacidades. Mensaje: no hay catálogo, se arranca por el problema del cliente.
- Hero con campo de partículas animado en canvas (reacciona al mouse, emite pulsos). Título enorme que entra palabra por palabra.
- Casos como 4 capítulos con el mismo peso (Bancor Arena, clearlit, comolocobro, Bitewave): pantalla fija, texto problema / IA / resultado que avanza con el scroll, pantalla que entra girando y un "registro" del agente que se completa paso a paso.
  - Bancor: render de día → atardecer → noche. clearlit: línea de escaneo, 3 trampas de costo y "USD 800 → 75". comolocobro: barras de métodos de cobro y gana uno. Bitewave: clip del video HUD real (`public/work/bitewave-hud.mp4`, recorte de `bitewave-v2-169.mp4` del vault).
  - Bitewave: código en el repo privado `Mbpipe/bitewave` (en la Mac en `~/bitewave`), contexto en el vault `Personal/Pesca/Bitewave/Bitewave.md`.
- Formulario sin selector de servicio (texto libre).
- Header fijo con blur al bajar; footer con wordmark gigante.
- Movimiento reducido: todo se muestra estático.

## Rediseño IA (2026-10-23) — v1
- Posicionamiento nuevo: estudio de productos digitales y agentes de IA (servicios + consultoría IA). Reemplaza el "sello de productos propios".
- Idioma: **ES default en `/`**, EN en `/en/`. `/es/` redirige a `/` (`public/_redirects`).
- Secciones: Hero (sesión de agente + render Bancor) · Qué hacemos (4 servicios) · Casos (Bancor Arena destacado con selector día/atardecer/noche, clearlit, comolocobro, Bitewave) · Cómo trabajamos · Contacto (form) · Footer.
- Sin WhatsApp ni precios (decisión del dueño). Contacto solo por formulario.
- Form: FormSubmit AJAX → `hello@aigralys.com` (Cloudflare Email Routing → Gmail). **El primer envío dispara un mail de activación a hello@: hay que clickear el link.** Campo oculto `origen` toma `utm_source`/`ref` de la URL (QR de Flama: `https://aigralys.com/?utm_source=flama`).
- Renders de Bancor en `public/work/` (redimensionados desde el repo `Mbpipe/bancor`, OK del cliente para usarlos).
- Todo el copy vive en `src/i18n/strings.ts`.

---

## Historial (landing v1, junio 2026)

- **Última actualización:** 2026-06-06 11:30 (UTC-3)
- **Estado actual:** **Página completa en ambos idiomas (EN default `/`, ES `/es`)**, Lighthouse 100 en las 4 categorías (mobile + desktop), commits pusheados a `origin/main`. **PARADO antes del deploy a Cloudflare Pages** (espera OK del dueño).

## Hecho
- Leído `docs/PRD.md` (versión bilingüe actualizada). Copy EN/ES tomado del PRD.
- Scaffold Astro: `package.json`, `astro.config.mjs` (con bloque `i18n`), `tsconfig.json`.
- **i18n configurado:** `defaultLocale: 'en'`, `locales: ['en','es']`, `prefixDefaultLocale: false` → EN en `/`, ES en `/es/`.
- `src/i18n/strings.ts`: TODO el copy EN/ES tipado + `MAIL = hello@aigralys.com` + helpers de locale/href.
- `src/styles/global.css`: tokens de paleta, fuentes (JetBrains Mono + Inter), estilos reutilizables de sección (`.section`, `.section__title`, label con device `//`).
- `public/favicon.svg`: `a` dorada mono sobre navy.
- `public/og.png`: OG image 1200×630 navy + wordmark + tagline (renderizada con Chrome desde `/tmp/aigralys-shots/og.html`).
- `src/layouts/BaseLayout.astro`: `lang` prop, `<html lang>`, title/description por idioma, **canonical**, **hreflang en/es/x-default**, Open Graph + Twitter card, skip-link a11y, header con wordmark + LangSwitcher.
- `src/components/LangSwitcher.astro`: EN / ES, marca el activo en dorado (`aria-current`).
- `src/components/Hero.astro`: bilingüe; **nitpick aplicado** → gap cursor `margin-left: clamp(4px,0.1em,6px)`. CTA `#products`.
- `src/components/About.astro`, `Products.astro` (comolocobro `live`+link / Producto #2 y #3 `wip`), `HowWeWork.astro` (3 principios numerados), `WhiteLabel.astro` (white-label soft, sin consultoría), `Footer.astro` (wordmark+cursor, mail, año, links).
- `src/pages/index.astro` (EN) + `src/pages/es/index.astro` (ES): montan todas las secciones con `lang`.
- `npm run build` OK → genera `dist/index.html` (EN) + `dist/es/index.html` (ES) + `og.png`.
- Verificado en el HTML buildeado: hreflang en/es/x-default, canonical por idioma, og:image, títulos por idioma.
- Capturas full-page de producción (desktop + mobile, EN + ES) revisadas y OK. (Quedaron en `/tmp/aigralys-shots/full-*.png`, no se commitean.)

## En progreso
- Nada a medias. Esperando el OK de la página completa para pasar al deploy.

## Lighthouse (build de producción vía `astro preview`, 2026-06-06 11:30)
Corrido con Chrome del sistema sobre `http://localhost:4399`:
- **EN mobile (`/`):** performance 100 · accessibility 100 · best-practices 100 · seo 100
- **EN desktop (`/`):** 100 · 100 · 100 · 100
- **ES mobile (`/es/`):** 100 · 100 · 100 · 100
Supera holgado el objetivo del PRD (95+). Reportes JSON en `/tmp/aigralys-shots/lh/` (no commiteados).

## Próximos pasos (en orden)
1. **Push a origin/main** ← en curso.
2. (Opcional, fuera del core) Autodetect de idioma del navegador → `/es` (el PRD lo marca como opcional).
3. Deploy a Cloudflare Pages: build `npm run build`, output `dist`. Conectar repo GitHub, dominio + SSL + redirect www→raíz. **No hacer hasta tener el OK del dueño.**

## Notas de herramientas (limpieza ya hecha)
- Para las capturas se usó `puppeteer-core` + un script `_shoot.mjs`. **Ambos ya removidos** del repo para no ensuciar deps. Si hace falta re-capturar: `npm i -D puppeteer-core`, levantar `npm run preview -- --port 4399`, y un script que apunte al Chrome del sistema con `fullPage:true`.
- Dependencia de runtime: solo `astro`. El sitio es estático puro.

## Decisiones / desvíos del PRD
- `docs/aigralys-mono-final.svg` SÍ apareció (se sumó después de arrancar). Lo revisé: confirma la dirección del hero (wordmark mono blanco + bloque dorado a la derecha, tagline `//` slate + flechas doradas, favicon `a` dorada en navy redondeado, stamp `~a`, pie `an aigralys product`). El hero construido coincide.
- **Flechas de la tagline:** el SVG final usa ASCII `->`, pero el PRD (texto) usa `→` unicode. Mantengo `→` por ahora (PRD = fuente primaria). Ver pregunta abierta.
- El wordmark se construye como **texto tipografiado vía CSS** (no imagen), tal como pide el PRD. No depende del SVG.
- Stack: **Astro** (sitio estático, una sola página), JS mínimo. Confirmado por el dueño.

## Paleta (hardcode)
- Fondo navy: `#101D30`
- Acento dorado: `#E2AC55`
- Texto principal: `#F4F3EF`
- Texto secundario (slate): `#7C8A9C`
- Borde sutil: `#21344A`

## Tono / restricciones duras
- Español rioplatense neutro, seco y honesto. Minúscula amigable. Acentos mono tipo `//`.
- CERO buzzwords (revolucionar, sinergia, AI-powered, disruptivo).
- CERO lenguaje de consultoría/advisory. White-label = "construimos el MVP", nunca "asesoramos".
- Estética plana: sin gradientes, sombras ni glow. Tema oscuro siempre.

## Cómo correr y deployar
- Dev: `npm install` luego `npm run dev` (http://localhost:4321).
- Build: `npm run build` → genera `dist/`.
- Deploy: Cloudflare Pages (build command `npm run build`, output dir `dist`). Pendiente de configurar.

## Decisiones del dueño (confirmadas 2026-06-06 ~11:05)
- **Mail de contacto:** `hello@aigralys.com` (el dueño lo escribió explícito; NOTA: difiere del PRD que decía `hola@`/`gonzalo@`. Confirmar si fue intencional o typo de "hola"). Aplicado en `Hero.astro` y en la meta description del `BaseLayout`.
- **Flechas tagline:** `→` unicode (confirmado). Se queda como está.

## Preguntas abiertas / bloqueos
- **Mail:** confirmar que `hello@aigralys.com` es correcto y no un typo de `hola@aigralys.com`. (El dueño lo tipeó como respuesta libre.)
- OG image: el PRD pide "una OG image simple navy+wordmark". Se generará en pasos posteriores (probablemente SVG→PNG o un PNG estático).
