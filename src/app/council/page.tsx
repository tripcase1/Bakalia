"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronRight, Users, Bell, Send, AlertCircle, Loader2, CheckCircle2, Clock, Trash2,
  FileText, Shield, Eye, ShieldAlert, BarChart3, HelpCircle, MapPin
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, addDoc } from "firebase/firestore";

export default function CouncilDashboardPage() {
  const { 
    user, role, theme, language, t
  } = useAppContext();

  // Tab: "overview" | "complaints" | "announcements" | "stats"
  const [activeTab, setActiveTab] = useState<"overview" | "complaints" | "announcements" | "stats">("overview");

  // Dynamic statistics
  const [roadIssues, setRoadIssues] = useState<any[]>([]);
  const [drainageIssues, setDrainageIssues] = useState<any[]>([]);
  const [wasteIssues, setWasteIssues] = useState<any[]>([]);
  const [lightIssues, setLightIssues] = useState<any[]>([]);
  const [wardComplaints, setWardComplaints] = useState<any[]>([]);

  // Councilor announcements state
  const [annTitle, setAnnTitle] = useState("");
  const [annDesc, setAnnDesc] = useState("");
  const [annLoading, setAnnLoading] = useState(false);
  const [annSuccess, setAnnSuccess] = useState(false);

  const isAuthorized = role === "councilor" || role === "super_admin";

  // Load ward complaints
  useEffect(() => {
    if (!isAuthorized) return;
    const q = collection(db, "civic_reports");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      const roads: any[] = [];
      const drains: any[] = [];
      const waste: any[] = [];
      const lights: any[] = [];

      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        const item = { id: docSnap.id, ...data };
        items.push(item);
        
        // Categorize issues
        if (data.category === "Roads" || data.category === "সড়ক") roads.push(item);
        else if (data.category === "Drainage" || data.category === "ড্রেনেজ") drains.push(item);
        else if (data.category === "Waste Management" || data.category === "আবর্জনা") waste.push(item);
        else if (data.category === "Street Lights" || data.category === "ল্যাম্পপোস্ট") lights.push(item);
      });

      setWardComplaints(items);
      setRoadIssues(roads);
      setDrainageIssues(drains);
      setWasteIssues(waste);
      setLightIssues(lights);
    });
    return () => unsubscribe();
  }, [isAuthorized]);

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnnLoading(true);
    setAnnSuccess(false);

    try {
      await addDoc(collection(db, "notices"), {
        title: "[Councilor Announcement] " + annTitle,
        description: annDesc,
        createdAt: new Date().toISOString()
      });
      setAnnTitle("");
      setAnnDesc("");
      setAnnSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setAnnLoading(false);
    }
  };

  if (!user || !isAuthorized) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white dark:bg-[#01205B] border rounded-2xl shadow-sm text-center py-10 space-y-4">
        <ShieldAlert className="w-10 h-10 text-red-500 mx-auto animate-bounce" />
        <h2 className="text-base font-black text-slate-905 dark:text-white">Councilor Access Only</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          This dashboard panel is restricted to verified Ward Councilors or council staff.
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
        <span className="text-slate-805 dark:text-white font-extrabold">Ward Council Dashboard</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Sidebar navigation */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card bg-white dark:bg-[#01205B] border p-4 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center gap-3 p-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-[#4A89DA] flex items-center justify-center font-black">
                <Users className="w-5.5 h-5.5" />
              </div>
              <div className="leading-tight">
                <span className="block text-xs font-black text-slate-850 dark:text-white">Ward Councilor</span>
                <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Operations Console</span>
              </div>
            </div>

            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "complaints", label: "Citizen Reports", icon: FileText, badge: wardComplaints.length },
              { id: "announcements", label: "Publish Notices", icon: Bell },
              { id: "stats", label: "Ward Statistics", icon: Eye }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-blue-600 dark:bg-[#0CA671] text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-355 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${activeTab === tab.id ? "bg-white text-slate-900" : "bg-slate-100 dark:bg-[#04142F] text-slate-500"}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Tab Contents Panel */}
        <div className="lg:col-span-9">
          
          {/* Tab 1: Overview stats */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">Ward Issues Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                  { label: "Road Problems", value: roadIssues.length, color: "text-blue-500" },
                  { label: "Drainage clogging", value: drainageIssues.length, color: "text-emerald-500" },
                  { label: "Waste Management", value: wasteIssues.length, color: "text-amber-500" },
                  { label: "Street Lights", value: lightIssues.length, color: "text-red-500" }
                ].map((stat, idx) => (
                  <div key={idx} className="p-4 bg-white dark:bg-[#01205B] border rounded-xl shadow-sm">
                    <span className="block text-[9.5px] text-slate-400 uppercase font-black">{stat.label}</span>
                    <span className={`block text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Citizen Reports */}
          {activeTab === "complaints" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">Ward Citizen Reports</h3>
              {wardComplaints.length === 0 ? (
                <p className="p-8 text-center bg-white dark:bg-[#01205B] border rounded-xl text-xs text-slate-400">No issues registered in your ward.</p>
              ) : (
                <div className="space-y-3">
                  {wardComplaints.map(rep => (
                    <div key={rep.id} className="p-4 bg-white dark:bg-[#01205B] border rounded-xl shadow-sm space-y-2">
                      <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold">
                        <span className="uppercase px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-900">{rep.category}</span>
                        <span>{new Date(rep.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-xs font-black text-slate-800 dark:text-white leading-snug">{rep.title}</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">{rep.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Announcements Form */}
          {activeTab === "announcements" && (
            <div className="glass-card bg-white dark:bg-[#01205B] border p-6 rounded-2xl shadow-sm space-y-4 animate-in fade-in duration-200">
              <h3 className="text-base font-black text-slate-905 dark:text-white border-b pb-3">Publish Ward Councilor Notice</h3>
              {annSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border rounded-lg text-[10.5px] font-bold">
                  Announcement posted successfully!
                </div>
              )}
              <form onSubmit={handlePostAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Notice Title</label>
                  <input 
                    type="text" 
                    required
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="e.g. Ward cleanliness drive schedule"
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Notice Context</label>
                  <textarea 
                    required
                    rows={3}
                    value={annDesc}
                    onChange={(e) => setAnnDesc(e.target.value)}
                    placeholder="Provide details..."
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none resize-none"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={annLoading}
                  className="px-4 py-2 bg-blue-600 dark:bg-[#0CA671] text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95"
                >
                  {annLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Post Notice</span>
                </button>
              </form>
            </div>
          )}

          {/* Tab 4: Ward Statistics */}
          {activeTab === "stats" && (
            <div className="glass-card bg-white dark:bg-[#01205B] border p-6 rounded-2xl shadow-sm py-12 text-center text-xs text-slate-455 animate-in fade-in duration-200">
              <BarChart3 className="w-8 h-8 mx-auto text-slate-350 mb-2 animate-bounce" />
              <h4 className="font-black text-slate-700 dark:text-slate-200">Ward Development Index</h4>
              <p className="mt-1">Track civic development indices, garbage cleanups, and maintenance schedules.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
