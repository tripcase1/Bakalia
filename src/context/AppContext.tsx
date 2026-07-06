"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

type Theme = "light" | "dark";
type Language = "en" | "bn";

interface AppContextType {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  showToast: (message: string, type?: "success" | "error" | "info") => void;

  // Navigation & UI control states
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authMode: "login" | "register" | "forgot";
  setAuthMode: (mode: "login" | "register" | "forgot") => void;
  authMethod: "phone" | "email";
  setAuthMethod: (method: "phone" | "email") => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isPrayerExpanded: boolean;
  setIsPrayerExpanded: (expanded: boolean) => void;

  // SOS State
  showSosConfirmModal: boolean;
  setShowSosConfirmModal: (show: boolean) => void;
  sosActive: boolean;
  setSosActive: (active: boolean) => void;
  sosCountdown: number | null;
  setSosCountdown: (count: number | null) => void;
  triggerSOS: () => void;

  // Auth Session State
  user: User | null;
  role: string | null; // "citizen" | "police_admin" | "super_admin"
  userData: any;
  authLoading: boolean;
  logout: () => Promise<void>;

  // Location States
  gpsCoords: { lat: number; lng: number } | null;
  detectedWard: string | null;
  gpsStatus: "idle" | "loading" | "granted" | "denied";
  requestGps: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    searchPlaceholder: "Search services, news or places...",
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
    heroDesc: "Connecting citizens, police, and social services seamlessly for a safer and smarter Ward Bakalia.",
    getHelpNow: "Get Help Now",
    exploreServices: "Explore Services",
    prayerTimesTitle: "Prayer Timetable",
    prayerTimesLoc: "Bakalia, Chittogram",
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
    quickAccessDesc: "All community services in one location",
    complaints: "Complaints & Issues",
    complaintsDesc: "Report and track civic issues",
    policeNotices: "Police Notices",
    policeNoticesDesc: "Latest updates from Thana",
    lostFound: "Lost & Found",
    lostFoundDesc: "Report or search for lost items",
    bloodDonation: "Blood Donation",
    bloodDonationDesc: "Donate blood, save lives",
    emergencySos: "Emergency SOS",
    emergencySosDesc: "Instant emergency assistance",
    houseRent: "House Rent (To-Let)",
    houseRentDesc: "Find apartments for rent",
    jobs: "Local Jobs",
    jobsDesc: "Explore employment opportunities",
    mosques: "Mosques Directory",
    mosquesDesc: "Prayer times & announcements",
    events: "Community Events",
    eventsDesc: "Ward updates and programs",
    marketplaceDesc: "Buy and sell local products",

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
    schools: "Schools Directory",
    fireService: "Fire Service Station",

    // Leaderboard
    points: "points",
    topVolunteer: "Top Volunteer",
    activeCitizen: "Active Citizen",
    helpfulCitizen: "Helpful Citizen",

    // Trust & Features
    verifiedSecure: "Verified & Secure",
    verifiedSecureDesc: "Your details are encrypted and safe",
    aiModeration: "AI Smart Moderation",
    aiModerationDesc: "Proactive reporting & filtering",
    support: "24/7 Ward Support",
    supportDesc: "Our volunteers are always ready",
    trustedBy: "Trusted by 100K+ Citizens",
    trustedByDesc: "Active community members",

    // Footer
    copyright: "© 2026 Bakalia Community. All rights reserved.",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    help: "Help Center",
    contact: "Contact us",
    downloadRules: "Download Rules Booklet",

    // Mobile Services Grid
    policeHelp: "Police Help",
    policeHelpDesc: "Reporting & Assistance",
    emergencyServices: "Emergency",
    emergencyServicesDesc: "24/7 hotline support",
    mosquesNearYou: "Mosques Directory",
    mosquesNearYouDesc: "Nearby mosques list",
    marketplaceBuySell: "Marketplace",
    marketplaceBuySellDesc: "Trade local goods",
    jobsFind: "Jobs Board",
    jobsFindDesc: "Find opportunities",
    bloodDonors: "Blood Donors",
    bloodDonorsDesc: "Find a match",
    documents: "Documents Portal",
    documentsDesc: "E-Forms & Manuals",
    community: "Community Forum",
    communityDesc: "Groups & Programs",

    // Quick Services Section
    quickServices: "Quick Services",

    // Bottom Nav
    homeNav: "Home",
    servicesNav: "Services",
    mosqueNav: "Mosque",
    profileNav: "Profile",

    // Next Prayer
    nextPrayer: "Next Prayer",

    // Date
    today: "Today",

    // Search Popup
    searchTitle: "Search Portal",
    searchHint: "Search services, news, listings...",
    quickLinks: "Quick Links",
    recentSearches: "Recent Searches",
    noResults: "No matching records found",
    closeSearch: "Close search panel",

    // Stats percent labels
    percentThisMonth: "this month",

    // View All Services
    viewAllServices: "View All Services",

    // Language label
    languageLabel: "Language",

    // Desktop location
    locationBakalia: "Bakalia, Chattogram",

    // Tap for SOS
    tapForSos: "Tap for SOS",

    // Show Less
    showLess: "Show Less",
    
    // Extra keys
    safer: "Safer",
    bakalia: "Bakalia",
    cancelSos: "Cancel SOS",
    sendingSosIn: "Sending SOS in",
    nextPrayerLabel: "Next Prayer:",
    welcomeBack: "Welcome Back",
    createAccount: "Create Account",
    accessAccountDesc: "Access your Bakalia portal account",
    joinCommunityDesc: "Sign up to join our smart community",
    phoneOtp: "Phone OTP",
    email: "Email",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    emailAddress: "Email Address",
    password: "Password",
    signIn: "Sign In",
    registerBtn: "Register Account",
    newToBakalia: "New to Bakalia?",
    createAnAccount: "Create an account",
    alreadyHaveAccount: "Already have an account?",
    loginHere: "Log in here",
    sosConfirmTitle: "Do you really need help now?",
    sosConfirmDesc: "This will send an emergency SOS alert with your GPS location to the Thana police and local volunteers.",
    cancel: "Cancel",
    yesINeedHelp: "Yes, I Need Help",
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
    activeVolunteers: "সক্রিয় স্বেচ্ছাসেবক",
    dailyVisitors: "দৈনিক দর্শনার্থী",
    emergencyWidgetTitle: "জরুরি",
    emergencyWidgetDesc: "জরুরি সাহায্যের প্রয়োজন? SOS টিপুন",
    thisMonth: "এই মাসে",
    thisWeek: "এই সপ্তাহে",

    // Quick Access
    quickAccessTitle: "কুইক অ্যাক্সেস",
    quickAccessDesc: "সব কমিউনিটি সেবা এক জায়গায়",
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
    houseRent: "বাসা ভাড়া",
    houseRentDesc: "ভাড়া বাসা খুঁজুন",
    jobs: "চাকরি",
    jobsDesc: "স্থানীয় চাকরি খুঁজুন",
    mosques: "মসজিদসমূহ",
    mosquesDesc: "নামাজের সময় ও কার্যক্রম",
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
    fireService: "ফায়ার সার্ভিস",

    // Leaderboard
    points: "পয়েন্ট",
    topVolunteer: "সেরা স্বেচ্ছাসেবক",
    activeCitizen: "সক্রিয় নাগরিক",
    helpfulCitizen: "সহায়ক নাগরিক",

    // Trust & Features
    verifiedSecure: "ভেরিফাইড ও সুরক্ষিত",
    verifiedSecureDesc: "আপনার তথ্য আমাদের কাছে নিরাপদ",
    aiModeration: "এআই মডারেশন",
    aiModerationDesc: "নিরাপদ সমাজের জন্য",
    support: "২৪/৭ সহায়তা",
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

    // Mobile Services Grid
    policeHelp: "পুলিশ সেবা",
    policeHelpDesc: "রিপোর্ট ও সহায়তা",
    emergencyServices: "জরুরি সেবা",
    emergencyServicesDesc: "২৪/৭ সেবা",
    mosquesNearYou: "মসজিদসমূহ",
    mosquesNearYouDesc: "আপনার কাছে",
    marketplaceBuySell: "বাজার",
    marketplaceBuySellDesc: "কেনা ও বেচা",
    jobsFind: "চাকরি",
    jobsFindDesc: "সুযোগ খুঁজুন",
    bloodDonors: "রক্তদাতা",
    bloodDonorsDesc: "জীবন বাঁচান",
    documents: "ডকুমেন্টস",
    documentsDesc: "ফরম ও তথ্য",
    community: "কমিউনিটি",
    communityDesc: "গ্রুপ ও ইভেন্ট",

    // Quick Services Section
    quickServices: "কুইক সার্ভিস",

    // Bottom Nav
    homeNav: "মূল পাতা",
    servicesNav: "সেবা",
    mosqueNav: "মসজিদ",
    profileNav: "প্রোফাইল",

    // Next Prayer
    nextPrayer: "পরবর্তী নামাজ",

    // Date
    today: "আজ",

    // Search Popup
    searchTitle: "অনুসন্ধান",
    searchHint: "সেবা, খবর, মানুষ খুঁজুন...",
    quickLinks: "দ্রুত লিংক",
    recentSearches: "সাম্প্রতিক অনুসন্ধান",
    noResults: "কোনো ফলাফল পাওয়া যায়নি",
    closeSearch: "বন্ধ করুন",

    // Stats percent labels
    percentThisMonth: "এই মাসে",

    // View All Services
    viewAllServices: "সকল সেবাসমূহ দেখুন",

    // Language label
    languageLabel: "ভাষা",

    // Desktop location
    locationBakalia: "বাকলিয়া, চট্টগ্রাম",

    // Tap for SOS
    tapForSos: "SOS টিপুন",

    // Show Less
    showLess: "সংক্ষিপ্ত রূপ",
    
    // Extra keys
    safer: "নিরাপদ",
    bakalia: "বাকলিয়া",
    cancelSos: "এসওএস বাতিল করুন",
    sendingSosIn: "এসওএস পাঠানো হচ্ছে",
    nextPrayerLabel: "পরবর্তী নামাজ:",
    welcomeBack: "আপনাকে স্বাগতম",
    createAccount: "নতুন অ্যাকাউন্ট তৈরি",
    accessAccountDesc: "আপনার বাকলিয়া পোর্টাল অ্যাকাউন্ট অ্যাক্সেস করুন",
    joinCommunityDesc: "আমাদের স্মার্ট সমাজে যোগ দিতে নিবন্ধন করুন",
    phoneOtp: "ফোন ওটিপি",
    email: "ইমেইল",
    fullName: "সম্পূর্ণ নাম",
    phoneNumber: "মোবাইল নম্বর",
    emailAddress: "ইমেইল ঠিকানা",
    password: "পাসওয়ার্ড",
    signIn: "লগইন করুন",
    registerBtn: "নিবন্ধন সম্পন্ন করুন",
    newToBakalia: "বাকলিয়া কমিউনিটিতে নতুন?",
    createAnAccount: "নতুন অ্যাকাউন্ট খুলুন",
    alreadyHaveAccount: "ইতিমধ্যেই অ্যাকাউন্ট আছে?",
    loginHere: "এখানে লগইন করুন",
    sosConfirmTitle: "আপনার কি সত্যিই জরুরি সাহায্য প্রয়োজন?",
    sosConfirmDesc: "এটি আপনার জিপিএস লোকেশন সহ থানা পুলিশ এবং স্থানীয় স্বেচ্ছাসেবকদের কাছে একটি জরুরি এসওএস অ্যালার্ট পাঠাবে।",
    cancel: "বাতিল",
    yesINeedHelp: "হ্যাঁ, সাহায্য লাগবে",
  },
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  // App Layout control states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot">("login");
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("phone");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPrayerExpanded, setIsPrayerExpanded] = useState(false);

  // SOS States
  const [showSosConfirmModal, setShowSosConfirmModal] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState<number | null>(null);

  // Auth States
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Location States
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [detectedWard, setDetectedWard] = useState<string | null>(null);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "loading" | "granted" | "denied">("idle");

  interface Toast {
    message: string;
    type: "success" | "error" | "info";
    id: number;
  }

  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = React.useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const calculateWard = (lat: number, lng: number): string => {
    const distance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
      return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2));
    };
    const d17 = distance(lat, lng, 22.3562, 91.8398);
    const d18 = distance(lat, lng, 22.3475, 91.8482);
    const d19 = distance(lat, lng, 22.3391, 91.8443);
    const minDist = Math.min(d17, d18, d19);
    
    if (minDist === d17) return language === "en" ? "Ward 17 (West Bakalia)" : "ওয়ার্ড ১৭ (পশ্চিম বাকলিয়া)";
    if (minDist === d18) return language === "en" ? "Ward 18 (East Bakalia)" : "ওয়ার্ড ১৮ (পূর্ব বাকলিয়া)";
    return language === "en" ? "Ward 19 (South Bakalia)" : "ওয়ার্ড ১৯ (দক্ষিণ বাকলিয়া)";
  };

  const requestGps = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setGpsStatus("denied");
      return;
    }
    setGpsStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setGpsCoords({ lat, lng });
        setGpsStatus("granted");

        // Dynamic reverse geocoding lookup for any location in Bangladesh
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`)
          .then((res) => {
            if (res.ok) return res.json();
            throw new Error("HTTP error");
          })
          .then((data) => {
            const addr = data.address || {};
            const localArea = addr.suburb || addr.neighbourhood || addr.village || addr.town || addr.city_district || "";
            const thana = addr.county || addr.city_district || addr.suburb || "";
            const district = addr.state_district || addr.city || addr.state || "";
            
            // Check if user is near Bakalia (lat: 22.34, lng: 91.84)
            const isNearBakalia = Math.abs(lat - 22.3475) < 0.05 && Math.abs(lng - 91.8482) < 0.05;
            if (isNearBakalia) {
              setDetectedWard(calculateWard(lat, lng));
            } else {
              // Construct dynamic district/thana name for other areas in Bangladesh
              let label = "";
              if (localArea && thana) {
                label = `${localArea}, ${thana.replace(" Upazila", "").replace(" Thana", "")}`;
              } else {
                label = thana || district || "Bangladesh";
              }
              setDetectedWard(label);
            }
          })
          .catch((err) => {
            console.warn("Reverse geocode failed on mount, using default distance fallback:", err);
            setDetectedWard(calculateWard(lat, lng));
          });
      },
      (error) => {
        console.warn("Geolocation permission error:", error);
        setGpsStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    const savedLang = localStorage.getItem("lang") as Language;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme("light");
    }

    if (savedLang) {
      setLanguageState(savedLang);
    } else {
      setLanguageState("en");
    }
    
    setMounted(true);
  }, []);

  // Auto-trigger GPS request on client mount
  useEffect(() => {
    if (mounted) {
      requestGps();
    }
  }, [mounted]);

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

  // Monitor Authentication State
  useEffect(() => {
    // Development Mock Bypass for Testing/Subagents
    if (process.env.NODE_ENV === "development" && typeof window !== "undefined" && window.location.search.includes("mock=admin")) {
      setUser({
        uid: "mock-admin-uid",
        displayName: "Super Admin",
        email: "almabruk786@gmail.com",
        getIdToken: async () => "mock-token"
      } as any);
      setRole("super_admin");
      setUserData({
        displayName: "Super Admin",
        email: "almabruk786@gmail.com",
        role: "super_admin"
      });
      document.cookie = `session_token=mock-token; path=/; max-age=604800; SameSite=Lax; Secure`;
      document.cookie = `user_role=super_admin; path=/; max-age=604800; SameSite=Lax; Secure`;
      sessionStorage.setItem("admin_2fa_verified", "true");
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Race getDoc against a 4-second timeout to prevent infinite hangs when Firestore is offline/blocked
          const getDocPromise = getDoc(doc(db, "users", currentUser.uid));
          const getDocTimeout = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Firestore connection timed out")), 4000)
          );
          const userDoc = await Promise.race([getDocPromise, getDocTimeout]);

          let currentRole = "citizen";
          if (currentUser.email === "almabruk786@gmail.com") {
            currentRole = "super_admin";
          } else if (userDoc.exists()) {
            const data = userDoc.data();
            currentRole = data.role || "citizen";
          }

          setRole(currentRole);
          setUserData(userDoc.exists() ? userDoc.data() : { email: currentUser.email, role: currentRole });

          if (currentUser.email === "almabruk786@gmail.com") {
            if (!userDoc.exists() || (userDoc.data() as { role?: string })?.role !== "super_admin") {
              const { setDoc: setDocFs } = await import("firebase/firestore");
              const setDocPromise = setDocFs(doc(db, "users", currentUser.uid), {
                uid: currentUser.uid,
                displayName: userDoc.exists() ? (userDoc.data()?.displayName || "Super Admin") : "Super Admin",
                email: currentUser.email,
                role: "super_admin",
                verified: true,
                createdAt: userDoc.exists() ? (userDoc.data()?.createdAt || new Date().toISOString()) : new Date().toISOString()
              }, { merge: true });

              // Race write against 3-second timeout
              await Promise.race([
                setDocPromise,
                new Promise<void>((_, reject) => setTimeout(() => reject(new Error("Firestore write timed out")), 3000))
              ]);
            }
          }

          // Set cookies for Next.js Middleware edge protection
          const token = await currentUser.getIdToken();
          document.cookie = `session_token=${token}; path=/; max-age=604800; SameSite=Lax; Secure`;
          document.cookie = `user_role=${currentRole}; path=/; max-age=604800; SameSite=Lax; Secure`;
        } catch (error) {
          console.error("Error loading user profile from Firestore:", error);
          let fallbackRole = currentUser.email === "almabruk786@gmail.com" ? "super_admin" : "citizen";
          setRole(fallbackRole);
          try {
            const token = await currentUser.getIdToken();
            document.cookie = `session_token=${token}; path=/; max-age=604800; SameSite=Lax; Secure`;
            document.cookie = `user_role=${fallbackRole}; path=/; max-age=604800; SameSite=Lax; Secure`;
          } catch (tokenErr) {
            console.warn("Could not get id token on fallback:", tokenErr);
          }
        }
      } else {
        setRole(null);
        setUserData(null);
        // Clear cookies on sign-out
        document.cookie = "session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  const triggerSOS = () => {
    setShowSosConfirmModal(true);
  };

  const logout = async () => {
    setAuthLoading(true);
    await signOut(auth);
    setRole(null);
    setUserData(null);
    document.cookie = "session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setAuthLoading(false);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <div className="min-h-screen bg-[#0F172A]"></div>;
  }

  return (
    <AppContext.Provider
      value={{
        theme,
        language,
        toggleTheme,
        setLanguage,
        t,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        showAuthModal,
        setShowAuthModal,
        authMode,
        setAuthMode,
        authMethod,
        setAuthMethod,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isPrayerExpanded,
        setIsPrayerExpanded,
        showSosConfirmModal,
        setShowSosConfirmModal,
        sosActive,
        setSosActive,
        sosCountdown,
        setSosCountdown,
        triggerSOS,
        user,
        role,
        userData,
        authLoading,
        logout,
        showToast,
        gpsCoords,
        detectedWard,
        gpsStatus,
        requestGps,
      }}
    >
      {children}
      {/* Dynamic Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-[9999] space-y-2.5 max-w-sm pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 p-3.5 rounded-xl border shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 ${
              t.type === "success" 
                ? "bg-[#0CA671]/10 border-[#0CA671]/30 text-emerald-800 dark:text-[#0CA671] bg-white dark:bg-[#04142F]"
                : t.type === "error"
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-450 bg-white dark:bg-[#04142F]"
                  : "bg-blue-500/10 border-blue-500/20 text-blue-800 dark:text-blue-405 bg-white dark:bg-[#04142F]"
            }`}
          >
            {t.type === "success" && <CheckCircle className="w-5 h-5 text-[#0CA671] shrink-0" />}
            {t.type === "error" && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />}
            {t.type === "info" && <Info className="w-5 h-5 text-blue-500 shrink-0" />}
            <span className="text-xs font-bold leading-tight">{t.message}</span>
          </div>
        ))}
      </div>
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
