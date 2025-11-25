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
    default: "Sahabat Ilmu - Platform Pembelajaran Islam Berbasis AI",
    template: "%s | Sahabat Ilmu",
  },
  description:
    "Platform pembelajaran Islam modern berbasis AI. Tanya jawab seputar kajian Islam, ilmu agama, dan belajar dengan chatbot AI Islami yang terpercaya. Sumber ilmu Islam yang sahih dan mudah dipahami.",

  // Keywords untuk SEO (meski tidak terlalu berpengaruh, tetap bagus untuk dokumentasi)
  keywords: [
    "kajian islam",
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
    title: "Sahabat Ilmu - Platform Pembelajaran Islam Berbasis AI",
    description:
      "Platform pembelajaran Islam modern berbasis AI. Tanya jawab seputar kajian Islam, ilmu agama, dan belajar dengan chatbot AI Islami yang terpercaya.",
    images: [
      {
        url: "/public/images/",
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
    title: "Sahabat Ilmu - Platform Pembelajaran Islam Berbasis AI",
    description:
      "Platform pembelajaran Islam modern berbasis AI. Tanya jawab seputar kajian Islam dengan chatbot AI Islami yang terpercaya.",
    images: ["/public/images/"],
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
      { url: "/app/favicon.ico" },
      {
        url: "/public/images/16x16-icon-sahabat-ilmu.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/public/images/32x32-icon-sahabat-ilmu.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      { url: "/public/images/180x180-sahabat-ilmu.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },

  // Manifest (PWA)
  manifest: "/manifest.json",

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
    <html lang="id">
      <head>
        {/* Additional SEO Tags */}
        <meta name="theme-color" content="#10b981" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

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
                "Platform pembelajaran Islam modern berbasis AI dengan chatbot untuk tanya jawab kajian Islam",
              url: "https://sahabat-ilmu.vercel.app",
              logo: "/public/images/sahabat-ilmu-horizontal2.png",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
