"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { 
  LayoutDashboard, BarChart3, Users, Shield, Award, Heart, Building, Store,
  AlertTriangle, Flame, EyeOff, Search, Home, Briefcase, ShoppingBag, FileText,
  Bell, Image, AreaChart, Cpu, Lock, ClipboardList, Settings, User, LogOut, ChevronLeft, ChevronRight, Droplet, Calendar, FileWarning
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";
  const { logout, language } = useAppContext();

  // Expanded group states (for users & CMS)
  const [usersExpanded, setUsersExpanded] = useState(true);
  const [cmsExpanded, setCmsExpanded] = useState(true);

  const setTab = (tabName: string) => {
    router.push(`/admin?tab=${tabName}`);
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const menuGroups = [
    {
      title: language === "en" ? "Overview" : "ওভারভিউ",
      items: [
        { id: "dashboard", label: language === "en" ? "Dashboard" : "ড্যাশবোর্ড", icon: LayoutDashboard },
        { id: "analytics", label: language === "en" ? "Analytics" : "অ্যানালিটিক্স", icon: BarChart3 }
      ]
    },
    {
      title: language === "en" ? "Users Management" : "ব্যবহারকারী তালিকা",
      isExpandable: true,
      expanded: usersExpanded,
      setExpanded: setUsersExpanded,
      items: [
        { id: "users_citizens", label: language === "en" ? "Citizens" : "নাগরিকবৃন্দ", icon: Users },
        { id: "users_police", label: language === "en" ? "Police Officers" : "পুলিশ কর্মকর্তা", icon: Shield },
        { id: "users_councilors", label: language === "en" ? "Councilors" : "কাউন্সিলরবৃন্দ", icon: Award },
        { id: "users_volunteers", label: language === "en" ? "Volunteers" : "স্বেচ্ছাসেবক", icon: Heart },
        { id: "users_mosques", label: language === "en" ? "Mosques" : "মসজিদ সমূহ", icon: Building },
        { id: "users_businesses", label: language === "en" ? "Businesses" : "ব্যবসায়ী", icon: Store }
      ]
    },
    {
      title: language === "en" ? "Operations" : "কার্যক্রম",
      items: [
        { id: "complaints", label: language === "en" ? "Complaints" : "অভিযোগ সমূহ", icon: AlertTriangle },
        { id: "sos", label: language === "en" ? "Emergency SOS" : "জরুরি এসওএস", icon: Flame },
        { id: "tips", label: language === "en" ? "Anonymous Tips" : "বেনামী তথ্য", icon: EyeOff },
        { id: "lostfound", label: language === "en" ? "Lost & Found" : "হারানো ও প্রাপ্তি", icon: Search },
        { id: "rentals", label: language === "en" ? "House Rent" : "বাসা ভাড়া", icon: Home },
        { id: "jobs", label: language === "en" ? "Jobs Queue" : "চাকরি বিজ্ঞাপন", icon: Briefcase },
        { id: "marketplace", label: language === "en" ? "Marketplace" : "মার্কেটপ্লেস", icon: ShoppingBag },
        { id: "news", label: language === "en" ? "CMS News" : "পোর্টাল সংবাদ", icon: FileText },
        { id: "notices", label: language === "en" ? "Police Notices" : "পুলিশ নোটিশ", icon: FileWarning },
        { id: "donors", label: language === "en" ? "Blood Donors" : "রক্তদাতা", icon: Droplet },
        { id: "events", label: language === "en" ? "Events Scheduler" : "ইভেন্ট সমূহ", icon: Calendar }
      ]
    },
    {
      title: language === "en" ? "System CMS" : "সিস্টেম সিএমএস",
      isExpandable: true,
      expanded: cmsExpanded,
      setExpanded: setCmsExpanded,
      items: [
        { id: "cms_notifications", label: language === "en" ? "Notifications" : "নোটিফিকেশন", icon: Bell },
        { id: "cms_media", label: language === "en" ? "Media Library" : "মিডিয়া লাইব্রেরি", icon: Image },
        { id: "cms_reports", label: language === "en" ? "Reports" : "রিপোর্ট সমূহ", icon: AreaChart },
        { id: "cms_moderation", label: language === "en" ? "AI Moderation" : "এআই মডারেশন", icon: Cpu }
      ]
    },
    {
      title: language === "en" ? "Admin Controls" : "অ্যাডমিন কন্ট্রোল",
      items: [
        { id: "permissions", label: language === "en" ? "Roles & Permissions" : "পারমিশন সেটআপ", icon: Lock },
        { id: "logs", label: language === "en" ? "Audit Logs" : "অডিট লগ সমূহ", icon: ClipboardList },
        { id: "settings", label: language === "en" ? "Settings" : "সেটিংস", icon: Settings },
        { id: "profile", label: language === "en" ? "Profile" : "প্রোফাইল", icon: User }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Sidebar Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-35 md:hidden animate-in fade-in duration-200"
        />
      )}
      
      <div 
        className={`border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F19] transition-all duration-300 flex flex-col h-screen select-none z-40
          md:sticky md:top-0 md:shrink-0
          fixed top-0 bottom-0 shadow-2xl md:shadow-none
          ${isOpen 
            ? "left-0 w-64" 
            : "-left-64 md:left-0 w-64 md:w-16"
          }`}
      >
      {/* Sidebar Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black text-sm shadow-md shrink-0">
            B
          </div>
          {isOpen && (
            <div className="leading-none min-w-0">
              <span className="block text-xs font-black text-slate-800 dark:text-white truncate">Bakalia Portal</span>
              <span className="text-[7.5px] font-black tracking-widest text-[#0CA671] uppercase mt-0.5 block">Admin Panel</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors active:scale-95 hidden md:block"
        >
          {isOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Menu scroll area */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4 scrollbar-none">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {isOpen && (
              <div 
                className={`text-[8.5px] font-black uppercase text-slate-400 dark:text-slate-550 px-2 py-1 flex items-center justify-between tracking-wider ${
                  group.isExpandable ? "cursor-pointer hover:text-slate-600 dark:hover:text-slate-300" : ""
                }`}
                onClick={() => group.isExpandable && group.setExpanded(!group.expanded)}
              >
                <span>{group.title}</span>
                {group.isExpandable && (
                  <span className="text-[7px] font-bold">
                    {group.expanded ? "▲" : "▼"}
                  </span>
                )}
              </div>
            )}
            
            {(!group.isExpandable || group.expanded || !isOpen) && (
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setTab(item.id)}
                      title={!isOpen ? item.label : undefined}
                      className={`w-full flex items-center rounded-lg py-1.5 px-2.5 transition-all text-left relative ${
                        isActive
                          ? "bg-slate-100 dark:bg-slate-850/80 text-black dark:text-white font-extrabold shadow-sm border border-slate-200/50 dark:border-slate-800/40"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/30 text-slate-500/80"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? "text-blue-500 dark:text-[#0CA671]" : "text-slate-400 dark:text-slate-500"
                      }`} />
                      {isOpen && (
                        <span className="ml-3 text-xs truncate">{item.label}</span>
                      )}
                      {isActive && !isOpen && (
                        <span className="absolute right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-[#0CA671]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer menu */}
      <div className="p-2 border-t border-slate-200/80 dark:border-slate-800/80">
        <button
          onClick={logout}
          className="w-full flex items-center rounded-lg py-1.5 px-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 transition-all text-left active:scale-95"
          title={!isOpen ? (language === "en" ? "Logout" : "লগআউট") : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {isOpen && (
            <span className="ml-3 text-xs font-bold">{language === "en" ? "Logout" : "লগআউট"}</span>
          )}
        </button>
      </div>
      </div>
    </>
  );
}
