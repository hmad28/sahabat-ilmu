import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://sahabat-ilmu.vercel.app";

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  // TODO: Fetch dynamic kajian pages from database
  // Example:
  // const kajianList = await db.select().from(kajian).where(eq(kajian.published, true))
  // const kajianPages = kajianList.map((item) => ({
  //   url: `${baseUrl}/kajian/${item.slug}`,
  //   lastModified: new Date(item.updatedAt),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.8,
  // }))

  const kajianPages: MetadataRoute.Sitemap = [];

  return [...staticPages, ...kajianPages];
}
