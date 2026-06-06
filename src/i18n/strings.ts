// Copy bilingüe de la landing. EN es el default (raíz `/`), ES en `/es`.
// Fuente: docs/PRD.md (§5 + sección "Copy EN").

export const MAIL = "hello@aigralys.com";

export const languages = {
  en: "EN",
  es: "ES",
} as const;

export type Lang = keyof typeof languages;

export const localeTag: Record<Lang, string> = {
  en: "en",
  es: "es-AR",
};

type Product = {
  name: string;
  line: string;
  status: "live" | "wip";
  href?: string;
  hrefLabel?: string;
};

type Strings = {
  meta: { title: string; description: string };
  skipToContent: string;
  nav: { products: string };
  hero: { subtitle: string; ctaProducts: string; ctaContact: string };
  about: { heading: string; body: string };
  products: { heading: string; live: string; wip: string; items: Product[] };
  how: { heading: string; principles: string[] };
  work: { heading: string; body: string; cta: string };
  footer: { tagline: string; products: string; rights: string; backToTop: string };
};

export const strings: Record<Lang, Strings> = {
  en: {
    meta: {
      title: "aigralys — a studio shipping its own digital products",
      description:
        "Aigralys is a studio shipping its own digital products. build, ship, repeat.",
    },
    skipToContent: "Skip to content",
    nav: { products: "products" },
    hero: {
      subtitle: "A studio shipping its own digital products.",
      ctaProducts: "see products",
      ctaContact: "get in touch",
    },
    about: {
      heading: "What is Aigralys",
      body: "Aigralys is a studio that ships its own digital products, at its own pace and in public. A few a year, each with its own face.",
    },
    products: {
      heading: "Products",
      live: "live",
      wip: "wip",
      items: [
        {
          name: "comolocobro",
          line: "Getting paid from abroad in Argentina, without the runaround.",
          status: "live",
          href: "https://comolocobro.com",
          hrefLabel: "comolocobro.com",
        },
        { name: "Product #2", line: "In exploration.", status: "wip" },
        { name: "Product #3", line: "In exploration.", status: "wip" },
      ],
    },
    how: {
      heading: "How we work",
      principles: ["We ship fast.", "We build in public.", "Few products, done well."],
    },
    work: {
      heading: "Work with Aigralys",
      body: "Need an MVP built? We take on one project a quarter.",
      cta: "get in touch",
    },
    footer: {
      tagline: "// build → ship → repeat.",
      products: "products",
      rights: "a studio shipping its own digital products.",
      backToTop: "back to top",
    },
  },

  es: {
    meta: {
      title: "aigralys — un sello de productos digitales propios",
      description:
        "Aigralys es un sello de productos digitales propios. build, ship, repeat.",
    },
    skipToContent: "Saltar al contenido",
    nav: { products: "productos" },
    hero: {
      subtitle: "Un sello de productos digitales propios.",
      ctaProducts: "ver productos",
      ctaContact: "escribir",
    },
    about: {
      heading: "Qué es Aigralys",
      body: "Aigralys es un estudio que lanza productos digitales propios, a su ritmo y en público. Pocos por año, cada uno con su propia cara.",
    },
    products: {
      heading: "Productos",
      live: "live",
      wip: "wip",
      items: [
        {
          name: "comolocobro",
          line: "Cómo cobrar desde afuera en Argentina, sin vueltas.",
          status: "live",
          href: "https://comolocobro.com",
          hrefLabel: "comolocobro.com",
        },
        { name: "Producto #2", line: "En exploración.", status: "wip" },
        { name: "Producto #3", line: "En exploración.", status: "wip" },
      ],
    },
    how: {
      heading: "Cómo trabajamos",
      principles: ["Enviamos rápido.", "Construimos en público.", "Pocos productos, bien hechos."],
    },
    work: {
      heading: "Trabajar con Aigralys",
      body: "¿Necesitás un MVP construido? A veces tomamos un proyecto por trimestre.",
      cta: "escribir",
    },
    footer: {
      tagline: "// build → ship → repeat.",
      products: "productos",
      rights: "un sello de productos digitales propios.",
      backToTop: "volver arriba",
    },
  },
};

// Path raíz para cada idioma (EN sin prefijo, ES bajo /es).
export const localeHref: Record<Lang, string> = {
  en: "/",
  es: "/es/",
};
