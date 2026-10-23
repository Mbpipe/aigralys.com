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
  hud: string[];
  href?: string;
  hrefLabel?: string;
};

type Strings = {
  meta: { title: string; description: string };
  skipToContent: string;
  nav: { open: string; cases: string; contact: string };
  hero: {
    title: string;
    lede: string;
    ctaContact: string;
    ctaCases: string;
    scroll: string;
  };
  open: {
    prefix: string;
    phrases: string[];
    body: string;
    cta: string;
    marquee: string[];
  };
  cases: {
    heading: string;
    intro: string;
    labels: { problem: string; ai: string; result: string };
    items: Case[];
  };
  agro: { lead: string; items: string[]; cta: string };
  process: { heading: string; steps: { title: string; body: string }[] };
  contact: {
    heading: string;
    lede: string;
    name: string;
    email: string;
    company: string;
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
    nav: { open: "qué podemos hacer", cases: "casos", contact: "contacto" },
    hero: {
      title: "Productos y agentes de IA que trabajan para tu negocio.",
      lede: "Diseñamos, construimos y operamos productos y agentes de IA a medida. Si tu negocio tiene un proceso, un producto o una idea, hay algo para poner a trabajar.",
      ctaContact: "Contanos tu proyecto",
      ctaCases: "Ver casos",
      scroll: "seguí bajando",
    },
    open: {
      prefix: "La IA puede",
      phrases: [
        "responder consultas a las 3 de la mañana.",
        "renderizar un producto que todavía no se fabricó.",
        "filmar un comercial sin cámara.",
        "escuchar la vibración de una máquina antes de que se rompa.",
        "cotizar en segundos lo que hoy lleva un día.",
        "ordenar diez años de planillas.",
        "hacer eso que estás pensando.",
      ],
      body: "Agentes, productos digitales, piezas audiovisuales, dispositivos conectados o consultoría. No trabajamos con un catálogo: arrancamos por tu problema, aunque no se parezca a nada de lo que ves acá.",
      cta: "Contanos el tuyo",
      marquee: [
        "agentes autónomos", "automatización", "renders 3D", "video generativo", "MCP", "LLMs",
        "RAG", "visión por computadora", "tinyML", "IoT", "productos digitales", "consultoría IA",
      ],
    },
    cases: {
      heading: "Casos",
      intro: "Cuatro proyectos, cuatro formas de poner IA a trabajar: agentes creativos, análisis automático, motores de decisión y sensores que entienden lo que pasa.",
      labels: { problem: "El problema", ai: "Qué hace la IA", result: "Resultado" },
      items: [
        {
          id: "bancor",
          name: "Bancor Arena",
          kind: "cliente",
          tags: ["agentes creativos", "3D", "MCP"],
          problem: "Un producto nuevo, una tribuna modular sobre contenedor marítimo, y ninguna imagen para salir a venderlo.",
          ai: "Conectamos un agente de IA a Blender por MCP. El agente arma la escena, ajusta luces y cámaras y produce renders de día, atardecer y noche, más el modelo 3D interactivo del sitio.",
          result: "Sitio de venta con visor 3D y consultas separadas por segmento, sin una sola sesión de fotos.",
          hud: ["brief: tribuna, vista nocturna, LEDs", "Blender vía MCP: escena, luces, cámara", "render 3840 × 2160 entregado"],
          href: "https://bancor-arena.pages.dev",
          hrefLabel: "bancor-arena.pages.dev",
        },
        {
          id: "clearlit",
          name: "clearlit",
          kind: "producto propio",
          tags: ["análisis con IA", "SaaS"],
          problem: "Las apps hechas con Lovable, Bolt o v0 funcionan, pero esconden costos que explotan cuando crecen.",
          ai: "Un análisis automático lee el stack de la app, detecta cada trampa de costo y escribe el arreglo listo para pegárselo al asistente que la construyó.",
          result: "Una app con 25 mil usuarios pasó de unos USD 800 a USD 75 por mes con un solo arreglo. Chequeo gratis, reporte completo pago.",
          hud: ["leyendo el stack de la app", "3 trampas de costo detectadas", "≈ USD 800 → 75 por mes"],
          href: "https://clearlit.app",
          hrefLabel: "clearlit.app",
        },
        {
          id: "comolocobro",
          name: "comolocobro",
          kind: "producto propio",
          tags: ["motor de decisión", "agentes de contenido"],
          problem: "Te pagan en dólares desde afuera y no sabés cuánto te queda en el bolsillo ni por dónde conviene cobrarlo.",
          ai: "Un motor cruza el método de cobro, tu situación fiscal y el dólar en vivo, y calcula el neto real. Un flujo de agentes mantiene al día escalas, guías y contenido.",
          result: "En producción, con tráfico orgánico de gente que busca exactamente esa respuesta.",
          hud: ["USD 2.000 por mes, monotributo", "comparando métodos con el dólar en vivo", "mejor ruta para tu caso"],
          href: "https://comolocobro.com",
          hrefLabel: "comolocobro.com",
        },
        {
          id: "bitewave",
          name: "Bitewave",
          kind: "I+D propio",
          tags: ["IoT", "Edge AI", "tinyML"],
          problem: "Un sensor tradicional manda números: la bomba vibra a tal intensidad. Alguien tiene que mirarlos, saber qué es normal y darse cuenta a tiempo de que algo cambió.",
          ai: "Bitewave interpreta en el propio dispositivo. Un sensor Seeed Studio con tinyML aprende el patrón habitual de cada máquina y lo compara en tiempo real, sin depender de la conexión ni de la nube.",
          result: "Un sensor tradicional te dice: la bomba vibra a 4,2\u00a0mm/s. Bitewave te dice: el patrón de vibración cambió respecto de su funcionamiento habitual. Esa diferencia es lo que vuelve atractiva la combinación de IoT y Edge AI.",
          hud: ["aprendiendo el patrón habitual", "comparando contra lo normal, en el dispositivo", "patrón distinto: aviso enviado"],
        },
      ],
    },
    agro: {
      lead: "La misma base también escucha",
      items: [
        "detección acústica de plagas",
        "actividad del ganado",
        "mantenimiento predictivo de maquinaria",
        "funcionamiento de bombas",
        "silos inteligentes",
        "humedad de suelo",
        "apertura de tranqueras",
        "colmenas",
        "anomalías en molinos",
        "actividad de aves",
      ],
      cta: "¿Otra idea? Contanos",
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
      heading: "¿Qué querés poner a trabajar?",
      lede: "Contanos qué hace tu negocio y qué te gustaría resolver. Te respondemos por mail.",
      name: "Nombre",
      email: "Email",
      company: "Empresa o marca (opcional)",
      message: "Tu proyecto, problema o idea",
      messageHint: "Lo que sea. Si no sabés por dónde empezar, también sirve.",
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
    nav: { open: "what's possible", cases: "work", contact: "contact" },
    hero: {
      title: "AI products and agents that work for your business.",
      lede: "We design, build and run custom AI products and agents. If your business has a process, a product or an idea, there's something to put to work.",
      ctaContact: "Tell us about your project",
      ctaCases: "See the work",
      scroll: "keep scrolling",
    },
    open: {
      prefix: "AI can",
      phrases: [
        "answer customers at 3 a.m.",
        "render a product that hasn't been built yet.",
        "shoot a commercial without a camera.",
        "hear a machine's vibration before it breaks.",
        "quote in seconds what takes a day today.",
        "sort out ten years of spreadsheets.",
        "do that thing you're thinking of.",
      ],
      body: "Agents, digital products, video and visuals, connected devices or consulting. We don't work from a catalog: we start from your problem, even if it looks nothing like what you see here.",
      cta: "Tell us yours",
      marquee: [
        "autonomous agents", "automation", "3D renders", "generative video", "MCP", "LLMs",
        "RAG", "computer vision", "tinyML", "IoT", "digital products", "AI consulting",
      ],
    },
    cases: {
      heading: "Work",
      intro: "Four projects, four ways to put AI to work: creative agents, automated analysis, decision engines and sensors that understand what's happening.",
      labels: { problem: "The problem", ai: "What the AI does", result: "Outcome" },
      items: [
        {
          id: "bancor",
          name: "Bancor Arena",
          kind: "client",
          tags: ["creative agents", "3D", "MCP"],
          problem: "A new product, a modular grandstand on a shipping container, and no images to go out and sell it.",
          ai: "We connected an AI agent to Blender over MCP. The agent sets up the scene, tunes lights and cameras and produces day, sunset and night renders, plus the interactive 3D model on the site.",
          result: "A sales site with a 3D viewer and inquiries split by segment, without a single photo shoot.",
          hud: ["brief: grandstand, night view, LEDs", "Blender over MCP: scene, lights, camera", "3840 × 2160 render delivered"],
          href: "https://bancor-arena.pages.dev",
          hrefLabel: "bancor-arena.pages.dev",
        },
        {
          id: "clearlit",
          name: "clearlit",
          kind: "own product",
          tags: ["AI analysis", "SaaS"],
          problem: "Apps built with Lovable, Bolt or v0 work, but hide costs that blow up as they grow.",
          ai: "An automated analysis reads the app's stack, finds every cost trap and writes the fix, ready to paste into the assistant that built it.",
          result: "One app at 25k users went from about USD 800 to USD 75 a month with a single fix. Free check, paid full report.",
          hud: ["reading the app's stack", "3 cost traps found", "≈ USD 800 → 75 a month"],
          href: "https://clearlit.app",
          hrefLabel: "clearlit.app",
        },
        {
          id: "comolocobro",
          name: "comolocobro",
          kind: "own product",
          tags: ["decision engine", "content agents"],
          problem: "You get paid in dollars from abroad and don't know what you actually keep or the best way to collect it.",
          ai: "An engine combines the payout method, your tax status and the live exchange rate, and works out your real net. An agent workflow keeps brackets, guides and content current.",
          result: "Live, with organic traffic from people searching for exactly that answer.",
          hud: ["USD 2,000 a month, monotributo", "comparing methods at the live rate", "best route for your case"],
          href: "https://comolocobro.com",
          hrefLabel: "comolocobro.com",
        },
        {
          id: "bitewave",
          name: "Bitewave",
          kind: "in-house R&D",
          tags: ["IoT", "Edge AI", "tinyML"],
          problem: "A traditional sensor sends numbers: the pump vibrates at this intensity. Someone has to watch them, know what normal looks like and notice in time that something changed.",
          ai: "Bitewave interprets on the device itself. A Seeed Studio sensor with tinyML learns each machine's usual pattern and compares against it in real time, without relying on a connection or the cloud.",
          result: "A traditional sensor tells you: the pump is vibrating at 4.2\u00a0mm/s. Bitewave tells you: the vibration pattern has changed from its usual behavior. That difference is what makes IoT plus Edge AI worth it.",
          hud: ["learning the usual pattern", "comparing against normal, on the device", "different pattern: alert sent"],
        },
      ],
    },
    agro: {
      lead: "The same base also listens to",
      items: [
        "acoustic pest detection",
        "livestock activity",
        "predictive machinery maintenance",
        "pump monitoring",
        "smart silos",
        "soil moisture",
        "gate opening alerts",
        "beehives",
        "windmill anomalies",
        "bird activity",
      ],
      cta: "Another idea? Tell us",
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
      heading: "What do you want to put to work?",
      lede: "Tell us what your business does and what you'd like to solve. We'll reply by email.",
      name: "Name",
      email: "Email",
      company: "Company or brand (optional)",
      message: "Your project, problem or idea",
      messageHint: "Anything goes. Not sure where to start? That works too.",
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
