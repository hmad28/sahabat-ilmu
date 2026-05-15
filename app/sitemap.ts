import { MetadataRoute } from "next";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { kajian } from "@/db/schema";

const baseUrl = "https://sahabat-ilmu.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/kajian`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/chat`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  try {
    const publishedKajian = await db
      .select({
        slug: kajian.slug,
        updatedAt: kajian.updatedAt,
      })
      .from(kajian)
      .where(eq(kajian.status, "published"))
      .orderBy(desc(kajian.updatedAt));

    const kajianPages: MetadataRoute.Sitemap = publishedKajian.map((item) => ({
      url: `${baseUrl}/kajian/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticPages, ...kajianPages];
  } catch (error) {
    console.error("Failed to build dynamic sitemap entries:", error);
    return staticPages;
  }
}
