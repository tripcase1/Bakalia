"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronRight, Calendar, Plus, Loader2, AlertCircle, MapPin, User, Clock, Info, CheckCircle
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

export default function EventsPage() {
  const { 
    user, theme, language, t,
    setAuthMode, setShowAuthModal
  } = useAppContext();

  // Form states
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Directory lists
  const [events, setEvents] = useState<any[]>([]);

  // Load from Firestore
  useEffect(() => {
    const q = collection(db, "events");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: any[] = [];
      snapshot.forEach(docSnap => {
        docs.push({ id: docSnap.id, ...docSnap.data() });
      });
      docs.sort((a, b) => new Date(b.eventDate || 0).getTime() - new Date(a.eventDate || 0).getTime());
      setEvents(docs);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthMode("login");
      setShowAuthModal(true);
      return;
    }
    setLoading(true);
    setErrorMsg("");
    setSuccess(false);

    try {
      await addDoc(collection(db, "events"), {
        title,
        eventDate,
        eventTime,
        organizer,
        location,
        details,
        userId: user.uid,
        userName: user.displayName || user.email || "Citizen",
        createdAt: new Date().toISOString()
      });

      setTitle("");
      setEventDate("");
      setEventTime("");
      setOrganizer("");
      setLocation("");
      setDetails("");
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  const mockEvents = [
    {
      id: "mock1",
      title: language === "en" ? "Ward 17 Mass Cleanliness Drive" : "ওয়ার্ড ১৭ পরিচ্ছন্নতা অভিযান",
      eventDate: "2026-07-15",
      eventTime: "08:00 AM",
      organizer: language === "en" ? "Youth Community Volunteers" : "যুব সমাজ স্বেচ্ছাসেবক দল",
      location: language === "en" ? "West Bakalia High School Ground" : "পশ্চিম বাকলিয়া উচ্চ বিদ্যালয় মাঠ",
      details: language === "en" 
        ? "Volunteers will clean up the neighborhood garbage bins and paint walls with smart messages." 
        : "এলাকার ময়লা আবর্জনা পরিষ্কার ও দেয়ালে সচেতনতামূলক বার্তা আঁকার কাজে আমাদের সাহায্য করুন।",
      createdAt: new Date().toISOString()
    },
    {
      id: "mock2",
      title: language === "en" ? "Monsoon Dengue Awareness Campaign" : "বর্ষাকালীন ডেঙ্গু সচেতনতা ক্যাম্পেইন",
      eventDate: "2026-07-20",
      eventTime: "10:00 AM",
      organizer: language === "en" ? "Ward Health & Sanitation Desk" : "ওয়ার্ড স্বাস্থ্য ও স্যানিটেশন শাখা",
      location: language === "en" ? "Bakalia Ward Office, Chittagong" : "বাকলিয়া ওয়ার্ড কাউন্সিলর কার্যালয়",
      details: language === "en" 
        ? "Distributing free mosquito repellents, leaflets, and spraying larvicide in clogged drains." 
        : "বিনামূল্যে মশার স্প্রে বিতরণ এবং ড্রেনে এডিস মশা নিধনের ওষুধ ছিটানো হবে।"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-wider">
        <a href="/" className="hover:text-slate-700 dark:hover:text-slate-350 transition-colors">{t("home")}</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-white font-extrabold">{t("events")}</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Events List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card bg-white dark:bg-[#01205B] border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Calendar className="w-5.5 h-5.5 text-blue-500" />
              <span>{language === "en" ? "Community Events Calendar" : "ওয়ার্ড উন্নয়ন ও সামাজিক ইভেন্টসমূহ"}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === "en" 
                ? "Participate in development meetings, health campaigns, and cleaning drives in Bakalia." 
                : "বাকলিয়ার পরিচ্ছন্নতা অভিযান, ডেঙ্গু প্রতিরোধ কর্মসূচি ও উন্নয়নমূলক সভায় অংশগ্রহণ করুন।"}
            </p>
          </div>

          {/* Events Listings */}
          <div className="space-y-4">
            {(events.length > 0 ? events : mockEvents).map((ev) => (
              <div key={ev.id} className="p-5 bg-white dark:bg-[#01205B] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-3.5 flex flex-col sm:flex-row gap-4 justify-between items-start">
                
                {/* Date display card left */}
                <div className="flex sm:flex-col items-center justify-center p-3.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-[#4A89DA] border border-blue-100 dark:border-blue-900/10 rounded-xl text-center shrink-0 w-full sm:w-20">
                  <span className="text-2xl font-black font-mono leading-none">
                    {new Date(ev.eventDate).getDate()}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase mt-1">
                    {new Date(ev.eventDate).toLocaleDateString("en-US", { month: 'short' })}
                  </span>
                </div>

                <div className="space-y-2 flex-1 min-w-0">
                  <h3 className="text-xs font-black text-slate-850 dark:text-slate-100 leading-snug">{ev.title}</h3>
                  <p className="text-[10.5px] text-slate-650 dark:text-[#859798] leading-relaxed font-bold">{ev.details}</p>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] font-bold text-slate-500">
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" /> <span className="truncate">{ev.location}</span></span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" /> <span>{ev.eventTime}</span></span>
                  </div>
                </div>

                <div className="w-full sm:w-auto shrink-0 flex items-center justify-between sm:justify-start gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-850/40">
                  <span className="text-[9.5px] font-bold text-slate-400">By: {ev.organizer}</span>
                  <button 
                    onClick={() => alert("Registration success! Event reminders set.")}
                    className="px-3.5 py-1.5 text-[10.5px] font-black rounded-lg text-white bg-blue-600 hover:bg-blue-550 transition-all select-none shadow-sm active:scale-95"
                  >
                    Join Event
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Create Event form */}
        <div className="lg:col-span-4">
          <div className="glass-card bg-white dark:bg-[#01205B] border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{language === "en" ? "Schedule a New Event" : "নতুন ইভেন্ট শিডিউল করুন"}</span>
            </h3>
            <p className="text-[10px] leading-relaxed text-slate-505 dark:text-slate-400">
              {language === "en"
                ? "Schedule official civic events, social projects, or volunteer gatherings."
                : "সামাজিক কর্মসূচি, ওয়ার্ড উন্নয়ন সভা বা স্বেচ্ছাসেবক সমাবেশ সময়সূচী অনুযায়ী নির্ধারণ করুন।"}
            </p>

            {!user ? (
              <div className="p-4 border border-dashed rounded-xl text-center py-6">
                <AlertCircle className="w-6 h-6 text-blue-500 mx-auto mb-2 animate-bounce" />
                <h3 className="text-xs font-black text-slate-850 dark:text-slate-200">{t("login")}</h3>
                <button
                  onClick={() => { setAuthMode("login"); setShowAuthModal(true); }}
                  className="mt-3 px-4 py-2 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md active:scale-95"
                >
                  {t("login")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {success && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border rounded-lg text-[10.5px] font-bold">
                    {language === "en" ? "Event scheduled successfully!" : "ইভেন্ট সফলভাবে শিডিউল করা হয়েছে!"}
                  </div>
                )}
                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-650 border rounded-lg text-[10.5px] font-bold">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider font-mono">Event Title</label>
                  <input 
                    type="text" 
                    required 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Tree Plantation Drive"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Date</label>
                    <input 
                      type="date" 
                      required 
                      value={eventDate} 
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Time</label>
                    <input 
                      type="text" 
                      required 
                      value={eventTime} 
                      onChange={(e) => setEventTime(e.target.value)}
                      placeholder="09:00 AM"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Organizer Name</label>
                  <input 
                    type="text" 
                    required 
                    value={organizer} 
                    onChange={(e) => setOrganizer(e.target.value)}
                    placeholder="Ward 17 Club"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Venue Location</label>
                  <input 
                    type="text" 
                    required 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="West Bakalia"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Details</label>
                  <textarea 
                    required 
                    value={details} 
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Provide details about requirements, registration steps..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-2.5 bg-blue-600 dark:bg-[#0CA671] text-white rounded-lg text-xs font-bold shadow-md hover:bg-blue-550 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Schedule Event</span>
                </button>
              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
