import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://bakalia.xyz";

  // Static routes to index
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/emergency",
    "/mosque",
    "/police",
    "/blood",
    "/volunteer",
    "/house-rent",
    "/lost-found",
    "/business",
    "/jobs",
    "/events",
    "/complaints",
  ];

  const routes = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  return routes;
}
