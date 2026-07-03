"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronRight, Calendar, Bell, Info, MapPin, Phone, Clock, Plus, Loader2, AlertCircle, Shield,
  CheckCircle2, DollarSign, Award
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, limit } from "firebase/firestore";

// Custom Mosque SVG Icon
const MosqueIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M12 2v3M12 5c-2.5 0-4.5 2-4.5 4.5V19h9V9.5C16.5 7 14.5 5 12 5z" />
    <path d="M3 21h18M6 19v-5c0-1.5 1-2.5 1.5-2.5s1.5 1 1.5 2.5v5M15 19v-5c0-1.5 1-2.5 1.5-2.5s1.5 1 1.5 2.5v5" />
    <path d="M12 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
  </svg>
);

export default function MosquePage() {
  const { 
    user, role, theme, language, t,
    setAuthMode, setShowAuthModal
  } = useAppContext();

  // Admin view toggle (if user is mosque_admin/super_admin)
  const isMosqueAdmin = role === "mosque_admin" || role === "super_admin";
  const [isAdminView, setIsAdminView] = useState(false);

  // Admin states
  const [activeAdminTab, setActiveAdminTab] = useState<"announcements" | "timings" | "donations" | "ramadan">("announcements");

  // Form states (Announcements)
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [mosqueName, setMosqueName] = useState("West Bakalia Jame Masjid");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Timing states
  const [timingFajr, setTimingFajr] = useState("4:30 AM");
  const [timingDhuhr, setTimingDhuhr] = useState("1:30 PM");
  const [timingAsr, setTimingAsr] = useState("5:00 PM");
  const [timingMaghrib, setTimingMaghrib] = useState("6:55 PM");
  const [timingIsha, setTimingIsha] = useState("8:30 PM");
  const [timingJumuah, setTimingJumuah] = useState("1:30 PM");
  const [timingSuccess, setTimingSuccess] = useState(false);

  // Donation form states
  const [donationGoal, setDonationGoal] = useState("50,000");
  const [donationRaised, setDonationRaised] = useState("35,000");
  const [donationSuccess, setDonationSuccess] = useState(false);

  // Directory lists
  const [announcements, setAnnouncements] = useState<any[]>([]);

  // Load announcements from Firestore `/mosque_announcements`
  useEffect(() => {
    const q = collection(db, "mosque_announcements");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: any[] = [];
      snapshot.forEach(docSnap => {
        docs.push({ id: docSnap.id, ...docSnap.data() });
      });
      docs.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setAnnouncements(docs);
    });
    return () => unsubscribe();
  }, []);

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setErrorMsg("");
    setSuccess(false);

    try {
      await addDoc(collection(db, "mosque_announcements"), {
        title,
        details,
        mosqueName,
        userId: user.uid,
        userName: user.displayName || user.email || "Citizen",
        createdAt: new Date().toISOString()
      });

      setTitle("");
      setDetails("");
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to post announcement.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTimings = (e: React.FormEvent) => {
    e.preventDefault();
    setTimingSuccess(true);
    setTimeout(() => setTimingSuccess(false), 3000);
  };

  const handleUpdateDonations = (e: React.FormEvent) => {
    e.preventDefault();
    setDonationSuccess(true);
    setTimeout(() => setDonationSuccess(false), 3000);
  };

  const mosquesList = [
    {
      name: language === "en" ? "West Bakalia Jame Masjid" : "পশ্চিম বাকলিয়া জামে মসজিদ",
      location: language === "en" ? "Ward 17, Bakalia" : "১৭ নং ওয়ার্ড, বাকলিয়া",
      phone: "+880-1812-112233",
      jamaatTimes: { Fajr: timingFajr, Dhuhr: timingDhuhr, Asr: timingAsr, Maghrib: timingMaghrib, Isha: timingIsha, Jumuah: timingJumuah }
    },
    {
      name: language === "en" ? "Baitul Mamur Jame Masjid" : "বাইতুল মামুর জামে মসজিদ",
      location: language === "en" ? "Ward 18, East Bakalia" : "১৮ নং ওয়ার্ড, পূর্ব বাকলিয়া",
      phone: "+880-1711-445566",
      jamaatTimes: { Fajr: "4:30 AM", Dhuhr: "1:30 PM", Asr: "5:00 PM", Maghrib: "6:55 PM", Isha: "8:30 PM", Jumuah: "1:30 PM" }
    },
    {
      name: language === "en" ? "Shah Amanat Jame Mosque" : "শাহ আমানত জামে মসজিদ",
      location: language === "en" ? "Ward 19, South Bakalia" : "১৯ নং ওয়ার্ড, দক্ষিণ বাকলিয়া",
      phone: "+880-1915-778899",
      jamaatTimes: { Fajr: "4:35 AM", Dhuhr: "1:30 PM", Asr: "5:05 PM", Maghrib: "7:00 PM", Isha: "8:35 PM", Jumuah: "1:30 PM" }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-wider justify-between">
        <div className="flex items-center gap-1.5">
          <a href="/" className="hover:text-slate-700 dark:hover:text-slate-350 transition-colors">{t("home")}</a>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 dark:text-white font-extrabold">{t("mosque")}</span>
        </div>

        {isMosqueAdmin && (
          <button
            onClick={() => setIsAdminView(!isAdminView)}
            className="px-3 py-1 rounded bg-blue-50 dark:bg-emerald-500/10 text-blue-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider"
          >
            {isAdminView ? "Switch to Public View" : "Open Admin Dashboard"}
          </button>
        )}
      </div>

      {isAdminView ? (
        /* Mosque Admin Dashboard View */
        <div className="grid lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
          
          {/* Admin Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <div className="glass-card bg-white dark:bg-[#01205B] border p-4 rounded-2xl shadow-sm space-y-2">
              <div className="flex items-center gap-3 p-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-[#0CA671] flex items-center justify-center font-black">
                  <MosqueIcon className="w-5.5 h-5.5" />
                </div>
                <div className="leading-tight">
                  <span className="block text-xs font-black text-slate-850 dark:text-white">Mosque Admin</span>
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Dashboard</span>
                </div>
              </div>

              {[
                { id: "announcements", label: "Janaza / Notices", icon: Bell },
                { id: "timings", label: "Prayer Times Updates", icon: Clock },
                { id: "donations", label: "Donation Goals", icon: DollarSign },
                { id: "ramadan", label: "Ramadan Calendars", icon: Calendar }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveAdminTab(tab.id as any)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      activeAdminTab === tab.id
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

          {/* Admin Panel contents */}
          <div className="lg:col-span-9">
            
            {activeAdminTab === "announcements" && (
              <div className="glass-card bg-white dark:bg-[#01205B] border p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-base font-black text-slate-900 dark:text-white border-b pb-3">Publish Janaza / Islamic Notice</h3>
                {success && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border rounded-lg text-[10.5px] font-bold">
                    Notice published to citizens feed successfully!
                  </div>
                )}
                <form onSubmit={handlePostAnnouncement} className="space-y-4">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Notice Title</label>
                    <input 
                      type="text" 
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Eid congregations timings"
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Notice Details</label>
                    <textarea 
                      required
                      rows={3}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Notice details context..."
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none resize-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-blue-600 dark:bg-[#0CA671] text-white rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
                  >
                    Publish Announcement
                  </button>
                </form>
              </div>
            )}

            {activeAdminTab === "timings" && (
              <div className="glass-card bg-white dark:bg-[#01205B] border p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-base font-black text-slate-900 dark:text-white border-b pb-3">Update Congregation (Jama'at) Timings</h3>
                {timingSuccess && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border rounded-lg text-[10.5px] font-bold">
                    Timings updated successfully!
                  </div>
                )}
                <form onSubmit={handleUpdateTimings} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha", "Jumuah"].map((prayer) => (
                    <div key={prayer}>
                      <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">{prayer}</label>
                      <input 
                        type="text" 
                        required
                        defaultValue={
                          prayer === "Fajr" ? timingFajr :
                          prayer === "Dhuhr" ? timingDhuhr :
                          prayer === "Asr" ? timingAsr :
                          prayer === "Maghrib" ? timingMaghrib :
                          prayer === "Isha" ? timingIsha : timingJumuah
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          if (prayer === "Fajr") setTimingFajr(val);
                          else if (prayer === "Dhuhr") setTimingDhuhr(val);
                          else if (prayer === "Asr") setTimingAsr(val);
                          else if (prayer === "Maghrib") setTimingMaghrib(val);
                          else if (prayer === "Isha") setTimingIsha(val);
                          else setTimingJumuah(val);
                        }}
                        className="w-full px-3 py-2 rounded bg-slate-50 dark:bg-[#010818] border text-xs font-mono font-black"
                      />
                    </div>
                  ))}
                  <div className="col-span-full pt-4">
                    <button type="submit" className="px-5 py-2.5 bg-blue-600 dark:bg-[#0CA671] text-white rounded-lg text-xs font-bold shadow-md">
                      Save Timings
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeAdminTab === "donations" && (
              <div className="glass-card bg-white dark:bg-[#01205B] border p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-base font-black text-slate-900 dark:text-white border-b pb-3">Manage Donation Campaigns</h3>
                {donationSuccess && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border rounded-lg text-[10.5px] font-bold">
                    Donation goals details modified!
                  </div>
                )}
                <form onSubmit={handleUpdateDonations} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Campaign Target Goal (৳)</label>
                      <input 
                        type="text" 
                        required
                        value={donationGoal}
                        onChange={(e) => setDonationGoal(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-slate-50 dark:bg-[#010818] border text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Amount Raised So Far (৳)</label>
                      <input 
                        type="text" 
                        required
                        value={donationRaised}
                        onChange={(e) => setDonationRaised(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-slate-50 dark:bg-[#010818] border text-xs"
                      />
                    </div>
                  </div>
                  <button type="submit" className="px-5 py-2.5 bg-blue-600 dark:bg-[#0CA671] text-white rounded-lg text-xs font-bold shadow-md">
                    Update Donation Stats
                  </button>
                </form>
              </div>
            )}

            {activeAdminTab === "ramadan" && (
              <div className="glass-card bg-white dark:bg-[#01205B] border p-6 rounded-2xl shadow-sm py-12 text-center text-xs text-slate-455">
                <Calendar className="w-8 h-8 mx-auto text-slate-350 mb-2" />
                <h4 className="font-black text-slate-700 dark:text-slate-200">Ramadan Calendar settings</h4>
                <p className="mt-1">Edit Sehar and Iftar schedules for the holy month of Ramadan.</p>
              </div>
            )}

          </div>

        </div>
      ) : (
        /* Regular Public View */
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Mosques Timings */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-card bg-white dark:bg-[#01205B] border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <MosqueIcon className="w-5.5 h-5.5 text-[#0CA671]" />
                <span>{language === "en" ? "Bakalia Mosque Directory & Timings" : "মসজিদ ডিরেক্টরি ও জামাত সময়সূচী"}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === "en" 
                  ? "Locate nearby mosques and view verified local congregation (Jama'at) timings." 
                  : "বাকলিয়ার নিকটবর্তী মসজিদসমূহ খুঁজুন এবং তাদের জামাত আদায়ের ভেরিফাইড সময়সূচী দেখুন।"}
              </p>
            </div>

            {/* Mosque List */}
            <div className="space-y-4">
              {mosquesList.map((mos, idx) => (
                <div key={idx} className="p-5 bg-white dark:bg-[#01205B] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <MosqueIcon className="w-4.5 h-4.5 text-blue-500" />
                      <h3 className="text-xs font-black text-slate-850 dark:text-slate-100">{mos.name}</h3>
                    </div>

                    <div className="space-y-1.5 text-[10.5px] font-bold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-red-500" /> {mos.location}</span>
                      <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-500" /> {mos.phone}</span>
                    </div>
                  </div>

                  {/* Timings Specification Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-slate-50 dark:bg-[#04142F]/50 p-3 rounded-lg border dark:border-slate-800/30 shrink-0">
                    {Object.entries(mos.jamaatTimes).map(([name, time]) => (
                      <div key={name} className="text-center p-1 px-2">
                        <span className="block text-[8px] font-black uppercase text-slate-400 tracking-wider leading-none">{name}</span>
                        <span className="block text-[9.5px] font-mono font-black text-slate-800 dark:text-slate-100 mt-1 leading-none">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Side: Announcements */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Donation Goals Campaign widget */}
            <div className="glass-card bg-white dark:bg-[#01205B] border p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-[#0CA671]" />
                <span>Masjid Donation Campaigns</span>
              </h3>
              <div className="space-y-2 text-xs">
                <span className="block font-bold text-slate-500 dark:text-slate-400">West Bakalia Mosque expansion:</span>
                <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-2">
                  <div className="bg-[#0CA671] h-2 rounded-full" style={{ width: "70%" }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                  <span>Raised: ৳ {donationRaised}</span>
                  <span>Goal: ৳ {donationGoal}</span>
                </div>
              </div>
            </div>

            {/* List Announcements */}
            <div className="glass-card bg-white dark:bg-[#01205B] border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-805 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-rose-500" />
                <span>{language === "en" ? "Mosque Announcements" : "মসজিদ ঘোষণা"}</span>
              </h3>

              <div className="space-y-4">
                {announcements.length === 0 ? (
                  <div className="p-4 bg-slate-50 dark:bg-[#04142F]/50 rounded-xl text-center text-[11px] text-slate-400">
                    {language === "en" ? "No notices announced recently." : "কোনো ঘোষণা নেই।"}
                  </div>
                ) : (
                  announcements.map(ann => (
                    <div key={ann.id} className="p-3 bg-slate-50 dark:bg-[#04142F]/50 border border-slate-100 dark:border-slate-800/40 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-[9px] text-slate-400">
                        <span className="font-bold">{ann.mosqueName}</span>
                        <span className="font-mono">{new Date(ann.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-xs font-black text-slate-800 dark:text-white mt-1 leading-snug">{ann.title}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">{ann.details}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
