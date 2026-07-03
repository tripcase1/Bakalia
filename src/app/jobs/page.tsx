"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Briefcase, ChevronRight, AlertCircle, Loader2, DollarSign, Calendar, MapPin, User
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

export default function JobsPage() {
  const { 
    user, theme, language, t,
    setAuthMode, setShowAuthModal
  } = useAppContext();

  // Form states
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [salary, setSalary] = useState("");
  const [category, setCategory] = useState("Tuition");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Directory lists
  const [jobs, setJobs] = useState<any[]>([]);
  const [filterCategory, setFilterCategory] = useState("All");

  // Load from Firestore
  useEffect(() => {
    const q = collection(db, "jobs");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: any[] = [];
      snapshot.forEach(docSnap => {
        docs.push({ id: docSnap.id, ...docSnap.data() });
      });
      docs.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setJobs(docs);
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
      await addDoc(collection(db, "jobs"), {
        title,
        company,
        salary,
        category,
        location,
        contact,
        description,
        userId: user.uid,
        userName: user.displayName || user.email || "Citizen",
        createdAt: new Date().toISOString()
      });

      setTitle("");
      setCompany("");
      setSalary("");
      setLocation("");
      setContact("");
      setDescription("");
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to submit job posting.");
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    return filterCategory === "All" || job.category === filterCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-wider">
        <a href="/" className="hover:text-slate-700 dark:hover:text-slate-350 transition-colors">{t("home")}</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-white font-extrabold">{t("jobs")}</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Post a Job */}
        <div className="lg:col-span-4">
          <div className="glass-card bg-white dark:bg-[#01205B] border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              {language === "en" ? "Post a Job or Tuition" : "টিউটর বা চাকরি পোস্ট করুন"}
            </h2>
            <p className="text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
              {language === "en" 
                ? "Post tuition requests, shop helper jobs, or driver openings within Ward Bakalia." 
                : "বাকলিয়ার অভ্যন্তরে শিক্ষকতা, দোকান কর্মচারী বা ড্রাইভার পদের শূন্যতা পোস্ট করুন।"}
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
                    {language === "en" ? "Job posted successfully!" : "সফলভাবে পোস্ট করা হয়েছে!"}
                  </div>
                )}
                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-600 border rounded-lg text-[10.5px] font-bold">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Job Title</label>
                  <input 
                    type="text" 
                    required 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Home Tutor for Class 8"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Company / Family</label>
                    <input 
                      type="text" 
                      required 
                      value={company} 
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Mamun Family"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Job Type</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                    >
                      <option value="Tuition">Tuition</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Tuition-Wanted">Tuition Wanted</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Salary (BDT)</label>
                    <input 
                      type="text" 
                      required 
                      value={salary} 
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="e.g. 5,000 / Neg"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Area / Location</label>
                    <input 
                      type="text" 
                      required 
                      value={location} 
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Ward 17, Bakalia"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Contact Email/Phone</label>
                  <input 
                    type="text" 
                    required 
                    value={contact} 
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="e.g. 01712345678"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Job Description</label>
                  <textarea 
                    required 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Requirements, timings, class details..."
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
                  <span>Post Job Openings</span>
                </button>
              </form>
            )}

          </div>
        </div>

        {/* Right Side: List and Filters */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Filters Bar */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none p-4 bg-white dark:bg-[#01205B] border rounded-xl shadow-sm">
            {["All", "Tuition", "Full-time", "Part-time", "Tuition-Wanted"].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all ${
                  filterCategory === cat
                    ? "bg-blue-600 dark:bg-[#0CA671] text-white border-transparent"
                    : "bg-slate-50 dark:bg-[#010818] border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-400 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Jobs List Grid */}
          {filteredJobs.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#01205B] border rounded-xl text-xs text-slate-450">
              No matching job listings available currently.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredJobs.map(job => (
                <div key={job.id} className="p-4 bg-white dark:bg-[#01205B] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[8px] font-extrabold bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-[#4A89DA] uppercase border border-blue-100 dark:border-blue-900/10">
                        {job.category}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-xs font-black text-slate-855 dark:text-slate-105 mt-3 leading-snug">{job.title}</h3>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-extrabold mt-1">{job.company}</p>
                    
                    <p className="text-[10px] text-slate-500 dark:text-[#859798] mt-2.5 leading-relaxed line-clamp-3">{job.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4 text-[9.5px] font-bold text-slate-405">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-red-500" /> {job.location}</span>
                      <span className="flex items-center gap-0.5"><DollarSign className="w-3.5 h-3.5 text-emerald-500" /> {job.salary}</span>
                    </div>
                  </div>

                  <div className="pt-3.5 mt-3.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-400">By: {job.userName}</span>
                    <a 
                      href={`mailto:${job.contact}`}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-[#04142F] hover:dark:bg-[#010818] text-slate-700 dark:text-slate-250 rounded-lg transition-all"
                    >
                      Apply Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
