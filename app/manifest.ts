import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sahabat Ilmu - Platform Pembelajaran Islam",
    short_name: "Sahabat Ilmu",
    description:
      "Platform pembelajaran Islam modern berbasis AI dengan chatbot untuk tanya jawab kajian Islam",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#10b981",
    orientation: "portrait",
    icons: [
      {
        src: "https://ibb.co.com/WvvHtjC1",
        sizes: "192x192",
        type: "image/png",
        // purpose: "any maskable",
      },
      {
        src: "https://ibb.co.com/ds0ydXc6",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "https://ibb.co.com/1fGBMN63",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["education", "lifestyle"],
    lang: "id",
    dir: "ltr",
    scope: "/",
  };
}
