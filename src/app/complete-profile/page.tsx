"use client";

import React, { useState, useEffect } from "react";
import { Lock, Phone, MapPin, User, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { auth, db } from "@/lib/firebase";
import { EmailAuthProvider, linkWithCredential, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function CompleteProfilePage() {
  const { user, authLoading, language, showToast } = useAppContext();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [ward, setWard] = useState("Ward 17");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const en = language === "en";

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
    if (user) {
      setFullName(user.displayName || "");
    }
  }, [user, authLoading, router]);

  // If user already has a password linked, skip this page
  useEffect(() => {
    if (!user) return;
    const hasPassword = user.providerData.some(p => p.providerId === "password");
    const checkFirestore = async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (hasPassword && snap.exists() && snap.data().phoneNumber) {
        router.replace("/dashboard");
      }
    };
    checkFirestore();
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg(en ? "Passwords do not match." : "পাসওয়ার্ড মিলছে না।");
      return;
    }
    if (password.length < 6) {
      setErrorMsg(en ? "Password must be at least 6 characters." : "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }
    if (!user) return;

    setLoading(true);
    setErrorMsg("");

    try {
      // Link password to Google account
      const credential = EmailAuthProvider.credential(user.email!, password);
      await linkWithCredential(user, credential);

      // Update display name if changed
      if (fullName !== user.displayName) {
        await updateProfile(user, { displayName: fullName });
      }

      // Save/update Firestore profile
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: fullName,
        email: user.email,
        phoneNumber: phone,
        ward,
        address,
        role: "citizen",
        verified: true,
        createdAt: new Date().toISOString(),
      }, { merge: true });

      showToast(en ? "Profile completed successfully!" : "প্রোফাইল সম্পন্ন হয়েছে!", "success");
      router.push("/dashboard");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/provider-already-linked" || code === "auth/email-already-in-use") {
        // Password already linked — just save profile info and proceed
        try {
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            displayName: fullName,
            email: user.email,
            phoneNumber: phone,
            ward,
            address,
            role: "citizen",
            verified: true,
            createdAt: new Date().toISOString(),
          }, { merge: true });
          showToast(en ? "Profile updated!" : "প্রোফাইল আপডেট হয়েছে!", "success");
          router.push("/dashboard");
        } catch (innerErr) {
          console.error(innerErr);
          setErrorMsg(en ? "Failed to save profile." : "প্রোফাইল সেভ করা যায়নি।");
        }
      } else {
        console.error(err);
        setErrorMsg(en ? "Failed to complete profile. Please try again." : "প্রোফাইল সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।");
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex-1 flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-[#0CA671]" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 bg-[#F4F6F9] dark:bg-[#010818] pb-24 md:pb-12">
      <div className="w-full max-w-md bg-white dark:bg-[#01205B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-[#0CA671] flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-base font-black text-slate-900 dark:text-white">
            {en ? "Complete Your Profile" : "প্রোফাইল সম্পন্ন করুন"}
          </h2>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-bold">
            {en ? `Signed in as ${user.email}` : `${user.email} দিয়ে সাইন ইন করা হয়েছে`}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/20 rounded-lg text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
              {en ? "Full Name" : "পূর্ণ নাম"}
            </label>
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

          {/* Phone + Ward */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                {en ? "Phone" : "ফোন নম্বর"}
              </label>
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
              <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                {en ? "Ward" : "ওয়ার্ড"}
              </label>
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

          {/* Address */}
          <div>
            <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
              {en ? "Residential Address" : "বাসার ঠিকানা"}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={en ? "Road, Block, Area..." : "রোড, ব্লক, এলাকা..."}
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-800 dark:text-white outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[9.5px] font-bold text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-wider">
              {en ? "Set a Password (required)" : "পাসওয়ার্ড সেট করুন (আবশ্যক)"}
            </p>
            <div className="space-y-3">
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={en ? "Min 6 characters" : "কমপক্ষে ৬ অক্ষর"}
                  className="w-full pl-10 pr-3 py-3 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-800 dark:text-white outline-none"
                />
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={en ? "Confirm password" : "পাসওয়ার্ড নিশ্চিত করুন"}
                  className={`w-full pl-10 pr-3 py-3 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-800 dark:text-white outline-none ${
                    confirmPassword && password !== confirmPassword ? "border-red-400" : ""
                  }`}
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-[10px] text-red-500 font-bold">
                  {en ? "Passwords do not match" : "পাসওয়ার্ড মিলছে না"}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || (!!confirmPassword && password !== confirmPassword)}
            className="w-full py-3 bg-blue-600 dark:bg-[#0CA671] hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            <span>{en ? "Complete & Go to Dashboard" : "সম্পন্ন করুন ও ড্যাশবোর্ডে যান"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
