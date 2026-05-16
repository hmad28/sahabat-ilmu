import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO Configuration - Optimized for Google Search
export const metadata: Metadata = {
  // Basic Metadata
  title: {
    default: "Sahabat Ilmu - Cari Dalil dan Ilmu dengan Rujukan",
    template: "%s | Sahabat Ilmu",
  },
  description:
    "Sahabat Ilmu membantu mencari dalil, kajian, dan pengetahuan agama melalui ringkasan AI dari Yufid.com dan tautan sumber untuk dibaca langsung.",

  // Keywords untuk SEO (meski tidak terlalu berpengaruh, tetap bagus untuk dokumentasi)
  keywords: [
    "kajian islam",
    "cari dalil islam",
    "belajar islam online",
    "chatbot islam",
    "tanya jawab islam",
    "ilmu agama islam",
    "platform pembelajaran islam",
    "AI islam",
    "chatbot islamic",
    "ustadz online",
    "belajar quran",
    "hadits",
    "fiqih",
    "tauhid",
    "aqidah",
    "syariah",
    "pembelajaran agama",
    "ilmu islami",
    "sahabat ilmu",
  ],

  // Authors
  authors: [
    {
      name: "Tim Sahabat Ilmu",
      url: "https://sahabat-ilmu.vercel.app",
    },
  ],

  // Creator
  creator: "Sahabat Ilmu",
  publisher: "Sahabat Ilmu",

  // Robots
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

  // Open Graph (untuk Facebook, WhatsApp, LinkedIn)
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://sahabat-ilmu.vercel.app",
    siteName: "Sahabat Ilmu",
    title: "Sahabat Ilmu - Cari Dalil dan Ilmu dengan Rujukan",
    description:
      "Cari dalil, kajian, dan pengetahuan agama melalui ringkasan AI dari Yufid.com dan tautan sumber untuk dibaca langsung.",
    images: [
      {
        url: "/images/1200x630-sahabat-ilmu.png",
        width: 1200,
        height: 630,
        alt: "Sahabat Ilmu - Platform Pembelajaran Islam",
        type: "image/jpeg",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Sahabat Ilmu - Cari Dalil dan Ilmu dengan Rujukan",
    description:
      "Cari dalil, kajian, dan pengetahuan agama melalui ringkasan AI dari Yufid.com dan tautan sumber untuk dibaca langsung.",
    images: ["/images/1200x630-sahabat-ilmu.png"],
    creator: "@sahabatilmu",
    site: "@sahabatilmu",
  },

  // Verification (Google Search Console, Bing, etc)
  verification: {
    google: "gCMZDvDQ_U2QHTFv1hoE9XC76oZF7t2Z1k7d19EJj0o",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },

  // Alternate Languages
  alternates: {
    canonical: "https://sahabat-ilmu.vercel.app",
    languages: {
      "id-ID": "https://sahabat-ilmu.vercel.app",
      "en-US": "https://sahabat-ilmu.vercel.app/en",
    },
  },

  // Category
  category: "education",

  // App Links (jika ada mobile app)
  // appLinks: {
  //   ios: {
  //     url: "sahabatilmu://",
  //     app_store_id: "your-app-store-id",
  //   },
  //   android: {
  //     url: "sahabatilmu://",
  //     package: "com.sahabatilmu.app",
  //   },
  // },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico" },
      {
        url: "/images/16x16-icon-sahabat-ilmu.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/images/32x32-icon-sahabat-ilmu.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      { url: "/images/180x180-sahabat-ilmu.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },

  // Manifest (PWA)
  manifest: "/manifest.webmanifest",

  // Other metadata
  metadataBase: new URL("https://sahabat-ilmu.vercel.app"),

  // Format Detection
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Additional SEO Tags */}
        <meta name="theme-color" content="#fffaf0" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        <meta
          property="og:title"
          content="Sahabat Ilmu - Cari Dalil dan Ilmu dengan Rujukan"
        />
        <meta
          property="og:description"
          content="Cari dalil, kajian, dan pengetahuan agama melalui ringkasan AI dari Yufid.com dan tautan sumber untuk dibaca langsung."
        />
        <meta property="og:image" content="/images/1200x630-sahabat-ilmu.png" />
        <meta property="og:url" content="https://sahabat-ilmu.vercel.app/" />

        {/* <!-- Twitter --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Sahabat Ilmu - Cari Dalil dan Ilmu dengan Rujukan"
        />
        <meta
          name="twitter:description"
          content="Cari dalil, kajian, dan pengetahuan agama melalui ringkasan AI dari Yufid.com dan tautan sumber untuk dibaca langsung."
        />
        <meta
          name="twitter:image"
          content="/images/1200x630-sahabat-ilmu.png"
        />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "Sahabat Ilmu",
              description:
                "Platform pencarian dalil, kajian, dan pengetahuan agama dengan ringkasan AI dari Yufid.com dan tautan sumber untuk dibaca langsung",
              url: "https://sahabat-ilmu.vercel.app",
              logo: "/images/sahabat-ilmu-horizontal2.png",
              // sameAs: [
              //   "https://www.facebook.com/sahabatilmu",
              //   "https://twitter.com/sahabatilmu",
              //   "https://www.instagram.com/sahabatilmu",
              //   "https://www.youtube.com/@sahabatilmu",
              // ],
              contactPoint: {
                "@type": "ContactPoint",
                email: "email1.hammad@gmail.com",
                contactType: "Customer Service",
                availableLanguage: ["Indonesian", "English"],
              },
              areaServed: "ID",
              educationalCredentialAwarded: "Islamic Knowledge",
            }),
          }}
        />

        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Sahabat Ilmu",
              url: "https://sahabat-ilmu.vercel.app",
              // potentialAction: {
              //   "@type": "SearchAction",
              //   target: "https://sahabatilmu.com/search?q={search_term_string}",
              //   "query-input": "required name=search_term_string",
              // },
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
