"use client";

import React, { useState } from "react";
import { 
  ShieldAlert, Mail, Lock, User, Phone, MapPin, Compass, ArrowRight, Loader2, AlertCircle
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { language, theme, t } = useAppContext();
  const router = useRouter();
  const isLight = theme === "light";

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [ward, setWard] = useState("Ward 17");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Auth Profile
      await updateProfile(user, { displayName: fullName });

      // Save user record to users collection in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: fullName,
        email: email,
        phoneNumber: phone,
        ward: ward,
        address: address,
        role: "citizen", // Default role is always citizen
        verified: false, // Default verification status is pending
        createdAt: new Date().toISOString()
      });

      // Redirect automatically to citizen dashboard
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to create user account.");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-16 bg-[#F4F6F9] dark:bg-[#010818] transition-colors duration-300">
      
      <div className="w-full max-w-md bg-white dark:bg-[#01205B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-[#0CA671] flex items-center justify-center mx-auto mb-3">
            <User className="w-5.5 h-5.5" />
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            {language === "en" ? "Register Citizen Account" : "নাগরিক অ্যাকাউন্ট নিবন্ধন"}
          </h2>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-wider mt-1">
            {language === "en" ? "Join Ward Smart Community" : "স্মার্ট বাকলিয়া সমাজ বিনির্মাণ"}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 text-red-655 dark:text-red-400 border border-red-100 dark:border-red-900/20 rounded-lg text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input 
                type="text" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Abdullah Al Mamun"
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-800 dark:text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01712345678"
                  className="w-full pl-10 pr-3 py-3 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-800 dark:text-white outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Ward Area</label>
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full px-3 py-3 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-800 dark:text-white outline-none font-bold"
              >
                <option value="Ward 17">Ward 17</option>
                <option value="Ward 18">Ward 18</option>
                <option value="Ward 19">Ward 19</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-800 dark:text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-800 dark:text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Residential Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input 
                type="text" 
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Road no, Flat, Block, Area..."
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-800 dark:text-white outline-none"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0CA671] hover:bg-emerald-600 text-white font-bold rounded-lg text-xs transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-1.5"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            <span>{language === "en" ? "Register Account" : "নিবন্ধন সম্পন্ন করুন"}</span>
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-6 font-bold">
          {language === "en" ? "Already have an account?" : "ইতিমধ্যেই অ্যাকাউন্ট আছে?"}{" "}
          <a href="/login" className="text-blue-500 hover:underline font-extrabold">
            {language === "en" ? "Log in here" : "লগইন করুন"}
          </a>
        </p>
      </div>

    </div>
  );
}
