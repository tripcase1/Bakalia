"use client";

import React, { useState } from "react";
import { 
  ChevronRight, AlertTriangle, Phone, Shield, Flame, Hospital, 
  User, MapPin, Compass, Locate, Radio, Info, Heart
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function EmergencyPage() {
  const { language, t, detectedWard, gpsStatus, requestGps } = useAppContext();
  const [manualWard, setManualWard] = useState<string>("Ward 17");

  // Determine active ward for filtering
  const activeWard = detectedWard || manualWard;

  // Ward data mapping
  const wardData: Record<string, {
    councilor: string;
    councilorPhone: string;
    address: string;
    precinct: string;
    precinctPhone: string;
    clinic: string;
    clinicPhone: string;
  }> = {
    "17": {
      councilor: language === "en" ? "Abdullah Al Mamun" : "আবদুল্লাহ আল মামুন",
      councilorPhone: "+8801712345678",
      address: language === "en" ? "Ward 17 Office, West Bakalia" : "১৭ নং ওয়ার্ড কার্যালয়, পশ্চিম বাকলিয়া",
      precinct: language === "en" ? "West Bakalia Outpost" : "পশ্চিম বাকলিয়া পুলিশ ফাঁড়ি",
      precinctPhone: "+88031610424",
      clinic: language === "en" ? "Bakalia General Hospital Desk" : "বাকলিয়া জেনারেল হাসপাতাল",
      clinicPhone: "+880312521526"
    },
    "18": {
      councilor: language === "en" ? "Mohammad Harun Ur Rashid" : "মোহাম্মদ হারুন অর রশীদ",
      councilorPhone: "+8801713373656",
      address: language === "en" ? "Ward 18 Office, East Bakalia" : "১৮ নং ওয়ার্ড কার্যালয়, পূর্ব বাকলিয়া",
      precinct: language === "en" ? "East Bakalia Outpost" : "পূর্ব বাকলিয়া পুলিশ ফাঁড়ি",
      precinctPhone: "+88031610425",
      clinic: language === "en" ? "Chawkbazar Ward Clinic" : "চকবাজার ওয়ার্ড ক্লিনিক",
      clinicPhone: "+88031713309"
    },
    "19": {
      councilor: language === "en" ? "Nurul Alam" : "নুরুল আলম",
      councilorPhone: "+8801713373657",
      address: language === "en" ? "Ward 19 Office, South Bakalia" : "১৯ নং ওয়ার্ড কার্যালয়, দক্ষিণ বাকলিয়া",
      precinct: language === "en" ? "South Bakalia Police Desk" : "দক্ষিণ বাকলিয়া পুলিশ ডেস্ক",
      precinctPhone: "+88031610426",
      clinic: language === "en" ? "South Bakalia Health Center" : "দক্ষিণ বাকলিয়া স্বাস্থ্য কেন্দ্র",
      clinicPhone: "+8801819322144"
    }
  };

  // Extract key representing ward number (17, 18, 19)
  const getWardKey = (wardString: string): string => {
    if (wardString.includes("17") || wardString.includes("১৭")) return "17";
    if (wardString.includes("18") || wardString.includes("১৮")) return "18";
    if (wardString.includes("19") || wardString.includes("১৯")) return "19";
    return "17"; // fallback default
  };

  const selectedWardKey = getWardKey(activeWard);
  const currentWardData = wardData[selectedWardKey];

  const priorityHotlines = [
    { name: language === "en" ? "National Emergency Desk" : "জাতীয় জরুরি সেবা", phone: "999", desc: language === "en" ? "Police, Fire, Ambulance" : "পুলিশ, ফায়ার সার্ভিস, অ্যাম্বুলেন্স", color: "from-rose-600 to-red-500 shadow-red-500/25" },
    { name: language === "en" ? "Government Helpline" : "সরকারি তথ্য ও সেবা", phone: "333", desc: language === "en" ? "Info, Social Services, Relief" : "নাগরিক সেবা ও তথ্য হেল্পলাইন", color: "from-blue-600 to-indigo-500 shadow-blue-500/25" },
    { name: language === "en" ? "Legal Aid Helpline" : "সরকারি আইনি সহায়তা", phone: "16430", desc: language === "en" ? "Legal Aid & Rights Services" : "বিনামূল্যে আইনি পরামর্শ ও সহায়তা", color: "from-amber-600 to-yellow-500 shadow-amber-500/25" }
  ];

  const emergencyContacts = [
    {
      category: language === "en" ? "Bakalia Thana Police" : "থানা পুলিশ কন্ট্যাক্ট",
      icon: Shield,
      color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:text-[#4A89DA] border border-blue-100 dark:border-blue-900/20",
      list: [
        { name: language === "en" ? "Bakalia Thana Duty Officer" : "থানা ডিউটি অফিসার", phone: "+88031610424" },
        { name: language === "en" ? "Officer in Charge (OC)" : "অফিসার ইন চার্জ (ওসি)", phone: "+8801713373656" },
        { name: language === "en" ? "precinct Inspector (Investigation)" : "পরিদর্শক (তদন্ত)", phone: "+8801713373657" }
      ]
    },
    {
      category: language === "en" ? "Fire Service Station" : "ফায়ার সার্ভিস ও সিভিল ডিফেন্স",
      icon: Flame,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-500 border border-amber-100 dark:border-amber-900/20",
      list: [
        { name: language === "en" ? "Bakalia Fire Station Control" : "বাকলিয়া ফায়ার স্টেশন", phone: "+88031713356" },
        { name: language === "en" ? "Chittagong Divisional Control Room" : "বিভাগীয় নিয়ন্ত্রণ কক্ষ", phone: "+88031713309" }
      ]
    },
    {
      category: language === "en" ? "Hospitals & Ambulances" : "হাসপাতাল ও অ্যাম্বুলেন্স",
      icon: Hospital,
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 dark:text-[#0CA671] border border-emerald-100 dark:border-emerald-900/20",
      list: [
        { name: language === "en" ? "Bakalia General Hospital Desk" : "বাকলিয়া জেনারেল হাসপাতাল", phone: "+880312521526" },
        { name: language === "en" ? "Ambulance dispatcher Service" : "জরুরি অ্যাম্বুলেন্স সার্ভিস", phone: "+8801819322144" }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-wider">
        <a href="/" className="hover:text-slate-700 dark:hover:text-slate-350 transition-colors">{t("home")}</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-white font-extrabold">{t("emergency")}</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-7">
        
        {/* Gorgeous Header Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-red-700 to-rose-950 p-6 sm:p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 p-6 opacity-10 shrink-0 select-none pointer-events-none">
            <Radio className="w-40 h-40 animate-pulse text-white" />
          </div>
          <div className="relative z-10 max-w-lg space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black tracking-wider uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping inline-block" />
              <span>{language === "en" ? "24/7 Smart Control" : "২৪/৭ জরুরি হাব"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {language === "en" ? "Emergency Response Center" : "জরুরি সেবা ও সহায়তা কেন্দ্র"}
            </h2>
            <p className="text-xs sm:text-sm text-red-100 leading-relaxed font-bold">
              {language === "en"
                ? "Locate your nearest ward authority, report civic incidents, or dial regional response outposts with a single tap."
                : "জিপিএস লোকেশনের মাধ্যমে আপনার ওয়ার্ডের কাউন্সিলর, পুলিশ ও ফায়ার স্টেশনের সাথে সরাসরি ওয়ান-ট্যাপে যোগাযোগ করুন।"}
            </p>
          </div>
        </div>

        {/* ==================== 24/7 PRIORITY HOTLINE WIDGETS ==================== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {language === "en" ? "24/7 Priority Hotlines" : "২৪/৭ জরুরি হটলাইনসমূহ"}
            </h3>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {priorityHotlines.map((hotline, idx) => (
              <div 
                key={idx} 
                className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-tr ${hotline.color} text-white shadow-lg flex flex-col justify-between space-y-4`}
              >
                <div className="space-y-1.5">
                  <span className="block text-[8px] uppercase tracking-wider font-extrabold text-white/70">{hotline.name}</span>
                  <span className="block text-[9.5px] font-bold text-white/90 leading-tight">{hotline.desc}</span>
                </div>

                {/* Call Button Directly Beside Phone Number */}
                <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10">
                  <span className="text-2xl font-black tracking-widest font-mono text-white leading-none">
                    {hotline.phone}
                  </span>
                  <a 
                    href={`tel:${hotline.phone}`}
                    className="w-10 h-10 rounded-full bg-white hover:bg-slate-50 text-red-650 flex items-center justify-center shadow-lg active:scale-90 transition-all shrink-0"
                    title={`Call ${hotline.phone}`}
                  >
                    <Phone className="w-4.5 h-4.5 text-rose-600 animate-pulse" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GPS Control Panel */}
        <div className="glass-card bg-white dark:bg-[#01205B] border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-[#04142F] text-emerald-600 dark:text-[#0CA671] border border-emerald-100 dark:border-emerald-950/20 flex items-center justify-center shrink-0">
                <Compass className="w-5.5 h-5.5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  {language === "en" ? "GPS Smart Location" : "জিপিএস স্মার্ট লোকেশন"}
                  {gpsStatus === "granted" && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black bg-emerald-500/10 text-emerald-600 dark:text-[#0CA671] uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
                      {language === "en" ? "Active" : "সক্রিয়"}
                    </span>
                  )}
                </h3>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                  {gpsStatus === "granted" 
                    ? `${language === "en" ? "Detected Area: " : "শনাক্তকৃত এলাকা: "} ${activeWard}`
                    : language === "en" ? "Offline or Manual Selection Active" : "অফলাইন অথবা ম্যানুয়াল সিলেকশন চালু রয়েছে"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {gpsStatus !== "granted" && (
                <button
                  onClick={requestGps}
                  className="flex-1 sm:flex-initial py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black shadow-md shadow-emerald-500/15 flex items-center justify-center gap-1.5 active:scale-95 transition-all select-none"
                >
                  {gpsStatus === "loading" ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{language === "en" ? "Detecting..." : "শনাক্ত হচ্ছে..."}</span>
                    </>
                  ) : (
                    <>
                      <Locate className="w-4 h-4 text-emerald-100" />
                      <span>{language === "en" ? "Detect Location" : "লোকেশন শনাক্ত করুন"}</span>
                    </>
                  )}
                </button>
              )}
              
              <div className="flex-1 sm:flex-initial flex items-center gap-2 bg-slate-50 dark:bg-[#04142F] border border-slate-200/60 dark:border-slate-800 rounded-2xl px-3 py-1">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">{language === "en" ? "Ward:" : "ওয়ার্ড:"}</span>
                <select
                  value={selectedWardKey}
                  onChange={(e) => setManualWard(`Ward ${e.target.value}`)}
                  className="bg-transparent border-none outline-none text-xs font-black text-slate-700 dark:text-white cursor-pointer py-1.5"
                >
                  <option value="17" className="bg-white dark:bg-[#01205B]">17</option>
                  <option value="18" className="bg-white dark:bg-[#01205B]">18</option>
                  <option value="19" className="bg-white dark:bg-[#01205B]">19</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Area Response Unit (Auto-selected based on Ward) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {language === "en" 
                ? `Local Responders (Ward ${selectedWardKey} Optimized)` 
                : `${selectedWardKey} নং ওয়ার্ডের স্থানীয় জরুরি যোগাযোগ`}
            </h3>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            
            {/* Councilor Card */}
            <div className="p-5 bg-gradient-to-br from-white to-slate-50 dark:from-[#01205B] dark:to-[#04142F] border border-slate-200 dark:border-slate-850 rounded-3xl shadow-sm flex flex-col justify-between space-y-4 hover:border-blue-400/30 dark:hover:border-blue-800/40 transition-all duration-300 group">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider font-extrabold text-blue-500">{language === "en" ? "Ward Councilor" : "ওয়ার্ড কাউন্সিলর"}</span>
                    <span className="block text-xs font-black text-slate-850 dark:text-white group-hover:text-blue-500 dark:group-hover:text-[#4A89DA] transition-colors">{currentWardData.councilor}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] text-slate-400 dark:text-slate-500 font-bold leading-tight flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                    {currentWardData.address}
                  </span>
                </div>
              </div>

              {/* Call Button Directly Beside Phone Number */}
              <div className="flex items-center justify-between p-2.5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/10 rounded-2xl">
                <div className="min-w-0">
                  <span className="block text-[8px] uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500 leading-none mb-0.5">{language === "en" ? "Contact Number" : "যোগাযোগ নম্বর"}</span>
                  <span className="block text-xs font-mono font-black text-slate-800 dark:text-slate-200 truncate pr-1">
                    {currentWardData.councilorPhone}
                  </span>
                </div>
                <a 
                  href={`tel:${currentWardData.councilorPhone}`}
                  className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center active:scale-90 transition-all shrink-0 shadow-md shadow-blue-500/15"
                  title="Call Councilor"
                >
                  <Phone className="w-4 h-4 text-blue-100" />
                </a>
              </div>
            </div>

            {/* Local Precinct Outpost */}
            <div className="p-5 bg-gradient-to-br from-white to-slate-50 dark:from-[#01205B] dark:to-[#04142F] border border-slate-200 dark:border-slate-850 rounded-3xl shadow-sm flex flex-col justify-between space-y-4 hover:border-purple-400/30 dark:hover:border-purple-800/40 transition-all duration-300 group">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider font-extrabold text-purple-500">{language === "en" ? "Local Precinct" : "পুলিশ আউটপোস্ট"}</span>
                    <span className="block text-xs font-black text-slate-850 dark:text-white group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">{currentWardData.precinct}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] text-slate-400 dark:text-slate-500 font-bold leading-tight flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                    {language === "en" ? "Nearest Outpost Box" : "নিকটবর্তী তদন্ত ফাঁড়ি"}
                  </span>
                </div>
              </div>

              {/* Call Button Directly Beside Phone Number */}
              <div className="flex items-center justify-between p-2.5 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100/50 dark:border-purple-900/10 rounded-2xl">
                <div className="min-w-0">
                  <span className="block text-[8px] uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500 leading-none mb-0.5">{language === "en" ? "Duty Desk" : "ডিউটি ডেস্ক"}</span>
                  <span className="block text-xs font-mono font-black text-slate-800 dark:text-slate-200 truncate pr-1">
                    {currentWardData.precinctPhone}
                  </span>
                </div>
                <a 
                  href={`tel:${currentWardData.precinctPhone}`}
                  className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center active:scale-90 transition-all shrink-0 shadow-md shadow-purple-500/15"
                  title="Call Precinct"
                >
                  <Phone className="w-4 h-4 text-purple-100" />
                </a>
              </div>
            </div>

            {/* Local Ward Clinic */}
            <div className="p-5 bg-gradient-to-br from-white to-slate-50 dark:from-[#01205B] dark:to-[#04142F] border border-slate-200 dark:border-slate-850 rounded-3xl shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-400/30 dark:hover:border-emerald-800/40 transition-all duration-300 group">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <Hospital className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider font-extrabold text-emerald-500">{language === "en" ? "Medical Desk" : "স্বাস্থ্য ও চিকিৎসা ডেস্ক"}</span>
                    <span className="block text-xs font-black text-slate-850 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-[#0CA671] transition-colors">{currentWardData.clinic}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] text-slate-400 dark:text-slate-500 font-bold leading-tight flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-slate-455 shrink-0" />
                    {language === "en" ? "Primary Health Unit Office" : "ওয়ার্ড স্বাস্থ্যসেবা কার্যালয়"}
                  </span>
                </div>
              </div>

              {/* Call Button Directly Beside Phone Number */}
              <div className="flex items-center justify-between p-2.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/10 rounded-2xl">
                <div className="min-w-0">
                  <span className="block text-[8px] uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500 leading-none mb-0.5">{language === "en" ? "Ambulance/Desk" : "অ্যাম্বুলেন্স/ডেস্ক"}</span>
                  <span className="block text-xs font-mono font-black text-slate-800 dark:text-slate-200 truncate pr-1">
                    {currentWardData.clinicPhone}
                  </span>
                </div>
                <a 
                  href={`tel:${currentWardData.clinicPhone}`}
                  className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center active:scale-90 transition-all shrink-0 shadow-md shadow-emerald-500/15"
                  title="Call Clinic Desk"
                >
                  <Phone className="w-4 h-4 text-emerald-100" />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* 24/7 Global Directory Grid */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-2 px-1">
            <Shield className="w-4.5 h-4.5 text-blue-500" />
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {language === "en" ? "24/7 Emergency Directory" : "২৪/৭ জরুরি ডিরেক্টরি"}
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {emergencyContacts.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div key={idx} className="p-5 bg-white dark:bg-[#01205B] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xs font-black text-slate-850 dark:text-slate-100">{cat.category}</h3>
                  </div>

                  <div className="space-y-2.5">
                    {cat.list.map((contact, cIdx) => (
                      <div 
                        key={cIdx} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 dark:bg-[#04142F]/50 border border-slate-100/50 dark:border-slate-800/20 group hover:border-slate-300/30 hover:bg-slate-50 dark:hover:bg-[#04142F]/80 transition-all duration-200 gap-3"
                      >
                        <div className="min-w-0">
                          <span className="block text-[10.5px] font-black text-slate-850 dark:text-slate-300 leading-tight group-hover:text-blue-600 dark:group-hover:text-[#4A89DA] transition-colors">{contact.name}</span>
                          <span className="block text-[8px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500 mt-1 leading-none">24/7 Hotline Support</span>
                        </div>
                        
                        {/* Call Button Directly Beside Phone Number */}
                        <div className="flex items-center justify-between bg-white dark:bg-[#01205B] border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl gap-3 sm:w-auto w-full">
                          <span className="text-[11px] font-mono font-black text-slate-800 dark:text-slate-250 leading-none">
                            {contact.phone}
                          </span>
                          <a 
                            href={`tel:${contact.phone}`}
                            className="w-8.5 h-8.5 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-md active:scale-90 transition-all shrink-0"
                            title={`Call ${contact.name}`}
                          >
                            <Phone className="w-3.5 h-3.5 text-white" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Informative Footer */}
        <div className="p-4 bg-blue-50/50 dark:bg-[#04142F]/40 border border-blue-100/30 dark:border-slate-800/40 rounded-2xl text-[10px] text-slate-500 dark:text-slate-400 font-bold flex items-start gap-2.5 leading-relaxed">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p>
            {language === "en" 
              ? "All dynamic location detections are computed locally on your device to respect user privacy. If your ward is detected incorrectly, you can manually switch the dropdown filter to retrieve local contacts." 
              : "স্মার্ট লোকেশন শনাক্তকরণের সকল হিসাব আপনার ডিভাইসেই সম্পন্ন হয়ে থাকে। জিপিএস শনাক্তকরণ কাজ না করলে বা ভুল ওয়ার্ড দেখালে ড্রপডাউন ব্যবহার করে ম্যানুয়ালি সঠিক ওয়ার্ড নির্ধারণ করে নিন।"}
          </p>
        </div>

      </div>
    </div>
  );
}
