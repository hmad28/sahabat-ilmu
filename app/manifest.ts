import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sahabat Ilmu - Platform Pembelajaran Islam",
    short_name: "Sahabat Ilmu",
    description:
      "Platform belajar Islam dengan ringkasan AI dari Yufid.com dan tautan sumber untuk dibaca langsung",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#fffaf0",
    orientation: "portrait",
    icons: [
      {
        src: "/images/192x192-icon-sahabat-ilmu.png",
        sizes: "192x192",
        type: "image/png",
        // purpose: "any maskable",
      },
      {
        src: "/images/384x384-icon-sahabat-ilmu.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/images/512x512-icon-sahabat-ilmu.png",
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
