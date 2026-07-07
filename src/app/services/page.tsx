"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Shield, Bell, Search, Droplet, Home, Briefcase, ShoppingCart,
  Calendar, AlertTriangle, Users, Newspaper, ChevronRight, MapPin, Phone
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";

const MosqueIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2v3M12 5c-2.5 0-4.5 2-4.5 4.5V19h9V9.5C16.5 7 14.5 5 12 5z" />
    <path d="M3 21h18M6 19v-5c0-1.5 1-2.5 1.5-2.5s1.5 1 1.5 2.5v5M15 19v-5c0-1.5 1-2.5 1.5-2.5s1.5 1 1.5 2.5v5" />
    <path d="M12 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
  </svg>
);

export default function ServicesPage() {
  const { t, language, triggerSOS, setShowAuthModal, setAuthMode, user } = useAppContext();
  const router = useRouter();

  const services = [
    {
      id: "complaints",
      icon: Shield,
      title: language === "en" ? "Complaints & Issues" : "অভিযোগ ও সমস্যা",
      desc: language === "en" ? "Report and track civic issues in your ward" : "আপনার ওয়ার্ডের সমস্যা রিপোর্ট করুন",
      color: "text-emerald-600 bg-emerald-50 dark:text-[#0CA671] dark:bg-[#22444B]",
      border: "hover:border-emerald-300 dark:hover:border-[#0CA671]/40",
      href: "/complaints",
    },
    {
      id: "police",
      icon: Bell,
      title: language === "en" ? "Police Notices" : "পুলিশ নোটিশ",
      desc: language === "en" ? "Latest updates from Bakalia Thana" : "বাকলিয়া থানার সর্বশেষ আপডেট",
      color: "text-blue-600 bg-blue-50 dark:text-[#4A89DA] dark:bg-[#04142F]",
      border: "hover:border-blue-300 dark:hover:border-[#4A89DA]/40",
      href: "/police",
    },
    {
      id: "lost-found",
      icon: Search,
      title: language === "en" ? "Lost & Found" : "হারানো ও প্রাপ্তি",
      desc: language === "en" ? "Report or search for lost items" : "হারানো জিনিস খুঁজুন বা রিপোর্ট করুন",
      color: "text-amber-600 bg-amber-50 dark:text-amber-500 dark:bg-[#01205B]",
      border: "hover:border-amber-300 dark:hover:border-amber-500/40",
      href: "/lost-found",
    },
    {
      id: "blood",
      icon: Droplet,
      title: language === "en" ? "Blood Donation" : "রক্তদান",
      desc: language === "en" ? "Find blood donors or register as donor" : "রক্তদাতা খুঁজুন বা নিবন্ধন করুন",
      color: "text-red-600 bg-red-50 dark:text-red-500 dark:bg-[#481C21]",
      border: "hover:border-red-300 dark:hover:border-red-500/40",
      href: "/blood",
    },
    {
      id: "house-rent",
      icon: Home,
      title: language === "en" ? "House Rent (To-Let)" : "বাসা ভাড়া",
      desc: language === "en" ? "Find apartments for rent in Bakalia" : "বাকলিয়ায় ভাড়া বাসা খুঁজুন",
      color: "text-emerald-600 bg-emerald-50 dark:text-[#0CA671] dark:bg-[#22444B]",
      border: "hover:border-emerald-300 dark:hover:border-[#0CA671]/40",
      href: "/house-rent",
    },
    {
      id: "jobs",
      icon: Briefcase,
      title: language === "en" ? "Local Jobs" : "চাকরি",
      desc: language === "en" ? "Explore local employment opportunities" : "স্থানীয় চাকরির সুযোগ খুঁজুন",
      color: "text-purple-600 bg-purple-50 dark:text-[#4A89DA] dark:bg-[#01205B]",
      border: "hover:border-purple-300 dark:hover:border-[#4A89DA]/40",
      href: "/jobs",
    },
    {
      id: "marketplace",
      icon: ShoppingCart,
      title: language === "en" ? "Marketplace" : "বাজার",
      desc: language === "en" ? "Buy and sell local products" : "স্থানীয় পণ্য কেনাবেচা করুন",
      color: "text-amber-600 bg-amber-50 dark:text-amber-500 dark:bg-[#0D1B2A]",
      border: "hover:border-amber-300 dark:hover:border-amber-500/40",
      href: "/marketplace",
    },
    {
      id: "mosque",
      icon: MosqueIcon,
      title: language === "en" ? "Mosques Directory" : "মসজিদসমূহ",
      desc: language === "en" ? "Prayer times & mosque announcements" : "নামাজের সময় ও মসজিদের ঘোষণা",
      color: "text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-[#22444B]",
      border: "hover:border-teal-300 dark:hover:border-teal-500/40",
      href: "/mosque",
    },
    {
      id: "events",
      icon: Calendar,
      title: language === "en" ? "Community Events" : "কমিউনিটি ইভেন্টস",
      desc: language === "en" ? "Ward updates and community programs" : "ওয়ার্ড আপডেট ও কমিউনিটি প্রোগ্রাম",
      color: "text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-[#04142F]",
      border: "hover:border-violet-300 dark:hover:border-violet-500/40",
      href: "/events",
    },
    {
      id: "emergency",
      icon: AlertTriangle,
      title: language === "en" ? "Emergency Services" : "জরুরি সেবা",
      desc: language === "en" ? "24/7 emergency hotlines & SOS" : "২৪/৭ জরুরি হেল্পলাইন ও SOS",
      color: "text-red-600 bg-red-50 dark:text-red-500 dark:bg-[#481C21]",
      border: "hover:border-red-300 dark:hover:border-red-500/40",
      href: "/emergency",
    },
    {
      id: "volunteer",
      icon: Users,
      title: language === "en" ? "Volunteers" : "স্বেচ্ছাসেবক",
      desc: language === "en" ? "Join or find community volunteers" : "কমিউনিটি স্বেচ্ছাসেবকদের সাথে যোগ দিন",
      color: "text-emerald-600 bg-emerald-50 dark:text-[#0CA671] dark:bg-[#22444B]",
      border: "hover:border-emerald-300 dark:hover:border-[#0CA671]/40",
      href: "/volunteer",
    },
    {
      id: "map",
      icon: MapPin,
      title: language === "en" ? "Ward Map" : "ওয়ার্ড ম্যাপ",
      desc: language === "en" ? "Interactive map of Bakalia wards" : "বাকলিয়া ওয়ার্ডের ইন্টারেক্টিভ ম্যাপ",
      color: "text-blue-600 bg-blue-50 dark:text-[#4A89DA] dark:bg-[#04142F]",
      border: "hover:border-blue-300 dark:hover:border-[#4A89DA]/40",
      href: "/map",
    },
  ];

  const emergencyNumbers = [
    { label: language === "en" ? "National Emergency" : "জাতীয় জরুরি সেবা", number: "999" },
    { label: language === "en" ? "Fire Service" : "ফায়ার সার্ভিস", number: "102" },
    { label: language === "en" ? "Ambulance" : "অ্যাম্বুলেন্স", number: "199" },
  ];

  const handleServiceClick = (service: typeof services[0]) => {
    if (service.id === "emergency") {
      triggerSOS();
      return;
    }
    router.push(service.href);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-wider">
        <a href="/" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
          {t("home")}
        </a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-white font-extrabold">
          {language === "en" ? "All Services" : "সকল সেবা"}
        </span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-black text-slate-900 dark:text-white">
          {language === "en" ? "Community Services" : "কমিউনিটি সেবাসমূহ"}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {language === "en"
            ? "All Bakalia community services in one place"
            : "বাকলিয়া কমিউনিটির সকল সেবা এক জায়গায়"}
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <button
              key={service.id}
              onClick={() => handleServiceClick(service)}
              className={`flex flex-col items-start p-4 bg-white dark:bg-[#01205B] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-all active:scale-95 text-left ${service.border}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${service.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                {service.title}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug font-medium">
                {service.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Emergency Numbers */}
      <div className="mt-8 p-4 bg-red-50 dark:bg-[#481C21] border border-red-200 dark:border-red-900/40 rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <Phone className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span className="text-xs font-black text-red-700 dark:text-red-400 uppercase tracking-wider">
            {language === "en" ? "Emergency Hotlines" : "জরুরি হেল্পলাইন"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {emergencyNumbers.map((item, idx) => (
            <a
              key={idx}
              href={`tel:${item.number}`}
              className="flex flex-col items-center p-3 bg-white dark:bg-[#3a1515] rounded-xl border border-red-100 dark:border-red-900/30 active:scale-95 transition-all"
            >
              <span className="text-lg font-black text-red-600 dark:text-red-400 font-mono">{item.number}</span>
              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-1 text-center leading-tight">{item.label}</span>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
