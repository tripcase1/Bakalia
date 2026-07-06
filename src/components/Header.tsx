"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Sun, Moon, Globe, Shield, MapPin, Calendar, 
  ChevronDown, Bell, User, Menu, X, LayoutGrid, Newspaper,
  ShieldCheck, AlertTriangle, Info, ShoppingCart, Home
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { collection, onSnapshot, query, limit } from "firebase/firestore";
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

export default function Header() {
  const { 
    theme, language, toggleTheme, setLanguage, t,
    isSearchOpen, setIsSearchOpen,
    showAuthModal, setShowAuthModal,
    authMode, setAuthMode,
    isMobileMenuOpen, setIsMobileMenuOpen,
    isPrayerExpanded, setIsPrayerExpanded,
    user, role, userData, logout,
    detectedWard, requestGps,
    triggerSOS, sosActive, sosCountdown
  } = useAppContext();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const getDashboardPath = (userRole: string | null): string => {
    switch (userRole) {
      case "citizen": return "/dashboard";
      case "super_admin": return "/admin";
      case "police_admin": return "/police";
      case "councilor": return "/council";
      case "volunteer": return "/volunteer";
      case "mosque_admin": return "/mosque";
      case "business_admin": return "/business";
      case "moderator": return "/moderator";
      case "editor": return "/editor";
      default: return "/";
    }
  };

  // Live Notifications Listener
  useEffect(() => {
    const q = query(collection(db, "notices"), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          title: language === "en" ? (data.title || data.titleBn) : (data.titleBn || data.title),
          description: language === "en" ? (data.description || data.descriptionBn) : (data.descriptionBn || data.description),
          createdAt: data.createdAt
        });
      });
      items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setNotifications(items);
      setUnreadCount(items.length);
    }, (error) => {
      console.warn("Notifications subscription failed:", error);
    });
    return () => unsubscribe();
  }, [language]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric', 
      weekday: 'long' 
    };
    return currentTime.toLocaleDateString(language === "en" ? "en-US" : "bn-BD", options);
  };

  const isLight = theme === "light";

  return (
    <>
      {/* ==================== MOBILE HEADER (md:hidden) ==================== */}
      <header className="md:hidden px-4 pt-4 pb-2 bg-white dark:bg-[#010818] border-b border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between transition-colors z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-blue-500/15 shrink-0">
            <Shield className="w-5 h-5 text-blue-100" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                {language === "en" ? "Bakalia Community" : "বাকলিয়া কমিউনিটি"}
              </span>
            </div>
            {/* Mobile dynamic ward label below logo */}
            {detectedWard && (
              <span className="block text-[8px] font-extrabold text-blue-600 dark:text-[#0CA671] mt-0.5 leading-none">{detectedWard}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Theme Switch */}
          <button 
            onClick={toggleTheme}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all active:scale-95"
            aria-label="Toggle theme"
          >
            {isLight ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
          </button>

          {/* Language Switch */}
          <button 
            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-black font-mono tracking-tight active:scale-95"
          >
            {language === "en" ? "বাংলা" : "EN"}
          </button>

          {/* Notification Button */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all active:scale-95 relative"
                aria-label="Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#01205B] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/40 mb-2">
                    <span className="text-[10px] font-black uppercase text-slate-400">{language === "en" ? "Announcements" : "নোটিশ সমূহ"}</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={() => setUnreadCount(0)}
                        className="text-[9px] font-bold text-blue-500 hover:underline"
                      >
                        {language === "en" ? "Mark read" : "পঠিত চিহ্নিত করুন"}
                      </button>
                    )}
                  </div>
                  
                  {notifications.length === 0 ? (
                    <p className="text-[10.5px] text-slate-400 py-4 text-center">{language === "en" ? "No alerts currently." : "কোনো নোটিশ নেই।"}</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-none text-left">
                      {notifications.map(notif => (
                        <div key={notif.id} className="p-2.5 rounded bg-slate-50 dark:bg-[#010818] border border-slate-150/30 dark:border-slate-800/20 text-[10px] leading-relaxed text-slate-800 dark:text-slate-200">
                          <span className="font-black block">{notif.title}</span>
                          <span className="text-slate-450 dark:text-slate-400 block mt-1">{notif.description}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Menu icon with green indicator dot */}
          <div 
            className="relative cursor-pointer ml-0.5 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-5.5 h-5.5 flex flex-col justify-center items-center gap-1.25">
              <span className={`h-0.75 w-5 bg-slate-600 dark:bg-slate-300 rounded-full transition-transform ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`h-0.75 w-5 bg-slate-600 dark:bg-slate-300 rounded-full transition-opacity ${isMobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`h-0.75 w-5 bg-slate-600 dark:bg-slate-300 rounded-full transition-transform ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
            {!isMobileMenuOpen && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
          </div>
        </div>
      </header>

      {/* ==================== DESKTOP/TABLET HEADER (hidden md:block) ==================== */}
      <header className="hidden md:block sticky top-0 z-50 glass-nav border-b border-slate-200/85 dark:border-slate-800/60 bg-white/95 dark:bg-[#010818]/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Logo and Location Selector */}
            <div className="flex items-center gap-4">
              <a href="/" className="flex items-center gap-2.5">
                <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-blue-500/15">
                  <Shield className="w-5 h-5 text-blue-100" />
                </div>
                <div className="leading-tight">
                  <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white block">
                    {language === "en" ? "Bakalia" : "বাকলিয়া"}
                  </span>
                  <span className="block text-[9px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                    {t("community")}
                  </span>
                </div>
              </a>

              {/* Location selector dropdown - clicking triggers GPS manual refresh */}
              <div 
                onClick={requestGps}
                title={language === "en" ? "Click to refresh GPS location" : "জিপিএস অবস্থান রিফ্রেশ করতে ক্লিক করুন"}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#04142F] border border-slate-200/60 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-350 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-all select-none"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>{detectedWard || t("locationBakalia")}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* Date Month Year Header on Desktop */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#04142F] border border-slate-200/60 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 select-none transition-colors">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                <span>{formatDate()}</span>
              </div>
            </div>

            {/* Center: Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex flex-1 max-w-sm mx-6 items-center bg-slate-100 dark:bg-[#04142F] border border-slate-200 dark:border-slate-800/80 rounded-lg px-3 py-1.5 text-xs text-slate-405 hover:bg-slate-200/40 dark:hover:bg-slate-800/50 outline-none transition-all cursor-pointer select-none text-left active:scale-[0.99]"
            >
              <Search className="h-4 w-4 text-slate-450 dark:text-slate-500 mr-2 shrink-0" />
              <span className="flex-grow">{t("searchPlaceholder")}</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-medium text-slate-455 dark:text-slate-500 bg-white dark:bg-[#01205B] border border-slate-202 dark:border-slate-700/65 rounded shadow-sm shrink-0">
                Ctrl K
              </kbd>
            </button>

            {/* Right: Language switch, Theme switch, Login/Register or Dashboard */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Language Switch */}
              <button 
                onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                className="px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-705 dark:text-slate-300 flex items-center gap-1.5 text-xs font-semibold transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
              >
                <Globe className="w-4 h-4 text-emerald-500" />
                <span>{language === "en" ? "বাংলা" : "English"}</span>
              </button>

              {/* Theme Switch */}
              <button 
                onClick={toggleTheme}
                className="p-1.5 rounded-lg hover:bg-slate-105 dark:hover:bg-slate-800 text-slate-505 dark:text-slate-350 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all"
                aria-label="Toggle theme"
              >
                {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              {/* Notification Bell with Dropdown */}
              {user && (
                <div className="relative">
                  <button 
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="p-1.5 rounded-lg hover:bg-slate-105 dark:hover:bg-slate-800 text-slate-505 dark:text-slate-355 border border-transparent hover:border-slate-202 dark:hover:border-slate-800 transition-all relative"
                  >
                    <Bell className="w-4.5 h-4.5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                  </button>

                  {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#01205B] border border-slate-202 dark:border-slate-800 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/40 mb-2">
                        <span className="text-[10px] font-black uppercase text-slate-400">Announcements</span>
                        {unreadCount > 0 && (
                          <button 
                            onClick={() => setUnreadCount(0)}
                            className="text-[9px] font-bold text-blue-500 hover:underline"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                      
                      {notifications.length === 0 ? (
                        <p className="text-[10.5px] text-slate-400 py-4 text-center">No alerts currently.</p>
                      ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-none">
                          {notifications.map(notif => (
                            <div key={notif.id} className="p-2.5 rounded bg-slate-50 dark:bg-[#010818] border border-slate-150/30 dark:border-slate-800/20 text-[10px] leading-relaxed text-slate-800 dark:text-slate-200">
                              <span className="font-black block">{notif.title}</span>
                              <span className="text-slate-450 dark:text-slate-400 block mt-1">{notif.description}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Session Buttons */}
              <div className="flex items-center gap-2 border-l border-slate-202 dark:border-slate-800 pl-3 ml-1">
                {user ? (
                  <>
                    {/* User profile info */}
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-[#04142F] border border-slate-200/60 dark:border-slate-800/80 shadow-sm transition-all select-none">
                      {/* Avatar */}
                      <div className="w-6.5 h-6.5 rounded-full bg-blue-600 dark:bg-[#0CA671] text-white flex items-center justify-center text-[10px] font-black uppercase shadow-inner shrink-0">
                        {((userData as any)?.displayName || user.displayName || user.email || "?").charAt(0)}
                      </div>
                      {/* Name & Role */}
                      <div className="flex flex-col leading-none">
                        <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 truncate max-w-[85px]">
                          {(userData as any)?.displayName || user.displayName || user.email?.split('@')[0]}
                        </span>
                        <span className={`text-[7px] font-extrabold uppercase tracking-wider mt-0.5 ${
                          role === "super_admin" ? "text-red-500" :
                          role === "police_admin" ? "text-blue-500" :
                          role === "councilor" ? "text-purple-500" :
                          role === "volunteer" ? "text-emerald-500" :
                          "text-slate-400"
                        }`}>
                          {role ? role.replace("_", " ") : "citizen"}
                        </span>
                      </div>
                    </div>

                    <a
                      href={getDashboardPath(role)}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-lg text-slate-705 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-905 dark:hover:text-white transition-all border border-slate-200 dark:border-slate-800"
                    >
                      {language === "en" ? "Dashboard" : "ড্যাশবোর্ড"}
                    </a>
                    <button 
                      onClick={logout}
                      className="px-4 py-1.5 text-xs font-bold rounded-lg text-white bg-red-650 hover:bg-red-700 active:scale-[0.98] transition-all shadow-md"
                    >
                      {language === "en" ? "Logout" : "লগআউট"}
                    </button>
                  </>
                ) : (
                  <>
                    <a 
                      href="/login"
                      className="px-3.5 py-1.5 text-xs font-bold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-slate-800"
                    >
                      {t("login")}
                    </a>
                    <a 
                      href="/register"
                      className="px-4 py-1.5 text-xs font-bold rounded-lg text-white bg-blue-600 dark:bg-[#0CA671] hover:bg-blue-500 dark:hover:bg-emerald-500 shadow-md shadow-blue-500/10 dark:shadow-emerald-500/10 active:scale-[0.98] transition-all"
                    >
                      {t("register")}
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Actions Drawer trigger */}
            <div className="flex lg:hidden items-center gap-2">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-slate-150 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-350 transition-all"
              >
                {isLight ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-150 dark:hover:bg-slate-855 transition-all"
              >
                {isMobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Row 2: Secondary Menu Links (Home, News, etc.) */}
        <div className="border-t border-slate-202 bg-white dark:bg-[#010818]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-7 py-2.5 text-xs font-semibold justify-start lg:justify-start overflow-x-auto scrollbar-none">
              {[
                { label: t("home"), icon: Home, href: "/" },
                { label: t("news"), icon: Newspaper, href: "/news" },
                { label: t("services"), icon: LayoutGrid, href: "/services" },
                { label: t("police"), icon: ShieldCheck, href: "/police" },
                { label: t("emergency"), icon: AlertTriangle, href: "/emergency" },
                { label: t("mosque"), icon: MosqueIcon, href: "/mosque" },
                { label: t("marketplace"), icon: ShoppingCart, href: "/marketplace" },
                { label: t("aboutUs"), icon: Info, href: "/about" }
              ].map((item, idx) => {
                const Icon = item.icon;
                const isEmergency = item.label === t("emergency");
                // Check if current path matches item.href in dynamic routers
                const isActive = typeof window !== "undefined" && window.location.pathname === item.href;
                return (
                  <a
                    key={idx}
                    href={item.href}
                    className={`flex items-center gap-1.5 transition-all duration-200 py-1 border-b-2 shrink-0 ${
                      isActive 
                        ? isLight 
                          ? "text-blue-600 border-blue-600"
                          : "text-[#0CA671] border-[#0CA671]" 
                        : isEmergency
                          ? "text-[#EF4444] border-transparent hover:text-red-500"
                          : "text-slate-505 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-202 hover:border-slate-300 dark:hover:border-slate-800"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isEmergency ? "text-[#EF4444]" : ""}`} />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-[#010818] border-b border-slate-200/80 dark:border-slate-800/80 animate-in fade-in slide-in-from-top-3 duration-150">
            <div className="px-4 pt-2 pb-5 space-y-3.5 shadow-xl">
              
              {/* Mobile Search Trigger */}
              <button
                onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }}
                className="w-full flex items-center bg-slate-100 dark:bg-[#04142F] border border-slate-200 dark:border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-400 text-left outline-none"
              >
                <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
                <span className="flex-grow">{t("searchPlaceholder")}</span>
              </button>

              {/* Navigation Links */}
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                {[
                  { label: t("home"), href: "/" },
                  { label: t("news"), href: "/news" },
                  { label: t("services"), href: "/services" },
                  { label: t("police"), href: "/police" },
                  { label: t("emergency"), href: "/emergency" },
                  { label: t("mosque"), href: "/mosque" },
                  { label: t("marketplace"), href: "/marketplace" },
                  { label: t("aboutUs"), href: "/about" }
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#04142F]/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-355 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>

              {/* Mobile Auth Actions */}
              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-3">
                {user ? (
                  <div className="w-full space-y-3">
                    {/* User profile info for mobile */}
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-[#04142F]/60 border border-slate-200 dark:border-slate-800">
                      <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-[#0CA671] text-white flex items-center justify-center text-sm font-black uppercase shadow-inner shrink-0">
                        {((userData as any)?.displayName || user.displayName || user.email || "?").charAt(0)}
                      </div>
                      <div className="flex flex-col leading-none">
                        <span className="text-xs font-black text-slate-850 dark:text-white">
                          {(userData as any)?.displayName || user.displayName || user.email?.split('@')[0]}
                        </span>
                        <span className={`text-[8.5px] font-black uppercase tracking-wider mt-1 ${
                          role === "super_admin" ? "text-red-500" :
                          role === "police_admin" ? "text-blue-500" :
                          role === "councilor" ? "text-purple-500" :
                          role === "volunteer" ? "text-emerald-500" :
                          "text-slate-400"
                        }`}>
                          {role ? role.replace("_", " ") : "citizen"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <a
                        href={getDashboardPath(role)}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex-1 py-2 text-center text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-705 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                      >
                        {language === "en" ? "Dashboard" : "ড্যাশবোর্ড"}
                      </a>
                      <button
                        onClick={() => { setIsMobileMenuOpen(false); logout(); }}
                        className="flex-1 py-2 text-xs font-bold rounded-lg text-white bg-red-650 hover:bg-red-750 transition-all shadow-md"
                      >
                        {language === "en" ? "Logout" : "লগআউট"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3 w-full">
                    <a
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex-1 py-2 text-center text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                    >
                      {t("login")}
                    </a>
                    <a
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex-1 py-2 text-center text-xs font-bold rounded-lg text-white bg-blue-600 dark:bg-[#0CA671] hover:bg-blue-500 dark:hover:bg-emerald-500 transition-all shadow-md"
                    >
                      {t("register")}
                    </a>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </header>

      {/* 5. Sticky Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 dark:bg-[#01205B]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] px-4 py-2.5 flex items-center justify-around">
        {[
          { label: t("homeNav"), icon: Home, href: "/" },
          { label: t("servicesNav"), icon: LayoutGrid, href: "/services" },
          { label: "SOS", icon: AlertTriangle, action: "sos" },
          { label: t("mosqueNav"), icon: MosqueIcon, href: "/mosque" },
          { label: t("profileNav"), icon: User, action: "profile" }
        ].map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = tab.href ? (typeof window !== "undefined" && window.location.pathname === tab.href) : false;
          
          const handleClick = (e: React.MouseEvent) => {
            if (tab.action === "profile") {
              e.preventDefault();
              if (user) {
                window.location.href = getDashboardPath(role);
              } else {
                window.location.href = "/login";
              }
            }
          };

          if (tab.action === "sos") {
            return (
              <button 
                key={idx}
                onClick={triggerSOS}
                className={`flex flex-col items-center justify-center -mt-5 w-11 h-11 rounded-full text-white shadow-lg transition-transform duration-200 active:scale-95 ${
                  sosActive 
                    ? "bg-rose-600 animate-pulse shadow-rose-500/30" 
                    : sosCountdown !== null 
                      ? "bg-amber-600 animate-pulse shadow-amber-500/30"
                      : "bg-red-650 hover:bg-red-550 shadow-red-500/35"
                }`}
                title="SOS Alert"
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          }

          return (
            <a
              key={idx}
              href={tab.href || "#"}
              onClick={handleClick}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive 
                  ? "text-blue-650 dark:text-white" 
                  : "text-slate-400 dark:text-slate-455 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-bold tracking-tight">{tab.label}</span>
            </a>
          );
        })}
      </div>
    </>
  );
}
