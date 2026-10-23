// Copy bilingüe. ES es el default (raíz `/`), EN en `/en/`.

export const MAIL = "hello@aigralys.com";
export const X_URL = "https://x.com/Aigralys";
// El formulario se entrega en hello@aigralys.com (Cloudflare Email Routing).
export const FORM_ENDPOINT = `https://formsubmit.co/ajax/${MAIL}`;

export const languages = {
  es: "ES",
  en: "EN",
} as const;

export type Lang = keyof typeof languages;

export const localeTag: Record<Lang, string> = {
  es: "es-AR",
  en: "en",
};

export const localeHref: Record<Lang, string> = {
  es: "/",
  en: "/en/",
};

export type CaseId = "bancor" | "clearlit" | "comolocobro" | "bitewave";

type Case = {
  id: CaseId;
  name: string;
  kind: string;
  tags: string[];
  problem: string;
  ai: string;
  result: string;
  href?: string;
  hrefLabel?: string;
  shot?: string;
};

type Strings = {
  meta: { title: string; description: string };
  skipToContent: string;
  nav: { services: string; cases: string; contact: string };
  hero: {
    title: string;
    lede: string;
    ctaContact: string;
    ctaCases: string;
    session: string;
    log: string[];
    caption: string;
  };
  services: {
    heading: string;
    intro: string;
    items: { title: string; body: string; examples: string[] }[];
  };
  cases: {
    heading: string;
    intro: string;
    labels: { problem: string; ai: string; result: string };
    views: { dia: string; atardecer: string; noche: string };
    viewsLabel: string;
    items: Case[];
  };
  process: { heading: string; steps: { title: string; body: string }[] };
  contact: {
    heading: string;
    lede: string;
    name: string;
    email: string;
    company: string;
    need: string;
    needOptions: string[];
    message: string;
    messageHint: string;
    submit: string;
    sending: string;
    ok: string;
    error: string;
    subject: string;
  };
  footer: { tagline: string; rights: string; backToTop: string; followX: string };
};

export const strings: Record<Lang, Strings> = {
  es: {
    meta: {
      title: "aigralys — productos digitales y agentes de IA",
      description:
        "Estudio que construye productos digitales con IA y agentes que automatizan, diseñan y producen para tu negocio. Consultoría e implementación de IA.",
    },
    skipToContent: "Saltar al contenido",
    nav: { services: "qué hacemos", cases: "casos", contact: "contacto" },
    hero: {
      title: "Productos y agentes de IA que trabajan para tu negocio.",
      lede: "Diseñamos, construimos y operamos productos digitales con IA adentro. Desde un agente que automatiza una tarea hasta un equipo de agentes que produce los renders o el comercial de tu marca.",
      ctaContact: "Contanos tu proyecto",
      ctaCases: "Ver casos",
      session: "agente de render / bancor-arena",
      log: [
        "brief: tribuna modular, vista nocturna, LEDs encendidos",
        "escena abierta en Blender vía MCP",
        "cámara, luces y materiales ajustados",
        "render 3840 × 2160 entregado",
      ],
      caption: "Render producido por un agente de IA conectado a Blender, para Bancor Arena.",
    },
    services: {
      heading: "Qué hacemos",
      intro: "Cuatro formas de poner IA a trabajar. Se pueden combinar.",
      items: [
        {
          title: "Agentes que automatizan",
          body: "Un agente que atiende consultas, cotiza, carga datos o arma el reporte de cada lunes. Conectado a las herramientas que ya usás.",
          examples: ["atención y respuesta", "cotizaciones", "carga y cruce de datos", "reportes"],
        },
        {
          title: "Agentes creativos para tu marca",
          body: "Asignamos agentes a tu negocio para producir renders 3D, piezas para redes y comerciales audiovisuales con IA, con herramientas como Higgsfield y Blender.",
          examples: ["renders de producto", "comerciales con IA", "piezas para redes", "visores 3D"],
        },
        {
          title: "Productos digitales con IA",
          body: "De la idea a producción: apps web, herramientas internas y dispositivos IoT con modelos de IA adentro. Lo construimos y lo dejamos andando.",
          examples: ["apps web", "herramientas internas", "IoT y sensores", "MVPs"],
        },
        {
          title: "Consultoría en IA",
          body: "Dónde conviene usar IA en tu negocio, cuánto cuesta operarla y por dónde empezar. Con un prototipo en la mano, no con una presentación.",
          examples: ["casos de uso", "costos de operación", "elección de herramientas", "hoja de ruta"],
        },
      ],
    },
    cases: {
      heading: "Casos",
      intro: "Proyectos para clientes y productos propios. Cada uno pone la IA a trabajar de una forma distinta.",
      labels: { problem: "El problema", ai: "Qué hace la IA", result: "Resultado" },
      views: { dia: "día", atardecer: "atardecer", noche: "noche" },
      viewsLabel: "Ver render",
      items: [
        {
          id: "bancor",
          name: "Bancor Arena",
          kind: "cliente",
          tags: ["agentes creativos", "3D", "sitio de venta"],
          problem: "Una constructora sustentable con un producto nuevo, una tribuna modular sobre contenedor marítimo, y ninguna imagen para venderlo.",
          ai: "Conectamos un agente de IA a Blender por MCP. El agente arma la escena, ajusta luces y cámaras y produce los renders de día, atardecer y noche, más el modelo 3D interactivo del sitio.",
          result: "Sitio de venta con visor 3D y consultas separadas por segmento, sin una sola sesión de fotos.",
          href: "https://bancor-arena.pages.dev",
          hrefLabel: "bancor-arena.pages.dev",
        },
        {
          id: "clearlit",
          name: "clearlit",
          kind: "producto propio",
          tags: ["análisis con IA", "SaaS"],
          problem: "Las apps hechas con Lovable, Bolt o v0 esconden costos que aparecen recién cuando crecen.",
          ai: "Un análisis automático lee la app, detecta las trampas de costo y propone el arreglo de cada una.",
          result: "En producción e indexado en Google, con un chequeo gratuito como puerta de entrada.",
          href: "https://clearlit.app",
          hrefLabel: "clearlit.app",
          shot: "/shots/clearlit.png",
        },
        {
          id: "comolocobro",
          name: "comolocobro",
          kind: "producto propio",
          tags: ["motor de recomendación", "contenido con agentes"],
          problem: "Cobrar desde el exterior en Argentina es un laberinto de plataformas, comisiones e impuestos.",
          ai: "Un motor compara rutas de cobro y calcula cuánto te queda en mano. Lo mantiene un flujo de agentes que actualiza contenido y escalas cuando cambia la normativa.",
          result: "En producción, con tráfico orgánico y respuestas al día.",
          href: "https://comolocobro.com",
          hrefLabel: "comolocobro.com",
          shot: "/shots/comolocobro.png",
        },
        {
          id: "bitewave",
          name: "Bitewave",
          kind: "I+D",
          tags: ["IoT", "tinyML", "datos a contenido"],
          problem: "Hay señales físicas que nadie está leyendo: vibraciones, golpes, movimiento.",
          ai: "Un sensor Seeed Studio captura la vibración, un pipeline la limpia y la convierte en eventos, y un modelo tinyML en el propio dispositivo puede clasificarlos sin conexión. Primer uso: la vibración de una caña de pesca convertida en música y overlays para video.",
          result: "La misma base sirve para mantenimiento predictivo de motores y bombas, monitoreo de maquinaria agrícola o cualquier lugar donde una vibración cuenta algo.",
        },
      ],
    },
    process: {
      heading: "Cómo trabajamos",
      steps: [
        { title: "Nos contás el problema", body: "Por el formulario o en persona. Sin compromiso." },
        { title: "Prototipo en semanas", body: "Algo que funciona y se puede probar, no una presentación." },
        { title: "A producción", body: "Lo terminamos, lo medimos y, si hace falta, lo seguimos operando." },
      ],
    },
    contact: {
      heading: "Contanos tu proyecto",
      lede: "Dejanos el problema o la idea. Te respondemos por mail.",
      name: "Nombre",
      email: "Email",
      company: "Empresa o marca (opcional)",
      need: "Qué necesitás",
      needOptions: [
        "Un agente para automatizar algo",
        "Renders, piezas o un comercial con IA",
        "Un producto digital o IoT",
        "Consultoría en IA",
        "Otra cosa",
      ],
      message: "Contanos un poco más",
      messageHint: "Qué hace tu negocio y qué te gustaría resolver.",
      submit: "Enviar consulta",
      sending: "Enviando…",
      ok: "Consulta enviada. Te escribimos pronto.",
      error: `No se pudo enviar. Probá de nuevo en un rato o escribinos a ${MAIL}.`,
      subject: "Nueva consulta desde aigralys.com",
    },
    footer: {
      tagline: "// build → ship → repeat.",
      rights: "productos digitales y agentes de IA.",
      backToTop: "volver arriba",
      followX: "Aigralys en X",
    },
  },

  en: {
    meta: {
      title: "aigralys — digital products and AI agents",
      description:
        "A studio building AI-native digital products and agents that automate, design and produce for your business. AI consulting and implementation.",
    },
    skipToContent: "Skip to content",
    nav: { services: "what we do", cases: "work", contact: "contact" },
    hero: {
      title: "AI products and agents that work for your business.",
      lede: "We design, build and run digital products with AI inside. From one agent that automates a task to a team of agents producing your brand's renders or commercial.",
      ctaContact: "Tell us about your project",
      ctaCases: "See the work",
      session: "render agent / bancor-arena",
      log: [
        "brief: modular grandstand, night view, LEDs on",
        "scene opened in Blender over MCP",
        "camera, lights and materials set",
        "3840 × 2160 render delivered",
      ],
      caption: "Render produced by an AI agent connected to Blender, for Bancor Arena.",
    },
    services: {
      heading: "What we do",
      intro: "Four ways to put AI to work. They combine well.",
      items: [
        {
          title: "Agents that automate",
          body: "An agent that answers inquiries, writes quotes, enters data or builds the Monday report. Plugged into the tools you already use.",
          examples: ["customer replies", "quotes", "data entry and matching", "reports"],
        },
        {
          title: "Creative agents for your brand",
          body: "We assign agents to your business to produce 3D renders, social pieces and AI video commercials, with tools like Higgsfield and Blender.",
          examples: ["product renders", "AI commercials", "social pieces", "3D viewers"],
        },
        {
          title: "AI-native digital products",
          body: "From idea to production: web apps, internal tools and IoT devices with AI models inside. We build it and keep it running.",
          examples: ["web apps", "internal tools", "IoT and sensors", "MVPs"],
        },
        {
          title: "AI consulting",
          body: "Where AI pays off in your business, what it costs to run and where to start. With a working prototype, not a slide deck.",
          examples: ["use cases", "running costs", "tool selection", "roadmap"],
        },
      ],
    },
    cases: {
      heading: "Work",
      intro: "Client projects and our own products. Each one puts AI to work in a different way.",
      labels: { problem: "The problem", ai: "What the AI does", result: "Outcome" },
      views: { dia: "day", atardecer: "sunset", noche: "night" },
      viewsLabel: "View render",
      items: [
        {
          id: "bancor",
          name: "Bancor Arena",
          kind: "client",
          tags: ["creative agents", "3D", "sales site"],
          problem: "A sustainable builder with a new product, a modular grandstand on a shipping container, and no images to sell it with.",
          ai: "We connected an AI agent to Blender over MCP. The agent sets up the scene, tunes lights and cameras and produces the day, sunset and night renders, plus the interactive 3D model on the site.",
          result: "A sales site with a 3D viewer and inquiries split by segment, without a single photo shoot.",
          href: "https://bancor-arena.pages.dev",
          hrefLabel: "bancor-arena.pages.dev",
        },
        {
          id: "clearlit",
          name: "clearlit",
          kind: "own product",
          tags: ["AI analysis", "SaaS"],
          problem: "Apps built with Lovable, Bolt or v0 hide costs that only show up once they grow.",
          ai: "An automated analysis reads the app, finds the cost traps and proposes a fix for each one.",
          result: "Live and indexed on Google, with a free check as the way in.",
          href: "https://clearlit.app",
          hrefLabel: "clearlit.app",
          shot: "/shots/clearlit.png",
        },
        {
          id: "comolocobro",
          name: "comolocobro",
          kind: "own product",
          tags: ["recommendation engine", "agent-run content"],
          problem: "Getting paid from abroad in Argentina is a maze of platforms, fees and taxes.",
          ai: "An engine compares payout routes and works out what you actually keep. An agent workflow keeps content and tax brackets current when the rules change.",
          result: "Live, with organic traffic and up-to-date answers.",
          href: "https://comolocobro.com",
          hrefLabel: "comolocobro.com",
          shot: "/shots/comolocobro.png",
        },
        {
          id: "bitewave",
          name: "Bitewave",
          kind: "R&D",
          tags: ["IoT", "tinyML", "data to content"],
          problem: "Some physical signals go unread: vibration, impacts, motion.",
          ai: "A Seeed Studio sensor captures vibration, a pipeline cleans it and turns it into events, and an on-device tinyML model can classify them offline. First use: a fishing rod's vibration turned into music and overlays for video.",
          result: "The same base fits predictive maintenance for motors and pumps, farm machinery monitoring, or anywhere a vibration tells you something.",
        },
      ],
    },
    process: {
      heading: "How we work",
      steps: [
        { title: "You tell us the problem", body: "Through the form or in person. No strings attached." },
        { title: "A prototype in weeks", body: "Something that works and can be tried, not a presentation." },
        { title: "Into production", body: "We finish it, measure it and, if needed, keep running it." },
      ],
    },
    contact: {
      heading: "Tell us about your project",
      lede: "Leave us the problem or the idea. We'll reply by email.",
      name: "Name",
      email: "Email",
      company: "Company or brand (optional)",
      need: "What do you need",
      needOptions: [
        "An agent to automate something",
        "Renders, pieces or an AI commercial",
        "A digital or IoT product",
        "AI consulting",
        "Something else",
      ],
      message: "Tell us a bit more",
      messageHint: "What your business does and what you'd like to solve.",
      submit: "Send inquiry",
      sending: "Sending…",
      ok: "Inquiry sent. We'll write back soon.",
      error: `It didn't go through. Try again shortly or write to ${MAIL}.`,
      subject: "New inquiry from aigralys.com",
    },
    footer: {
      tagline: "// build → ship → repeat.",
      rights: "digital products and AI agents.",
      backToTop: "back to top",
      followX: "Aigralys on X",
    },
  },
};
