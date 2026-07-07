"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, Home, ArrowLeft, Shield, Droplet, AlertTriangle,
  Briefcase, Calendar, MapPin, ChevronRight, Newspaper,
} from "lucide-react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface NewsItem {
  id: string;
  title: string;
  category: string;
  publishedAt: Date;
}

const popularPages = [
  { href: "/emergency", label: "Emergency Services", icon: AlertTriangle, color: "text-red-500" },
  { href: "/police",    label: "Police Portal",       icon: Shield,        color: "text-blue-500" },
  { href: "/blood",     label: "Blood Donors",        icon: Droplet,       color: "text-rose-500" },
  { href: "/jobs",      label: "Jobs",                icon: Briefcase,     color: "text-purple-500" },
  { href: "/events",    label: "Events",              icon: Calendar,      color: "text-amber-500" },
  { href: "/map",       label: "Community Map",       icon: MapPin,        color: "text-emerald-500" },
];

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    getDocs(query(collection(db, "news"), orderBy("publishedAt", "desc"), limit(3)))
      .then((snap) =>
        setLatestNews(
          snap.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title ?? "Untitled",
            category: doc.data().category ?? "News",
            publishedAt: doc.data().publishedAt?.toDate?.() ?? new Date(),
          }))
        )
      )
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#010818] flex flex-col items-center justify-center px-4 py-16 text-slate-900 dark:text-white">

      {/* 404 Visual */}
      <div className="relative select-none mb-6">
        <span className="text-[120px] sm:text-[160px] font-black leading-none text-slate-100 dark:text-[#04142F]">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-2">
              <Search className="w-8 h-8 text-[#0CA671]" />
            </div>
          </div>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-black text-center tracking-tight mb-2">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-md mb-8 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Try searching or explore popular sections below.
      </p>

      {/* Search Box */}
      <form onSubmit={handleSearch} className="w-full max-w-md mb-10">
        <div className="flex items-center bg-white dark:bg-[#01205B] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <Search className="w-4 h-4 text-slate-400 ml-4 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services, news..."
            className="flex-1 px-3 py-3 bg-transparent text-sm outline-none placeholder-slate-400 dark:placeholder-slate-500"
          />
          <button
            type="submit"
            className="px-4 py-3 bg-[#0CA671] hover:bg-emerald-600 text-white text-xs font-bold transition-colors shrink-0"
          >
            Search
          </button>
        </div>
      </form>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-12 w-full max-w-md">
        <Link
          href="/"
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0CA671] hover:bg-emerald-600 text-white text-sm font-bold transition-colors shadow-md shadow-emerald-500/20"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <button
          onClick={() => router.back()}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#01205B] text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>

      <div className="w-full max-w-2xl grid sm:grid-cols-2 gap-8">

        {/* Popular Pages */}
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
            Popular Pages
          </h2>
          <div className="space-y-2">
            {popularPages.map(({ href, label, icon: Icon, color }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#01205B] border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-[#0CA671] transition-colors">
                    {label}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>

        {/* Latest News */}
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
            Latest News
          </h2>
          {latestNews.length > 0 ? (
            <div className="space-y-2">
              {latestNews.map((news) => (
                <Link
                  key={news.id}
                  href={`/news/${news.id}`}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-[#01205B] border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all group shadow-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#04142F] flex items-center justify-center shrink-0">
                    <Newspaper className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug group-hover:text-[#0CA671] transition-colors">
                      {news.title}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-1">{news.category}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-[#01205B]/50 animate-pulse" />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
