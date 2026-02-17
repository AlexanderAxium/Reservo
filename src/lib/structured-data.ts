const SITE_NAME = "CanchaLibre";
const SITE_URL = process.env.SITE_URL ?? "https://canchalibre.com";

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    legalName: SITE_NAME,
    description:
      "CanchaLibre es la plataforma para reservar canchas deportivas de fútbol, tenis, basketball y más.",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lima",
      addressCountry: "PE",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "contacto@canchalibre.com",
        availableLanguage: ["Spanish", "English"],
      },
    ],
    sameAs: [],
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description:
      "CanchaLibre es la plataforma para reservar canchas deportivas de fútbol, tenis, basketball y más.",
    url: SITE_URL,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/canchas?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateSportsFacilitySchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: SITE_NAME,
    description:
      "Plataforma de reservas de canchas deportivas. Encuentra y reserva canchas de fútbol, tenis, basketball y más.",
    url: SITE_URL,
    sport: ["Football", "Tennis", "Basketball", "Volleyball", "Futsal"],
  };
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}#business`,
    name: SITE_NAME,
    description:
      "Plataforma de reservas de canchas deportivas en Perú. Fútbol, tenis, basketball, volleyball y más.",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/logo.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lima",
      addressCountry: "PE",
    },
    areaServed: {
      "@type": "Country",
      name: "Perú",
    },
  };
}
