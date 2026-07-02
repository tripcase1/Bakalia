"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Search, Sun, Moon, Globe, Shield, Bell, Droplet, 
  AlertTriangle, Home, Briefcase, ShoppingCart, Calendar, 
  ArrowRight, MapPin, Users, Headphones, Cpu, Menu, X, 
  ChevronRight, Lock, PlusCircle, CheckCircle2, Phone, Mail, Award,
  Newspaper, LayoutGrid, Info, ShieldCheck, Heart, User, Star, Hospital,
  Flame, School, ChevronDown
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { getPrayerTimes, getNextPrayer, PrayerTimes } from "@/lib/prayerTimes";

// Custom Mosque SVG Icon matching the design aesthetics
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

// High-fidelity Golden Trophy Vector Illustration SVG
const TrophyVector = () => (
  <svg viewBox="0 0 120 120" className="w-20 h-20 text-amber-400 shrink-0 select-none animate-pulse-soft hidden md:block">
    {/* Background glow circle */}
    <circle cx="60" cy="60" r="50" fill="currentColor" opacity="0.05" />
    
    {/* Trophy Cup */}
    <path d="M40 30h40v30c0 11-9 20-20 20s-20-9-20-20V30z" fill="#FBBF24" />
    <path d="M48 30h24v30c0 6.6-5.4 12-12 12s-12-5.4-12-12V30z" fill="#F59E0B" />
    
    {/* Cup Handles */}
    <path d="M40 38H32v12c0 5.5 4.5 10 10 10" stroke="#FBBF24" strokeWidth="4.5" fill="none" strokeLinecap="round" />
    <path d="M80 38h8v12c0 5.5-4.5 10-10 10" stroke="#FBBF24" strokeWidth="4.5" fill="none" strokeLinecap="round" />
    
    {/* Stem & Base */}
    <path d="M54 80h12v15H54z" fill="#D97706" />
    <rect x="36" y="92" width="48" height="8" rx="2" fill="#B45309" />
    <rect x="42" y="87" width="36" height="5" rx="1.5" fill="#D97706" />
    
    {/* Stars & Dots decoration */}
    <path d="M60 22l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" fill="#FCD34D" />
    <path d="M22 45l1.5 3 3 .8-2.2 2.2.8 3-3.1-1.5-3.1 1.5.8-3-2.2-2.2 3-.8z" fill="#60A5FA" opacity="0.8" />
    <path d="M98 52l1.5 3 3 .8-2.2 2.2.8 3-3.1-1.5-3.1 1.5.8-3-2.2-2.2 3-.8z" fill="#34D399" opacity="0.8" />
    
    <circle cx="28" cy="80" r="2" fill="#FBBF24" />
    <circle cx="92" cy="78" r="1.5" fill="#60A5FA" />
  </svg>
);

export default function HomePage() {
  const { theme, language, toggleTheme, setLanguage, t } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("phone");
  const [sosCountdown, setSosCountdown] = useState<number | null>(null);
  const [sosActive, setSosActive] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<"news" | "nearby" | "highlights">("news");
  const [isPrayerExpanded, setIsPrayerExpanded] = useState(false);
  const [heroAnnouncement, setHeroAnnouncement] = useState<{ title: string; category: string } | null>(null);

  // SOS hold state
  const [showSosConfirmModal, setShowSosConfirmModal] = useState(false);
  const [showSosHoldOverlay, setShowSosHoldOverlay] = useState(false);
  const [sosHoldProgress, setSosHoldProgress] = useState(0);
  const [sosHoldTimeLeft, setSosHoldTimeLeft] = useState(5);
  const [isHoldingSos, setIsHoldingSos] = useState(false);
  const [sosSuccess, setSosSuccess] = useState(false);

  // Refs for reliable hold tracking (avoids stale closures on mobile)
  const holdingRef = useRef(false);
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStartRef = useRef(0);
  const sosBtnRef = useRef<HTMLDivElement>(null);

  // Update current time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Start hold
  const startHold = useCallback(() => {
    if (holdingRef.current) return;
    holdingRef.current = true;
    holdStartRef.current = Date.now();
    setIsHoldingSos(true);

    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      const progress = Math.min((elapsed / 5000) * 100, 100);
      const secondsLeft = Math.max(5 - Math.floor(elapsed / 1000), 0);
      setSosHoldProgress(progress);
      setSosHoldTimeLeft(secondsLeft);

      if (elapsed >= 5000) {
        if (holdTimerRef.current) clearInterval(holdTimerRef.current);
        holdTimerRef.current = null;
        holdingRef.current = false;
        setIsHoldingSos(false);
        setSosSuccess(true);
        setSosActive(true);
      }
    }, 30);
  }, []);

  // Stop hold
  const stopHold = useCallback(() => {
    if (!holdingRef.current) return;
    holdingRef.current = false;
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsHoldingSos(false);
    setSosHoldProgress(0);
    setSosHoldTimeLeft(5);
  }, []);

  // Attach native touch/mouse listeners to SOS button for reliable mobile hold
  useEffect(() => {
    const el = sosBtnRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => { e.preventDefault(); e.stopPropagation(); startHold(); };
    const onTouchEnd = (e: TouchEvent) => { e.preventDefault(); stopHold(); };
    const onMouseDown = (e: MouseEvent) => { e.preventDefault(); startHold(); };
    const onMouseUp = () => stopHold();
    const onMouseLeave = () => stopHold();
    const onCtx = (e: Event) => e.preventDefault();

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: false });
    el.addEventListener("touchcancel", onTouchEnd, { passive: false });
    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("contextmenu", onCtx);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("contextmenu", onCtx);
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    };
  }, [showSosHoldOverlay, sosSuccess, startHold, stopHold]);

  const triggerSOS = () => {
    setShowSosConfirmModal(true);
  };

  // Get Prayer Times for current date
  const prayerTimes = getPrayerTimes(currentTime);
  const nextPrayer = getNextPrayer(prayerTimes, currentTime);

  // Format date nicely for display
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

  // Quick Access items with dynamic colors depending on theme
  const quickAccessServices = [
    { 
      id: "complaints", 
      icon: Shield, 
      title: t("complaints"), 
      desc: t("complaintsDesc"), 
      iconBg: isLight
        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
        : "bg-[#22444B] text-[#0CA671] border border-[#0CA671]/20", 
      hoverStyle: isLight
        ? "hover:border-emerald-300 hover:bg-slate-50"
        : "hover:border-[#0CA671]/40 hover:bg-[#0CA671]/5" 
    },
    { 
      id: "notices", 
      icon: Bell, 
      title: t("policeNotices"), 
      desc: t("policeNoticesDesc"), 
      iconBg: isLight
        ? "bg-blue-50 text-blue-600 border border-blue-100"
        : "bg-[#04142F] text-[#4A89DA] border border-[#4A89DA]/20", 
      hoverStyle: isLight
        ? "hover:border-blue-300 hover:bg-slate-50"
        : "hover:border-[#4A89DA]/40 hover:bg-[#4A89DA]/5" 
    },
    { 
      id: "lost-found", 
      icon: Search, 
      title: t("lostFound"), 
      desc: t("lostFoundDesc"), 
      iconBg: isLight
        ? "bg-amber-50 text-amber-600 border border-amber-100"
        : "bg-[#01205B] text-amber-500 border border-[#D3D9E2]/10", 
      hoverStyle: isLight
        ? "hover:border-amber-300 hover:bg-slate-50"
        : "hover:border-amber-500/40 hover:bg-[#01205B]/10" 
    },
    { 
      id: "blood", 
      icon: Droplet, 
      title: t("bloodDonation"), 
      desc: t("bloodDonationDesc"), 
      iconBg: isLight
        ? "bg-red-50 text-red-600 border border-red-100"
        : "bg-[#481C21] text-red-500 border border-red-500/10", 
      hoverStyle: isLight
        ? "hover:border-red-300 hover:bg-slate-50"
        : "hover:border-red-500/40 hover:bg-[#481C21]/15" 
    },
    { 
      id: "sos", 
      icon: AlertTriangle, 
      title: t("emergencySos"), 
      desc: t("emergencySosDesc"), 
      iconBg: isLight
        ? "bg-rose-50 text-rose-600 border border-rose-100 animate-pulse"
        : "bg-[#481C21] text-rose-500 border border-rose-500/20 animate-pulse", 
      hoverStyle: isLight
        ? "hover:border-rose-300 hover:bg-slate-50"
        : "hover:border-red-500/40 hover:bg-red-500/5" 
    },
    { 
      id: "tolet", 
      icon: Home, 
      title: t("houseRent"), 
      desc: t("houseRentDesc"), 
      iconBg: isLight
        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
        : "bg-[#22444B] text-[#0CA671] border border-[#0CA671]/20", 
      hoverStyle: isLight
        ? "hover:border-emerald-305 hover:bg-slate-50"
        : "hover:border-[#0CA671]/40 hover:bg-[#0CA671]/5" 
    },
    { 
      id: "jobs", 
      icon: Briefcase, 
      title: t("jobs"), 
      desc: t("jobsDesc"), 
      iconBg: isLight
        ? "bg-purple-50 text-purple-600 border border-purple-100"
        : "bg-[#01205B] text-[#4A89DA] border border-[#4A89DA]/20", 
      hoverStyle: isLight
        ? "hover:border-purple-300 hover:bg-slate-50"
        : "hover:border-[#4A89DA]/40 hover:bg-[#4A89DA]/5" 
    },
    { 
      id: "marketplace", 
      icon: ShoppingCart, 
      title: t("marketplace"), 
      desc: t("marketplaceDesc"), 
      iconBg: isLight
        ? "bg-amber-50 text-amber-605 border border-amber-100"
        : "bg-[#0D1B2A] text-amber-500 border border-[#D3D9E2]/10", 
      hoverStyle: isLight
        ? "hover:border-amber-300 hover:bg-slate-50"
        : "hover:border-amber-550 hover:bg-[#0D1B2A]/20" 
    },
    { 
      id: "mosques", 
      icon: MosqueIcon, 
      title: t("mosques"), 
      desc: t("mosquesDesc"), 
      iconBg: isLight
        ? "bg-teal-50 text-teal-600 border border-teal-100"
        : "bg-[#22444B] text-teal-400 border border-teal-500/20", 
      hoverStyle: isLight
        ? "hover:border-teal-300 hover:bg-slate-50"
        : "hover:border-teal-500/45 hover:bg-[#22444B]/20" 
    },
    { 
      id: "events", 
      icon: Calendar, 
      title: t("events"), 
      desc: t("eventsDesc"), 
      iconBg: isLight
        ? "bg-violet-50 text-violet-600 border border-violet-100"
        : "bg-[#04142F] text-violet-400 border border-violet-500/20", 
      hoverStyle: isLight
        ? "hover:border-violet-300 hover:bg-slate-50"
        : "hover:border-violet-500 hover:bg-[#04142F]/15" 
    },
  ];

  // Filtered services based on search query
  const filteredServices = quickAccessServices.filter(service => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 bg-[#F4F6F9] dark:bg-[#010818]">
      
      {/* ==================== MOBILE HOMEPAGE (FROM SCRATCH) ==================== */}
      <div className="md:hidden flex flex-col min-h-screen bg-[#F4F6F9] dark:bg-[#010818] pb-20 relative text-slate-900 dark:text-white transition-colors duration-300">
        
        {/* 1. Header */}
        <header className="px-4 pt-4 pb-2 bg-white dark:bg-[#010818] border-b border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-blue-500/15 shrink-0">
              <Shield className="w-5 h-5 text-blue-100" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                  Bakalia Community
                </span>
              </div>
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
              {language === "en" ? "\u09ac\u09be\u0982\u09b2\u09be" : "EN"}
            </button>

            {/* Notification Button */}
            <button
              onClick={() => alert(language === "en" ? "Notifications are empty." : "\u0995\u09cb\u09a8\u09cb \u09a8\u09cb\u099f\u09bf\u09ab\u09bf\u0995\u09c7\u09b6\u09a8 \u09a8\u09c7\u0987\u0964")}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all active:scale-95 relative"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>

            {/* Menu icon with green indicator dot */}
            <div 
              className="relative cursor-pointer ml-0.5 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5 text-slate-800 dark:text-white" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#0CA671] rounded-full border border-white dark:border-[#010818]" />
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="bg-white dark:bg-[#04142F] border-b border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-3 duration-150 p-4 space-y-4">
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              {[t("home"), t("news"), t("services"), t("police"), t("emergency"), t("mosque"), t("marketplace"), t("aboutUs")].map((label, idx) => (
                <a
                  key={idx}
                  href="#"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#01205B]/60 hover:bg-slate-100 dark:hover:bg-[#01205B] text-slate-700 dark:text-slate-300 hover:text-slate-900 hover:text-white transition-all flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0CA671]" />
                  {label}
                </a>
              ))}
            </div>
            <div className="border-t border-slate-200 dark:border-slate-800/80 pt-3 flex flex-col gap-3">
              <button
                onClick={() => { setLanguage(language === "en" ? "bn" : "en"); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-105 dark:bg-[#01205B]/60 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#0CA671]" /> Language
                </span>
                <span className="text-[#0CA671]">{language === "en" ? "à¦¬à¦¾à¦‚à¦²à¦¾" : "English"}</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); setAuthMode("login"); setShowAuthModal(true); }}
                  className="w-full py-2 text-center text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-705 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {t("login")}
                </button>
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); setAuthMode("register"); setShowAuthModal(true); }}
                  className="w-full py-2 text-center text-xs font-bold rounded-lg bg-[#0CA671] text-white hover:bg-[#0CA671]/90"
                >
                  {t("register")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Search Capsule */}
        <div className="px-4 py-1.5 bg-slate-50/50 dark:bg-[#010818] transition-colors">
          <div className="flex items-center bg-white dark:bg-[#04142F] rounded-full px-3.5 py-1.5 shadow-sm border border-slate-200/50 dark:border-slate-800">
            <Search className="w-4.5 h-4.5 text-[#0CA671] shrink-0" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services, news, people..." 
              className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-[11px] ml-2 font-medium"
            />
            <button 
              onClick={() => alert("Filters menu is currently under development.")}
              className="w-6.5 h-6.5 rounded-full bg-[#0CA671] flex items-center justify-center text-white shrink-0 active:scale-95 transition-transform ml-1.5"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
            </button>
          </div>
        </div>

        {/* 3. Hero Banner Card */}
        <div className="px-4 py-2 bg-slate-50/50 dark:bg-[#010818] transition-colors">
          <div className="relative rounded-3xl overflow-hidden bg-[#04142F] border border-slate-200/50 dark:border-slate-800/80 shadow-lg aspect-[1.8/1]">
            <div 
              className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-55 mix-blend-lighten"
              style={{ backgroundImage: "url('/chattogram_night_skyline_1782988025505.png')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="absolute inset-0 p-4.5 flex flex-col justify-between z-10">
              <div>
                {heroAnnouncement ? (
                  <>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#0CA671] text-[8px] font-extrabold uppercase tracking-wider">
                      {heroAnnouncement.category}
                    </span>
                    <h2 className="text-xl font-black tracking-tight text-white leading-tight mt-1.5">
                      {heroAnnouncement.title}
                    </h2>
                  </>
                ) : (
                  <div className="h-10" /> /* Empty hero banner state as requested */
                )}
              </div>
              {/* Bottom row: empty as requested since buttons and 1/4 badge are removed */}
              <div />
            </div>
          </div>
        </div>

        {/* 4. Content Panel */}
        <div className="bg-white dark:bg-[#010818] rounded-t-[36px] mt-4 pt-7 px-4 pb-14 text-slate-805 dark:text-slate-200 flex flex-col space-y-5.5 shadow-2xl transition-colors">
          
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black tracking-tight text-slate-900 dark:text-white">Quick Services</h3>
            <button 
              onClick={() => alert("All services are displayed below.")}
              className="text-xs font-black text-[#0CA671] flex items-center gap-0.5"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div id="mobile-services-grid" className="grid grid-cols-4 gap-3">
            {[
              { title: "Police Help", desc: "Report & Support", icon: Shield, color: "text-blue-500 bg-blue-50 dark:text-[#4A89DA] dark:bg-[#04142F]" },
              { title: "Emergency", desc: "24/7 Services", icon: AlertTriangle, color: "text-red-500 bg-red-50 dark:text-rose-500 dark:bg-[#481C21]" },
              { title: "Mosques", desc: "Near You", icon: MosqueIcon, color: "text-emerald-500 bg-emerald-50 dark:text-[#0CA671] dark:bg-[#22444B]" },
              { title: "Marketplace", desc: "Buy & Sell", icon: ShoppingCart, color: "text-amber-500 bg-amber-50 dark:text-amber-550 dark:bg-[#01205B]" },
              { title: "Jobs", desc: "Find Opportunities", icon: Briefcase, color: "text-purple-500 bg-purple-50 dark:text-[#4A89DA] dark:bg-[#01205B]" },
              { title: "Blood Donors", desc: "Save Lives", icon: Droplet, color: "text-rose-500 bg-rose-50 dark:text-rose-500 dark:bg-[#481C21]" },
              { title: "Documents", desc: "Forms & Info", icon: Newspaper, color: "text-teal-500 bg-teal-50 dark:text-teal-400 dark:bg-[#22444B]" },
              { title: "Community", desc: "Groups & Events", icon: Users, color: "text-blue-500 bg-blue-50 dark:text-[#4A89DA] dark:bg-[#04142F]" }
            ].map((item, idx) => {
              const ItemIcon = item.icon;
              return (
                <div 
                  key={idx} 
                  onClick={() => {
                    if (item.title === "Emergency") {
                      triggerSOS();
                    } else if (item.title === "Police Help") {
                      alert("Connecting to Thana Police Help desk...");
                    } else {
                      setAuthMode("login");
                      setShowAuthModal(true);
                    }
                  }}
                  className="flex flex-col items-center text-center p-2 rounded-2xl bg-white dark:bg-[#01205B] border border-slate-100 dark:border-slate-800/40 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.color} shadow-sm shrink-0`}>
                    <ItemIcon className="w-5.5 h-5.5" />
                  </div>
                  <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 leading-tight mt-2 truncate w-full">{item.title}</span>
                  <span className="text-[8.5px] text-slate-400 dark:text-[#859798] font-bold mt-0.5 leading-none truncate w-full">{item.desc}</span>
                </div>
              );
            })}
          </div>

          {/* Next Prayer Card */}
          <div className="rounded-3xl bg-[#01122C] text-white p-4.5 shadow-xl border border-slate-800/10 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#0CA671]">
                  <MosqueIcon className="w-6.5 h-6.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    Next Prayer: <span className="text-[#0CA671]">{nextPrayer.name}</span>
                  </h4>
                  <span className="text-[9.5px] text-slate-400 flex items-center gap-1 mt-1 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Bakalia, Chattogram
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-base font-black text-[#0CA671] leading-none">{nextPrayer.timeStr}</span>
                <span className="block text-[9px] text-slate-400 font-bold mt-1.5 font-mono">{formatDate()}</span>
              </div>
            </div>
            <div className="border-t border-slate-800/50 mt-4 pt-3 flex items-center justify-between text-[10px]">
              <span className="text-slate-400 font-bold flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Fajr 3:48 AM
              </span>
              <button 
                onClick={() => setIsPrayerExpanded(!isPrayerExpanded)}
                className="text-[#0CA671] font-extrabold flex items-center gap-0.5 hover:underline"
              >
                View Full Timetable <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {isPrayerExpanded && (
              <div className="mt-4 pt-3.5 border-t border-slate-800/60 grid grid-cols-5 gap-2 text-center text-[10px]">
                {[
                  { name: "Fajr", time: "3:48 AM" },
                  { name: "Dhuhr", time: "12:02 PM" },
                  { name: "Asr", time: "4:44 PM" },
                  { name: "Maghrib", time: "6:44 PM" },
                  { name: "Isha", time: "8:01 PM" }
                ].map((p, idx) => (
                  <div key={idx} className={`p-1.5 rounded-xl border ${p.name === nextPrayer.name ? "bg-emerald-500/10 border-emerald-500/35 text-white" : "border-slate-800/40 text-slate-450"}`}>
                    <span className="block font-bold">{p.name}</span>
                    <span className="block text-[8.5px] font-mono font-semibold mt-0.5">{p.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats/Metrics cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { title: "Registered Citizens", value: "125,430", percent: "12.4% this month", color: "bg-emerald-50/60 dark:bg-[#01205B] border-emerald-100/50 dark:border-slate-800/40 text-emerald-800 dark:text-slate-200 icon-emerald-500", icon: Users },
              { title: "Resolved Complaints", value: "1,824", percent: "8.7% this month", color: "bg-blue-50/60 dark:bg-[#01205B] border-blue-100/50 dark:border-slate-800/40 text-blue-800 dark:text-slate-200 icon-blue-500", icon: ShieldCheck },
              { title: "Active Volunteers", value: "320", percent: "15.2% this month", color: "bg-purple-50/60 dark:bg-[#01205B] border-purple-100/50 dark:border-slate-800/40 text-purple-800 dark:text-slate-200 icon-purple-550", icon: Award }
            ].map((stat, idx) => {
              const StatIcon = stat.icon;
              return (
                <div key={idx} className={`p-3 rounded-2xl border ${stat.color} flex flex-col justify-between shadow-sm`}>
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#04142F] shadow-sm flex items-center justify-center mb-2.5">
                      <StatIcon className="w-5 h-5 text-slate-800 dark:text-[#4A89DA]" />
                    </div>
                    <span className="block text-base font-black tracking-tight leading-none text-slate-900 dark:text-white">{stat.value}</span>
                    <span className="block text-[8px] text-slate-500 dark:text-[#859798] font-extrabold mt-1.5 leading-snug">{stat.title}</span>
                  </div>
                  <span className="block text-[7.5px] font-black text-emerald-600 dark:text-[#0CA671] mt-2.5 leading-none">â†‘ {stat.percent}</span>
                </div>
              );
            })}
          </div>

        </div>

        {/* 5. Sticky Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#04142F]/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-850 px-4 py-2.5 flex items-center justify-around shadow-2xl text-slate-500 dark:text-slate-400 transition-colors">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center gap-0.5 text-[#0CA671] dark:text-[#0CA671]"
          >
            <Home className="w-5.5 h-5.5" />
            <span className="text-[9px] font-black">{language === "en" ? "Home" : "à¦®à§‚à¦² à¦ªà¦¾à¦¤à¦¾"}</span>
          </button>

          <button 
            onClick={() => {
              const el = document.getElementById("mobile-services-grid");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex flex-col items-center gap-0.5 hover:text-slate-800 dark:hover:text-white"
          >
            <LayoutGrid className="w-5.5 h-5.5" />
            <span className="text-[9px] font-black">{language === "en" ? "Services" : "à¦¸à§‡à¦¬à¦¾"}</span>
          </button>

          {/* SOS button */}
          <button 
            onClick={triggerSOS}
            className={`flex flex-col items-center justify-center -mt-6.5 w-14 h-14 rounded-full text-white shadow-xl transition-all duration-200 active:scale-95 ${
              sosActive 
                ? "bg-rose-600 animate-pulse shadow-rose-500/50" 
                : sosCountdown !== null 
                  ? "bg-amber-600 animate-pulse shadow-amber-500/50"
                  : "bg-[#EF4444] hover:bg-[#EF4444]/95 shadow-[#EF4444]/30"
            }`}
          >
            <AlertTriangle className="w-5 h-5 text-white" />
            <span className="text-[8px] font-black mt-0.5 tracking-wider text-white">SOS</span>
          </button>

          <button 
            onClick={() => {
              setIsPrayerExpanded(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-0.5 hover:text-slate-800 dark:hover:text-white"
          >
            <MosqueIcon className="w-5.5 h-5.5 text-slate-500 dark:text-slate-400" />
            <span className="text-[9px] font-black">{language === "en" ? "Mosque" : "à¦®à¦¸à¦œà¦¿à¦¦"}</span>
          </button>

          <button 
            onClick={() => { setAuthMode("login"); setShowAuthModal(true); }}
            className="flex flex-col items-center gap-0.5 hover:text-slate-800 dark:hover:text-white"
          >
            <User className="w-5.5 h-5.5" />
            <span className="text-[9px] font-black">{language === "en" ? "Profile" : "à¦ªà§à¦°à§‹à¦«à¦¾à¦‡à¦²"}</span>
          </button>
        </div>

      </div>

      {/* ==================== DESKTOP/TABLET VIEWPORT ==================== */}
      <div className="hidden md:block">
        
        {/* 1. TOP NAVBAR */}
        <header className="sticky top-0 z-50 glass-nav border-b border-slate-200/85 dark:border-slate-800/60 bg-white/95 dark:bg-[#010818]/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Row 1: Logo, Location, Search, Action buttons */}
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Logo and Location Selector */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-blue-500/15">
                  {/* Shield logo (Blue shield as specified) */}
                  <Shield className="w-5 h-5 text-blue-100 dark:text-blue-100" />
                </div>
                <div className="leading-tight">
                  <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white block">
                    Bakalia
                  </span>
                  <span className="block text-[9px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                    Community
                  </span>
                </div>
              </div>

              {/* Location selector dropdown from light mode mockup */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#04142F] border border-slate-200/60 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-350 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-all select-none">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>Bakalia, Chattogram</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            {/* Center: Search Bar */}
            <div className="hidden md:flex flex-1 max-w-sm mx-6 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="w-full pl-9 pr-12 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-[#04142F] border border-slate-200 dark:border-slate-800/80 focus:border-blue-500/30 dark:focus:border-[#4A89DA]/45 focus:bg-white dark:focus:bg-[#04142F] focus:ring-1 focus:ring-blue-500/10 outline-none transition-all duration-200 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400"
              />
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-medium text-slate-400 dark:text-slate-500 bg-white dark:bg-[#01205B] border border-slate-200 dark:border-slate-700/65 rounded">
                  Ctrl K
                </kbd>
              </div>
            </div>

            {/* Right: Language switch, Theme switch, Login, Register */}
            <div className="hidden lg:flex items-center gap-3">
              
              {/* Language Switch */}
              <button 
                onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                className="px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 text-xs font-semibold transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-805"
              >
                <Globe className="w-4 h-4 text-emerald-500" />
                <span>{language === "en" ? "à¦¬à¦¾à¦‚à¦²à¦¾" : "English"}</span>
              </button>

              {/* Theme Switch */}
              <button 
                onClick={toggleTheme}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-350 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all"
                aria-label="Toggle theme"
              >
                {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-3 ml-1">
                <button 
                  onClick={() => { setAuthMode("login"); setShowAuthModal(true); }}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-slate-800"
                >
                  {t("login")}
                </button>
                <button 
                  onClick={() => { setAuthMode("register"); setShowAuthModal(true); }}
                  className="px-4 py-1.5 text-xs font-bold rounded-lg text-white bg-blue-600 dark:bg-[#0CA671] hover:bg-blue-500 dark:hover:bg-emerald-500 shadow-md shadow-blue-500/10 dark:shadow-emerald-500/10 active:scale-[0.98] transition-all"
                >
                  {t("register")}
                </button>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-slate-150 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-350 transition-all"
              >
                {isLight ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-155 dark:hover:bg-slate-850 transition-all"
              >
                {isMobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Row 2: Secondary Nav Bar (Home, News, etc.) */}
        <div className="border-t border-slate-200/80 dark:border-slate-850 bg-white dark:bg-[#010818]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-7 py-2.5 text-xs font-semibold justify-start lg:justify-start overflow-x-auto scrollbar-none">
              {[
                { label: t("home"), active: true, icon: Home },
                { label: t("news"), icon: Newspaper },
                { label: t("services"), icon: LayoutGrid },
                { label: t("police"), icon: ShieldCheck },
                { label: t("emergency"), icon: AlertTriangle },
                { label: t("mosque"), icon: MosqueIcon },
                { label: t("marketplace"), icon: ShoppingCart },
                { label: t("aboutUs"), icon: Info }
              ].map((item, idx) => {
                const Icon = item.icon;
                const isActive = item.active;
                const isEmergency = item.label === t("emergency");
                return (
                  <a
                    key={idx}
                    href="#"
                    className={`flex items-center gap-1.5 transition-all duration-200 py-1 border-b-2 shrink-0 ${
                      isActive 
                        ? isLight 
                          ? "text-blue-600 border-blue-600"
                          : "text-[#0CA671] border-[#0CA671]" 
                        : isEmergency
                          ? "text-[#EF4444] border-transparent hover:text-red-500"
                          : "text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-800"
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
              
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-slate-100 dark:bg-[#04142F] border border-slate-200 dark:border-slate-850 text-slate-805 dark:text-slate-100 outline-none"
                />
              </div>

              {/* Navigation Links */}
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                {[t("home"), t("news"), t("services"), t("police"), t("emergency"), t("mosque"), t("marketplace"), t("aboutUs")].map((label, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#04142F]/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 hover:text-slate-900 hover:text-white transition-all flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    {label}
                  </a>
                ))}
              </div>

              <div className="border-t border-slate-200 dark:border-slate-850 pt-3.5 flex flex-col gap-3">
                {/* Language Switch */}
                <button
                  onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-100 dark:bg-[#04142F]/60 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-500" /> Language
                  </span>
                  <span>{language === "en" ? "à¦¬à¦¾à¦‚à¦²à¦¾" : "English"}</span>
                </button>

                {/* Login/Register Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => { setIsMobileMenuOpen(false); setAuthMode("login"); setShowAuthModal(true); }}
                    className="w-full py-2 text-center text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                  >
                    {t("login")}
                  </button>
                  <button 
                    onClick={() => { setIsMobileMenuOpen(false); setAuthMode("register"); setShowAuthModal(true); }}
                    className="w-full py-2 text-center text-xs font-bold rounded-lg bg-blue-600 dark:bg-[#0CA671] text-white hover:bg-blue-500 dark:hover:bg-emerald-450"
                  >
                    {t("register")}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section 
        className="relative overflow-hidden py-2 sm:py-3 lg:py-4 text-slate-900 dark:text-white"
        style={{
          background: isLight 
            ? "linear-gradient(to right, #F1F5F9 0%, #F1F5F9 100%)" 
            : "linear-gradient(90deg, #010818 0%, #04142F 25%, #01205B 55%, #043983 75%, #0CA671 100%)"
        }}
      >
        
        {/* Background Image depending on mode */}
        <div 
          className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-60 dark:opacity-25 mix-blend-multiply dark:mix-blend-lighten"
          style={{ backgroundImage: isLight ? "url('/hero-bg-day.png')" : "url('/hero-bg.png')" }}
        />
        
        {/* Gradients overlays */}
        {isLight ? (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-100/90 to-transparent pointer-events-none" />
        ) : (
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#F8FAFC]/5 to-transparent dark:from-[#010818]/60 dark:via-transparent dark:to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-500/5 dark:bg-emerald-500/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-5 lg:gap-8 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 flex flex-col space-y-2.5 text-center lg:text-left">
              
              {/* Tag Capsule */}
              <div className="inline-flex self-center lg:self-start items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450 text-[10px] sm:text-[10.5px] font-bold backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t("systemTag")}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-2.5xl sm:text-3xl lg:text-3.8xl font-black tracking-tight leading-tight sm:leading-tight">
                <span className="block text-slate-900 dark:text-white font-bold">
                  {t("heroTitle")}
                </span>
                <span className="inline-flex gap-2">
                  <span className="text-emerald-500 dark:text-[#0CA671] font-black">{language === "en" ? "Safer" : "à¦¨à¦¿à¦°à¦¾à¦ªà¦¦"}</span>
                  <span className="text-blue-600 dark:text-[#4A89DA] font-black">{language === "en" ? "Bakalia" : "à¦¬à¦¾à¦•à¦²à¦¿à¦¯à¦¼à¦¾"}</span>
                </span>
              </h1>

              {/* Subheading */}
              <p className="max-w-lg mx-auto lg:mx-0 text-slate-600 dark:text-slate-350 text-xs sm:text-[12.5px] leading-relaxed">
                {t("heroDesc")}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5">
                <button 
                  onClick={triggerSOS}
                  className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-4.5 py-2 rounded-lg text-white text-xs font-bold transition-all shadow-md active:scale-[0.98] ${
                    sosActive 
                      ? "bg-rose-600 animate-pulse hover:bg-rose-500 shadow-rose-600/10" 
                      : sosCountdown !== null 
                        ? "bg-amber-600 hover:bg-amber-500 shadow-amber-600/10"
                        : isLight 
                          ? "bg-blue-600 hover:bg-blue-750 shadow-blue-500/10"
                          : "bg-[#0CA671] hover:bg-[#0CA671]/95 shadow-md shadow-[#0CA671]/15"
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>
                    {sosActive 
                      ? (language === "en" ? "Cancel SOS" : "à¦à¦¸à¦“à¦à¦¸ à¦¬à¦¾à¦¤à¦¿à¦² à¦•à¦°à§à¦¨")
                      : sosCountdown !== null
                        ? `${language === "en" ? "Sending SOS in" : "à¦à¦¸à¦“à¦à¦¸ à¦ªà¦¾à¦ à¦¾à¦¨à§‹ à¦¹à¦šà§à¦›à§‡"} ${sosCountdown}s`
                        : t("getHelpNow")
                    }
                  </span>
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById("quick-access");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full sm:w-auto px-4.5 py-2 rounded-lg text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/60 bg-white dark:bg-[#04142F]/70 transition-all text-xs font-bold shadow-sm"
                >
                  {t("exploreServices")}
                </button>
              </div>

            </div>

            {/* Hero Right: Prayer Widget */}
            <div className="lg:col-span-5 w-full max-w-md mx-auto">
              <div className="glass-card bg-white/95 dark:bg-[#01205B]/85 border-slate-200 dark:border-slate-800/80 rounded-xl p-3.5 sm:p-4 backdrop-blur-xl shadow-2xl relative overflow-hidden text-slate-850 dark:text-white">
                
                {/* Visual Top Highlight Accent */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-[#0CA671]" />
                
                {/* Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center gap-2.5">
                    {/* Prayer Icon Gold/Amber as specified */}
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 dark:text-amber-400">
                      <MosqueIcon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="text-xs.5 font-bold text-slate-900 dark:text-slate-100">{t("prayerTimesTitle")}</h3>
                      <p className="text-[9.5px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#0CA671]" /> {t("prayerTimesLoc")}
                      </p>
                    </div>
                  </div>
                  
                  {/* Dynamic Time Indicator */}
                  <div className="text-right">
                    <span className="block text-[9.5px] text-slate-500 dark:text-slate-400 leading-tight">{formatDate()}</span>
                    <span className="text-[11px] font-bold font-mono text-emerald-600 dark:text-[#0CA671] leading-tight">
                      {currentTime.toLocaleTimeString(language === "en" ? "en-US" : "bn-BD", { 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        second: '2-digit', 
                        hour12: true 
                      })}
                    </span>
                  </div>
                </div>

                {/* Next Prayer Banner for Mobile (hidden when expanded, always hidden on desktop) */}
                <div className={`mt-2.5 flex items-center justify-between p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-[#0CA671] md:hidden ${isPrayerExpanded ? "hidden" : "flex"}`}>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0CA671] animate-ping" />
                    <span className="text-[11px] font-bold">
                      {language === "en" ? "Next Prayer:" : "à¦ªà¦°à¦¬à¦°à§à¦¤à§€ à¦¨à¦¾à¦®à¦¾à¦œ:"} {t(nextPrayer.name.toLowerCase())}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold">{prayerTimes[nextPrayer.name as keyof PrayerTimes]}</span>
                </div>

                {/* Timetable list (collapsible on mobile, always visible on desktop) */}
                <div className={`mt-3 space-y-1.5 ${isPrayerExpanded ? "block" : "hidden md:block"}`}>
                  {(Object.keys(prayerTimes) as Array<keyof PrayerTimes>).map((key) => {
                    const isNext = nextPrayer.name === key;
                    return (
                      <div 
                        key={key}
                        className={`flex items-center justify-between px-3 py-1.5 rounded-lg transition-all duration-200 ${
                          isNext 
                            ? "bg-[#0CA671]/10 border border-[#0CA671]/25 text-emerald-600 dark:text-[#0CA671] shadow-sm font-bold" 
                            : "bg-slate-50/50 dark:bg-slate-900/20 border border-transparent text-slate-700 dark:text-slate-335 hover:bg-slate-100 dark:hover:bg-slate-900/40 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${isNext ? "bg-[#0CA671] animate-ping" : "bg-slate-400 dark:bg-slate-700"}`} />
                          <span className="text-[11px]">{t(key.toLowerCase())}</span>
                        </div>
                        <span className="font-mono text-xs">{prayerTimes[key]}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom link */}
                <div className="mt-2.5 text-center">
                  <button 
                    onClick={() => setIsPrayerExpanded(!isPrayerExpanded)}
                    className="text-[10.5px] text-emerald-600 dark:text-[#0CA671] hover:text-emerald-500 dark:hover:text-emerald-300 font-bold inline-flex items-center gap-0.5 transition-all group md:hidden"
                  >
                    <span>{isPrayerExpanded ? (language === "en" ? "Show Less" : "à¦¸à¦‚à¦•à§à¦·à¦¿à¦ªà§à¦¤ à¦°à§‚à¦ª") : t("viewFullTimetable")}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isPrayerExpanded ? "rotate-180" : ""}`} />
                  </button>
                  <a 
                    href="#" 
                    className="text-[10.5px] text-emerald-600 dark:text-[#0CA671] hover:text-emerald-500 dark:hover:text-emerald-300 font-bold hidden md:inline-flex items-center gap-0.5 transition-all group"
                  >
                    <span>{t("viewFullTimetable")}</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. STATISTICS SECTION */}
      <section className="py-6 bg-white dark:bg-[#010818] border-y border-slate-200 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-4 items-stretch">
            
            {/* Stats items with color-coded circles matching spec */}
            <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-3.5">
              {[
                { label: t("registeredCitizens"), value: "125,430", growth: "+2.4% " + t("thisMonth"), icon: Users, iconColor: "text-blue-500 bg-blue-50 dark:text-[#4A89DA] dark:bg-[#4A89DA]/10" },
                { label: t("resolvedComplaints"), value: "1,824", growth: "+18% " + t("thisMonth"), icon: ShieldCheck, iconColor: isLight ? "text-emerald-600 bg-emerald-50" : "text-[#0CA671] bg-[#0CA671]/10" },
                { label: t("activeVolunteers"), value: "450", growth: "+35 " + t("thisMonth"), icon: Award, iconColor: isLight ? "text-purple-650 bg-purple-50" : "text-[#0CA671] bg-[#0CA671]/10" },
                { label: t("dailyVisitors"), value: "14,230", growth: "+6.3% " + t("thisWeek"), icon: Heart, iconColor: isLight ? "text-amber-600 bg-amber-50" : "text-[#0CA671] bg-[#0CA671]/10" }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="glass-card bg-white dark:bg-[#01205B] border-slate-200 dark:border-slate-800/80 rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div>
                      <span className="block text-[9px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-350">{stat.label}</span>
                      <span className="block text-xl font-black text-slate-800 dark:text-slate-100 mt-1">{stat.value}</span>
                      <span className="text-[9px] font-bold text-emerald-600 dark:text-[#0CA671] mt-0.5 block">{stat.growth}</span>
                    </div>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${stat.iconColor} border border-slate-200 dark:border-slate-800`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Emergency SOS Card (Danger bg card as specified) */}
            <div className="lg:col-span-3">
              <button 
                onClick={triggerSOS}
                className={`w-full h-full text-left p-4.5 rounded-xl border transition-all flex items-center justify-between group relative overflow-hidden active:scale-[0.99] ${
                  isLight 
                    ? "bg-white border-slate-200 shadow-sm hover:border-red-300"
                    : "bg-[#481C21] border-[#481C21]/60 shadow-lg shadow-rose-950/20 hover:border-red-500/40 text-white"
                }`}
              >
                {/* Background glowing circle */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 dark:bg-[#EF4444]/10 rounded-full group-hover:scale-110 transition-transform duration-300" />
                
                <div>
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-100">{t("emergencyWidgetTitle")}</span>
                  <span className="block text-[9.5px] text-slate-400 dark:text-slate-300 mt-0.5">{t("emergencyWidgetDesc")}</span>
                  <span className="block text-[10px] font-bold text-red-600 dark:text-rose-300 mt-1.5">Tap for SOS</span>
                </div>
                
                {/* Red Circular SOS Badge */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-red-50 dark:bg-rose-500/10 text-[#EF4444] border border-red-200 dark:border-[#EF4444]/30 animate-pulse">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 4. QUICK ACCESS GRID */}
      <section id="quick-access" className="py-12 sm:py-16 bg-[#F4F6F9] dark:bg-[#010818]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header with View All Services button from mockup */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                {t("quickAccessTitle")}
              </h2>
              <p className="mt-1 text-xs text-slate-505 dark:text-slate-400 max-w-xl">
                {t("quickAccessDesc")}
              </p>
            </div>
            
            {/* View All Services Button */}
            <button 
              onClick={() => alert("All services list is under development.")}
              className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-202 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900 bg-white dark:bg-[#01205B] transition-all flex items-center gap-1 shadow-sm select-none"
            >
              <span>{language === "en" ? "View All Services" : "à¦¸à¦•à¦² à¦¸à§‡à¦¬à¦¾à¦¸à¦®à§‚à¦¹ à¦¦à§‡à¦–à§à¦¨"}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-450" />
            </button>
          </div>

          {/* Quick Access Services: Compact 4-Column Grid on mobile, detailed cards on desktop */}
          <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
            {filteredServices.map((service) => {
              const Icon = service.icon;
              return (
                <div 
                  key={service.id} 
                  className="group flex flex-col items-center justify-center p-2.5 sm:flex-row sm:items-start sm:justify-start sm:p-4 bg-white dark:bg-[#01205B] border border-slate-200/80 dark:border-slate-800/80 rounded-xl transition-all duration-300 shadow-sm cursor-pointer hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"
                >
                  {/* Icon Circle */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${service.iconBg}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex flex-col items-center sm:items-start justify-center min-w-0 mt-1.5 sm:mt-0 sm:ml-3">
                    <h3 className="text-[10px] sm:text-xs font-bold text-slate-850 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-[#0CA671] transition-colors leading-tight text-center sm:text-left truncate max-w-[76px] sm:max-w-none">
                      {service.title}
                    </h3>
                    <p className="hidden sm:block mt-1 text-[10.5px] text-slate-450 dark:text-[#859798] leading-snug group-hover:text-slate-600 dark:group-hover:text-slate-305 transition-colors">
                      {service.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. LATEST NEWS + NEARBY SERVICES + COMMUNITY HIGHLIGHTS */}
      <section className="py-6 sm:py-12 border-t border-slate-200 dark:border-slate-900 bg-slate-50/50 dark:bg-[#010818]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Mobile Column switcher (Tabs) */}
          <div className="flex md:hidden items-center justify-between p-1 bg-slate-100 dark:bg-[#04142F]/60 border border-slate-200/50 dark:border-slate-800/40 rounded-lg mb-5 text-[11px] font-bold">
            <button 
              onClick={() => setActiveMobileTab("news")}
              className={`flex-1 py-1.5 rounded transition-all text-center ${
                activeMobileTab === "news" 
                  ? "bg-blue-650 dark:bg-[#0CA671] text-white" 
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {t("latestNews").split(' ')[1] || t("latestNews")}
            </button>
            <button 
              onClick={() => setActiveMobileTab("nearby")}
              className={`flex-1 py-1.5 rounded transition-all text-center ${
                activeMobileTab === "nearby" 
                  ? "bg-blue-650 dark:bg-[#0CA671] text-white" 
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {t("nearbyServices").split(' ')[0] || t("nearbyServices")}
            </button>
            <button 
              onClick={() => setActiveMobileTab("highlights")}
              className={`flex-1 py-1.5 rounded transition-all text-center ${
                activeMobileTab === "highlights" 
                  ? "bg-blue-650 dark:bg-[#0CA671] text-white" 
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {t("communityHighlights").split(' ')[1] || t("communityHighlights")}
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Column 1: Latest News */}
            <div className={`flex flex-col space-y-4 ${activeMobileTab === "news" ? "flex" : "hidden md:flex"}`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-850">
                <h3 className="text-sm font-extrabold text-slate-805 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  {t("latestNews")}
                </h3>
                <a href="#" className="text-[11px] font-bold text-blue-600 dark:text-blue-450 hover:underline">
                  {t("viewAll")}
                </a>
              </div>

              {/* News List */}
              <div className="space-y-3.5">
                {[
                  {
                    title: language === "en" 
                      ? "Youth coordination campaign to ensure purity in Bakalia Area"
                      : "à¦¬à¦¾à¦•à¦²à¦¿à¦¯à¦¼à¦¾à§Ÿ à¦¯à§à¦¬ à¦¸à¦®à¦¾à¦œà§‡à¦° à¦‰à¦¦à§à¦¯à§‹à¦—à§‡ à¦ªà¦°à¦¿à¦šà§à¦›à¦¨à§à¦¨à¦¤à¦¾ à¦…à¦­à¦¿à¦¯à¦¾à¦¨ à¦ªà¦°à¦¿à¦šà¦¾à¦²à¦¨à¦¾",
                    category: language === "en" ? "Civic Activity" : "à¦¨à¦¾à¦—à¦°à¦¿à¦• à¦‰à¦¦à§à¦¯à§‹à¦—",
                    categoryColor: "bg-emerald-50 text-emerald-600 dark:bg-[#22444B] dark:text-[#0CA671] border border-emerald-100 dark:border-[#0CA671]/20",
                    time: language === "en" ? "2 hours ago" : "à§¨ à¦˜à¦£à§à¦Ÿà¦¾ à¦†à¦—à§‡",
                    views: "1.2k views",
                  },
                  {
                    title: language === "en"
                      ? "Police Notice: Landlords urged to follow guidelines on traffic laws"
                      : "à¦Ÿà§à¦°à¦¾à¦«à¦¿à¦• à¦†à¦‡à¦¨ à¦®à§‡à¦¨à§‡ à¦šà¦²à¦¾à¦° à¦†à¦¹à§à¦¬à¦¾à¦¨ à¦ªà§à¦²à¦¿à¦¶à§‡à¦°: à¦¸à¦‚à¦¯à§‹à¦— à¦¸à§œà¦•à§‡ à¦¸à¦¤à¦°à§à¦•à§€à¦•à¦°à¦£ à¦¨à§‹à¦Ÿà¦¿à¦¶",
                    category: language === "en" ? "Police Notice" : "à¦ªà§à¦²à¦¿à¦¶ à¦¨à§‹à¦Ÿà¦¿à¦¶",
                    categoryColor: "bg-blue-50 text-blue-600 dark:bg-[#04142F] dark:text-[#4A89DA] border border-blue-105 dark:border-[#4A89DA]/20",
                    time: language === "en" ? "5 hours ago" : "à§« à¦˜à¦£à§à¦Ÿà¦¾ à¦†à¦—à§‡",
                    views: "856 views",
                  }
                ].map((news, idx) => (
                  <div key={idx} className="glass-card bg-white dark:bg-[#01205B] border-slate-200 dark:border-slate-850 rounded-xl overflow-hidden p-3.5 flex gap-3.5 hover:border-slate-300 dark:hover:border-slate-700/50 transition-all cursor-pointer shadow-sm">
                    
                    {/* Visual Dummy News Image Box */}
                    <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-[#04142F] border border-slate-200 dark:border-slate-800 shrink-0 flex items-center justify-center text-[9px] font-bold text-slate-400 dark:text-slate-500">
                      PHOTO
                    </div>

                    <div className="flex flex-col justify-between min-w-0">
                      <div>
                        <span className={`inline-block px-1.5 py-0.5 text-[8.5px] font-extrabold rounded ${news.categoryColor}`}>
                          {news.category}
                        </span>
                        <h4 className="mt-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight">
                          {news.title}
                        </h4>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[9px] text-slate-455 dark:text-[#859798]">
                        <span>{news.time}</span>
                        <span>â€¢</span>
                        <span>{news.views}</span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Nearby Services Directory */}
            <div className={`flex flex-col space-y-4 ${activeMobileTab === "nearby" ? "flex" : "hidden md:flex"}`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-850">
                <h3 className="text-sm font-extrabold text-slate-805 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  {t("nearbyServices")}
                </h3>
                <a href="#" className="text-[11px] font-bold text-blue-600 dark:text-blue-455 hover:underline">
                  {t("viewMap")}
                </a>
              </div>

              {/* Nearby Services List */}
              <div className="glass-card bg-white dark:bg-[#01205B] border-slate-200 dark:border-slate-855 rounded-xl p-3.5 divide-y divide-slate-100 dark:divide-slate-800/60 shadow-sm">
                {[
                  { name: t("hospitals"), count: `8 ${t("nearbySuffix")}`, icon: Hospital, color: "text-rose-500" },
                  { name: t("policeStation"), count: `2 ${t("nearbySuffix")}`, icon: ShieldCheck, color: "text-blue-500" },
                  { name: t("mosques"), count: `12 ${t("nearbySuffix")}`, icon: MosqueIcon, color: "text-teal-600" },
                  { name: t("schools"), count: `15 ${t("nearbySuffix")}`, icon: School, color: "text-amber-600" },
                  { name: t("fireService"), count: `3 ${t("nearbySuffix")}`, icon: Flame, color: "text-red-500" }
                ].map((item, idx) => {
                  const ItemIcon = item.icon;
                  return (
                    <div key={idx} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 hover:bg-slate-50 dark:hover:bg-slate-800/25 rounded px-1 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-2.5">
                        <ItemIcon className={`w-4 h-4 ${item.color}`} />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-450 dark:text-[#859798] font-semibold">{item.count}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 3: Community Highlights */}
            <div className={`flex flex-col space-y-4 ${activeMobileTab === "highlights" ? "flex" : "hidden md:flex"}`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-850">
                <h3 className="text-sm font-extrabold text-slate-850 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  {t("communityHighlights")}
                </h3>
                <a href="#" className="text-[11px] font-bold text-blue-600 dark:text-blue-450 hover:underline">
                  {t("viewLeaderboard")}
                </a>
              </div>

              {/* Leaderboard List Layout including vector Trophy */}
              <div className="glass-card bg-white dark:bg-[#01205B] border-slate-200 dark:border-slate-850 rounded-xl p-4.5 shadow-sm">
                
                {/* Horizontal split content: Top volunteers list + Trophy vector right */}
                <div className="flex items-center justify-between gap-4">
                  
                  {/* Volunteers List */}
                  <div className="space-y-3.5 flex-1">
                    {[
                      { name: "Abdullah Al Mamun", role: t("topVolunteer"), points: 210, avatarBg: "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-450 dark:border-emerald-500/20" },
                      { name: "Sadia Akter", role: t("activeCitizen"), points: 180, avatarBg: "bg-blue-50 text-blue-600 border border-blue-100 dark:bg-[#04142F] dark:text-[#4A89DA] dark:border-[#4A89DA]/20" },
                      { name: "Md. Arif Hossen", role: t("helpfulCitizen"), points: 160, avatarBg: "bg-amber-50 text-amber-600 border border-amber-100 dark:bg-[#22444B] dark:text-[#0CA671] dark:border-[#0CA671]/20" }
                    ].map((user, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full ${user.avatarBg} font-black text-xs flex items-center justify-center shrink-0 shadow-sm`}>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="min-w-0">
                          <span className="block text-xs font-bold text-slate-850 dark:text-slate-200 truncate leading-none">{user.name}</span>
                          <span className="block text-[9px] text-slate-450 dark:text-[#859798] font-bold mt-0.5 leading-none">{user.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Trophy Vector Artwork on the right (matches light mode spec) */}
                  <TrophyVector />

                </div>

                <button 
                  onClick={() => alert("Leaderboard view is currently under development.")}
                  className="w-full py-2.5 rounded-lg border border-slate-202 dark:border-slate-800 text-[10.5px] font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center mt-4 bg-white dark:bg-[#04142F]"
                >
                  {t("viewLeaderboard")}
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. TRUST & FEATURES BAR */}
      <section className="py-8 bg-white dark:bg-[#010818] border-t border-slate-200 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: t("verifiedSecure"), desc: t("verifiedSecureDesc"), color: "text-blue-600 dark:text-[#4A89DA]" },
              { icon: Cpu, title: t("aiModeration"), desc: t("aiModerationDesc"), color: "text-[#0CA671] dark:text-[#0CA671]" },
              { icon: Headphones, title: t("support"), desc: t("supportDesc"), color: "text-indigo-600 dark:text-indigo-400" },
              { icon: Users, title: t("trustedBy"), desc: t("trustedByDesc"), color: "text-amber-600 dark:text-amber-405" }
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="flex items-center md:items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-slate-50 dark:bg-[#04142F] flex items-center justify-center shrink-0 ${item.color} border border-slate-200 dark:border-slate-800/80 shadow-sm`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-805 dark:text-slate-200">{item.title}</h4>
                    <p className="text-[9.5px] text-slate-450 dark:text-[#859798] mt-0.5 leading-normal">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-405 dark:text-slate-500 border-t border-slate-200 dark:border-slate-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Copyright */}
            <div className="text-center md:text-left">
              <span className="block text-xs font-bold text-slate-250 dark:text-slate-350">Bakalia Community</span>
              <span className="block text-[10px] mt-0.5 text-slate-400 dark:text-slate-500">{t("copyright")}</span>
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-[10.5px] font-bold text-slate-350 dark:text-slate-450">
              <a href="#" className="hover:text-slate-200 transition-colors">{t("privacy")}</a>
              <a href="#" className="hover:text-slate-200 transition-colors">{t("terms")}</a>
              <a href="#" className="hover:text-slate-200 transition-colors">{t("help")}</a>
              <a href="#" className="hover:text-slate-200 transition-colors">{t("contact")}</a>
              <a href="#" className="hover:text-[#0CA671] transition-colors text-[#0CA671]">{t("downloadRules")}</a>
            </div>

          </div>
        </div>
      </footer>

      </div>

      {/* 8. HIGH-FIDELITY AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-250">
          
          <div className="w-full max-w-sm glass-card bg-white dark:bg-[#0D1B2A] border-slate-202 dark:border-slate-800/80 text-slate-800 dark:text-white rounded-2xl p-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-105 dark:hover:bg-slate-800 transition-all"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            {/* Header */}
            <div className="text-center mb-5">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {authMode === "login" 
                  ? (language === "en" ? "Welcome Back" : "à¦†à¦ªà¦¨à¦¾à¦•à§‡ à¦¸à§à¦¬à¦¾à¦—à¦¤à¦®") 
                  : (language === "en" ? "Create Account" : "à¦¨à¦¤à§à¦¨ à¦…à§à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§à¦Ÿ à¦¤à§ˆà¦°à¦¿")
                }
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {authMode === "login" 
                  ? (language === "en" ? "Access your Bakalia portal account" : "à¦†à¦ªà¦¨à¦¾à¦° à¦¬à¦¾à¦•à¦²à¦¿à¦¯à¦¼à¦¾ à¦ªà§‹à¦°à§à¦Ÿà¦¾à¦² à¦…à§à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§à¦Ÿ à¦…à§à¦¯à¦¾à¦•à§à¦¸à§‡à¦¸ à¦•à¦°à§à¦¨")
                  : (language === "en" ? "Sign up to join our smart community" : "à¦†à¦®à¦¾à¦¦à§‡à¦° à¦¸à§à¦®à¦¾à¦°à§à¦Ÿ à¦¸à¦®à¦¾à¦œà§‡ à¦¯à§‹à¦— à¦¦à¦¿à¦¤à§‡ à¦¨à¦¿à¦¬à¦¨à§à¦§à¦¨ à¦•à¦°à§à¦¨")
                }
              </p>
            </div>

            {/* Selector tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-[#010818]/60 rounded-lg mb-5">
              <button 
                onClick={() => setAuthMethod("phone")}
                className={`py-1.5 text-[10.5px] font-bold rounded flex items-center justify-center gap-1.5 transition-all ${
                  authMethod === "phone" ? "bg-blue-650 dark:bg-blue-600 text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{language === "en" ? "Phone OTP" : "à¦«à§‹à¦¨ à¦“à¦Ÿà¦¿à¦ªà¦¿"}</span>
              </button>
              <button 
                onClick={() => setAuthMethod("email")}
                className={`py-1.5 text-[10.5px] font-bold rounded flex items-center justify-center gap-1.5 transition-all ${
                  authMethod === "email" ? "bg-blue-655 dark:bg-blue-600 text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{language === "en" ? "Email" : "à¦‡à¦®à§‡à¦‡à¦²"}</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={(e) => { e.preventDefault(); alert("Auth processing (demo only)."); setShowAuthModal(false); }} className="space-y-3.5">
              
              {authMode === "register" && (
                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    {language === "en" ? "Full Name" : "à¦¸à¦®à§à¦ªà§‚à¦°à§à¦£ à¦¨à¦¾à¦®"}
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Abdullah Al Mamun" 
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-55 dark:bg-[#010818] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:border-blue-500/50 outline-none text-xs transition-all"
                  />
                </div>
              )}

              {authMethod === "phone" ? (
                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    {language === "en" ? "Phone Number" : "à¦®à§‹à¦¬à¦¾à¦‡à¦² à¦¨à¦®à§à¦¬à¦°"}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-semibold text-slate-550 font-mono">+880</span>
                    <input 
                      type="tel" 
                      required 
                      pattern="[0-9]{10}"
                      placeholder="1712345678" 
                      className="w-full pl-13 pr-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border border-slate-205 dark:border-slate-800 text-slate-800 dark:text-white focus:border-blue-500/50 outline-none text-xs transition-all font-mono"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-550 dark:text-slate-400 mb-1 uppercase tracking-wider">
                      {language === "en" ? "Email Address" : "à¦‡à¦®à§‡à¦‡à¦² à¦ à¦¿à¦•à¦¾à¦¨à¦¾"}
                    </label>
                    <input 
                      type="email" 
                      required 
                      placeholder="name@example.com" 
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:border-blue-500/50 outline-none text-xs transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-550 dark:text-slate-400 mb-1 uppercase tracking-wider">
                      {language === "en" ? "Password" : "à¦ªà¦¾à¦¸à¦“à¦¯à¦¼à¦¾à¦°à§à¦¡"}
                    </label>
                    <input 
                      type="password" 
                      required 
                      placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" 
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:border-blue-500/50 outline-none text-xs transition-all font-mono"
                    />
                  </div>
                </>
              )}

              <button 
                type="submit"
                className="w-full py-2.5 rounded-lg bg-blue-600 dark:bg-[#0CA671] hover:bg-blue-500 dark:hover:bg-emerald-550 text-white text-xs font-bold transition-all shadow-md active:scale-[0.98] mt-4"
              >
                {authMode === "login" 
                  ? (language === "en" ? "Sign In" : "à¦²à¦—à¦‡à¦¨ à¦•à¦°à§à¦¨") 
                  : (language === "en" ? "Register Account" : "à¦¨à¦¿à¦¬à¦¨à§à¦§à¦¨ à¦¸à¦®à§à¦ªà¦¨à§à¦¨ à¦•à¦°à§à¦¨")
                }
              </button>
            </form>

            {/* Switch Mode Footer */}
            <div className="mt-5 text-center text-[10px] text-slate-500 dark:text-slate-455 pt-3.5 border-t border-slate-150 dark:border-slate-850">
              {authMode === "login" ? (
                <>
                  <span>{language === "en" ? "New to Bakalia?" : "à¦¬à¦¾à¦•à¦²à¦¿à¦¯à¦¼à¦¾ à¦•à¦®à¦¿à¦‰à¦¨à¦¿à¦Ÿà¦¿à¦¤à§‡ à¦¨à¦¤à§à¦¨?"}</span>{" "}
                  <button 
                    onClick={() => setAuthMode("register")}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
                  >
                    {language === "en" ? "Create an account" : "à¦¨à¦¤à§à¦¨ à¦…à§à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§à¦Ÿ à¦–à§à¦²à§à¦¨"}
                  </button>
                </>
              ) : (
                <>
                  <span>{language === "en" ? "Already have an account?" : "à¦‡à¦¤à¦¿à¦®à¦§à§à¦¯à§‡ à¦…à§à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§à¦Ÿ à¦†à¦›à§‡?"}</span>{" "}
                  <button 
                    onClick={() => setAuthMode("login")}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
                  >
                    {language === "en" ? "Log in here" : "à¦à¦–à¦¾à¦¨à§‡ à¦²à¦—à¦‡à¦¨ à¦•à¦°à§à¦¨"}
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ==================== SOS CONFIRMATION MODAL ==================== */}
      {showSosConfirmModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-250">
          <div className="w-full max-w-sm bg-white dark:bg-[#0D1B2A] text-slate-800 dark:text-white rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-150 border border-slate-200 dark:border-slate-800">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-[#481C21] text-[#EF4444] flex items-center justify-center mx-auto mb-4 animate-bounce">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black leading-tight text-slate-900 dark:text-white">
                {language === "en" ? "Do you really need help now?" : "à¦†à¦ªà¦¨à¦¾à¦° à¦•à¦¿ à¦¸à¦¤à§à¦¯à¦¿à¦‡ à¦œà¦°à§à¦°à¦¿ à¦¸à¦¾à¦¹à¦¾à¦¯à§à¦¯ à¦ªà§à¦°à§Ÿà§‹à¦œà¦¨?"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {language === "en" 
                  ? "This will send an emergency SOS alert containing your GPS location to Thana Police and local citizen volunteers." 
                  : "à¦à¦Ÿà¦¿ à¦†à¦ªà¦¨à¦¾à¦° à¦œà¦¿à¦ªà¦¿à¦à¦¸ à¦²à§‹à¦•à§‡à¦¶à¦¨ à¦¸à¦¹ à¦¥à¦¾à¦¨à¦¾ à¦ªà§à¦²à¦¿à¦¶ à¦à¦¬à¦‚ à¦¸à§à¦¥à¦¾à¦¨à§€à¦¯à¦¼ à¦¸à§à¦¬à§‡à¦šà§à¦›à¦¾à¦¸à§‡à¦¬à¦•à¦¦à§‡à¦° à¦•à¦¾à¦›à§‡ à¦à¦•à¦Ÿà¦¿ à¦œà¦°à§à¦°à¦¿ à¦à¦¸à¦“à¦à¦¸ à¦…à§à¦¯à¦¾à¦²à¦¾à¦°à§à¦Ÿ à¦ªà¦¾à¦ à¦¾à¦¬à§‡à¥¤"}
              </p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowSosConfirmModal(false)}
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
              >
                {language === "en" ? "Cancel" : "à¦¬à¦¾à¦¤à¦¿à¦²"}
              </button>
              <button
                onClick={() => {
                  setShowSosConfirmModal(false);
                  setShowSosHoldOverlay(true);
                  setSosHoldProgress(0);
                  setSosHoldTimeLeft(5);
                  setSosSuccess(false);
                }}
                className="w-full py-2.5 rounded-xl bg-red-650 hover:bg-red-500 text-white text-xs font-bold transition-all active:scale-95 shadow-md shadow-red-500/10"
              >
                {language === "en" ? "Yes, I Need Help" : "à¦¹à§à¦¯à¦¾à¦, à¦¸à¦¾à¦¹à¦¾à¦¯à§à¦¯ à¦²à¦¾à¦—à¦¬à§‡"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SOS HOLD-TO-VERIFY OVERLAY ==================== */}
      {showSosHoldOverlay && (
        <div 
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center text-white p-6 text-center select-none"
          style={{ 
            touchAction: 'none', 
            WebkitTouchCallout: 'none', 
            WebkitUserSelect: 'none', 
            userSelect: 'none',
            background: 'radial-gradient(ellipse at center, #0a1628 0%, #010818 70%)'
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes sos-pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.04); opacity: 0.9; }
            }
            @keyframes sos-glow {
              0%, 100% { box-shadow: 0 0 20px rgba(239,68,68,0.3), 0 0 60px rgba(239,68,68,0.1), inset 0 -8px 20px rgba(0,0,0,0.4), inset 0 4px 10px rgba(255,255,255,0.1); }
              50% { box-shadow: 0 0 40px rgba(239,68,68,0.5), 0 0 80px rgba(239,68,68,0.2), inset 0 -8px 20px rgba(0,0,0,0.4), inset 0 4px 10px rgba(255,255,255,0.1); }
            }
            @keyframes sos-glow-active {
              0%, 100% { box-shadow: 0 0 50px rgba(239,68,68,0.7), 0 0 100px rgba(239,68,68,0.35), 0 0 150px rgba(239,68,68,0.15), inset 0 -6px 15px rgba(0,0,0,0.5), inset 0 2px 8px rgba(255,200,200,0.2); }
              50% { box-shadow: 0 0 60px rgba(239,68,68,0.8), 0 0 120px rgba(239,68,68,0.4), 0 0 180px rgba(239,68,68,0.2), inset 0 -6px 15px rgba(0,0,0,0.5), inset 0 2px 8px rgba(255,200,200,0.2); }
            }
            @keyframes sos-shake {
              0%, 100% { transform: translate(0,0) scale(0.92); }
              10% { transform: translate(-1px, 1px) scale(0.92); }
              20% { transform: translate(1px, -1px) scale(0.92); }
              30% { transform: translate(-2px, 0px) scale(0.92); }
              40% { transform: translate(2px, 1px) scale(0.92); }
              50% { transform: translate(-1px, -1px) scale(0.92); }
              60% { transform: translate(1px, 2px) scale(0.92); }
              70% { transform: translate(-2px, -1px) scale(0.92); }
              80% { transform: translate(2px, 0px) scale(0.92); }
              90% { transform: translate(-1px, 1px) scale(0.92); }
            }
            @keyframes sos-ripple {
              0% { transform: scale(0.8); opacity: 0.6; }
              100% { transform: scale(2); opacity: 0; }
            }
            @keyframes sos-ring-pulse {
              0%, 100% { opacity: 0.15; }
              50% { opacity: 0.35; }
            }
            .sos-btn-idle {
              animation: sos-glow 2s infinite ease-in-out, sos-pulse 2s infinite ease-in-out;
            }
            .sos-btn-active {
              animation: sos-glow-active 0.8s infinite ease-in-out, sos-shake 0.15s infinite linear;
            }
            .sos-ripple-ring {
              animation: sos-ripple 1.5s infinite ease-out;
            }
            .sos-outer-ring {
              animation: sos-ring-pulse 2s infinite ease-in-out;
            }
          `}} />
          
          {!sosSuccess ? (
            <>
              <div className="max-w-xs space-y-2 mb-10">
                <h2 className="text-lg font-black tracking-tight uppercase text-red-500">
                  {language === "en" ? "Emergency SOS" : "\u099c\u09b0\u09c1\u09b0\u09bf \u098f\u09b8\u0993\u098f\u09b8"}
                </h2>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                  {language === "en" 
                    ? "Press and hold the button for 5 seconds to send alert" 
                    : "\u0985\u09cd\u09af\u09be\u09b2\u09be\u09b0\u09cd\u099f \u09aa\u09be\u09a0\u09be\u09a4\u09c7 \u09ac\u09cb\u09a4\u09be\u09ae\u099f\u09bf \u09eb \u09b8\u09c7\u0995\u09c7\u09a8\u09cd\u09a1 \u099a\u09c7\u09aa\u09c7 \u09a7\u09b0\u09c1\u09a8"}
                </p>
              </div>

              {/* Hold Button Container */}
              <div className="relative flex items-center justify-center" style={{ width: '220px', height: '220px' }}>
                
                {/* Outer decorative ring */}
                <div 
                  className="absolute rounded-full border-2 sos-outer-ring pointer-events-none"
                  style={{ 
                    width: '210px', height: '210px',
                    borderColor: isHoldingSos ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)'
                  }}
                />

                {/* Expanding ripple rings while holding */}
                {isHoldingSos && (
                  <>
                    <div className="absolute rounded-full border-2 border-red-500/40 sos-ripple-ring pointer-events-none" style={{ width: '170px', height: '170px', animationDelay: '0s' }} />
                    <div className="absolute rounded-full border-2 border-red-500/25 sos-ripple-ring pointer-events-none" style={{ width: '170px', height: '170px', animationDelay: '0.5s' }} />
                    <div className="absolute rounded-full border-2 border-red-500/15 sos-ripple-ring pointer-events-none" style={{ width: '170px', height: '170px', animationDelay: '1.0s' }} />
                  </>
                )}

                {/* SVG Progress Ring */}
                <svg className="absolute -rotate-90 pointer-events-none" style={{ width: '190px', height: '190px' }} viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
                  <circle 
                    cx="60" cy="60" r="54" fill="none" 
                    stroke={sosHoldProgress > 80 ? "#EF4444" : sosHoldProgress > 40 ? "#F59E0B" : "#3B82F6"}
                    strokeWidth="4" 
                    strokeDasharray="339.3" 
                    strokeDashoffset={339.3 - (339.3 * sosHoldProgress) / 100}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.05s linear, stroke 0.3s ease' }}
                  />
                </svg>

                {/* The realistic 3D SOS button - uses ref for native touch listeners */}
                <div 
                  ref={sosBtnRef}
                  className={`relative rounded-full cursor-pointer select-none flex items-center justify-center ${
                    isHoldingSos ? 'sos-btn-active' : 'sos-btn-idle'
                  }`}
                  style={{
                    width: '160px', 
                    height: '160px',
                    background: isHoldingSos 
                      ? 'radial-gradient(circle at 40% 35%, #ff6b6b 0%, #dc2626 40%, #991b1b 80%, #7f1d1d 100%)'
                      : 'radial-gradient(circle at 40% 35%, #ef4444 0%, #dc2626 35%, #b91c1c 70%, #991b1b 100%)',
                    touchAction: 'none',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                  }}
                >
                  {/* Inner highlight (3D convex effect) */}
                  <div 
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      top: '8px', left: '12px', right: '12px', bottom: '40%',
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 100%)',
                      borderRadius: '50%',
                    }}
                  />

                  {/* Content */}
                  <div className="flex flex-col items-center pointer-events-none z-10">
                    <AlertTriangle className={`w-9 h-9 text-white mb-1 drop-shadow-lg ${isHoldingSos ? 'animate-bounce' : ''}`} />
                    <span className="text-4xl font-black font-mono tracking-tighter leading-none text-white drop-shadow-lg">
                      {sosHoldTimeLeft}
                    </span>
                    <span className="text-[8px] font-extrabold tracking-[0.2em] uppercase text-white/90 mt-1.5 drop-shadow">
                      {isHoldingSos 
                        ? (language === "en" ? "HOLDING..." : "\u099f\u09bf\u09aa\u09c7 \u09a7\u09b0\u09c7 \u09b0\u09be\u0996\u09c1\u09a8...") 
                        : (language === "en" ? "HOLD" : "\u099a\u09c7\u09aa\u09c7 \u09a7\u09b0\u09c1\u09a8")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress text */}
              <div className="mt-8 space-y-1.5">
                <span className="text-xs font-bold text-slate-500 block font-mono">
                  {Math.round(sosHoldProgress)}%
                </span>
                {isHoldingSos && (
                  <span className="text-[10px] text-red-400 font-extrabold animate-pulse block">
                    {language === "en" ? "\ud83d\udea8 Keep holding..." : "\ud83d\udea8 \u09a7\u09b0\u09c7 \u09b0\u09be\u0996\u09c1\u09a8..."}
                  </span>
                )}
              </div>

              {/* Go Back */}
              {!isHoldingSos && (
                <button
                  onClick={() => { setShowSosHoldOverlay(false); setSosHoldProgress(0); setSosHoldTimeLeft(5); }}
                  className="mt-10 px-6 py-2.5 rounded-full border border-slate-800 text-[11px] font-bold text-slate-500 hover:text-white hover:border-slate-600 transition-all active:scale-95"
                >
                  {language === "en" ? "Go Back" : "\u09ab\u09bf\u09b0\u09c7 \u09af\u09be\u09a8"}
                </button>
              )}
            </>
          ) : (
            /* Success Screen */
            <div className="max-w-xs space-y-5">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto text-[#0CA671]" style={{ animation: 'sos-pulse 1.5s infinite ease-in-out' }}>
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-black tracking-tight text-white leading-tight">
                  {language === "en" ? "Alert Sent!" : "\u0985\u09cd\u09af\u09be\u09b2\u09be\u09b0\u09cd\u099f \u09aa\u09be\u09a0\u09be\u09a8\u09cb \u09b9\u09af\u09bc\u09c7\u099b\u09c7!"}
                </h3>
                <p className="text-sm text-emerald-400 font-bold animate-pulse">
                  {language === "en" ? "Please stay calm." : "\u09a6\u09af\u09bc\u09be \u0995\u09b0\u09c7 \u09b6\u09be\u09a8\u09cd\u09a4 \u09a5\u09be\u0995\u09c1\u09a8\u0964"}
                </p>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  {language === "en" 
                    ? "Help is being notified. The Thana police and volunteers have received your details." 
                    : "\u09b8\u09be\u09b9\u09be\u09af\u09cd\u09af\u0995\u09be\u09b0\u09c0 \u09a6\u09b2\u0995\u09c7 \u099c\u09be\u09a8\u09be\u09a8\u09cb \u09b9\u099a\u09cd\u099b\u09c7\u0964 \u09a5\u09be\u09a8\u09be \u09aa\u09c1\u09b2\u09bf\u09b6 \u098f\u09ac\u0982 \u09b8\u09cd\u09ac\u09c7\u099a\u09cd\u099b\u09be\u09b8\u09c7\u09ac\u09c0\u09b0\u09be \u0986\u09aa\u09a8\u09be\u09b0 \u09ac\u09bf\u09ac\u09b0\u09a3 \u09aa\u09c7\u09af\u09bc\u09c7\u099b\u09c7\u09a8\u0964"}
                </p>
              </div>
              <button
                onClick={() => { setShowSosHoldOverlay(false); setSosSuccess(false); setSosHoldProgress(0); setSosHoldTimeLeft(5); }}
                className="mt-4 px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition-all active:scale-95"
              >
                {language === "en" ? "Dismiss" : "\u09ac\u09a8\u09cd\u09a7 \u0995\u09b0\u09c1\u09a8"}
              </button>
            </div>
          )}
        </div>
      )}


    </div>
  );
}

