"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";
type Language = "en" | "bn";

interface AppContextType {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Simple dictionary for translations used on the homepage
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    searchPlaceholder: "Search services, news, places...",
    login: "Login",
    register: "Register",
    home: "Home",
    news: "News",
    services: "Services",
    police: "Police",
    emergency: "Emergency",
    mosque: "Mosque",
    marketplace: "Marketplace",
    aboutUs: "About Us",
    
    // Hero
    systemTag: "Smart Community Operating System",
    heroTitle: "Stronger Community",
    heroSubtitle: "Safer Bakalia",
    heroDesc: "Connecting citizens, police and community services for a better and safer Bakalia.",
    getHelpNow: "Get Help Now",
    exploreServices: "Explore Services",
    prayerTimesTitle: "Prayer Times",
    prayerTimesLoc: "Bakalia, Chattogram",
    fajr: "Fajr",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
    viewFullTimetable: "View Full Timetable",

    // Stats
    registeredCitizens: "Registered Citizens",
    resolvedComplaints: "Resolved Complaints",
    activeVolunteers: "Active Volunteers",
    dailyVisitors: "Daily Visitors",
    emergencyWidgetTitle: "Emergency",
    emergencyWidgetDesc: "Need immediate help? Tap for SOS",
    thisMonth: "this month",
    thisWeek: "this week",

    // Quick Access
    quickAccessTitle: "Quick Access",
    quickAccessDesc: "All community services in one place",
    complaints: "Complaints",
    complaintsDesc: "Report & track issues",
    policeNotices: "Police Notices",
    policeNoticesDesc: "Latest updates",
    lostFound: "Lost & Found",
    lostFoundDesc: "Find or report items",
    bloodDonation: "Blood Donation",
    bloodDonationDesc: "Donate blood, save lives",
    emergencySos: "Emergency SOS",
    emergencySosDesc: "Instant emergency help",
    houseRent: "House Rent",
    houseRentDesc: "Find rental homes",
    jobs: "Jobs",
    jobsDesc: "Find local jobs",
    mosques: "Mosques",
    mosquesDesc: "Prayer times & events",
    events: "Events",
    eventsDesc: "Community events",
    marketplaceDesc: "Buy & sell items",

    // Columns
    latestNews: "Latest News",
    viewAll: "View All",
    nearbyServices: "Nearby Services",
    viewMap: "View Map",
    communityHighlights: "Community Highlights",
    viewLeaderboard: "View Leaderboard",
    nearbySuffix: "nearby",

    // Nearby list
    hospitals: "Hospitals",
    policeStation: "Police Station",
    schools: "Schools",
    fireService: "Fire Service",

    // Leaderboard
    points: "points",
    topVolunteer: "Top Volunteer",
    activeCitizen: "Active Citizen",
    helpfulCitizen: "Helpful Citizen",

    // Trust & Features
    verifiedSecure: "Verified & Secure",
    verifiedSecureDesc: "Your data is safe with us",
    aiModeration: "AI Moderation",
    aiModerationDesc: "For a safer community",
    support: "24/7 Support",
    supportDesc: "We are here to help",
    trustedBy: "Trusted by 100K+",
    trustedByDesc: "Community members",

    // Footer
    copyright: "© 2026 Bakalia Community. All rights reserved.",
    privacy: "Privacy",
    terms: "Terms",
    help: "Help",
    contact: "Contact",
    downloadRules: "Download Rules",
  },
  bn: {
    // Navbar
    searchPlaceholder: "সার্ভিস, খবর বা স্থান খুঁজুন...",
    login: "লগইন",
    register: "নিবন্ধন",
    home: "মূল পাতা",
    news: "খবর",
    services: "সেবাসমূহ",
    police: "পুলিশ",
    emergency: "জরুরি সেবা",
    mosque: "মসজিদ",
    marketplace: "বাজার",
    aboutUs: "আমাদের সম্পর্কে",
    
    // Hero
    systemTag: "স্মার্ট কমিউনিটি অপারেটিং সিস্টেম",
    heroTitle: "শক্তিশালী সমাজ",
    heroSubtitle: "নিরাপদ বাকলিয়া",
    heroDesc: "উন্নত ও নিরাপদ বাকলিয়ার জন্য নাগরিক, পুলিশ এবং সামাজিক সেবাসমূহকে একসূত্রে সংযুক্ত করা।",
    getHelpNow: "এখনই সাহায্য নিন",
    exploreServices: "সেবা অন্বেষণ করুন",
    prayerTimesTitle: "নামাজের সময়সূচী",
    prayerTimesLoc: "বাকলিয়া, চট্টগ্রাম",
    fajr: "ফজর",
    dhuhr: "যোহর",
    asr: "আসর",
    maghrib: "মাগরিব",
    isha: "এশা",
    viewFullTimetable: "সম্পূর্ণ সময়সূচী দেখুন",

    // Stats
    registeredCitizens: "নিবন্ধিত নাগরিক",
    resolvedComplaints: "সমাধানকৃত অভিযোগ",
    activeVolunteers: "সক্রিয় স্বেচ্ছাসেবক",
    dailyVisitors: "দৈনিক দর্শনার্থী",
    emergencyWidgetTitle: "জরুরি",
    emergencyWidgetDesc: "জরুরি সাহায্যের প্রয়োজন? SOS টিপুন",
    thisMonth: "এই মাসে",
    thisWeek: "এই সপ্তাহে",

    // Quick Access
    quickAccessTitle: "কুইক অ্যাক্সেস",
    quickAccessDesc: "সব কমিউনিটি সেবা এক জায়গায়",
    complaints: "অভিযোগ ও সমস্যা",
    complaintsDesc: "সমস্যা রিপোর্ট ও ট্র্যাক করুন",
    policeNotices: "পুলিশ নোটিশ",
    policeNoticesDesc: "সর্বশেষ আপডেট",
    lostFound: "হারানো ও প্রাপ্তি",
    lostFoundDesc: "জিনিসপত্র খুঁজুন বা রিপোর্ট করুন",
    bloodDonation: "রক্তদান",
    bloodDonationDesc: "রক্ত দিন, জীবন বাঁচান",
    emergencySos: "জরুরি SOS",
    emergencySosDesc: "তাৎক্ষণিক জরুরি সাহায্য",
    houseRent: "বাসা ভাড়া",
    houseRentDesc: "ভাড়া বাসা খুঁজুন",
    jobs: "চাকরি",
    jobsDesc: "স্থানীয় চাকরি খুঁজুন",
    mosques: "মসজিদসমূহ",
    mosquesDesc: "নামাজের সময় ও কার্যক্রম",
    events: "ইভেন্টস",
    eventsDesc: "কমিউনিটি ইভেন্টসমূহ",
    marketplaceDesc: "পণ্য কেনাবেচা করুন",

    // Columns
    latestNews: "সর্বশেষ খবর",
    viewAll: "সব দেখুন",
    nearbyServices: "নিকটস্থ সেবাসমূহ",
    viewMap: "ম্যাপ দেখুন",
    communityHighlights: "কমিউনিটি হাইলাইটস",
    viewLeaderboard: "লিডারবোর্ড দেখুন",
    nearbySuffix: "টি কাছেই",

    // Nearby list
    hospitals: "হাসপাতাল",
    policeStation: "থানা পুলিশ",
    schools: "বিদ্যালয়সমূহ",
    fireService: "ফায়ার সার্ভিস",

    // Leaderboard
    points: "পয়েন্ট",
    topVolunteer: "সেরা স্বেচ্ছাসেবক",
    activeCitizen: "সক্রিয় নাগরিক",
    helpfulCitizen: "সহায়ক নাগরিক",

    // Trust & Features
    verifiedSecure: "ভেরিফাইড ও সুরক্ষিত",
    verifiedSecureDesc: "আপনার তথ্য আমাদের কাছে নিরাপদ",
    aiModeration: "এআই মডারেশন",
    aiModerationDesc: "নিরাপদ সমাজের জন্য",
    support: "২৪/৭ সহায়তা",
    supportDesc: "আমরা সাহায্যের জন্য প্রস্তুত",
    trustedBy: "১ লাখ+ মানুষের বিশ্বস্ত",
    trustedByDesc: "কমিউনিটি সদস্য",

    // Footer
    copyright: "© ২০২৬ বাকলিয়া কমিউনিটি। সর্বস্বত্ব সংরক্ষিত।",
    privacy: "গোপনীয়তা নীতি",
    terms: "শর্তাবলী",
    help: "সাহায্য",
    contact: "যোগাযোগ",
    downloadRules: "নিয়মাবলী ডাউনলোড করুন",
  },
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light"); // Defaulting to light as in the light theme design spec
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check localStorage if available
    const savedTheme = localStorage.getItem("theme") as Theme;
    const savedLang = localStorage.getItem("lang") as Language;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme("light"); // Default to light theme
    }

    if (savedLang) {
      setLanguageState(savedLang);
    } else {
      setLanguageState("en");
    }
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("lang", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <div className="min-h-screen bg-[#0F172A]"></div>;
  }

  return (
    <AppContext.Provider value={{ theme, language, toggleTheme, setLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
