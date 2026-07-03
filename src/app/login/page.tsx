"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, Mail, Lock, Phone, ArrowRight, Loader2, Compass, AlertCircle, KeyRound
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { auth, db } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, 
  RecaptchaVerifier, signInWithPhoneNumber 
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { language, theme, t } = useAppContext();
  const router = useRouter();
  const isLight = theme === "light";

  // Login methods: "email" | "phone"
  const [method, setMethod] = useState<"email" | "phone">("email");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 2FA Admin States
  const [show2fa, setShow2fa] = useState(false);
  const [admin2faCode, setAdmin2faCode] = useState("");
  const [pendingRole, setPendingRole] = useState("");

  // Recaptcha verifier
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>(null);

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

  const getRoleDashboard = (role: string): string => {
    switch (role) {
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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.exists() ? ((userDoc.data() as any).role || "citizen") : "citizen";
      
      if (user.email === "almabruk786@gmail.com") {
        setPendingRole(role);
        setShow2fa(true);
        setLoading(false);
        return;
      }

      router.push(getRoleDashboard(role));
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Invalid email or password.");
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (!recaptchaVerifier) {
        throw new Error("Recaptcha verifier is not ready.");
      }
      
      let formattedPhone = phone.trim();
      if (!formattedPhone.startsWith("+")) {
        formattedPhone = "+88" + formattedPhone;
      }

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to send verification SMS.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const result = await confirmationResult.confirm(otpCode);
      const user = result.user;
      
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.exists() ? ((userDoc.data() as any).role || "citizen") : "citizen";
      
      if (user.email === "almabruk786@gmail.com") {
        setPendingRole(role);
        setShow2fa(true);
        setLoading(false);
        return;
      }

      router.push(getRoleDashboard(role));
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Invalid verification code.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.exists() ? ((userDoc.data() as any).role || "citizen") : "citizen";
      
      if (user.email === "almabruk786@gmail.com") {
        setPendingRole(role);
        setShow2fa(true);
        setLoading(false);
        return;
      }

      router.push(getRoleDashboard(role));
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Google authentication failed.");
      setLoading(false);
    }
  };

  const handle2faSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (admin2faCode.trim() === "424800") {
      sessionStorage.setItem("admin_2fa_verified", "true");
      router.push(getRoleDashboard(pendingRole || "super_admin"));
    } else {
      setErrorMsg("Incorrect Admin 2FA Code. Access Denied.");
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-16 bg-[#F4F6F9] dark:bg-[#010818] transition-colors duration-300">
      
      <div id="recaptcha-container"></div>

      <div className="w-full max-w-md bg-white dark:bg-[#01205B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
        
        {show2fa ? (
          /* Admin 2FA Entry Section */
          <form onSubmit={handle2faSubmit} className="space-y-5">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-[#4A89DA] flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-5.5 h-5.5" />
              </div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                {language === "en" ? "Admin 2FA Security" : "Admin 2FA Security"}
              </h2>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-wider mt-1">
                {language === "en" ? "Enter 6-digit preset code" : "Enter 6-digit preset code"}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-100 dark:border-red-900/20 rounded-lg text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider text-center">
                6-Digit Security Code
              </label>
              <input 
                type="text" 
                maxLength={6}
                required
                value={admin2faCode}
                onChange={(e) => setAdmin2faCode(e.target.value)}
                placeholder="******"
                className="w-full px-3 py-3 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none tracking-widest text-center font-mono font-black"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-blue-600 dark:bg-[#0CA671] text-white font-bold rounded-lg text-xs transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <span>{language === "en" ? "Confirm & Authorize" : "Confirm & Authorize"}</span>
            </button>
          </form>
        ) : (
          /* Normal Authentication Form */
          <>
            <div className="text-center mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-[#4A89DA] flex items-center justify-center mx-auto mb-3">
                <Compass className="w-5.5 h-5.5 animate-spin" />
              </div>
              <h2 className="text-lg font-black text-slate-905 dark:text-white">
                {language === "en" ? "Sign In to Bakalia" : "Sign In to Bakalia"}
              </h2>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-wider mt-1">
                {language === "en" ? "Smart Community Operating System" : "Smart Community Operating System"}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-100 dark:border-red-900/20 rounded-lg text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex bg-slate-50 dark:bg-[#010818] p-1 rounded-lg border dark:border-slate-800/30 mb-5">
              <button
                onClick={() => { setMethod("email"); setErrorMsg(""); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                  method === "email"
                    ? "bg-white dark:bg-[#01205B] text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-650"
                }`}
              >
                {language === "en" ? "Email Address" : "Email Address"}
              </button>
              <button
                onClick={() => { setMethod("phone"); setErrorMsg(""); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                  method === "phone"
                    ? "bg-white dark:bg-[#01205B] text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-650"
                }`}
              >
                {language === "en" ? "Phone OTP" : "Phone OTP"}
              </button>
            </div>

            {method === "email" ? (
              <form onSubmit={handleEmailLogin} className="space-y-4">
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
                      className="w-full pl-10 pr-3 py-3 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none focus:border-blue-500/40"
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
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-3 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none focus:border-blue-500/40"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 dark:bg-[#0CA671] hover:bg-blue-550 text-white font-bold rounded-lg text-xs transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  <span>{language === "en" ? "Sign In" : "Sign In"}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                {!otpSent ? (
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                      <input 
                        type="tel" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 01712345678"
                        className="w-full pl-10 pr-3 py-3 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Verification OTP Code</label>
                    <input 
                      type="text" 
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="e.g. 123456"
                      className="w-full px-3 py-3 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none tracking-widest text-center font-mono font-black"
                    />
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 dark:bg-[#0CA671] hover:bg-blue-550 text-white font-bold rounded-lg text-xs transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  <span>{otpSent ? (language === "en" ? "Verify Code" : "Verify Code") : (language === "en" ? "Send SMS OTP" : "Send SMS OTP")}</span>
                </button>
              </form>
            )}

            <div className="my-5 flex items-center justify-between text-[10px] text-slate-400 uppercase font-black tracking-wider select-none">
              <span className="h-[1px] bg-slate-200 dark:bg-slate-800 flex-1"></span>
              <span className="px-3">Or continue with</span>
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
                {language === "en" ? "Recommended" : "Recommended"}
              </span>
            </button>

            <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-6 font-bold">
              {language === "en" ? "Don't have an account?" : "Don't have an account?"}{" "}
              <a href="/register" className="text-blue-500 hover:underline font-extrabold">
                {language === "en" ? "Register here" : "Register here"}
              </a>
            </p>
          </>
        )}
      </div>

    </div>
  );
}
