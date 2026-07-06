"use client";

import React, { useState, useEffect } from "react";
import { 
  Mail, Lock, Phone, ArrowRight, Loader2, Compass, AlertCircle, KeyRound
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { auth, db } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult,
  RecaptchaVerifier, signInWithPhoneNumber, signOut, ConfirmationResult
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
const ADMIN_2FA = process.env.NEXT_PUBLIC_ADMIN_2FA_CODE;

export default function LoginPage() {
  const { language, t, user, role, authLoading, showToast } = useAppContext();
  const router = useRouter();

  const [method, setMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [show2fa, setShow2fa] = useState(false);
  const [admin2faCode, setAdmin2faCode] = useState("");
  const [pendingRole, setPendingRole] = useState("");
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !auth) return;
    try {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {}
      });
      setRecaptchaVerifier(verifier);
    } catch (err) {
      console.warn("Recaptcha verifier failed to load:", err);
    }
  }, []);

  // Handle Google redirect result on mobile
  useEffect(() => {
    getRedirectResult(auth).then(async (result) => {
      if (!result) return;
      const firebaseUser = result.user;
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      const userRole = userDoc.exists() ? ((userDoc.data() as { role?: string }).role || "citizen") : "citizen";
      if (checkAdminAndRedirect(firebaseUser.email, userRole)) return;
      showToast(language === "en" ? "Signed in successfully!" : "সফলভাবে লগইন করা হয়েছে!", "success");
      router.push(getRoleDashboard(userRole));
    }).catch((err) => console.error("Redirect result error:", err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!authLoading && user && role) {
      if (ADMIN_EMAIL && user.email === ADMIN_EMAIL && localStorage.getItem("admin_2fa_verified") !== "true") {
        setShow2fa(true);
        setPendingRole(role);
        return;
      }
      router.replace(getRoleDashboard(role));
    }
  }, [user, role, authLoading, router]);

  const getRoleDashboard = (r: string): string => {
    switch (r) {
      case "citizen": return "/dashboard";
      case "super_admin": return "/admin";
      case "police_admin": return "/police";
      case "councilor": return "/council";
      case "volunteer": return "/volunteer";
      case "mosque_admin": return "/mosque";
      case "business_admin": return "/business";
      case "moderator": return "/moderator";
      case "editor": return "/editor";
      default: return "/";
    }
  };

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case "auth/invalid-email": return language === "en" ? "Invalid email address format." : "ইমেল ঠিকানার বিন্যাস সঠিক নয়।";
      case "auth/user-disabled": return language === "en" ? "This user account has been disabled." : "এই ব্যবহারকারী অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে।";
      case "auth/user-not-found":
      case "auth/invalid-credential": return language === "en" ? "Incorrect email or password." : "ভুল ইমেল বা পাসওয়ার্ড।";
      case "auth/wrong-password": return language === "en" ? "Incorrect password." : "ভুল পাসওয়ার্ড।";
      case "auth/email-already-in-use": return language === "en" ? "Email is already registered." : "ইমেলটি ইতিমধ্যে নিবন্ধিত হয়েছে।";
      case "auth/weak-password": return language === "en" ? "Password should be at least 6 characters." : "পাসওয়ার্ডটি অন্তত ৬ অক্ষরের হতে হবে।";
      case "auth/network-request-failed": return language === "en" ? "Network error. Please check your connection." : "নেটওয়ার্ক ত্রুটি। আপনার সংযোগটি পরীক্ষা করুন।";
      case "auth/too-many-requests": return language === "en" ? "Too many attempts. Please try again later." : "অতিরিক্ত চেষ্টা করা হয়েছে। পরে আবার চেষ্টা করুন।";
      default: return language === "en" ? "An authentication error occurred. Please try again." : "একটি প্রমাণীকরণ ত্রুটি ঘটেছে। আবার চেষ্টা করুন।";
    }
  };

  const checkAdminAndRedirect = (userEmail: string | null, userRole: string) => {
    if (ADMIN_EMAIL && userEmail === ADMIN_EMAIL) {
      setPendingRole(userRole);
      setShow2fa(true);
      setLoading(false);
      showToast(language === "en" ? "Verification code required for admin access." : "অ্যাডমিন অ্যাক্সেসের জন্য ভেরিফিকেশন কোড প্রয়োজন।", "info");
      return true;
    }
    return false;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const isEmailProvider = firebaseUser.providerData.some(p => p.providerId === "password");
      if (isEmailProvider && !firebaseUser.emailVerified && !(ADMIN_EMAIL && firebaseUser.email === ADMIN_EMAIL)) {
        const msg = language === "en" ? "Please verify your email address before logging in." : "অনুগ্রহ করে লগইন করার আগে আপনার ইমেল ঠিকানা যাচাই করুন।";
        setErrorMsg(msg);
        showToast(msg, "error");
        await signOut(auth);
        setLoading(false);
        return;
      }

      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      const userRole = userDoc.exists() ? ((userDoc.data() as { role?: string }).role || "citizen") : "citizen";
      
      if (checkAdminAndRedirect(firebaseUser.email, userRole)) return;

      showToast(language === "en" ? "Signed in successfully!" : "সফলভাবে লগইন করা হয়েছে!", "success");
      setLoading(false);
      router.push(getRoleDashboard(userRole));
    } catch (err: unknown) {
      console.error(err);
      const friendlyMsg = getErrorMessage((err as { code?: string }).code ?? "");
      setErrorMsg(friendlyMsg);
      showToast(friendlyMsg, "error");
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErrorMsg("");

    try {
      if (!recaptchaVerifier) throw new Error("Recaptcha verifier is not ready.");
      
      let formattedPhone = phone.trim();
      if (!formattedPhone.startsWith("+")) formattedPhone = "+88" + formattedPhone;

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      showToast(language === "en" ? "OTP sent successfully!" : "ওটিপি সফলভাবে পাঠানো হয়েছে!", "success");
    } catch (err: unknown) {
      console.error(err);
      const friendlyMsg = getErrorMessage((err as { code?: string }).code ?? "");
      setErrorMsg(friendlyMsg);
      showToast(friendlyMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !confirmationResult) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const result = await confirmationResult.confirm(otpCode);
      const firebaseUser = result.user;
      
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      const userRole = userDoc.exists() ? ((userDoc.data() as { role?: string }).role || "citizen") : "citizen";
      
      if (checkAdminAndRedirect(firebaseUser.email, userRole)) return;

      showToast(language === "en" ? "Signed in successfully!" : "সফলভাবে লগইন করা হয়েছে!", "success");
      setLoading(false);
      router.push(getRoleDashboard(userRole));
    } catch (err: unknown) {
      console.error(err);
      const friendlyMsg = language === "en" ? "Invalid verification code." : "ভুল ওটিপি কোড।";
      setErrorMsg(friendlyMsg);
      showToast(friendlyMsg, "error");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const provider = new GoogleAuthProvider();
      const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
      if (isMobile) {
        await signInWithRedirect(auth, provider);
        return; // page redirects, result handled in useEffect above
      }
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      const userRole = userDoc.exists() ? ((userDoc.data() as { role?: string }).role || "citizen") : "citizen";
      
      if (checkAdminAndRedirect(firebaseUser.email, userRole)) return;

      showToast(language === "en" ? "Signed in successfully!" : "সফলভাবে লগইন করা হয়েছে!", "success");
      setLoading(false);
      router.push(getRoleDashboard(userRole));
    } catch (err: unknown) {
      console.error(err);
      const friendlyMsg = getErrorMessage((err as { code?: string }).code ?? "");
      setErrorMsg(friendlyMsg);
      showToast(friendlyMsg, "error");
      setLoading(false);
    }
  };

  const handle2faSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ADMIN_2FA && admin2faCode.trim() === ADMIN_2FA) {
      localStorage.setItem("admin_2fa_verified", "true");
      showToast(language === "en" ? "Admin authorized successfully!" : "অ্যাডমিন সফলভাবে অনুমোদিত হয়েছে!", "success");
      router.push(getRoleDashboard(pendingRole || "super_admin"));
    } else {
      const msg = language === "en" ? "Incorrect Admin 2FA Code. Access Denied." : "ভুল অ্যাডমিন ওটিপি কোড। প্রবেশাধিকার প্রত্যাখ্যান করা হয়েছে।";
      setErrorMsg(msg);
      showToast(msg, "error");
    }
  };

  if (authLoading) {
    return (
      <div className="flex-1 flex justify-center items-center px-4 py-16 bg-[#F4F6F9] dark:bg-[#010818] transition-colors duration-300">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-[#0CA671]" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-16 bg-[#F4F6F9] dark:bg-[#010818] transition-colors duration-300">
      
      <div id="recaptcha-container"></div>

      <div className="w-full max-w-md bg-white dark:bg-[#01205B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
        
        {show2fa ? (
          <form onSubmit={handle2faSubmit} className="space-y-5">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-[#4A89DA] flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-5 h-5" />
              </div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">Admin 2FA Security</h2>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-wider mt-1">Enter 6-digit preset code</p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/20 rounded-lg text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider text-center">6-Digit Security Code</label>
              <input 
                type="text" 
                maxLength={6}
                required
                value={admin2faCode}
                onChange={(e) => setAdmin2faCode(e.target.value)}
                placeholder="******"
                className="w-full px-3 py-3 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-800 dark:text-white outline-none tracking-widest text-center font-mono font-black"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-blue-600 dark:bg-[#0CA671] text-white font-bold rounded-lg text-xs transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <span>Confirm &amp; Authorize</span>
            </button>
          </form>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-[#4A89DA] flex items-center justify-center mx-auto mb-3">
                <Compass className="w-5 h-5 animate-spin" />
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {language === "en" ? "Sign In to Bakalia" : "বাকলিয়ায় সাইন ইন করুন"}
              </h2>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-wider mt-1">
                {language === "en" ? "Smart Community Operating System" : "স্মার্ট কমিউনিটি অপারেটিং সিস্টেম"}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/20 rounded-lg text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">{t("emailAddress")}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3 py-3 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-800 dark:text-white outline-none focus:border-blue-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">{t("password")}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-3 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-800 dark:text-white outline-none focus:border-blue-500/40"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 dark:bg-[#0CA671] hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-1.5"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>{t("signIn")}</span>
              </button>
            </form>

            <div className="my-5 flex items-center justify-between text-[10px] text-slate-400 uppercase font-black tracking-wider select-none">
              <span className="h-[1px] bg-slate-200 dark:bg-slate-800 flex-1"></span>
              <span className="px-3">{language === "en" ? "Or continue with" : "অথবা"}</span>
              <span className="h-[1px] bg-slate-200 dark:bg-slate-800 flex-1"></span>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-all relative overflow-hidden active:scale-[0.99]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-1.14 2.78-2.4 3.63v3.02h3.87c2.27-2.08 3.58-5.15 3.58-8.5z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.87-3.02c-1.08.72-2.45 1.16-4.09 1.16-3.15 0-5.81-2.13-6.76-5.01H1.28v3.12C3.26 21.28 7.37 24 12 24z"/>
                <path fill="#FBBC05" d="M5.24 14.22A7.16 7.16 0 0 1 4.88 12c0-.79.13-1.57.36-2.32V6.56H1.28A11.94 11.94 0 0 0 0 12c0 2.02.51 3.93 1.28 5.64l3.96-3.42z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.97 1.19 15.24 0 12 0 7.37 0 3.26 2.72 1.28 6.56l3.96 3.42c.95-2.88 3.61-5.01 6.76-5.01z"/>
              </svg>
              <span>Google Accounts</span>
              <span className="absolute top-0 right-0 bg-blue-600 dark:bg-emerald-600 text-white text-[7.5px] font-black uppercase px-2 py-0.5 rounded-bl-lg tracking-wider scale-95 select-none">
                {language === "en" ? "Recommended" : "প্রস্তাবিত"}
              </span>
            </button>

            <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-6 font-bold">
              {language === "en" ? "Don't have an account?" : "অ্যাকাউন্ট নেই?"}{" "}
              <a href="/register" className="text-blue-500 hover:underline font-extrabold">
                {language === "en" ? "Register here" : "নিবন্ধন করুন"}
              </a>
            </p>
          </>
        )}
      </div>

    </div>
  );
}
