"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronRight, AlertTriangle, Phone, Shield, Flame, Hospital, 
  User, MapPin, Compass, Locate, CheckCircle, Navigation, Radio, Info
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

  const emergencyContacts = [
    {
      category: language === "en" ? "National Help Desk" : "জাতীয় জরুরি সেবা",
      icon: AlertTriangle,
      color: "text-rose-500 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-100 dark:border-rose-900/20",
      list: [
        { name: language === "en" ? "National Emergency Service" : "জাতীয় হেল্প ডেস্ক", phone: "999" },
        { name: language === "en" ? "Government Information Helpline" : "তথ্য ও সেবা", phone: "333" },
        { name: language === "en" ? "Citizen Rights & Legal Aid" : "আইনি সহায়তা", phone: "16430" }
      ]
    },
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

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Gorgeous Header Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-red-700 to-rose-900 p-6 sm:p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 p-6 opacity-10 shrink-0">
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
            <Radio className="w-4 h-4 text-red-500 animate-pulse" />
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {language === "en" 
                ? `Local Responders (Ward ${selectedWardKey} Optimized)` 
                : `${selectedWardKey} নং ওয়ার্ডের স্থানীয় জরুরি যোগাযোগ`}
            </h3>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            
            {/* Councilor Card */}
            <div className="p-4 bg-gradient-to-br from-white to-slate-50 dark:from-[#01205B] dark:to-[#04142F] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all group">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider font-extrabold text-blue-500">{language === "en" ? "Ward Councilor" : "ওয়ার্ড কাউন্সিলর"}</span>
                    <span className="block text-xs font-black text-slate-850 dark:text-white group-hover:text-blue-500 dark:group-hover:text-[#4A89DA] transition-colors">{currentWardData.councilor}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] text-slate-400 dark:text-slate-500 font-bold leading-tight">{currentWardData.address}</span>
                  <span className="block text-[10px] font-mono font-bold text-slate-650 dark:text-slate-350">{currentWardData.councilorPhone}</span>
                </div>
              </div>
              <a 
                href={`tel:${currentWardData.councilorPhone}`}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.97] transition-all text-white text-xs font-black rounded-xl shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-blue-100" />
                <span>{language === "en" ? "Call Councilor" : "কাউন্সিলরকে কল করুন"}</span>
              </a>
            </div>

            {/* Local Precinct Outpost */}
            <div className="p-4 bg-gradient-to-br from-white to-slate-50 dark:from-[#01205B] dark:to-[#04142F] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all group">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                    <Shield className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider font-extrabold text-purple-500">{language === "en" ? "Local Precinct" : "পুলিশ আউটপোস্ট"}</span>
                    <span className="block text-xs font-black text-slate-850 dark:text-white group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">{currentWardData.precinct}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] text-slate-400 dark:text-slate-500 font-bold leading-tight">{language === "en" ? "Nearest Police Outpost Box" : "নিকটবর্তী পুলিশ তদন্ত কেন্দ্র"}</span>
                  <span className="block text-[10px] font-mono font-bold text-slate-650 dark:text-slate-350">{currentWardData.precinctPhone}</span>
                </div>
              </div>
              <a 
                href={`tel:${currentWardData.precinctPhone}`}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 active:scale-[0.97] transition-all text-white text-xs font-black rounded-xl shadow-md shadow-purple-500/10 flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-purple-100" />
                <span>{language === "en" ? "Call Outpost" : "ফাঁড়িতে কল করুন"}</span>
              </a>
            </div>

            {/* Local Ward Clinic */}
            <div className="p-4 bg-gradient-to-br from-white to-slate-50 dark:from-[#01205B] dark:to-[#04142F] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all group">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <Hospital className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider font-extrabold text-emerald-500">{language === "en" ? "Medical Desk" : "নিকটস্থ ক্লিনিক ও জরুরি ডেস্ক"}</span>
                    <span className="block text-xs font-black text-slate-850 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-[#0CA671] transition-colors">{currentWardData.clinic}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] text-slate-400 dark:text-slate-500 font-bold leading-tight">{language === "en" ? "Primary healthcare medical outpost" : "প্রাথমিক চিকিৎসা সেবা ডেস্ক ও কন্ট্যাক্ট"}</span>
                  <span className="block text-[10px] font-mono font-bold text-slate-650 dark:text-slate-350">{currentWardData.clinicPhone}</span>
                </div>
              </div>
              <a 
                href={`tel:${currentWardData.clinicPhone}`}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.97] transition-all text-white text-xs font-black rounded-xl shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-100" />
                <span>{language === "en" ? "Call Clinic Desk" : "ক্লিনিকে কল করুন"}</span>
              </a>
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
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 dark:bg-[#04142F]/50 border border-slate-100/50 dark:border-slate-800/20 group hover:border-slate-350/20 hover:bg-slate-50 dark:hover:bg-[#04142F]/80 transition-all duration-200"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="block text-[10.5px] font-black text-slate-800 dark:text-slate-300 leading-tight group-hover:text-blue-600 dark:group-hover:text-[#4A89DA] transition-colors">{contact.name}</span>
                          <span className="block text-[9.5px] text-slate-400 dark:text-slate-500 font-mono mt-1 leading-none font-bold">{contact.phone}</span>
                        </div>
                        
                        <a 
                          href={`tel:${contact.phone}`}
                          className="px-4 py-2 bg-white dark:bg-[#01205B] hover:bg-red-50 dark:hover:bg-red-550/15 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10.5px] font-black text-slate-700 dark:text-slate-200 hover:text-red-650 hover:border-red-200 dark:hover:text-red-400 dark:hover:border-red-950/40 transition-all flex items-center gap-1 active:scale-95 shadow-sm"
                        >
                          <Phone className="w-3.5 h-3.5 text-red-500" />
                          <span>{language === "en" ? "Call" : "কল করুন"}</span>
                        </a>
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
