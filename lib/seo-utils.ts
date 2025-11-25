export function generateKajianMetadata(kajian: {
  title: string;
  excerpt: string;
  slug: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  const baseUrl = "https://sahabat-ilmu.vercel.app";

  return {
    title: `${kajian.title} | Sahabat Ilmu`,
    description: kajian.excerpt,
    keywords: [
      kajian.title,
      "kajian islam",
      "ilmu agama",
      "pembelajaran islam",
    ],
    openGraph: {
      type: "article",
      url: `${baseUrl}/kajian/${kajian.slug}`,
      title: kajian.title,
      description: kajian.excerpt,
      images: [
        {
          url: kajian.thumbnail || `${baseUrl}/1200x630-sahabat-ilmu.png`,
          width: 1200,
          height: 630,
          alt: kajian.title,
        },
      ],
      publishedTime: kajian.createdAt.toISOString(),
      modifiedTime: kajian.updatedAt.toISOString(),
      authors: ["Tim Sahabat Ilmu"],
      section: "Kajian Islam",
    },
    twitter: {
      card: "summary_large_image",
      title: kajian.title,
      description: kajian.excerpt,
      images: [kajian.thumbnail || `${baseUrl}/twitter-image.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/kajian/${kajian.slug}`,
    },
  };
}

/**
 * Generate JSON-LD structured data for article
 */
export function generateArticleJsonLd(kajian: {
  title: string;
  excerpt: string;
  slug: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
  author?: string;
}) {
  const baseUrl = "https://sahabat-ilmu.vercel.app";

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: kajian.title,
    description: kajian.excerpt,
    image: kajian.thumbnail || `${baseUrl}/1200x630-sahabat-ilmu.png`,
    datePublished: kajian.createdAt.toISOString(),
    dateModified: kajian.updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: kajian.author || "Tim Sahabat Ilmu",
    },
    publisher: {
      "@type": "Organization",
      name: "Sahabat Ilmu",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/sahabat-ilmu-horizontal2.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/kajian/${kajian.slug}`,
    },
  };
}
