import { MetadataRoute } from "next";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

const BASE_URL = "https://bakalia.xyz";

const staticRoutes: { path: string; priority: number; changeFreq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "",           priority: 1.0, changeFreq: "daily" },
  { path: "/about",     priority: 0.8, changeFreq: "monthly" },
  { path: "/services",  priority: 0.9, changeFreq: "weekly" },
  { path: "/emergency", priority: 0.9, changeFreq: "daily" },
  { path: "/mosque",    priority: 0.8, changeFreq: "daily" },
  { path: "/police",    priority: 0.8, changeFreq: "daily" },
  { path: "/blood",     priority: 0.8, changeFreq: "daily" },
  { path: "/volunteer", priority: 0.7, changeFreq: "weekly" },
  { path: "/house-rent",priority: 0.7, changeFreq: "daily" },
  { path: "/lost-found",priority: 0.7, changeFreq: "daily" },
  { path: "/business",  priority: 0.7, changeFreq: "weekly" },
  { path: "/jobs",      priority: 0.7, changeFreq: "daily" },
  { path: "/events",    priority: 0.7, changeFreq: "daily" },
  { path: "/complaints",priority: 0.6, changeFreq: "weekly" },
  { path: "/council",   priority: 0.6, changeFreq: "monthly" },
  { path: "/map",       priority: 0.6, changeFreq: "monthly" },
];

const categoryRoutes: { path: string }[] = [
  { path: "/news/category/civic" },
  { path: "/news/category/police" },
  { path: "/news/category/emergency" },
  { path: "/news/category/community" },
  { path: "/news/category/events" },
  { path: "/news/category/health" },
];

export const revalidate = 3600; // revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(({ path, priority, changeFreq }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: changeFreq,
    priority,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categoryRoutes.map(({ path }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  let newsEntries: MetadataRoute.Sitemap = [];
  try {
    const newsQuery = query(
      collection(db, "news"),
      orderBy("publishedAt", "desc"),
      limit(500)
    );
    const snapshot = await getDocs(newsQuery);
    newsEntries = snapshot.docs.map((doc) => {
      const data = doc.data();
      const publishedAt = data.publishedAt?.toDate?.() ?? now;
      return {
        url: `${BASE_URL}/news/${doc.id}`,
        lastModified: publishedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    });
  } catch {
    // Firestore unavailable during build — skip news entries
  }

  return [...staticEntries, ...categoryEntries, ...newsEntries];
}
