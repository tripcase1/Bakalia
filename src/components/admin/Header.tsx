"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { 
  Sun, Moon, Bell, Search, ChevronDown, Menu, Plus, Compass, Settings, User, LogOut, CheckCircle, ShieldAlert
} from "lucide-react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const router = useRouter();
  const { 
    user, role, userData, theme, toggleTheme, language, logout 
  } = useAppContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [actionsOpen, setActionsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const triggerQuickAction = (tabName: string) => {
    setActionsOpen(false);
    router.push(`/admin?tab=${tabName}`);
  };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Set query tab or trigger search filter in DataManagement
    router.push(`/admin?tab=dashboard&search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="h-14 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-xl sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between transition-colors duration-200">
      {/* Left section: Toggle & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors active:scale-95"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search */}
        <form onSubmit={handleGlobalSearch} className="hidden sm:flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 px-3 py-1.5 rounded-lg w-72 max-w-xs focus-within:ring-1 focus-within:ring-blue-500/30 transition-all">
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === "en" ? "Search dashboard..." : "সার্চ করুন..."}
            className="bg-transparent text-xs w-full outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </form>
      </div>

      {/* Right section: Quick actions, notifications, theme toggle, and profile */}
      <div className="flex items-center gap-3">
        {/* Quick Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setActionsOpen(!actionsOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-white bg-blue-600 dark:bg-[#0CA671] hover:bg-blue-500 dark:hover:bg-emerald-500 shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{language === "en" ? "Quick Action" : "কুইক অ্যাকশন"}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {actionsOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setActionsOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#0B0F19] border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {[
                  { label: language === "en" ? "Publish News" : "সংবাদ প্রকাশ", action: "news" },
                  { label: language === "en" ? "Post Police Notice" : "পুলিশ নোটিশ প্রকাশ", action: "notices" },
                  { label: language === "en" ? "Manage Users" : "ব্যবহারকারী তালিকা", action: "users_citizens" },
                  { label: language === "en" ? "View Complaints" : "অভিযোগ সমূহ", action: "complaints" }
                ].map((act, idx) => (
                  <button
                    key={idx}
                    onClick={() => triggerQuickAction(act.action)}
                    className="w-full text-left px-3 py-2 text-xs rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors font-medium"
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200/60 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors active:scale-95"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Center indicator */}
        <button
          onClick={() => triggerQuickAction("cms_notifications")}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200/60 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors active:scale-95 relative"
        >
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Profile Bubble Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors select-none"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 dark:bg-[#0CA671] text-white flex items-center justify-center text-xs font-black uppercase shadow-inner">
              {((userData as any)?.displayName || user?.displayName || user?.email || "?").charAt(0)}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          </button>
          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#0B0F19] border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Profile header details */}
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/40 mb-1.5 leading-tight">
                  <span className="block text-xs font-black text-slate-800 dark:text-white truncate">
                    {(userData as any)?.displayName || user?.displayName || user?.email?.split('@')[0]}
                  </span>
                  <span className="text-[8.5px] font-black uppercase text-slate-400 tracking-wider">
                    {role ? role.replace("_", " ") : "citizen"}
                  </span>
                </div>
                
                <button
                  onClick={() => triggerQuickAction("profile")}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors font-medium text-left"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{language === "en" ? "My Profile" : "প্রোফাইল"}</span>
                </button>
                
                <button
                  onClick={() => triggerQuickAction("settings")}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors font-medium text-left"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{language === "en" ? "Settings" : "সেটিংস"}</span>
                </button>

                <div className="h-px bg-slate-100 dark:bg-slate-800/40 my-1" />

                <button
                  onClick={() => { setProfileOpen(false); logout(); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors font-bold text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{language === "en" ? "Sign Out" : "লগআউট"}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
