# PRD — Landing aigralys.com

**Para:** Cursor (agente de código)
**Producto:** Landing de marca del sello Aigralys (la umbrella, no un producto)
**Estado:** v1 para construir
**Dominio:** aigralys.com (canónico de marca). La `aigralys.ai` se da de baja.

---

## 1. Objetivo

Construir una landing estática de una sola página para **Aigralys**, el sello/estudio que lanza productos digitales propios. La página tiene que comunicar, en menos de 10 segundos, tres cosas: qué es Aigralys, qué productos lanzó/lanza, y cómo contactarlo. No vende un producto puntual: presenta el sello.

**No es** una landing de startup SaaS, ni una web de agencia/consultora. Es una landing de **builder / indie hacker** (referencia de tono: las webs de Pieter Levels), pero un punto más pulida para no espantar a un eventual cliente de white-label.

## 2. Audiencia

1. **Curiosos / prensa / otros builders** que llegan por un producto (ej. comolocobro) y quieren ver "quién está atrás".
2. **Posibles clientes de white-label** (empresas que quieren un MVP hecho). Secundario, pero la página no debe cerrarles la puerta.

> Restricción dura: el copy **no puede leerse como consultoría/advisory**. Hablar de "construir productos / MVPs", nunca de "asesorar", "consultar", "estrategia para tu empresa".

## 3. Tono de voz

- Seco, directo, honesto. Minúscula amigable. Cero buzzwords ("revolucionar", "sinergia", "AI-powered", "disruptivo": prohibidas).
- Acentos mono tipo comentario de código (`//`) como device de marca.
- Honesto sin ser autodestructivo: se puede decir "apostamos seguido, la mayoría son experimentos", pero NO poner "la mayoría van a fracasar" como promesa de vidriera.

## 4. Identidad visual (ya decidida — respetar)

Archivo de referencia: `aigralys-mono-final.svg`.

**Paleta (hardcode):**

| Uso | Hex |
|---|---|
| Fondo (navy tinta) | `#101D30` |
| Acento (dorado) | `#E2AC55` |
| Texto principal | `#F4F3EF` |
| Texto secundario (slate) | `#7C8A9C` |
| Borde sutil | `#21344A` |

- **Tema oscuro siempre** (navy de fondo). No hay light mode en v1.
- **Wordmark:** `aigralys` en minúscula, **monoespaciada**, con un cursor/bloque dorado a la derecha (guiño terminal). Es texto tipografiado, no un logo-imagen.
- **Tagline:** `// build → ship → repeat.` (las flechas `→` en dorado).
- **Stamp / favicon:** la letra `a` en dorado como favicon; el pie `an aigralys product` queda para los productos, no hace falta en esta landing salvo en el footer.
- **Tipografías:** un monospace real para wordmark/acentos (JetBrains Mono, IBM Plex Mono o Berkeley Mono si está disponible) + una sans limpia y neutra para cuerpo (Inter, o la misma mono si se quiere look 100% terminal). Cargar por `@font-face` o Google Fonts.
- Estética **plana**: sin gradientes, sin sombras, sin glow/neón. El neón quedó descartado a propósito.

## 5. Estructura de la página (orden vertical)

1. **Hero**
   - Wordmark `aigralys` + cursor dorado.
   - Tagline `// build → ship → repeat.`
   - Una línea de qué es: *"Un sello de productos digitales propios."* (o variante).
   - CTA suave doble: `ver productos` (ancla a la sección) + `escribir` (mailto a hello@aigralys.com).

2. **Qué es Aigralys** (2-4 líneas, no más)
   - El relato del sello: lanza productos propios a cadencia, en público. Honesto, sin autodestrucción. Tomar como base la idea "operado como un sello discográfico: varios lanzamientos al año, cada uno su propia cara".

3. **Productos / "Releases"** (el corazón de la página)
   - Grid de cards estilo discografía de sello.
   - **comolocobro** — live. Card con nombre, una línea ("Cómo cobrar desde el exterior en Argentina, sin vueltas"), estado `live`, link a comolocobro.com.
   - 1-2 slots `en el taller / próximamente` como placeholders (sin inventar nombres falsos; usar "Producto #2 — en exploración").
   - Cada card: borde sutil, hover discreto, badge de estado (`live` dorado / `wip` slate).

4. **Cómo trabajamos** (opcional, breve — 3 principios máx)
   - Ej: "Enviamos rápido." / "Construimos en público." / "Pocos productos, bien hechos." Formato lista corta, mono.

5. **Trabajar con Aigralys** (white-label, soft)
   - Una línea: "¿Necesitás un MVP construido? A veces tomamos un proyecto por trimestre." + mailto.
   - **Sin** lenguaje de consultoría. Solo "construimos el producto".

6. **Footer**
   - Stamp/wordmark chico, mail (hello@aigralys.com), año, link a productos. Minimal.

## 6. Requerimientos técnicos

- **Single page**, HTML/CSS, JS mínimo o nulo. Vanilla o el framework más liviano; nada de SPA pesada.
- **Responsive** (mobile-first; el hero tiene que verse bien en 375px).
- **Performance:** objetivo Lighthouse 95+; peso total < 150kb; sin librerías innecesarias.
- **Accesibilidad:** contraste AA sobre el navy, navegación por teclado, `alt`/`aria` donde corresponda.
- **SEO/meta:** `<title>`, meta description, Open Graph (title, description, image), favicon = la `a` dorada sobre navy. Una OG image simple navy+wordmark.
- **Sin backend.** Contacto = `mailto:`. (Si más adelante se quiere captura de email, se enchufa Kit como en comolocobro — fuera de alcance de v1.)
- **Deploy:** Cloudflare Pages, mismo patrón que comolocobro (repo propio en GitHub, dominio + SSL + redirect www→raíz).

## 7. Fuera de alcance (v1)

Blog/CMS, login, dashboards, analytics propios, formularios con backend, multi-idioma, light mode, cualquier copy que implique consultoría/advisory.

## 8. Criterios de aceptación

- [ ] Respeta la identidad (paleta, wordmark mono + cursor dorado, tagline, plano sin glow).
- [ ] Las 6 secciones presentes, en orden, sin lorem ipsum.
- [ ] comolocobro aparece como producto `live` con link correcto.
- [ ] Cero lenguaje de consultoría; white-label encuadrado como "construimos el MVP".
- [ ] Responsive 375px → desktop; Lighthouse 95+ en performance y accesibilidad.
- [ ] Meta + OG + favicon completos.
- [ ] Deployable a Cloudflare Pages sin pasos manuales raros.

---

### Notas para el copy (borradores en voz de marca)

- Hero: `aigralys` · `// build → ship → repeat.` · "Un sello de productos digitales propios."
- Qué es: "Aigralys es un estudio que lanza productos digitales propios, a su ritmo y en público. Pocos por año, cada uno con su propia cara."
- comolocobro card: "Cómo cobrar desde afuera en Argentina, sin vueltas." — estado `live`.
- White-label: "¿Necesitás un MVP construido? A veces tomamos un proyecto por trimestre. Escribinos."
