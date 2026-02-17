import type { Metadata } from "next";

const SITE_NAME = "CanchaLibre";
const SITE_URL = process.env.SITE_URL ?? "https://canchalibre.com";

export const defaultMetadata: Metadata = {
  title: {
    default: "CanchaLibre - Reserva Canchas Deportivas Online",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "CanchaLibre es la plataforma para reservar canchas deportivas de fútbol, tenis, basketball y más. Encuentra y reserva tu cancha ideal en segundos.",
  keywords: [
    "reserva canchas",
    "canchas deportivas",
    "alquiler canchas",
    "fútbol",
    "tenis",
    "basketball",
    "reservas online",
    "canchas cerca de mí",
    "deportes",
    "centros deportivos",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: SITE_URL,
    title: "CanchaLibre - Reserva Canchas Deportivas Online",
    description:
      "Encuentra y reserva canchas deportivas de fútbol, tenis, basketball y más. Tu plataforma de reservas deportivas.",
    siteName: SITE_NAME,
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "CanchaLibre - Reserva Canchas Deportivas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CanchaLibre - Reserva Canchas Deportivas Online",
    description:
      "Encuentra y reserva canchas deportivas de fútbol, tenis, basketball y más.",
    images: ["/logo.png"],
    creator: "@canchalibre",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
};

export function generateMetadata({
  title,
  description,
  keywords,
  image,
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
}): Metadata {
  return {
    title: title ? `${title} | ${SITE_NAME}` : defaultMetadata.title,
    description: description ?? defaultMetadata.description,
    keywords: keywords ?? defaultMetadata.keywords,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: title ?? defaultMetadata.openGraph?.title,
      description: description ?? defaultMetadata.openGraph?.description,
      images: image ? [{ url: image }] : defaultMetadata.openGraph?.images,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: title ?? defaultMetadata.twitter?.title,
      description: description ?? defaultMetadata.twitter?.description,
      images: image ? [image] : defaultMetadata.twitter?.images,
    },
  };
}

export const homePageMetadata: Metadata = {
  title: "CanchaLibre - Reserva Canchas Deportivas Online",
  description:
    "CanchaLibre es la plataforma para reservar canchas deportivas de fútbol, tenis, basketball y más. Encuentra y reserva tu cancha ideal en segundos.",
  keywords: defaultMetadata.keywords as string[],
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: SITE_URL,
    title: "CanchaLibre - Reserva Canchas Deportivas Online",
    description:
      "Encuentra y reserva canchas deportivas de fútbol, tenis, basketball y más. Tu plataforma de reservas deportivas.",
    siteName: SITE_NAME,
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "CanchaLibre - Reserva Canchas Deportivas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CanchaLibre - Reserva Canchas Deportivas Online",
    description:
      "Encuentra y reserva canchas deportivas de fútbol, tenis, basketball y más.",
    images: ["/logo.png"],
  },
};
