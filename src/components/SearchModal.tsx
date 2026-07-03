"use client";

import React, { useRef, useEffect, useState } from "react";
import { Search, X, Shield, Bell, Droplet, AlertTriangle, Home, Briefcase, ShoppingCart, Calendar, ChevronRight } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { collection, query, getDocs, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Custom Mosque SVG Icon
const MosqueIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M12 2v3M12 5c-2.5 0-4.5 2-4.5 4.5V19h9V9.5C16.5 7 14.5 5 12 5z" />
    <path d="M3 21h18M6 19v-5c0-1.5 1-2.5 1.5-2.5s1.5 1 1.5 2.5v5M15 19v-5c0-1.5 1-2.5 1.5-2.5s1.5 1 1.5 2.5v5" />
    <path d="M12 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
  </svg>
);

export default function SearchModal() {
  const { 
    isSearchOpen, setIsSearchOpen,
    searchQuery, setSearchQuery,
    triggerSOS, setIsPrayerExpanded,
    setAuthMode, setShowAuthModal,
    t, theme, language
  } = useAppContext();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [dbResults, setDbResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  // Query Firestore on search change
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setDbResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results: any[] = [];
        const collectionsToSearch = ["news", "notices", "listings", "lost_found"];
        
        for (const colName of collectionsToSearch) {
          const q = query(collection(db, colName), limit(3));
          const snap = await getDocs(q);
          snap.forEach(docSnap => {
            const data = docSnap.data();
            const title = data.title || data.headline || data.itemName || "";
            const desc = data.desc || data.description || data.details || "";
            
            if (
              title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              desc.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
              results.push({
                id: docSnap.id,
                title,
                desc,
                type: colName,
                href: colName === "lost_found" ? "/lost-found" : colName === "listings" ? "/house-rent" : `/${colName}`
              });
            }
          });
        }
        setDbResults(results);
      } catch (err) {
        console.error("Error searching Firestore:", err);
      } finally {
        setLoading(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isSearchOpen) return null;

  const isLight = theme === "light";

  // Quick Access items mapping
  const quickAccessServices = [
    { 
      id: "complaints", 
      icon: Shield, 
      title: t("complaints"), 
      desc: t("complaintsDesc"),
      iconBg: isLight ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-[#22444B] text-[#0CA671] border border-[#0CA671]/20",
      href: "/complaints"
    },
    { 
      id: "notices", 
      icon: Bell, 
      title: t("policeNotices"), 
      desc: t("policeNoticesDesc"),
      iconBg: isLight ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-[#04142F] text-[#4A89DA] border border-[#4A89DA]/20",
      href: "/police"
    },
    { 
      id: "lost-found", 
      icon: Search, 
      title: t("lostFound"), 
      desc: t("lostFoundDesc"),
      iconBg: isLight ? "bg-slate-50 text-slate-600 border border-slate-100" : "bg-[#04142F] text-[#4A89DA] border border-[#4A89DA]/20",
      href: "/lost-found"
    },
    { 
      id: "blood", 
      icon: Droplet, 
      title: t("bloodDonation"), 
      desc: t("bloodDonationDesc"),
      iconBg: isLight ? "bg-red-50 text-red-600 border border-red-100" : "bg-[#481C21] text-red-500 border border-red-500/10",
      href: "/blood"
    },
    { 
      id: "tolet", 
      icon: Home, 
      title: t("houseRent"), 
      desc: t("houseRentDesc"),
      iconBg: isLight ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-[#22444B] text-[#0CA671] border border-[#0CA671]/20",
      href: "/house-rent"
    },
    { 
      id: "jobs", 
      icon: Briefcase, 
      title: t("jobs"), 
      desc: t("jobsDesc"),
      iconBg: isLight ? "bg-purple-50 text-purple-600 border border-purple-100" : "bg-[#01205B] text-[#4A89DA] border border-[#4A89DA]/20",
      href: "/jobs"
    },
    { 
      id: "marketplace", 
      icon: ShoppingCart, 
      title: t("marketplace"), 
      desc: t("marketplaceDesc"),
      iconBg: isLight ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-[#0D1B2A] text-amber-500 border border-[#D3D9E2]/10",
      href: "/marketplace"
    },
    { 
      id: "mosques", 
      icon: MosqueIcon, 
      title: t("mosques"), 
      desc: t("mosquesDesc"),
      iconBg: isLight ? "bg-teal-50 text-teal-600 border border-teal-100" : "bg-[#22444B] text-teal-400 border border-teal-500/20",
      href: "/mosque"
    },
    { 
      id: "events", 
      icon: Calendar, 
      title: t("events"), 
      desc: t("eventsDesc"),
      iconBg: isLight ? "bg-violet-50 text-violet-600 border border-violet-100" : "bg-[#01205B] text-[#4A89DA] border border-[#4A89DA]/20",
      href: "/events"
    }
  ];

  // Filter static local services
  const matchedServices = quickAccessServices.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 z-[150] bg-black/65 backdrop-blur-md flex items-start justify-center pt-10 sm:pt-20 px-4 animate-in fade-in duration-200 text-slate-800 dark:text-white"
      onClick={(e) => { if (e.target === e.currentTarget) setIsSearchOpen(false); }}
    >
      <div className="w-full max-w-2xl bg-white dark:bg-[#01122C] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Header / Input Row */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-[#01122C]">
          <Search className="w-5 h-5 text-slate-400 dark:text-[#0CA671] shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full bg-transparent border-none outline-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold shrink-0 animate-in fade-in duration-100"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shrink-0"
          >
            {t("closeSearch")}
          </button>
        </div>

        {/* Results Area */}
        <div className="p-4 overflow-y-auto space-y-4 divide-y divide-slate-100 dark:divide-slate-800/50 bg-white dark:bg-[#01122C]">
          
          {!searchQuery ? (
            /* Empty Query: Show Quick Links */
            <div className="space-y-3 pb-2 pt-1 first:pt-0">
              <span className="block text-[10px] uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500">
                {t("quickLinks")}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {quickAccessServices.slice(0, 6).map((service) => {
                  const Icon = service.icon;
                  return (
                    <a
                      key={service.id}
                      href={service.href}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-[#04142F] border border-slate-200/50 dark:border-slate-800/40 hover:border-blue-500/30 dark:hover:border-[#0CA671]/45 hover:bg-white dark:hover:bg-[#01205B]/40 transition-all cursor-pointer shadow-sm group"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${service.iconBg}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-[#0CA671] transition-colors truncate">
                        {service.title}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Queries Present */
            <>
              {/* Matched Local Quick Services */}
              {matchedServices.length > 0 && (
                <div className="space-y-2.5 pb-3 pt-2 first:pt-0">
                  <span className="block text-[10px] uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500">
                    {t("services")} ({matchedServices.length})
                  </span>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {matchedServices.map((service) => {
                      const Icon = service.icon;
                      return (
                        <a
                          key={service.id}
                          href={service.href}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-[#04142F] border border-slate-200/50 dark:border-slate-800/40 hover:border-blue-500/30 dark:hover:border-[#0CA671]/40 hover:bg-white dark:hover:bg-[#01205B]/40 transition-all cursor-pointer shadow-sm group"
                        >
                          <div className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center shrink-0 ${service.iconBg}`}>
                            <Icon className="w-4.5 h-4.5" />
                          </div>
                          <div className="min-w-0">
                            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-[#0CA671] transition-colors leading-tight">
                              {service.title}
                            </span>
                            <span className="block text-[9.5px] text-slate-400 dark:text-[#859798] font-medium leading-tight mt-0.5 truncate">
                              {service.desc}
                            </span>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Matched Database Records */}
              {dbResults.length > 0 && (
                <div className="space-y-2.5 pb-3 pt-3">
                  <span className="block text-[10px] uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500">
                    {language === "en" ? "Registry Results" : "ডাটাবেজ রেকর্ডস"} ({dbResults.length})
                  </span>
                  <div className="space-y-2">
                    {dbResults.map((res) => (
                      <a
                        key={res.id}
                        href={res.href}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#04142F] border border-slate-200/50 dark:border-slate-800/40 hover:border-blue-500/30 dark:hover:border-[#0CA671]/40 hover:bg-white dark:hover:bg-[#01205B]/40 transition-all cursor-pointer shadow-sm group"
                      >
                        <div className="min-w-0 flex-1 pr-4">
                          <span className="block text-xs font-black text-slate-800 dark:text-slate-250 truncate group-hover:text-blue-600 dark:group-hover:text-[#0CA671] transition-colors">{res.title}</span>
                          <span className="block text-[9.5px] text-slate-450 dark:text-slate-400 leading-tight mt-0.5 truncate">{res.desc}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase shrink-0 bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-[#0CA671]/20 dark:group-hover:text-[#0CA671] transition-colors">
                          {res.type}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results Fallback */}
              {matchedServices.length === 0 && dbResults.length === 0 && (
                <div className="text-center py-8">
                  <AlertTriangle className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-500 animate-bounce mb-2" />
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{t("noResults")}</p>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
