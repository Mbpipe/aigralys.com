# CONTEXT — Handoff landing aigralys.com

- **Última actualización:** 2026-06-06 11:18 (UTC-3)
- **Estado actual:** **Página completa en ambos idiomas (EN default `/`, ES `/es`)**. Hero aprobado por el dueño. Todas las secciones del PRD §5 construidas. **PARADO antes del deploy** (pedido explícito): falta el OK de la página completa + configurar Cloudflare Pages.

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

## Próximos pasos (en orden)
1. **Esperar aprobación de la página completa.**
2. (Opcional, fuera del core) Autodetect de idioma del navegador → `/es` (el PRD lo marca como opcional).
3. Lighthouse 95+ (perf + a11y) — chequeo final.
4. Deploy a Cloudflare Pages: build `npm run build`, output `dist`. Conectar repo GitHub, dominio + SSL + redirect www→raíz. **No hacer hasta tener el OK.**

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
