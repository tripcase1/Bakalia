"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronRight, Users, Bell, Send, AlertCircle, Loader2, CheckCircle2, Clock, Trash2,
  FileText, Shield, Eye, ShieldAlert, BarChart3, HelpCircle, Award, Plus
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function EditorDashboardPage() {


  const { user, role, theme, language, t, authLoading } = useAppContext();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 dark:text-[#0CA671] animate-spin" />
      </div>
    );
  }

  // News states
  const [newsTitle, setNewsTitle] = useState("");
  const [newsTitleBn, setNewsTitleBn] = useState("");
  const [newsCategory, setNewsCategory] = useState("Official Update");
  const [newsCategoryBn, setNewsCategoryBn] = useState("সরকারি নোটিশ");
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsSuccess, setNewsSuccess] = useState(false);

  const isAuthorized = role === "editor" || role === "super_admin";

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsLoading(true);
    setNewsSuccess(false);

    try {
      await addDoc(collection(db, "news"), {
        title: newsTitle,
        titleBn: newsTitleBn,
        category: newsCategory,
        categoryBn: newsCategoryBn,
        categoryColor: "bg-blue-50 text-blue-600 dark:bg-[#04142F] dark:text-[#4A89DA] border border-blue-100 dark:border-[#4A89DA]/20",
        time: language === "en" ? "Just now" : "এইমাত্র",
        views: language === "en" ? "0 views" : "০ ভিউ",
        createdAt: new Date().toISOString()
      });

      setNewsTitle("");
      setNewsTitleBn("");
      setNewsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setNewsLoading(false);
    }
  };

  if (!user || !isAuthorized) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white dark:bg-[#01205B] border rounded-2xl shadow-sm text-center py-10 space-y-4">
        <ShieldAlert className="w-10 h-10 text-red-500 mx-auto animate-bounce" />
        <h2 className="text-base font-black text-slate-905 dark:text-white">Editor Access Required</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          This dashboard panel is restricted to verified news editors.
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
        <span className="text-slate-805 dark:text-white font-extrabold">News Editor Dashboard</span>
      </div>

      <div className="glass-card bg-white dark:bg-[#01205B] border p-6 rounded-2xl shadow-sm space-y-4 max-w-lg mx-auto">
        <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b pb-3">
          <Award className="w-5 h-5 text-blue-500" />
          <span>Publish Editorial News</span>
        </h3>

        {newsSuccess && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border rounded-lg text-[10.5px] font-bold">
            News published successfully!
          </div>
        )}

        <form onSubmit={handleAddNews} className="space-y-4">
          <div>
            <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">News Title (English)</label>
            <input 
              type="text" 
              required
              value={newsTitle}
              onChange={(e) => setNewsTitle(e.target.value)}
              placeholder="e.g. Ward cleanliness drive schedule"
              className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none"
            />
          </div>
          <div>
            <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">News Title (Bangla)</label>
            <input 
              type="text" 
              required
              value={newsTitleBn}
              onChange={(e) => setNewsTitleBn(e.target.value)}
              placeholder="উদাঃ ওয়ার্ড পরিচ্ছন্নতা কার্যক্রমের বিস্তারিত"
              className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none"
            />
          </div>
          <button 
            type="submit"
            disabled={newsLoading}
            className="px-4 py-2 bg-[#0CA671] text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95"
          >
            {newsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>Publish News</span>
          </button>
        </form>
      </div>

    </div>
  );
}
