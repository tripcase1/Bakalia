"use client";

import React from "react";
import { 
  ChevronRight, AlertTriangle, Phone, Shield, Flame, Hospital, UserCheck, AlertCircle
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function EmergencyPage() {
  const { language, t } = useAppContext();

  const emergencyContacts = [
    {
      category: language === "en" ? "National Help Desk" : "জাতীয় জরুরি সেবা",
      icon: AlertCircle,
      color: "text-red-500 bg-red-50 dark:bg-rose-500/10 dark:text-rose-455",
      list: [
        { name: language === "en" ? "National Emergency Service" : "জাতীয় হেল্প ডেস্ক", phone: "999" },
        { name: language === "en" ? "Government Information Helpline" : "তথ্য ও সেবা", phone: "333" },
        { name: language === "en" ? "Citizen Rights & Legal Aid" : "আইনি সহায়তা", phone: "16430" }
      ]
    },
    {
      category: language === "en" ? "Bakalia Thana Police" : "থানা পুলিশ কন্ট্যাক্ট",
      icon: Shield,
      color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:text-[#4A89DA]",
      list: [
        { name: language === "en" ? "Bakalia Thana Duty Officer" : "থানা ডিউটি অফিসার", phone: "+880-31-610424" },
        { name: language === "en" ? "Officer in Charge (OC)" : "অফিসার ইন চার্জ (ওসি)", phone: "+880-1713-373656" },
        { name: language === "en" ? "precinct Inspector (Investigation)" : "পরিদর্শক (তদন্ত)", phone: "+880-1713-373657" }
      ]
    },
    {
      category: language === "en" ? "Fire Service Station" : "ফায়ার সার্ভিস ও সিভিল ডিফেন্স",
      icon: Flame,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-500",
      list: [
        { name: language === "en" ? "Bakalia Fire Station Control" : "বাকলিয়া ফায়ার স্টেশন", phone: "+880-31-713356" },
        { name: language === "en" ? "Chittagong Divisional Control Room" : "বিভাগীয় নিয়ন্ত্রণ কক্ষ", phone: "+880-31-713309" }
      ]
    },
    {
      category: language === "en" ? "Hospitals & Ambulances" : "হাসপাতাল ও অ্যাম্বুলেন্স",
      icon: Hospital,
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 dark:text-[#0CA671]",
      list: [
        { name: language === "en" ? "Bakalia General Hospital Desk" : "বাকলিয়া জেনারেল হাসপাতাল", phone: "+880-31-2521526" },
        { name: language === "en" ? "Ambulance dispatcher Service" : "জরুরি অ্যাম্বুলেন্স সার্ভিস", phone: "+880-1819-322144" }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-wider">
        <a href="/" className="hover:text-slate-700 dark:hover:text-slate-350 transition-colors">{t("home")}</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-white font-extrabold">{t("emergency")}</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="glass-card bg-white dark:bg-[#01205B] border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            {language === "en" ? "Emergency Hotline Contacts" : "জরুরি যোগাযোগ ডিরেক্টরি"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
            {language === "en"
              ? "Call local precincts, fire control, and hospital emergency dispatch units directly. Hotlines are operational 24/7."
              : "থানা পুলিশ, ফায়ার সার্ভিস ও হাসপাতালের সাথে সরাসরি যোগাযোগ করুন। সকল হেল্পলাইন ২৪ ঘণ্টা সচল থাকে।"}
          </p>
        </div>

        {/* Contacts Category Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {emergencyContacts.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div key={idx} className="p-5 bg-white dark:bg-[#01205B] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${cat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-black text-slate-850 dark:text-slate-100">{cat.category}</h3>
                </div>

                <div className="space-y-2.5">
                  {cat.list.map((contact, cIdx) => (
                    <div key={cIdx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#04142F]/50 border border-slate-100 dark:border-slate-800/20">
                      <div className="min-w-0">
                        <span className="block text-[10.5px] font-black text-slate-800 dark:text-slate-300 leading-tight">{contact.name}</span>
                        <span className="block text-[9.5px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 leading-none">{contact.phone}</span>
                      </div>
                      
                      <a 
                        href={`tel:${contact.phone}`}
                        className="px-3 py-1.5 bg-white hover:bg-slate-50 dark:bg-[#01205B] hover:dark:bg-[#010818] border rounded-lg text-[10px] font-extrabold text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1 active:scale-95 shadow-sm"
                      >
                        <Phone className="w-3 h-3 text-emerald-500" />
                        <span>Call</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
