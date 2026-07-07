"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import {
  Users, Eye, Activity, AlertTriangle, ShieldAlert, FileText, FileWarning,
  Droplet, Briefcase, Home, Calendar, TrendingUp, ArrowUpRight,
  CheckCircle, Clock, Plus, RefreshCw, Flame, Search, ShoppingBag
} from "lucide-react";

export default function DashboardHome() {
  const { language, user, userData } = useAppContext();
  const router = useRouter();
  const en = language === "en";

  const [citizensCount, setCitizensCount] = useState(0);
  const [openComplaints, setOpenComplaints] = useState(0);
  const [resolvedComplaints, setResolvedComplaints] = useState(0);
  const [sosAlerts, setSosAlerts] = useState(0);
  const [newsCount, setNewsCount] = useState(0);
  const [noticesCount, setNoticesCount] = useState(0);
  const [bloodCount, setBloodCount] = useState(0);
  const [rentalsCount, setRentalsCount] = useState(0);
  const [jobsCount, setJobsCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [lostFoundCount, setLostFoundCount] = useState(0);
  const [marketplaceCount, setMarketplaceCount] = useState(0);
  const [recentComplaints, setRecentComplaints] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const unsubs: (() => void)[] = [];

    unsubs.push(onSnapshot(collection(db, "users"), (snap) => {
      let c = 0;
      snap.forEach(d => { if (d.data().role === "citizen") c++; });
      setCitizensCount(c);
    }));

    unsubs.push(onSnapshot(collection(db, "civic_reports"), (snap) => {
      let open = 0, resolved = 0, sos = 0;
      snap.forEach(d => {
        const data = d.data();
        if (data.category?.toLowerCase() === "emergency") sos++;
        if (data.status === "resolved") resolved++; else open++;
      });
      setOpenComplaints(open);
      setResolvedComplaints(resolved);
      setSosAlerts(sos);
    }));

    unsubs.push(onSnapshot(collection(db, "notices"), (snap) => setNoticesCount(snap.size)));
    unsubs.push(onSnapshot(collection(db, "news"), (snap) => setNewsCount(snap.size)));
    unsubs.push(onSnapshot(collection(db, "blood_donors"), (snap) => setBloodCount(snap.size)));
    unsubs.push(onSnapshot(collection(db, "listings"), (snap) => setRentalsCount(snap.size)));
    unsubs.push(onSnapshot(collection(db, "jobs"), (snap) => setJobsCount(snap.size)));
    unsubs.push(onSnapshot(collection(db, "events"), (snap) => setEventsCount(snap.size)));
    unsubs.push(onSnapshot(collection(db, "lost_found"), (snap) => setLostFoundCount(snap.size)));
    unsubs.push(onSnapshot(collection(db, "marketplace_items"), (snap) => setMarketplaceCount(snap.size)));

    // Recent complaints (live feed)
    const qComplaints = query(collection(db, "civic_reports"), orderBy("createdAt", "desc"), limit(5));
    unsubs.push(onSnapshot(qComplaints, (snap) => {
      setRecentComplaints(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }));

    // Recent users
    const qUsers = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(5));
    unsubs.push(onSnapshot(qUsers, (snap) => {
      setRecentUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }));

    return () => unsubs.forEach(u => u());
  }, []);

  const kpis = [
    { label: en ? "Registered Citizens" : "নিবন্ধিত নাগরিক", value: citizensCount, icon: Users, color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/20", change: "+2.1%", tab: "users_citizens" },
    { label: en ? "Open Complaints" : "চলতি অভিযোগ", value: openComplaints, icon: AlertTriangle, color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20", change: "Pending", tab: "complaints" },
    { label: en ? "Resolved" : "নিষ্পত্তিকৃত", value: resolvedComplaints, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20", change: "+18%", tab: "complaints" },
    { label: en ? "SOS Alerts" : "জরুরি সংকেত", value: sosAlerts, icon: Flame, color: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/20", change: "Live", tab: "sos" },
  ];

  const modules = [
    { label: en ? "News" : "সংবাদ", value: newsCount, icon: FileText, color: "text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-950/20", tab: "news" },
    { label: en ? "Notices" : "নোটিশ", value: noticesCount, icon: FileWarning, color: "text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/20", tab: "notices" },
    { label: en ? "Blood Donors" : "রক্তদাতা", value: bloodCount, icon: Droplet, color: "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/20", tab: "donors" },
    { label: en ? "Rentals" : "বাসা ভাড়া", value: rentalsCount, icon: Home, color: "text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-950/20", tab: "rentals" },
    { label: en ? "Jobs" : "চাকরি", value: jobsCount, icon: Briefcase, color: "text-pink-600 bg-pink-50 dark:text-pink-400 dark:bg-pink-950/20", tab: "jobs" },
    { label: en ? "Events" : "ইভেন্ট", value: eventsCount, icon: Calendar, color: "text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/20", tab: "events" },
    { label: en ? "Lost & Found" : "হারানো", value: lostFoundCount, icon: Search, color: "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950/20", tab: "lostfound" },
    { label: en ? "Marketplace" : "মার্কেটপ্লেস", value: marketplaceCount, icon: ShoppingBag, color: "text-cyan-600 bg-cyan-50 dark:text-cyan-400 dark:bg-cyan-950/20", tab: "marketplace" },
  ];

  const quickActions = [
    { label: en ? "Publish News" : "সংবাদ প্রকাশ", tab: "news", icon: FileText, color: "bg-sky-600 hover:bg-sky-700" },
    { label: en ? "Post Notice" : "নোটিশ প্রকাশ", tab: "notices", icon: FileWarning, color: "bg-indigo-600 hover:bg-indigo-700" },
    { label: en ? "Manage Users" : "ব্যবহারকারী", tab: "users_citizens", icon: Users, color: "bg-blue-600 hover:bg-blue-700" },
    { label: en ? "View SOS" : "SOS দেখুন", tab: "sos", icon: Flame, color: "bg-red-600 hover:bg-red-700" },
  ];

  const getStatusBadge = (status: string) => {
    if (status === "resolved") return <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/20">Resolved</span>;
    if (status === "in_progress") return <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/20">In Progress</span>;
    return <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900/20">Pending</span>;
  };

  const adminName = (userData as any)?.displayName || user?.displayName || user?.email?.split("@")[0] || "Admin";
  const hour = currentTime.getHours();
  const greeting = hour < 12 ? (en ? "Good Morning" : "শুভ সকাল") : hour < 17 ? (en ? "Good Afternoon" : "শুভ বিকাল") : (en ? "Good Evening" : "শুভ সন্ধ্যা");

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-[#0CA671] dark:to-emerald-700 rounded-2xl text-white shadow-lg">
        <div>
          <p className="text-xs font-bold opacity-80">{greeting},</p>
          <h2 className="text-lg font-black tracking-tight mt-0.5">{adminName}</h2>
          <p className="text-[10px] opacity-70 mt-1 font-mono">
            {currentTime.toLocaleDateString(en ? "en-US" : "bn-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            {" · "}
            {currentTime.toLocaleTimeString(en ? "en-US" : "bn-BD", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {quickActions.map((qa, i) => {
            const Icon = qa.icon;
            return (
              <button
                key={i}
                onClick={() => router.push(`/admin?tab=${qa.tab}`)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10.5px] font-bold text-white transition-all active:scale-95 shadow-sm bg-white/20 hover:bg-white/30`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{qa.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <button
              key={i}
              onClick={() => router.push(`/admin?tab=${kpi.tab}`)}
              className="p-4 bg-white dark:bg-[#0F1420] border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all text-left group"
            >
              <div className="flex items-start justify-between">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${kpi.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900 dark:text-white block">{kpi.value.toLocaleString()}</span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mt-0.5">{kpi.label}</span>
              </div>
              <span className={`text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-full inline-block mt-2 ${
                kpi.change.startsWith("+") ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20" :
                kpi.change === "Live" ? "text-red-600 bg-red-50 dark:bg-red-950/20 animate-pulse" :
                "text-blue-600 bg-blue-50 dark:bg-blue-950/20"
              }`}>
                {kpi.change}
              </span>
            </button>
          );
        })}
      </div>

      {/* Module Grid */}
      <div>
        <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
          {en ? "All Modules" : "সকল মডিউল"}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {modules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <button
                key={i}
                onClick={() => router.push(`/admin?tab=${mod.tab}`)}
                className="flex flex-col items-center p-3 bg-white dark:bg-[#0F1420] border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all active:scale-95 group"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${mod.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <span className="text-lg font-black text-slate-900 dark:text-white">{mod.value}</span>
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 text-center leading-tight">{mod.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom: Recent Activity + Recent Users */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Recent Complaints */}
        <div className="bg-white dark:bg-[#0F1420] border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/40">
            <h4 className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              {en ? "Recent Complaints" : "সাম্প্রতিক অভিযোগ"}
            </h4>
            <button
              onClick={() => router.push("/admin?tab=complaints")}
              className="text-[9.5px] font-bold text-blue-500 hover:underline flex items-center gap-0.5"
            >
              {en ? "View all" : "সব দেখুন"} <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/40">
            {recentComplaints.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-8">{en ? "No complaints yet." : "কোনো অভিযোগ নেই।"}</p>
            ) : recentComplaints.map((c) => (
              <div key={c.id} className="flex items-start justify-between px-5 py-3 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{c.title || "Untitled"}</p>
                  <p className="text-[9.5px] text-slate-400 mt-0.5 font-mono">
                    {c.createdAt ? new Date(c.createdAt).toLocaleString() : "—"}
                    {c.userName ? ` · ${c.userName}` : ""}
                  </p>
                </div>
                <div className="ml-3 shrink-0">{getStatusBadge(c.status || "pending")}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="bg-white dark:bg-[#0F1420] border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/40">
            <h4 className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {en ? "Recent Registrations" : "সাম্প্রতিক নিবন্ধন"}
            </h4>
            <button
              onClick={() => router.push("/admin?tab=users_citizens")}
              className="text-[9.5px] font-bold text-blue-500 hover:underline flex items-center gap-0.5"
            >
              {en ? "View all" : "সব দেখুন"} <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/40">
            {recentUsers.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-8">{en ? "No users yet." : "কোনো ব্যবহারকারী নেই।"}</p>
            ) : recentUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                <div className="w-7 h-7 rounded-full bg-blue-600 dark:bg-[#0CA671] text-white flex items-center justify-center text-[10px] font-black uppercase shrink-0">
                  {(u.displayName || u.email || "?").charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{u.displayName || u.email?.split("@")[0] || "Unknown"}</p>
                  <p className="text-[9.5px] text-slate-400 font-mono">{u.email || "—"}</p>
                </div>
                <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-500 border dark:border-slate-800 shrink-0">
                  {u.role || "citizen"}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
