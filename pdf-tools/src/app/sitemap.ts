import { tools } from "@/lib/tools";
import type { MetadataRoute } from "next";

const BASE_URL = "https://pdf-tools-utility.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = tools.map((tool) => ({
    url: `${BASE_URL}/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: tool.available ? 0.8 : 0.5,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/api-docs`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...toolPages,
  ];
}
