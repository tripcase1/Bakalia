"use client";

import React from "react";
import { 
  ChevronRight, Info, ShieldAlert, Phone, Mail, MapPin, Download, BookOpen, User, Users
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function AboutPage() {
  const { language, t } = useAppContext();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-wider">
        <a href="/" className="hover:text-slate-700 dark:hover:text-slate-350 transition-colors">{t("home")}</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-white font-extrabold">{t("aboutUs")}</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Ward Information */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card bg-white dark:bg-[#01205B] border-slate-202 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Info className="w-5.5 h-5.5 text-blue-500" />
              <span>{language === "en" ? "About Bakalia Ward" : "বাকলিয়া ওয়ার্ড সম্পর্কে"}</span>
            </h2>
            
            <div className="space-y-4 text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-bold">
              <p>
                {language === "en"
                  ? "Bakalia is a prominent municipal area located in Chittagong, Bangladesh. It comprises Wards 17, 18, and 19 under the Chittagong City Corporation (CCC). Bakalia is one of the most populated and active trading regions in the city, rapidly developing into a digital-smart residential zone."
                  : "বাকলিয়া চট্টগ্রামের একটি অন্যতম গুরুত্বপূর্ণ এলাকা। এটি চট্টগ্রাম সিটি কর্পোরেশনের (চসিক) অধীনে ১৭, ১৮ এবং ১৯ নম্বর ওয়ার্ড নিয়ে গঠিত। এটি শহরের অন্যতম ঘনবসতিপূর্ণ এবং বাণিজ্যিক এলাকা হিসেবে পরিচিত, যা বর্তমানে একটি আধুনিক স্মার্ট আবাসিক জোনে রূপান্তরিত হচ্ছে।"}
              </p>
              <p>
                {language === "en"
                  ? "The smart community portal serves as a digital bridge between citizens and administrative bodies, simplifying report submissions, lost asset recovery, properties listings, and volunteer mobilizations."
                  : "এই স্মার্ট কমিউনিটি পোর্টালটি নাগরিক এবং প্রশাসনিক পর্ষদের মধ্যে একটি সংযোগ স্থাপন করে, যার মাধ্যমে নাগরিক সমস্যা রিপোর্ট করা, জরুরি সহায়তা চাওয়া, বাসা ভাড়া ও রক্তদাতার সন্ধান সহজতর হয়।"}
              </p>
            </div>
          </div>

          {/* Core Objectives */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: language === "en" ? "Interactive Civic Registry" : "অভিযোগ রেজিস্ট্রি", desc: language === "en" ? "File garbage or infrastructure complaints directly to volunteers." : "ময়লা-আবর্জনা বা ভাঙা রাস্তার অভিযোগ দাখিল করুন সরাসরি।" },
              { title: language === "en" ? "Dynamic Support Hotlines" : "জরুরি ডিরেক্টরি", desc: language === "en" ? "Quick contact details for precinct, clinics, and fire centers." : "থানা পুলিশ, হাসপাতাল ও ফায়ার সার্ভিসের কুইক কন্ট্যাক্ট ডিরেক্টরি।" }
            ].map((obj, idx) => (
              <div key={idx} className="p-4.5 bg-white dark:bg-[#01205B] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                <h3 className="text-xs font-black text-slate-800 dark:text-slate-100">{obj.title}</h3>
                <p className="text-[10px] text-slate-500 dark:text-[#859798] mt-1.5 leading-relaxed font-medium">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Councilor & Precinct details */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Councilor details */}
          <div className="p-5 bg-white dark:bg-[#01205B] border rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {language === "en" ? "Ward Councilor" : "ওয়ার্ড কাউন্সিলর"}
            </h3>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <User className="w-5.5 h-5.5" />
              </div>
              <div className="leading-tight">
                <span className="block text-xs font-black text-slate-800 dark:text-white">Abdullah Al Mamun</span>
                <span className="block text-[9.5px] text-slate-400 dark:text-slate-450 mt-0.5">Councilor, Ward 17</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-850 space-y-2 text-[10.5px] font-bold text-slate-600 dark:text-slate-350">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>+880-1712-345678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                <span>mamun.ccc@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Ward 17 Office, Bakalia</span>
              </div>
            </div>
          </div>

          {/* Handbook Download */}
          <div className="p-5 bg-gradient-to-tr from-blue-600 to-indigo-700 text-white rounded-2xl shadow-lg space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-200">
              {language === "en" ? "Citizen Manual Booklet" : "নাগরিক নির্দেশিকা booklet"}
            </h3>
            
            <p className="text-[10px] text-blue-100 leading-relaxed font-bold">
              {language === "en"
                ? "Download the official civic guidelines handbook detailing rules, duties, and emergency responses."
                : "নাগরিক দায়িত্ব, ট্রাফিক নিয়ম এবং জরুরি পরিস্থিতির জন্য অফিসিয়াল নাগরিক নির্দেশিকা ডাউনলোড করুন।"}
            </p>

            <a 
              href="#"
              onClick={(e) => { e.preventDefault(); alert("Citizen booklet downloading commences..."); }}
              className="w-full py-2.5 bg-white text-blue-700 hover:bg-blue-50 rounded-lg text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-all select-none active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{t("downloadRules")}</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
