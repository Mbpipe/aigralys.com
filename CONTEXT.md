# CONTEXT — Handoff landing aigralys.com

- **Última actualización:** 2026-06-06 11:00 (UTC-3)
- **Estado actual:** HERO terminado y andando. **PARADO a la espera de aprobación del dueño** antes de seguir con el resto de secciones (pedido explícito).

## Hecho
- Leído `docs/PRD.md` completo. Requisitos clave internalizados (ver "Decisiones / desvíos").
- Creado este `CONTEXT.md` como bitácora de handoff.
- Scaffold Astro completo: `package.json`, `astro.config.mjs`, `tsconfig.json`.
- `src/styles/global.css` con tokens de paleta + fuentes (JetBrains Mono + Inter por Google Fonts).
- Favicon `public/favicon.svg`: letra `a` dorada mono sobre navy redondeado.
- `src/layouts/BaseLayout.astro`: head, meta básica, carga de fuentes, slot.
- `src/components/Hero.astro`: wordmark mono + cursor dorado parpadeante, tagline `// build → ship → repeat.` (flechas doradas), lede, doble CTA (`ver productos` ancla a #productos + `escribir` mailto).
- `src/pages/index.astro`: monta BaseLayout + Hero.
- `npm install` OK. `npm run build` OK. `npm run dev` corriendo en **http://localhost:4322** (4321 estaba ocupado).

## En progreso
- Nada en progreso. Esperando el OK del hero para continuar.

## Próximos pasos (en orden)
1. **Esperar aprobación del HERO.**
2. Sección "Qué es Aigralys" (2-4 líneas).
3. Sección "Productos / Releases" (grid; card comolocobro `live` → comolocobro.com + 1-2 slots "en exploración" `wip`). Esta sección lleva el id `#productos` (target del CTA del hero).
4. Sección "Cómo trabajamos" (3 principios).
5. Sección "Trabajar con Aigralys" (white-label soft, mailto). Sin lenguaje de consultoría.
6. Footer (wordmark chico, mail, año, link a productos).
7. Meta completa + Open Graph + OG image navy+wordmark.
8. Pasada de accesibilidad/contraste + Lighthouse (objetivo 95+).
9. Deploy a Cloudflare Pages (build `npm run build`, output `dist`).

> Nota: el CTA del hero apunta a `#productos`, que todavía no existe (se crea en el paso 3). No es un bug, es por orden de construcción.

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
