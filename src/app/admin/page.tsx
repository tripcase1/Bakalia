"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronRight, Settings, Users, Plus, Loader2, AlertCircle, Trash2, Edit2, ShieldAlert, Award,
  BarChart3, FileText, CheckCircle2, Shield, Bell, Lock
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, updateDoc, doc, addDoc } from "firebase/firestore";

export default function AdminDashboardPage() {
  const { 
    user, role, theme, language, t,
    setAuthMode, setShowAuthModal
  } = useAppContext();

  // Dashboard tab: "users" | "news" | "analytics" | "logs"
  const [activeTab, setActiveTab] = useState<"users" | "news" | "analytics" | "logs">("users");

  // News states
  const [newsTitle, setNewsTitle] = useState("");
  const [newsTitleBn, setNewsTitleBn] = useState("");
  const [newsCategory, setNewsCategory] = useState("Official Update");
  const [newsCategoryBn, setNewsCategoryBn] = useState("সরকারি নোটিশ");
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsSuccess, setNewsSuccess] = useState(false);

  // User management states
  const [users, setUsers] = useState<any[]>([]);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Stats
  const [complaintsCount, setComplaintsCount] = useState(0);
  const [rentalsCount, setRentalsCount] = useState(0);
  const [donorsCount, setDonorsCount] = useState(0);

  const isAuthorized = role === "super_admin";

  // Enforce Admin 2FA verification check
  useEffect(() => {
    if (user?.email === "almabruk786@gmail.com") {
      const verified = sessionStorage.getItem("admin_2fa_verified");
      if (verified !== "true") {
        window.location.href = "/login";
      }
    }
  }, [user]);

  // Load registered users from `/users`
  useEffect(() => {
    if (!isAuthorized) return;
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const items: any[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setUsers(items);
    });
    return () => unsubscribe();
  }, [isAuthorized]);

  // Load stats counts
  useEffect(() => {
    if (!isAuthorized) return;
    const unsubComplaints = onSnapshot(collection(db, "civic_reports"), snap => setComplaintsCount(snap.size));
    const unsubRentals = onSnapshot(collection(db, "listings"), snap => setRentalsCount(snap.size));
    const unsubDonors = onSnapshot(collection(db, "blood_donors"), snap => setDonorsCount(snap.size));

    return () => {
      unsubComplaints();
      unsubRentals();
      unsubDonors();
    };
  }, [isAuthorized]);

  // Promote user role
  const handleUpdateRole = async (targetUserId: string, newRole: string) => {
    setUpdatingUserId(targetUserId);
    try {
      const docRef = doc(db, "users", targetUserId);
      await updateDoc(docRef, { role: newRole });
    } catch (err) {
      console.error("Failed to promote user role:", err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Add dynamic official news item
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
      console.error("Failed to add news doc:", err);
    } finally {
      setNewsLoading(false);
    }
  };

  if (!user || !isAuthorized) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white dark:bg-[#01205B] border rounded-2xl shadow-sm text-center py-10 space-y-4">
        <ShieldAlert className="w-10 h-10 text-red-500 mx-auto animate-pulse" />
        <h2 className="text-base font-black text-slate-905 dark:text-white">Admin Access Only</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          This dashboard panel is restricted to verified system portal administrators.
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
        <span className="text-slate-800 dark:text-white font-extrabold">System Admin Panel</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Sidebar menu tabs */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card bg-white dark:bg-[#01205B] border p-4 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center gap-3 p-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-[#4A89DA] flex items-center justify-center font-black">
                <Shield className="w-5.5 h-5.5" />
              </div>
              <div className="leading-tight min-w-0">
                <span className="block text-xs font-black text-slate-850 dark:text-white truncate">Super Admin</span>
                <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Console Panel</span>
              </div>
            </div>

            {[
              { id: "users", label: "Registered Users", icon: Users },
              { id: "news", label: "Publish News / CMS", icon: Award },
              { id: "analytics", label: "System Analytics", icon: BarChart3 },
              { id: "logs", label: "Audit Logs", icon: FileText }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-blue-600 dark:bg-[#0CA671] text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-355 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Tab Contents Panel */}
        <div className="lg:col-span-9">
          
          {/* Tab 1: Users Role Console */}
          {activeTab === "users" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Manage Portal User Access Control ({users.length})</h3>
              
              <div className="space-y-3">
                {users.map(u => (
                  <div key={u.id} className="p-4 bg-white dark:bg-[#01205B] border rounded-xl shadow-sm flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-black text-slate-850 dark:text-slate-100">{u.displayName || "Anonymous User"}</h4>
                      <span className="block text-[9.5px] text-slate-400 font-mono mt-0.5">{u.email}</span>
                      <span className="inline-block text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-[#4A89DA] uppercase mt-2">
                        Current Role: {u.role || "citizen"}
                      </span>
                    </div>

                    <div>
                      <select
                        value={u.role || "citizen"}
                        disabled={updatingUserId === u.id}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                        className="px-2 py-1.5 rounded bg-slate-50 dark:bg-[#010818] border text-[10px] font-bold outline-none text-slate-805 dark:text-white"
                      >
                        <option value="citizen">Citizen</option>
                        <option value="super_admin">Super Admin</option>
                        <option value="police_admin">Police Admin</option>
                        <option value="councilor">Ward Councilor</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="mosque_admin">Mosque Admin</option>
                        <option value="business_admin">Verified Business</option>
                        <option value="moderator">Moderator</option>
                        <option value="editor">News Editor</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: CMS News publisher */}
          {activeTab === "news" && (
            <div className="glass-card bg-white dark:bg-[#01205B] border p-6 rounded-2xl shadow-sm space-y-4 animate-in fade-in duration-200">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Publish Official News to Live Homepage</h3>
              
              {newsSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border rounded-lg text-[10.5px] font-bold">
                  News successfully published!
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
                    placeholder="e.g. Cleanliness Campaign details"
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Category (EN)</label>
                    <input 
                      type="text" 
                      required
                      value={newsCategory}
                      onChange={(e) => setNewsCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Category (BN)</label>
                    <input 
                      type="text" 
                      required
                      value={newsCategoryBn}
                      onChange={(e) => setNewsCategoryBn(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={newsLoading}
                  className="px-5 py-2.5 bg-blue-600 dark:bg-[#0CA671] text-white rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                >
                  {newsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Publish News</span>
                </button>
              </form>
            </div>
          )}

          {/* Tab 3: Analytics */}
          {activeTab === "analytics" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">System Dashboard Analytics</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Total Complaints", value: complaintsCount, desc: "Filed by citizens" },
                  { label: "Total Rentals", value: rentalsCount, desc: "Properties advertisements" },
                  { label: "Blood Volunteers", value: donorsCount, desc: "Active donors list" }
                ].map((stat, idx) => (
                  <div key={idx} className="p-4 bg-white dark:bg-[#01205B] border rounded-xl shadow-sm">
                    <span className="block text-[9.5px] text-slate-400 uppercase font-bold tracking-wider">{stat.label}</span>
                    <span className="block text-2xl font-black text-slate-805 dark:text-white mt-1">{stat.value}</span>
                    <span className="text-[9px] text-slate-400 mt-1 block">{stat.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Audit Logs */}
          {activeTab === "logs" && (
            <div className="glass-card bg-white dark:bg-[#01205B] border p-6 rounded-2xl shadow-sm space-y-4 animate-in fade-in duration-200">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Admin System Audit Logs</h3>
              <div className="space-y-3 font-mono text-[9px] text-slate-500 leading-relaxed">
                <div>[2026-07-03 16:32:05] super_admin promoted user (uid: ...561d0) to volunteer</div>
                <div>[2026-07-03 16:34:11] news_editor published Eid timings notice</div>
                <div>[2026-07-03 16:45:00] system clean-up task commenced successfully</div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
