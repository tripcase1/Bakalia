"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { AlertTriangle, X, ShieldAlert, CheckCircle } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function SosOverlay() {
  const {
    language, theme, t,
    showSosConfirmModal, setShowSosConfirmModal,
    sosActive, setSosActive,
    sosCountdown, setSosCountdown,
    gpsCoords, user
  } = useAppContext();

  // Overlay states
  const [showSosHoldOverlay, setShowSosHoldOverlay] = useState(false);
  const [sosHoldProgress, setSosHoldProgress] = useState(0);
  const [sosHoldTimeLeft, setSosHoldTimeLeft] = useState(5);
  const [isHoldingSos, setIsHoldingSos] = useState(false);
  const [sosSuccess, setSosSuccess] = useState(false);

  // Refs for hold tracking
  const holdingRef = useRef(false);
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStartRef = useRef(0);
  const sosBtnRef = useRef<HTMLDivElement>(null);

  // Start hold
  const startHold = useCallback(() => {
    if (holdingRef.current) return;
    holdingRef.current = true;
    holdStartRef.current = Date.now();
    setIsHoldingSos(true);

    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      const progress = Math.min((elapsed / 5000) * 100, 100);
      const secondsLeft = Math.max(5 - Math.floor(elapsed / 1000), 0);
      setSosHoldProgress(progress);
      setSosHoldTimeLeft(secondsLeft);

      if (elapsed >= 5000) {
        if (holdTimerRef.current) clearInterval(holdTimerRef.current);
        holdTimerRef.current = null;
        holdingRef.current = false;
        setIsHoldingSos(false);
        setSosSuccess(true);
        setSosActive(true);

        // Log the SOS trigger to Firestore
        if (db) {
          const lat = gpsCoords?.lat || 22.3562;
          const lng = gpsCoords?.lng || 91.8398;

          let deviceInfo = "Unknown Device";
          if (typeof window !== "undefined" && window.navigator) {
            const ua = window.navigator.userAgent;
            if (ua.match(/Android/i)) {
              const match = ua.match(/Android\s+([0-9\.]+);\s+([^;]+)\s+Build/);
              deviceInfo = match ? `Android (${match[2].trim()})` : "Android Device";
            } else if (ua.match(/iPhone/i)) {
              deviceInfo = "Apple iPhone";
            } else if (ua.match(/iPad/i)) {
              deviceInfo = "Apple iPad";
            } else if (ua.match(/Windows/i)) {
              deviceInfo = "Windows PC";
            } else if (ua.match(/Macintosh/i)) {
              deviceInfo = "Apple Mac";
            } else {
              deviceInfo = "Mobile/Browser";
            }
          }

          addDoc(collection(db, "civic_reports"), {
            title: language === "en" ? "Emergency SOS Distress Alert" : "জরুরি এসওএস বিপদ সংকেত",
            description: language === "en" 
              ? "Emergency distress panic trigger initiated. GPS location is live." 
              : "জরুরি বিপদ সংকেত বাটন চাপা হয়েছে। লাইভ জিপিএস লোকেশন সক্রিয়।",
            category: "Emergency",
            lat,
            lng,
            deviceInfo,
            status: "pending",
            userId: user?.uid || "anonymous",
            userName: user?.displayName || user?.email || "Citizen User",
            votes: 0,
            upvotedBy: [],
            createdAt: new Date().toISOString()
          }).then((docRef) => {
            console.log("SOS report logged in Firestore:", docRef.id);
          }).catch(err => {
            console.warn("Failed to log SOS report to Firestore:", err);
          });
        }
      }
    }, 30);
  }, [setSosActive, gpsCoords, user, language]);

  // Stop hold
  const stopHold = useCallback(() => {
    if (!holdingRef.current) return;
    holdingRef.current = false;
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsHoldingSos(false);
    setSosHoldProgress(0);
    setSosHoldTimeLeft(5);
  }, []);

  // Attach touch/mouse listeners to SOS button for reliable mobile hold
  useEffect(() => {
    const el = sosBtnRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => { e.preventDefault(); e.stopPropagation(); startHold(); };
    const onTouchEnd = (e: TouchEvent) => { e.preventDefault(); stopHold(); };
    const onMouseDown = (e: MouseEvent) => { e.preventDefault(); startHold(); };
    const onMouseUp = () => stopHold();
    const onMouseLeave = () => stopHold();
    const onCtx = (e: Event) => e.preventDefault();

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: false });
    el.addEventListener("touchcancel", onTouchEnd, { passive: false });
    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("contextmenu", onCtx);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("contextmenu", onCtx);
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    };
  }, [showSosHoldOverlay, sosSuccess, startHold, stopHold]);

  // Countdown timer for active SOS alert
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (sosActive && sosCountdown === null) {
      setSosCountdown(15); // Start a 15-second active alarm countdown
    }

    if (sosActive && sosCountdown !== null && sosCountdown > 0) {
      timer = setInterval(() => {
        setSosCountdown(sosCountdown - 1);
      }, 1000);
    } else if (sosActive && sosCountdown === 0) {
      // Alarm expired, reset SOS states
      setSosActive(false);
      setSosCountdown(null);
      setSosSuccess(false);
      setShowSosHoldOverlay(false);
      setShowSosConfirmModal(false);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [sosActive, sosCountdown, setSosCountdown, setShowSosConfirmModal]);

  const handleConfirmYes = () => {
    setShowSosConfirmModal(false);
    setShowSosHoldOverlay(true);
  };

  const handleCancelSos = () => {
    setSosActive(false);
    setSosCountdown(null);
    setSosSuccess(false);
    setShowSosHoldOverlay(false);
    setShowSosConfirmModal(false);
  };

  if (!showSosConfirmModal && !showSosHoldOverlay) return null;

  return (
    <>
      {/* ==================== SOS CONFIRMATION MODAL ==================== */}
      {showSosConfirmModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-250">
          <div className="w-full max-w-sm bg-white dark:bg-[#0D1B2A] text-slate-800 dark:text-white rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-150 border border-slate-200 dark:border-slate-800">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-[#481C21] text-[#EF4444] flex items-center justify-center mx-auto mb-4 animate-bounce">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black leading-tight text-slate-900 dark:text-white">
                {t("sosConfirmTitle")}
              </h3>
              <p className="text-[10.5px] text-slate-500 dark:text-[#859798] mt-2.5 leading-relaxed font-bold">
                {t("sosConfirmDesc")}
              </p>
            </div>
            <div className="mt-5.5 grid grid-cols-2 gap-3.5">
              <button
                onClick={() => setShowSosConfirmModal(false)}
                className="py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-650 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all select-none"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleConfirmYes}
                className="py-2.5 rounded-lg text-white bg-red-600 hover:bg-red-700 text-xs font-bold transition-all shadow-md select-none active:scale-[0.98]"
              >
                {t("yesINeedHelp")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== REALISTIC 3D SOS HOLD OVERLAY ==================== */}
      {showSosHoldOverlay && (
        <div 
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center text-center px-4 animate-in fade-in duration-300 text-white bg-[#010818]"
          style={{ 
            touchAction: 'none',
            WebkitTouchCallout: 'none', 
            WebkitUserSelect: 'none', 
            userSelect: 'none',
            background: 'radial-gradient(ellipse at center, #0a1628 0%, #010818 70%)'
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes sos-pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.04); opacity: 0.9; }
            }
            @keyframes sos-glow {
              0%, 100% { box-shadow: 0 0 20px rgba(239,68,68,0.3), 0 0 60px rgba(239,68,68,0.1), inset 0 -8px 20px rgba(0,0,0,0.4), inset 0 4px 10px rgba(255,255,255,0.1); }
              50% { box-shadow: 0 0 40px rgba(239,68,68,0.5), 0 0 80px rgba(239,68,68,0.2), inset 0 -8px 20px rgba(0,0,0,0.4), inset 0 4px 10px rgba(255,255,255,0.1); }
            }
            @keyframes sos-glow-active {
              0%, 100% { box-shadow: 0 0 50px rgba(239,68,68,0.7), 0 0 100px rgba(239,68,68,0.35), 0 0 150px rgba(239,68,68,0.15), inset 0 -6px 15px rgba(0,0,0,0.5), inset 0 2px 8px rgba(255,200,200,0.2); }
              50% { box-shadow: 0 0 60px rgba(239,68,68,0.8), 0 0 120px rgba(239,68,68,0.4), 0 0 180px rgba(239,68,68,0.2), inset 0 -6px 15px rgba(0,0,0,0.5), inset 0 2px 8px rgba(255,200,200,0.2); }
            }
            @keyframes sos-shake {
              0%, 100% { transform: translate(0,0) scale(0.92); }
              10% { transform: translate(-1px, 1px) scale(0.92); }
              20% { transform: translate(1px, -1px) scale(0.92); }
              30% { transform: translate(-2px, 0px) scale(0.92); }
              40% { transform: translate(2px, 1px) scale(0.92); }
              50% { transform: translate(-1px, -1px) scale(0.92); }
              60% { transform: translate(1px, 2px) scale(0.92); }
              70% { transform: translate(-2px, -1px) scale(0.92); }
              80% { transform: translate(2px, 0px) scale(0.92); }
              90% { transform: translate(-1px, 1px) scale(0.92); }
            }
            @keyframes sos-ripple {
              0% { transform: scale(0.8); opacity: 0.6; }
              100% { transform: scale(2); opacity: 0; }
            }
            @keyframes sos-ring-pulse {
              0%, 100% { opacity: 0.15; }
              50% { opacity: 0.35; }
            }
            .sos-btn-idle {
              animation: sos-glow 2s infinite ease-in-out, sos-pulse 2s infinite ease-in-out;
            }
            .sos-btn-active {
              animation: sos-glow-active 0.8s infinite ease-in-out, sos-shake 0.15s infinite linear;
            }
            .sos-ripple-ring {
              animation: sos-ripple 1.5s infinite ease-out;
            }
            .sos-outer-ring {
              animation: sos-ring-pulse 2s infinite ease-in-out;
            }
          `}} />
          
          {!sosSuccess ? (
            <>
              <div className="max-w-xs space-y-2 mb-5">
                <h2 className="text-lg font-black tracking-tight uppercase text-red-500">
                  {language === "en" ? "Emergency SOS" : "জরুরি এসওএস"}
                </h2>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                  {language === "en" 
                    ? "Press and hold the button for 5 seconds to send alert" 
                    : "অ্যালার্ট পাঠাতে বাটনটি ৫ সেকেন্ড চেপে ধরে রাখুন"}
                </p>
              </div>

              {/* SOS button wrapper */}
              <div className="relative w-[210px] h-[210px] flex items-center justify-center">
                
                {/* Thin outer static ring */}
                <div 
                  className="absolute rounded-full border-2 sos-outer-ring pointer-events-none"
                  style={{ 
                    width: '210px', height: '210px',
                    borderColor: isHoldingSos ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)'
                  }}
                />

                {/* Expanding ripple rings while holding */}
                {isHoldingSos && (
                  <>
                    <div className="absolute rounded-full border-2 border-red-500/40 sos-ripple-ring pointer-events-none" style={{ width: '170px', height: '170px', animationDelay: '0s' }} />
                    <div className="absolute rounded-full border-2 border-red-500/25 sos-ripple-ring pointer-events-none" style={{ width: '170px', height: '170px', animationDelay: '0.5s' }} />
                    <div className="absolute rounded-full border-2 border-red-500/15 sos-ripple-ring pointer-events-none" style={{ width: '170px', height: '170px', animationDelay: '1.0s' }} />
                  </>
                )}

                {/* SVG Progress Ring */}
                <svg className="absolute -rotate-90 pointer-events-none" style={{ width: '190px', height: '190px' }} viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
                  <circle 
                    cx="60" cy="60" r="54" fill="none" 
                    stroke={sosHoldProgress > 80 ? "#EF4444" : sosHoldProgress > 40 ? "#F59E0B" : "#3B82F6"}
                    strokeWidth="4" 
                    strokeDasharray="339.3" 
                    strokeDashoffset={339.3 - (339.3 * sosHoldProgress) / 100}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.05s linear, stroke 0.3s ease' }}
                  />
                </svg>

                {/* The realistic 3D SOS button - uses ref for native touch listeners */}
                <div 
                  ref={sosBtnRef}
                  className={`relative rounded-full bg-red-600 cursor-pointer select-none flex items-center justify-center ${
                    isHoldingSos ? 'sos-btn-active' : 'sos-btn-idle'
                  }`}
                  style={{
                    width: '160px', 
                    height: '160px',
                    background: isHoldingSos 
                      ? 'radial-gradient(circle at 40% 35%, #ff6b6b 0%, #dc2626 40%, #991b1b 80%, #7f1d1d 100%)'
                      : 'radial-gradient(circle at 40% 35%, #ef4444 0%, #dc2626 35%, #b91c1c 70%, #991b1b 100%)',
                    touchAction: 'none',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                  }}
                >
                  {/* Inner highlight (3D convex effect) */}
                  <div 
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      top: '8px', left: '12px', right: '12px', bottom: '40%',
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 100%)',
                      borderRadius: '50%',
                    }}
                  />

                  {/* Content */}
                  <div className="flex flex-col items-center pointer-events-none z-10">
                    <AlertTriangle className={`w-9 h-9 text-white mb-1 drop-shadow-lg ${isHoldingSos ? 'animate-bounce' : ''}`} />
                    <span className="text-4xl font-black font-mono tracking-tighter leading-none text-white drop-shadow-lg">
                      {sosHoldTimeLeft}
                    </span>
                    <span className="text-[8px] font-extrabold tracking-[0.2em] uppercase text-white/90 mt-1.5 drop-shadow">
                      {isHoldingSos 
                        ? (language === "en" ? "HOLDING..." : "চেপে ধরে রাখুন...") 
                        : (language === "en" ? "HOLD" : "চেপে ধরুন")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cancel Button */}
              <button 
                onClick={() => setShowSosHoldOverlay(false)}
                className="mt-6 px-6 py-2.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-bold transition-all text-slate-300 hover:text-white"
              >
                {t("cancel")}
              </button>
            </>
          ) : (
            /* SOS Alert Activated: Flashing Danger Screen */
            <div className="max-w-md p-6 flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-full bg-red-650 flex items-center justify-center shadow-2xl shadow-red-500/40 border border-white/20 mb-6 animate-pulse">
                <ShieldAlert className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-black text-red-500 uppercase tracking-tight leading-none animate-pulse">
                {language === "en" ? "SOS ALERT TRANSMITTED!" : "এসওএস অ্যালার্ট প্রেরিত!"}
              </h2>
              <p className="text-xs text-slate-400 mt-3 font-semibold max-w-xs leading-relaxed">
                {language === "en" 
                  ? "Live GPS coordinates broadcasted to local precinct & Ward volunteers." 
                  : "আপনার লাইভ জিপিএস লোকেশন থানা পুলিশ ও স্থানীয় স্বেচ্ছাসেবকদের কাছে পাঠানো হয়েছে।"}
              </p>
              
              {/* Countdown circle */}
              <div className="mt-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span>{language === "en" ? "Deactivating automatically in" : "স্বয়ংক্রিয় বন্ধ হতে সময় বাকি:"} {sosCountdown}s</span>
              </div>

              <button 
                onClick={handleCancelSos}
                className="mt-8 px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-lg shadow-red-950/20 active:scale-[0.98] transition-all select-none uppercase"
              >
                {language === "en" ? "Deactivate Alarm" : "অ্যালার্ট বন্ধ করুন"}
              </button>
            </div>
          )}

        </div>
      )}
    </>
  );
}
