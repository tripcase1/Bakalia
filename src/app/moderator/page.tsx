"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronRight, Shield, Bell, Send, AlertCircle, Loader2, CheckCircle2, Clock, Trash2,
  FileText, Eye, ShieldAlert, BarChart3, HelpCircle
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, limit } from "firebase/firestore";

export default function ModeratorDashboardPage() {


  const { user, role, theme, language, t, authLoading } = useAppContext();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 dark:text-[#0CA671] animate-spin" />
      </div>
    );
  }

  const isAuthorized = role === "moderator" || role === "super_admin";

  if (!user || !isAuthorized) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white dark:bg-[#01205B] border rounded-2xl shadow-sm text-center py-10 space-y-4">
        <ShieldAlert className="w-10 h-10 text-red-500 mx-auto animate-bounce" />
        <h2 className="text-base font-black text-slate-905 dark:text-white">Moderator Access Required</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          This dashboard panel is restricted to verified system portal moderators.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-wider">
        <a href="/" className="hover:text-slate-700 dark:hover:text-slate-350 transition-colors">{t("home")}</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-805 dark:text-white font-extrabold">Moderator Dashboard</span>
      </div>

      <div className="glass-card bg-white dark:bg-[#01205B] border p-6 rounded-2xl shadow-sm py-12 text-center text-xs text-slate-455 animate-in fade-in duration-200">
        <Shield className="w-8 h-8 mx-auto text-slate-350 mb-2 animate-pulse" />
        <h4 className="font-black text-slate-700 dark:text-slate-200">Content Moderation Queue</h4>
        <p className="mt-1">Inspect complaints, rentals, and job listings reported by citizens.</p>
      </div>

    </div>
  );
}
