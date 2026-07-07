import { NextResponse } from "next/server";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const revalidate = 3600;

export async function GET() {
  const BASE_URL = "https://bakalia.xyz";
  const now = new Date();

  let items = "";

  try {
    const newsQuery = query(
      collection(db, "news"),
      orderBy("publishedAt", "desc"),
      limit(50)
    );
    const snapshot = await getDocs(newsQuery);

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const pubDate: Date = data.publishedAt?.toDate?.() ?? now;
      const title = escapeXml(data.title ?? "Untitled");
      const description = escapeXml(data.excerpt ?? data.description ?? "");
      const category = escapeXml(data.category ?? "Community");
      const link = `${BASE_URL}/news/${doc.id}`;

      items += `
    <item>
      <title>${title}</title>
      <description>${description}</description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate.toUTCString()}</pubDate>
      <category>${category}</category>
    </item>`;
    });
  } catch {
    // Firestore unavailable — return feed with no items
  }

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Bakalia Community Portal - Latest News</title>
    <description>Latest news, notices and updates from Bakalia, Chattogram.</description>
    <link>${BASE_URL}</link>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>bn-BD</language>
    <lastBuildDate>${now.toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    <image>
      <url>${BASE_URL}/icon-512.png</url>
      <title>Bakalia Community Portal</title>
      <link>${BASE_URL}</link>
    </image>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
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
