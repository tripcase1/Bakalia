"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronRight, Users, Bell, Send, AlertCircle, Loader2, CheckCircle2, Clock, Trash2,
  FileText, Shield, Eye, ShieldAlert, BarChart3, HelpCircle, Heart, Star, Sparkles, Calendar
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, limit, updateDoc, doc } from "firebase/firestore";

export default function VolunteerDashboardPage() {
  const { 
    user, role, theme, language, t
  } = useAppContext();

  // Tab: "tasks" | "blood" | "support" | "events" | "leaderboard"
  const [activeTab, setActiveTab] = useState<"tasks" | "blood" | "support" | "events" | "leaderboard">("tasks");

  // State lists
  const [bloodRequests, setBloodRequests] = useState<any[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  const isAuthorized = role === "volunteer" || role === "super_admin";

  // Load blood donors list as requests fallback
  useEffect(() => {
    if (!isAuthorized) return;
    const q = collection(db, "blood_donors");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setBloodRequests(items);
    });
    return () => unsubscribe();
  }, [isAuthorized]);

  // Load community events
  useEffect(() => {
    if (!isAuthorized) return;
    const q = collection(db, "events");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setEvents(items);
    });
    return () => unsubscribe();
  }, [isAuthorized]);

  if (!user || !isAuthorized) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white dark:bg-[#01205B] border rounded-2xl shadow-sm text-center py-10 space-y-4">
        <ShieldAlert className="w-10 h-10 text-red-500 mx-auto animate-bounce" />
        <h2 className="text-base font-black text-slate-905 dark:text-white">Volunteer Access Only</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          This dashboard panel is restricted to verified community volunteers.
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
        <span className="text-slate-800 dark:text-white font-extrabold">Volunteer Dashboard</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Sidebar menu tabs */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card bg-white dark:bg-[#01205B] border p-4 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center gap-3 p-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-[#0CA671] flex items-center justify-center font-black">
                <Sparkles className="w-5.5 h-5.5 text-emerald-500" />
              </div>
              <div className="leading-tight">
                <span className="block text-xs font-black text-slate-850 dark:text-white">Active Volunteer</span>
                <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Dashboard Panel</span>
              </div>
            </div>

            {[
              { id: "tasks", label: "Assigned Tasks", icon: CheckCircle2 },
              { id: "blood", label: "Blood Requests", icon: Heart, badge: bloodRequests.length },
              { id: "support", label: "Emergency Support", icon: ShieldAlert },
              { id: "events", label: "Events & Campaigns", icon: Calendar, badge: events.length },
              { id: "leaderboard", label: "Leaderboard Points", icon: Star }
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
          
          {/* Tab 1: Assigned Tasks */}
          {activeTab === "tasks" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">Assigned Tasks</h3>
              <div className="p-6 bg-white dark:bg-[#01205B] border rounded-xl text-xs text-slate-400 text-center py-12 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No community development tasks currently assigned to you.</p>
              </div>
            </div>
          )}

          {/* Tab 2: Blood Requests */}
          {activeTab === "blood" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">Blood Requests Directory</h3>
              
              {bloodRequests.length === 0 ? (
                <p className="p-8 text-center bg-white dark:bg-[#01205B] border rounded-xl text-xs text-slate-400">No blood alerts registered.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {bloodRequests.map(don => (
                    <div key={don.id} className="p-4 bg-white dark:bg-[#01205B] border rounded-xl shadow-sm space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black text-slate-800 dark:text-white">{don.name}</h4>
                        <span className="text-[10px] font-mono font-black text-rose-500 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded border border-rose-100">
                          {don.bloodGroup}
                        </span>
                      </div>
                      <p className="text-[9.5px] text-slate-500 font-semibold leading-relaxed">
                        Location: {don.location || "Ward 17, Bakalia"} | Phone: {don.phone}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Emergency Support */}
          {activeTab === "support" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">SOS Emergency Support Requests</h3>
              <div className="p-6 bg-white dark:bg-[#01205B] border rounded-xl text-xs text-slate-400 text-center py-12 space-y-2">
                <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No active SOS alerts signals from nearby citizens.</p>
              </div>
            </div>
          )}

          {/* Tab 4: Events & Campaigns */}
          {activeTab === "events" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">Community Cleaning & Events Campaigns</h3>
              
              {events.length === 0 ? (
                <p className="p-8 text-center bg-white dark:bg-[#01205B] border rounded-xl text-xs text-slate-450">No events scheduled.</p>
              ) : (
                <div className="space-y-3">
                  {events.map(ev => (
                    <div key={ev.id} className="p-4 bg-white dark:bg-[#01205B] border rounded-xl shadow-sm">
                      <span className="block text-[8.5px] text-slate-400 font-mono">{new Date(ev.date || ev.createdAt || 0).toLocaleDateString()}</span>
                      <h4 className="text-xs font-black text-slate-850 dark:text-white mt-1">{ev.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-semibold">{ev.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Volunteering Leaderboard */}
          {activeTab === "leaderboard" && (
            <div className="glass-card bg-white dark:bg-[#01205B] border p-6 rounded-2xl shadow-sm space-y-4 animate-in fade-in duration-200">
              <h3 className="text-base font-black text-slate-900 dark:text-white border-b pb-3">Volunteering Points Leaderboard</h3>
              
              <div className="space-y-3 text-xs">
                {[
                  { rank: 1, name: "Abdullah Al Mamun", points: 420 },
                  { rank: 2, name: "Tanvir Rahman", points: 380 },
                  { rank: 3, name: "Niaz Ahmed", points: 350 }
                ].map((vol) => (
                  <div key={vol.rank} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-[#010818] rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-slate-400"># {vol.rank}</span>
                      <span className="font-black text-slate-850 dark:text-white">{vol.name}</span>
                    </div>
                    <span className="font-black text-[#0CA671]">{vol.points} Points</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
