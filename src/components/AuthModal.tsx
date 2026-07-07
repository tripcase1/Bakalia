"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Mail, Phone, Lock, User as UserIcon, AlertCircle } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAppContext } from "@/context/AppContext";

export default function AuthModal() {
  const { 
    showAuthModal, setShowAuthModal,
    authMode, setAuthMode,
    authMethod, setAuthMethod,
    t, language
  } = useAppContext();

  // Inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    setErrorMsg("");
    setSuccessMsg("");
    setConfirmationResult(null);
  }, [authMode, authMethod, showAuthModal]);

  // Handle Google redirect result on mobile
  useEffect(() => {
    getRedirectResult(auth).then(async (result) => {
      if (!result) return;
      const userDocRef = doc(db, "users", result.user.uid);
      const userDoc = await getDoc(userDocRef);
      const isNewUser = !userDoc.exists() || !userDoc.data().phoneNumber;
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: result.user.uid,
          name: result.user.displayName || "Google User",
          phone: result.user.phoneNumber || "",
          email: result.user.email || "",
          role: "citizen",
          createdAt: new Date().toISOString()
        });
      }
      setShowAuthModal(false);
      if (isNewUser && typeof window !== "undefined") {
        window.location.href = "/complete-profile";
      }
    }).catch((err) => console.error("Redirect result error:", err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clean recaptcha on unmount
  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  if (!showAuthModal) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (authMode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        setShowAuthModal(false);
      } else if (authMode === "register") {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Save to Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          name: fullName,
          phone: "+880" + phoneNumber,
          email: email,
          role: "citizen",
          createdAt: new Date().toISOString()
        });
        setShowAuthModal(false);
      } else if (authMode === "forgot") {
        await sendPasswordResetEmail(auth, email);
        setSuccessMsg(language === "en" ? "Password reset link sent to your email!" : "পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে!");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const provider = new GoogleAuthProvider();
      const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
      if (isMobile) {
        await signInWithRedirect(auth, provider);
        return;
      }
      const userCredential = await signInWithPopup(auth, provider);
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      const isNewUser = !userDoc.exists() || !userDoc.data().phoneNumber;
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: userCredential.user.uid,
          name: userCredential.user.displayName || "Google User",
          phone: userCredential.user.phoneNumber || "",
          email: userCredential.user.email || "",
          role: "citizen",
          createdAt: new Date().toISOString()
        });
      }
      setShowAuthModal(false);
      if (isNewUser) window.location.href = "/complete-profile";
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Google Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const initializeRecaptcha = () => {
    if (recaptchaVerifierRef.current) return;
    try {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {}
      });
    } catch (err) {
      console.error("Recaptcha initialization failed:", err);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      initializeRecaptcha();
      const verifier = recaptchaVerifierRef.current;
      if (!verifier) throw new Error("Recaptcha verifier not initialized.");

      const fullPhoneNumber = "+880" + phoneNumber;
      const result = await signInWithPhoneNumber(auth, fullPhoneNumber, verifier);
      setConfirmationResult(result);
      setSuccessMsg(language === "en" ? "Verification code sent to your phone!" : "ভেরিফিকেশন কোড আপনার ফোনে পাঠানো হয়েছে!");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to send SMS.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const userCredential = await confirmationResult.confirm(verificationCode);
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: userCredential.user.uid,
          name: fullName || "Phone User",
          phone: "+880" + phoneNumber,
          email: "",
          role: "citizen",
          createdAt: new Date().toISOString()
        });
      }
      setShowAuthModal(false);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Invalid OTP code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-250">
      <div className="w-full max-w-sm glass-card bg-white dark:bg-[#0D1B2A] border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-white rounded-2xl p-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Invisible Recaptcha container */}
        <div id="recaptcha-container" />

        {/* Close Button */}
        <button 
          onClick={() => setShowAuthModal(false)}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            {authMode === "login" 
              ? t("welcomeBack") 
              : authMode === "register" 
                ? t("createAccount") 
                : (language === "en" ? "Reset Password" : "পাসওয়ার্ড রিসেট")}
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            {authMode === "login" 
              ? t("accessAccountDesc") 
              : authMode === "register" 
                ? t("joinCommunityDesc") 
                : (language === "en" ? "Enter your email to receive a password reset link" : "পাসওয়ার্ড রিসেট লিংক পেতে আপনার ইমেইল প্রদান করুন")}
          </p>
        </div>

        {/* Selector tabs for Phone/Email (only visible in Login/Register modes) */}
        {authMode !== "forgot" && !confirmationResult && (
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-[#010818]/60 rounded-lg mb-5">
            <button 
              onClick={() => setAuthMethod("phone")}
              className={`py-1.5 text-[10.5px] font-bold rounded flex items-center justify-center gap-1.5 transition-all ${
                authMethod === "phone" ? "bg-blue-600 dark:bg-blue-600 text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t("phoneOtp")}</span>
            </button>
            <button 
              onClick={() => setAuthMethod("email")}
              className={`py-1.5 text-[10.5px] font-bold rounded flex items-center justify-center gap-1.5 transition-all ${
                authMethod === "email" ? "bg-blue-600 dark:bg-blue-600 text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{t("email")}</span>
            </button>
          </div>
        )}

        {/* Error/Success Feedbacks */}
        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-100 dark:border-red-900/30 text-[10.5px] font-bold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="leading-tight">{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 text-[10.5px] font-bold">
            {successMsg}
          </div>
        )}

        {/* OTP Input Field Form */}
        {confirmationResult ? (
          <form onSubmit={handleVerifyOtp} className="space-y-3.5">
            <div>
              <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                {language === "en" ? "Enter OTP Code" : "ওটিপি কোড লিখুন"}
              </label>
              <input 
                type="text" 
                required 
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="123456" 
                className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:border-blue-500/50 outline-none text-xs text-center tracking-widest font-mono"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-blue-600 dark:bg-[#0CA671] hover:bg-blue-500 dark:hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-[0.98] mt-4"
            >
              {loading ? (language === "en" ? "Verifying..." : "যাচাই করা হচ্ছে...") : (language === "en" ? "Verify & Sign In" : "ওটিপি যাচাই করুন")}
            </button>
          </form>
        ) : (
          /* Email / Phone standard forms */
          <form onSubmit={authMethod === "phone" && authMode !== "forgot" ? handleSendOtp : handleEmailAuth} className="space-y-3.5">
            
            {authMode === "register" && (
              <div>
                <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                  {t("fullName")}
                </label>
                <input 
                  type="text" 
                  required 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Abdullah Al Mamun" 
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:border-blue-500/50 outline-none text-xs transition-all"
                />
              </div>
            )}

            {authMethod === "phone" && authMode !== "forgot" ? (
              <div>
                <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                  {t("phoneNumber")}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-semibold text-slate-500 font-mono">+880</span>
                  <input 
                    type="tel" 
                    required 
                    pattern="[0-9]{10}"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="1712345678" 
                    className="w-full pl-13 pr-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:border-blue-500/50 outline-none text-xs transition-all font-mono"
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    {t("emailAddress")}
                  </label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com" 
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:border-blue-500/50 outline-none text-xs transition-all"
                  />
                </div>
                {authMode !== "forgot" && (
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                      {t("password")}
                    </label>
                    <input 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:border-blue-500/50 outline-none text-xs transition-all font-mono"
                    />
                  </div>
                )}
              </>
            )}

            {/* Forgot password link */}
            {authMode === "login" && authMethod === "email" && (
              <div className="text-right">
                <button 
                  type="button"
                  onClick={() => setAuthMode("forgot")}
                  className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-bold"
                >
                  {language === "en" ? "Forgot Password?" : "পাসওয়ার্ড ভুলে গেছেন?"}
                </button>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-blue-600 dark:bg-[#0CA671] hover:bg-blue-500 dark:hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-[0.98] mt-4"
            >
              {loading ? (language === "en" ? "Processing..." : "প্রক্রিয়াধীন...") : (
                authMode === "login" 
                  ? t("signIn") 
                  : authMode === "register" 
                    ? t("registerBtn") 
                    : (language === "en" ? "Send Reset Link" : "রিসেট লিংক পাঠান")
              )}
            </button>
          </form>
        )}

        {/* Google Authentication Option (only if not confirming OTP) */}
        {!confirmationResult && (
          <div className="mt-4">
            <div className="relative flex items-center justify-center my-4">
              <span className="absolute w-full border-t border-slate-200 dark:border-slate-800" />
              <span className="relative z-10 px-3 text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 bg-white dark:bg-[#0D1B2A]">
                {language === "en" ? "Or Continue With" : "অথবা সাইন ইন করুন"}
              </span>
            </div>
            
            <button 
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full py-2 flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#010818]/40 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all select-none"
            >
              {/* Simple Google Colored G Icon */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Google</span>
            </button>
          </div>
        )}

        {/* Switch Mode Footer */}
        <div className="mt-5 text-center text-[10px] text-slate-500 dark:text-slate-400 pt-3.5 border-t border-slate-200 dark:border-slate-800">
          {authMode === "login" ? (
            <>
              <span>{t("newToBakalia")}</span>{" "}
              <button 
                onClick={() => setAuthMode("register")}
                className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
              >
                {t("createAnAccount")}
              </button>
            </>
          ) : (
            <>
              <span>{t("alreadyHaveAccount")}</span>{" "}
              <button 
                onClick={() => setAuthMode("login")}
                className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
              >
                {t("loginHere")}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
