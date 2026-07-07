import { NextResponse } from "next/server";
import { collection, getDocs, query, orderBy, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const revalidate = 3600;

export async function GET() {
  const BASE_URL = "https://bakalia.xyz";
  const now = new Date();
  const cutoff = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  let items = "";

  try {
    const newsQuery = query(
      collection(db, "news"),
      where("publishedAt", ">=", Timestamp.fromDate(cutoff)),
      orderBy("publishedAt", "desc")
    );
    const snapshot = await getDocs(newsQuery);

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const pubDate: Date = data.publishedAt?.toDate?.() ?? now;
      const title = escapeXml(data.title ?? "Untitled");
      const category = escapeXml(data.category ?? "Community");
      const pubDateStr = pubDate.toISOString();

      items += `
  <url>
    <loc>${BASE_URL}/news/${doc.id}</loc>
    <news:news>
      <news:publication>
        <news:name>Bakalia Community Portal</news:name>
        <news:language>bn</news:language>
      </news:publication>
      <news:publication_date>${pubDateStr}</news:publication_date>
      <news:title>${title}</news:title>
      <news:keywords>${category}</news:keywords>
    </news:news>
  </url>`;
    });
  } catch {
    // Firestore unavailable — return empty sitemap
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
