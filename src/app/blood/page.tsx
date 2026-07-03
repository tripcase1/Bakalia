"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Droplet, ChevronRight, AlertCircle, Loader2, Phone, Calendar, Heart, Award
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

export default function BloodDonationPage() {
  const { 
    user, theme, language, t,
    setAuthMode, setShowAuthModal
  } = useAppContext();

  // Form states
  const [fullName, setFullName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("A+");
  const [lastDonation, setLastDonation] = useState("");
  const [ward, setWard] = useState("Ward 17");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Directory lists
  const [donors, setDonors] = useState<any[]>([]);
  const [filterGroup, setFilterGroup] = useState("All");

  // Load from Firestore
  useEffect(() => {
    const q = collection(db, "blood_donors");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: any[] = [];
      snapshot.forEach(docSnap => {
        docs.push({ id: docSnap.id, ...docSnap.data() });
      });
      docs.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setDonors(docs);
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
      await addDoc(collection(db, "blood_donors"), {
        name: fullName,
        bloodGroup,
        lastDonation,
        ward,
        phone,
        userId: user.uid,
        createdAt: new Date().toISOString()
      });

      setFullName("");
      setLastDonation("");
      setPhone("");
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to register donor.");
    } finally {
      setLoading(false);
    }
  };

  const filteredDonors = donors.filter(d => {
    return filterGroup === "All" || d.bloodGroup === filterGroup;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-wider">
        <a href="/" className="hover:text-slate-700 dark:hover:text-slate-350 transition-colors">{t("home")}</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-white font-extrabold">{t("bloodDonation")}</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Register Donor */}
        <div className="lg:col-span-4">
          <div className="glass-card bg-white dark:bg-[#01205B] border-slate-205 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="text-base font-black text-slate-905 dark:text-white flex items-center gap-2">
              <Droplet className="w-5 h-5 text-red-500 fill-red-500" />
              <span>{language === "en" ? "Become a Blood Donor" : "রক্তদাতা হিসেবে নাম লিখুন"}</span>
            </h2>
            <p className="text-[10px] leading-relaxed text-slate-505 dark:text-slate-400">
              {language === "en" 
                ? "Register your blood group to receive emergency donation requests in Bakalia Wards." 
                : "বাকলিয়ায় জরুরি রক্তদানের প্রয়োজনে সাড়া দিতে নিজের নাম ও রক্তের গ্রুপ তালিকাভুক্ত করুন।"}
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
                    {language === "en" ? "Donor profile registered successfully!" : "সফলভাবে রক্তদাতা হিসেবে নাম নিবন্ধিত হয়েছে!"}
                  </div>
                )}
                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-650 border rounded-lg text-[10.5px] font-bold">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider font-mono">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Abdullah Al Mamun"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Blood Group</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none font-bold"
                    >
                      {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Ward Area</label>
                    <select
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                    >
                      <option value="Ward 17">Ward 17</option>
                      <option value="Ward 18">Ward 18</option>
                      <option value="Ward 19">Ward 19</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Last Donation Date</label>
                  <input 
                    type="date" 
                    required 
                    value={lastDonation} 
                    onChange={(e) => setLastDonation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Contact Phone</label>
                  <input 
                    type="text" 
                    required 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 01812345678"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none font-mono"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Register Volunteer</span>
                </button>
              </form>
            )}

          </div>
        </div>

        {/* Right Side: List and Filters */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Filters Bar */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none p-4 bg-white dark:bg-[#01205B] border rounded-xl shadow-sm">
            {["All", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(g => (
              <button
                key={g}
                onClick={() => setFilterGroup(g)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all ${
                  filterGroup === g
                    ? "bg-red-600 text-white border-transparent shadow-md"
                    : "bg-slate-50 dark:bg-[#010818] border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-405 hover:bg-slate-100"
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Donors List Grid */}
          {filteredDonors.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#01205B] border rounded-xl text-xs text-slate-450">
              No registered donors found for this blood group.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredDonors.map(donor => (
                <div key={donor.id} className="p-4 bg-white dark:bg-[#01205B] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex items-center justify-between hover:shadow-md transition-all">
                  <div className="min-w-0">
                    <h3 className="text-xs font-black text-slate-850 dark:text-slate-100 truncate">{donor.name}</h3>
                    <p className="text-[10px] text-slate-450 dark:text-[#859798] mt-1 font-bold">{donor.ward}</p>
                    
                    <div className="flex items-center gap-1.5 text-[9.5px] text-slate-400 mt-3 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      <span>Last Donated: {donor.lastDonation}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {/* Big red blood drop badge */}
                    <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-[#481C21] border border-red-100 dark:border-red-500/10 flex items-center justify-center text-red-500 dark:text-red-400 font-extrabold text-xs shadow-sm">
                      {donor.bloodGroup}
                    </div>

                    <a 
                      href={`tel:${donor.phone}`}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-[#04142F] hover:dark:bg-[#010818] text-slate-700 dark:text-slate-250 rounded-lg transition-all text-[10px] font-extrabold flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-emerald-500" />
                      <span>Call</span>
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
