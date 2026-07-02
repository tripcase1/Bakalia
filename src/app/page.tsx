"use client";

import React, { useState, useEffect } from "react";
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

  // Update current time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // SOS Countdown handler
  useEffect(() => {
    if (sosCountdown === null) return;
    if (sosCountdown === 0) {
      setSosCountdown(null);
      setSosActive(true);
      alert(language === "en" 
        ? "🚨 SOS ALERT SENT! Thana Police and local volunteers have been notified with your GPS coordinates." 
        : "🚨 এসওএস অ্যালার্ট পাঠানো হয়েছে! আপনার জিপিএস লোকেশন সহ থানা পুলিশ এবং স্থানীয় স্বেচ্ছাসেবকদের অবহিত করা হয়েছে।"
      );
      return;
    }
    const timer = setTimeout(() => {
      setSosCountdown(sosCountdown - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [sosCountdown, language]);

  const triggerSOS = () => {
    if (sosActive) {
      setSosActive(false);
      return;
    }
    if (sosCountdown !== null) {
      setSosCountdown(null);
      return;
    }
    setSosCountdown(3);
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
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 bg-[#F4F6F9] dark:bg-[#010818] pb-16 md:pb-0">
      
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
                <span>{language === "en" ? "বাংলা" : "English"}</span>
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
                  <span>{language === "en" ? "বাংলা" : "English"}</span>
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
                  <span className="text-emerald-500 dark:text-[#0CA671] font-black">{language === "en" ? "Safer" : "নিরাপদ"}</span>
                  <span className="text-blue-600 dark:text-[#4A89DA] font-black">{language === "en" ? "Bakalia" : "বাকলিয়া"}</span>
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
                      ? (language === "en" ? "Cancel SOS" : "এসওএস বাতিল করুন")
                      : sosCountdown !== null
                        ? `${language === "en" ? "Sending SOS in" : "এসওএস পাঠানো হচ্ছে"} ${sosCountdown}s`
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
                      {language === "en" ? "Next Prayer:" : "পরবর্তী নামাজ:"} {t(nextPrayer.name.toLowerCase())}
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
                    <span>{isPrayerExpanded ? (language === "en" ? "Show Less" : "সংক্ষিপ্ত রূপ") : t("viewFullTimetable")}</span>
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
              <span>{language === "en" ? "View All Services" : "সকল সেবাসমূহ দেখুন"}</span>
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
                      : "বাকলিয়ায় যুব সমাজের উদ্যোগে পরিচ্ছন্নতা অভিযান পরিচালনা",
                    category: language === "en" ? "Civic Activity" : "নাগরিক উদ্যোগ",
                    categoryColor: "bg-emerald-50 text-emerald-600 dark:bg-[#22444B] dark:text-[#0CA671] border border-emerald-100 dark:border-[#0CA671]/20",
                    time: language === "en" ? "2 hours ago" : "২ ঘণ্টা আগে",
                    views: "1.2k views",
                  },
                  {
                    title: language === "en"
                      ? "Police Notice: Landlords urged to follow guidelines on traffic laws"
                      : "ট্রাফিক আইন মেনে চলার আহ্বান পুলিশের: সংযোগ সড়কে সতর্কীকরণ নোটিশ",
                    category: language === "en" ? "Police Notice" : "পুলিশ নোটিশ",
                    categoryColor: "bg-blue-50 text-blue-600 dark:bg-[#04142F] dark:text-[#4A89DA] border border-blue-105 dark:border-[#4A89DA]/20",
                    time: language === "en" ? "5 hours ago" : "৫ ঘণ্টা আগে",
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
                        <span>•</span>
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
                  ? (language === "en" ? "Welcome Back" : "আপনাকে স্বাগতম") 
                  : (language === "en" ? "Create Account" : "নতুন অ্যাকাউন্ট তৈরি")
                }
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {authMode === "login" 
                  ? (language === "en" ? "Access your Bakalia portal account" : "আপনার বাকলিয়া পোর্টাল অ্যাকাউন্ট অ্যাক্সেস করুন")
                  : (language === "en" ? "Sign up to join our smart community" : "আমাদের স্মার্ট সমাজে যোগ দিতে নিবন্ধন করুন")
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
                <span>{language === "en" ? "Phone OTP" : "ফোন ওটিপি"}</span>
              </button>
              <button 
                onClick={() => setAuthMethod("email")}
                className={`py-1.5 text-[10.5px] font-bold rounded flex items-center justify-center gap-1.5 transition-all ${
                  authMethod === "email" ? "bg-blue-655 dark:bg-blue-600 text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{language === "en" ? "Email" : "ইমেইল"}</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={(e) => { e.preventDefault(); alert("Auth processing (demo only)."); setShowAuthModal(false); }} className="space-y-3.5">
              
              {authMode === "register" && (
                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    {language === "en" ? "Full Name" : "সম্পূর্ণ নাম"}
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
                    {language === "en" ? "Phone Number" : "মোবাইল নম্বর"}
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
                      {language === "en" ? "Email Address" : "ইমেইল ঠিকানা"}
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
                      {language === "en" ? "Password" : "পাসওয়ার্ড"}
                    </label>
                    <input 
                      type="password" 
                      required 
                      placeholder="••••••••" 
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
                  ? (language === "en" ? "Sign In" : "লগইন করুন") 
                  : (language === "en" ? "Register Account" : "নিবন্ধন সম্পন্ন করুন")
                }
              </button>
            </form>

            {/* Switch Mode Footer */}
            <div className="mt-5 text-center text-[10px] text-slate-500 dark:text-slate-455 pt-3.5 border-t border-slate-150 dark:border-slate-850">
              {authMode === "login" ? (
                <>
                  <span>{language === "en" ? "New to Bakalia?" : "বাকলিয়া কমিউনিটিতে নতুন?"}</span>{" "}
                  <button 
                    onClick={() => setAuthMode("register")}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
                  >
                    {language === "en" ? "Create an account" : "নতুন অ্যাকাউন্ট খুলুন"}
                  </button>
                </>
              ) : (
                <>
                  <span>{language === "en" ? "Already have an account?" : "ইতিমধ্যে অ্যাকাউন্ট আছে?"}</span>{" "}
                  <button 
                    onClick={() => setAuthMode("login")}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
                  >
                    {language === "en" ? "Log in here" : "এখানে লগইন করুন"}
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
      {/* 9. STICKY BOTTOM NAVIGATION BAR FOR SMART MOBILE PORTAL */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 dark:bg-[#04142F]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800/80 px-4 py-2 flex items-center justify-around shadow-xl text-slate-500 dark:text-slate-400">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center gap-0.5 text-blue-600 dark:text-[#0CA671]"
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] font-bold">{language === "en" ? "Home" : "মূল পাতা"}</span>
        </button>

        <button 
          onClick={() => {
            const el = document.getElementById("quick-access");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex flex-col items-center gap-0.5 hover:text-slate-800 dark:hover:text-white"
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[9px] font-bold">{language === "en" ? "Services" : "সেবা"}</span>
        </button>

        {/* SOS Emergency button in the center (larger and glowing!) */}
        <button 
          onClick={triggerSOS}
          className={`flex flex-col items-center justify-center -mt-5 w-12 h-12 rounded-full text-white shadow-lg transition-transform duration-200 active:scale-95 ${
            sosActive 
              ? "bg-rose-600 animate-pulse shadow-rose-500/30" 
              : sosCountdown !== null 
                ? "bg-amber-600 animate-pulse shadow-amber-500/30"
                : "bg-red-600 hover:bg-red-500 shadow-red-500/35"
          }`}
        >
          <AlertTriangle className="w-6 h-6" />
        </button>

        <button 
          onClick={() => {
            setIsPrayerExpanded(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-0.5 hover:text-slate-800 dark:hover:text-white"
        >
          <MosqueIcon className="w-5 h-5 text-amber-500 dark:text-amber-400" />
          <span className="text-[9px] font-bold">{language === "en" ? "Mosque" : "মসজিদ"}</span>
        </button>

        <button 
          onClick={() => { setAuthMode("login"); setShowAuthModal(true); }}
          className="flex flex-col items-center gap-0.5 hover:text-slate-800 dark:hover:text-white"
        >
          <User className="w-5 h-5" />
          <span className="text-[9px] font-bold">{language === "en" ? "Account" : "অ্যাকাউন্ট"}</span>
        </button>
      </div>

    </div>
  );
}
