import { BLOG_ARTICLES } from "@/constants/articles";

export default async function sitemap() {
  const baseUrl = "https://fajritravelbatam.com";

  // 1. Static routes
  const staticRoutes = [
    "",
    "/paket-tour",
    "/blog",
    "/ulasan",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. Dynamic blog article routes
  const blogRoutes = BLOG_ARTICLES.map((article) => ({
    url: `${baseUrl}/blog/${article.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
