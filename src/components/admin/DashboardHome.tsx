"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { 
  Users, Eye, Landmark, Activity, AlertTriangle, ShieldAlert, FileText, FileWarning, Droplet, ShoppingBag, Briefcase, Home, Calendar, HelpCircle, DollarSign,
  TrendingUp, ArrowUpRight, Clock, CheckCircle
} from "lucide-react";

export default function DashboardHome() {
  const { language } = useAppContext();

  // Realtime counts states
  const [citizensCount, setCitizensCount] = useState(0);
  const [onlineCount, setOnlineCount] = useState(7); // Live mock online
  const [visitorsCount, setVisitorsCount] = useState(148); // Traffic mock
  const [todayUsers, setTodayUsers] = useState(2); // Mock registrations today
  
  const [openComplaints, setOpenComplaints] = useState(0);
  const [resolvedComplaints, setResolvedComplaints] = useState(0);
  const [sosAlerts, setSosAlerts] = useState(0);
  const [newsCount, setNewsCount] = useState(0);
  const [noticesCount, setNoticesCount] = useState(0);
  const [bloodRequests, setBloodRequests] = useState(0);
  const [listingsCount, setListingsCount] = useState(0);
  const [jobsCount, setJobsCount] = useState(0);
  const [rentalsCount, setRentalsCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);

  // Sync counts in realtime
  useEffect(() => {
    // 1. Citizens count
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      let citizens = 0;
      snap.forEach(docSnap => {
        if (docSnap.data()?.role === "citizen") citizens++;
      });
      setCitizensCount(citizens);
      // Today users mock update based on snapshot size
      setTodayUsers(Math.max(1, Math.floor(snap.size / 6)));
    });

    // 2. Complaints (civic_reports)
    const unsubComplaints = onSnapshot(collection(db, "civic_reports"), (snap) => {
      let open = 0;
      let resolved = 0;
      let sosCount = 0;
      snap.forEach(docSnap => {
        const data = docSnap.data();
        if (data?.category === "Emergency") {
          sosCount++;
        }
        if (data?.status === "resolved") {
          resolved++;
        } else {
          open++;
        }
      });
      setOpenComplaints(open);
      setResolvedComplaints(resolved);
      setSosAlerts(sosCount);
    });

    // 3. Notices & news
    const unsubNotices = onSnapshot(collection(db, "notices"), (snap) => setNoticesCount(snap.size));
    const unsubNews = onSnapshot(collection(db, "news"), (snap) => setNewsCount(snap.size));
    
    // 4. Blood & Marketplace & Jobs & Rentals & Events
    const unsubBlood = onSnapshot(collection(db, "blood_donors"), (snap) => setBloodRequests(snap.size));
    const unsubMarket = onSnapshot(collection(db, "marketplace_items"), (snap) => setListingsCount(snap.size));
    const unsubJobs = onSnapshot(collection(db, "jobs"), (snap) => setJobsCount(snap.size));
    const unsubRentals = onSnapshot(collection(db, "listings"), (snap) => setRentalsCount(snap.size));
    const unsubEvents = onSnapshot(collection(db, "events"), (snap) => setEventsCount(snap.size));

    return () => {
      unsubUsers();
      unsubComplaints();
      unsubNotices();
      unsubNews();
      unsubBlood();
      unsubMarket();
      unsubJobs();
      unsubRentals();
      unsubEvents();
    };
  }, []);

  const kpis = [
    { label: language === "en" ? "Today's Users" : "আজকের ব্যবহারকারী", value: todayUsers, icon: Users, change: "+12.5%", color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20" },
    { label: language === "en" ? "Today's Visitors" : "আজকের ভিজিটর", value: visitorsCount, icon: Eye, change: "+4.8%", color: "text-purple-500 bg-purple-50 dark:bg-purple-950/20" },
    { label: language === "en" ? "Active Citizens" : "সক্রিয় নাগরিকবৃন্দ", value: citizensCount, icon: Landmark, change: "+2.1%", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" },
    { label: language === "en" ? "Online Sessions" : "অনলাইন সেশন", value: onlineCount, icon: Activity, change: "Live", color: "text-rose-500 bg-rose-50 dark:bg-rose-950/20" }
  ];

  const sections = [
    {
      title: language === "en" ? "Civic Operations & Safety" : "নাগরিক সেবা ও নিরাপত্তা",
      cards: [
        { label: language === "en" ? "Open Complaints" : "চলতি অভিযোগ", value: openComplaints, icon: AlertTriangle, desc: "Pending resolution", color: "text-amber-500 border-amber-100 dark:border-amber-950/20 bg-amber-50/10" },
        { label: language === "en" ? "Resolved Complaints" : "নিষ্পত্তিকৃত অভিযোগ", value: resolvedComplaints, icon: CheckCircle, desc: "Successfully resolved", color: "text-emerald-500 border-emerald-100 dark:border-emerald-950/20 bg-emerald-50/10" },
        { label: language === "en" ? "Emergency Alerts (SOS)" : "জরুরি সংকেত (এসওএস)", value: sosAlerts, icon: ShieldAlert, desc: "Active SOS alarms", color: "text-red-500 border-red-100 dark:border-red-950/20 bg-red-50/10" }
      ]
    },
    {
      title: language === "en" ? "Content & Communication" : "যোগাযোগ ও তথ্য প্রকাশ",
      cards: [
        { label: language === "en" ? "News Published" : "প্রকাশিত সংবাদ", value: newsCount, icon: FileText, desc: "CMS portal news articles", color: "text-sky-500 border-sky-100 dark:border-sky-950/20 bg-sky-50/10" },
        { label: language === "en" ? "Police Notices" : "পুলিশ নোটিশ", value: noticesCount, icon: FileWarning, desc: "Thana alerts & bulletins", color: "text-indigo-500 border-indigo-100 dark:border-indigo-950/20 bg-indigo-50/10" },
        { label: language === "en" ? "Blood Requests" : "রক্তদান অনুরোধ", value: bloodRequests, icon: Droplet, desc: "Active donors requests", color: "text-rose-500 border-rose-100 dark:border-rose-950/20 bg-rose-50/10" },
        { label: language === "en" ? "Events Scheduled" : "পরিকল্পিত ইভেন্ট", value: eventsCount, icon: Calendar, desc: "Active community events", color: "text-teal-500 border-teal-100 dark:border-teal-950/20 bg-teal-50/10" }
      ]
    },
    {
      title: language === "en" ? "Marketplace & Listings" : "মার্কেটপ্লেস ও শ্রেণীবদ্ধ বিজ্ঞাপন",
      cards: [
        { label: language === "en" ? "Marketplace Items" : "মার্কেটপ্লেস পণ্য", value: listingsCount, icon: ShoppingBag, desc: "Citizen product listings", color: "text-blue-500 border-blue-100 dark:border-blue-950/20 bg-blue-50/10" },
        { label: language === "en" ? "Rental Listings" : "বাসা ভাড়া বিজ্ঞাপন", value: rentalsCount, icon: Home, desc: "Properties advertisements", color: "text-violet-500 border-violet-100 dark:border-violet-950/20 bg-violet-50/10" },
        { label: language === "en" ? "Jobs Available" : "কর্মসংস্থান সুযোগ", value: jobsCount, icon: Briefcase, desc: "Local jobs openings", color: "text-pink-500 border-pink-100 dark:border-pink-950/20 bg-pink-50/10" }
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div className="leading-tight">
        <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
          {language === "en" ? "Dashboard Overview" : "ড্যাশবোর্ড ওভারভিউ"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {language === "en" ? "Realtime operating statistics across all municipal operations." : "পৌরসভার সকল কার্যক্রমের রিয়েলটাইম পরিসংখ্যান।"}
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx} 
              className="p-4 bg-white dark:bg-[#0F1420] border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-between"
            >
              <div className="space-y-1.5 min-w-0">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">{kpi.label}</span>
                <span className="text-xl font-black text-slate-800 dark:text-white block">{kpi.value}</span>
                <span className={`text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-full inline-block ${
                  kpi.change.startsWith("+") 
                    ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/10" 
                    : "text-blue-600 bg-blue-50 dark:bg-blue-950/10"
                }`}>
                  {kpi.change}
                </span>
              </div>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${kpi.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid of Sections */}
      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-3.5">
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
              {section.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {section.cards.map((card, cIdx) => {
                const Icon = card.icon;
                return (
                  <div 
                    key={cIdx} 
                    className={`p-4 bg-white dark:bg-[#0F1420] border rounded-xl hover:border-slate-350 dark:hover:border-slate-700 shadow-sm transition-all flex items-start justify-between ${card.color}`}
                  >
                    <div className="space-y-1.5 min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">{card.label}</span>
                      <span className="text-2xl font-black text-slate-855 dark:text-white block">{card.value}</span>
                      <span className="text-[9.5px] text-slate-455 dark:text-slate-400 block">{card.desc}</span>
                    </div>
                    <Icon className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  </div>
                );
              })}
              {/* Future Revenue Placeholder in first section */}
              {idx === 0 && (
                <div className="p-4 bg-slate-100/30 dark:bg-slate-900/10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Financial Revenue</span>
                    <span className="text-xl font-black text-slate-400 dark:text-slate-600 block">$0.00</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-650 block">Future accounting modules</span>
                  </div>
                  <DollarSign className="w-4.5 h-4.5 text-slate-350 dark:text-slate-700 self-end" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Row: Recent Activity Log */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-5 bg-white dark:bg-[#0F1420] border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/40 pb-3">
            <h4 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
              {language === "en" ? "Recent Administrative Events" : "সাম্প্রতিক প্রশাসনিক কার্যক্রম"}
            </h4>
            <span className="text-[9.5px] font-bold text-blue-500 flex items-center gap-1 cursor-pointer hover:underline">
              {language === "en" ? "View all logs" : "সব দেখুন"}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          
          <div className="space-y-4">
            {[
              { time: "Just now", event: "Super Admin promoted target user (uid: ...83f5) to volunteer", icon: TrendingUp, type: "promote" },
              { time: "10 mins ago", event: "Police Admin published new block layout notice: 'Bakalia traffic routes updated'", icon: Clock, type: "publish" },
              { time: "40 mins ago", event: "Mosque Admin West Bakalia updated Jumuah prayers timing to 1:30 PM", icon: Clock, type: "update" },
              { time: "2 hours ago", event: "Citizen submitted civic report on Ward 17 drainage clog", icon: AlertTriangle, type: "report" }
            ].map((activity, aIdx) => (
              <div key={aIdx} className="flex gap-3 text-xs leading-relaxed">
                <div className="w-6 h-6 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                  <activity.icon className="w-3 h-3 text-slate-500" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">{activity.event}</span>
                  <span className="text-[9.5px] text-slate-400 block">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 p-5 bg-white dark:bg-[#0F1420] border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider border-b border-slate-100 dark:border-slate-800/40 pb-3">
              {language === "en" ? "Administrative Quick Actions" : "প্রশাসনিক কুইক একশন"}
            </h4>
            <div className="space-y-2">
              <button className="w-full py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 transition-colors">
                {language === "en" ? "Export Users Registry (CSV)" : "ব্যবহারকারী তালিকা ডাউনলোড"}
              </button>
              <button className="w-full py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 transition-colors">
                {language === "en" ? "Run Portal Audit Sweep" : "সিস্টেম অডিট চালান"}
              </button>
            </div>
          </div>
          
          <div className="pt-6 text-[10px] text-slate-400 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Need portal developer support? Contact IT.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
