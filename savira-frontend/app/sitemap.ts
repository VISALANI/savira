import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://saviraattires.com";
  const now = new Date();

  const staticPages = [
    { url: baseUrl, priority: 1.0 },
    { url: `${baseUrl}/shop`, priority: 0.9 },
    { url: `${baseUrl}/shop?category=kurtis`, priority: 0.8 },
    { url: `${baseUrl}/shop?category=festive-wear`, priority: 0.8 },
    { url: `${baseUrl}/shop?category=coord-sets`, priority: 0.8 },
    { url: `${baseUrl}/shop?category=cotton-kurtis`, priority: 0.7 },
    { url: `${baseUrl}/shop?category=office-wear`, priority: 0.7 },
    { url: `${baseUrl}/shop?category=daily-wear`, priority: 0.7 },
    { url: `${baseUrl}/contact`, priority: 0.5 },
    { url: `${baseUrl}/faq`, priority: 0.5 },
    { url: `${baseUrl}/returns`, priority: 0.5 },
    { url: `${baseUrl}/size-guide`, priority: 0.5 },
    { url: `${baseUrl}/privacy`, priority: 0.3 },
    { url: `${baseUrl}/terms`, priority: 0.3 },
  ];

  return staticPages.map(({ url, priority }) => ({
    url,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority,
  }));
}
