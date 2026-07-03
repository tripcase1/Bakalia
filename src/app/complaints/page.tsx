"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ShieldAlert, ShieldCheck, MapPin, Upload, Star, ChevronRight, 
  Map as MapIcon, Plus, AlertCircle, Eye, ThumbsUp, Loader2, ArrowLeft
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, updateDoc, doc, arrayUnion, arrayRemove } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ComplaintsPage() {
  const { 
    user, theme, language, t,
    setAuthMode, setShowAuthModal, gpsCoords
  } = useAppContext();

  const isLight = theme === "light";

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Garbage");
  const [lat, setLat] = useState(22.3486);
  const [lng, setLng] = useState(91.8436);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Directory lists
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  // Map references
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const leafletLoadedRef = useRef(false);

  // Load complaints from Firestore
  useEffect(() => {
    const q = collection(db, "civic_reports");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Sort client-side (resilient to missing index)
      items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setReports(items);
      if (items.length > 0 && !selectedReport) {
        setSelectedReport(items[0]);
      }
    });
    return () => unsubscribe();
  }, [selectedReport]);

  // Sync GPS Coordinates
  useEffect(() => {
    if (gpsCoords) {
      setLat(gpsCoords.lat);
      setLng(gpsCoords.lng);
    }
  }, [gpsCoords]);

  // Client side image compression
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            resolve(blob || file);
          }, "image/jpeg", 0.7);
        };
      };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit Complaint to Firestore
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
      let imageUrl = "";
      if (imageFile) {
        const compressedBlob = await compressImage(imageFile);
        const storageRef = ref(storage, `complaints/${Date.now()}_${imageFile.name}`);
        const uploadResult = await uploadBytes(storageRef, compressedBlob);
        imageUrl = await getDownloadURL(uploadResult.ref);
      }

      await addDoc(collection(db, "civic_reports"), {
        title,
        description,
        category,
        lat,
        lng,
        imageUrl,
        status: "pending",
        userId: user.uid,
        userName: user.displayName || user.email || "Citizen",
        votes: 0,
        upvotedBy: [],
        createdAt: new Date().toISOString()
      });

      setTitle("");
      setDescription("");
      setImageFile(null);
      setImagePreview(null);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  // Upvote complaint
  const handleUpvote = async (reportId: string, currentUpvoters: string[] = []) => {
    if (!user) {
      setAuthMode("login");
      setShowAuthModal(true);
      return;
    }
    const hasVoted = currentUpvoters.includes(user.uid);
    const reportRef = doc(db, "civic_reports", reportId);
    
    try {
      if (hasVoted) {
        await updateDoc(reportRef, {
          upvotedBy: arrayRemove(user.uid),
          votes: Math.max(0, (currentUpvoters.length - 1))
        });
      } else {
        await updateDoc(reportRef, {
          upvotedBy: arrayUnion(user.uid),
          votes: (currentUpvoters.length + 1)
        });
      }
    } catch (err) {
      console.error("Upvote failed:", err);
    }
  };

  // Initialize interactive Leaflet map dynamically
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let LInstance: any = null;
    let localMap: any = null;
    let localMarker: any = null;

    import("leaflet").then((LModule) => {
      LInstance = LModule;
      
      // Fix default Leaflet marker icon asset paths
      delete LInstance.Icon.Default.prototype._getIconUrl;
      LInstance.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
      });

      // Avoid double initialization
      if (mapRef.current) {
        localMap = mapRef.current;
        localMap.setView([lat, lng], 14);
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        }
        return;
      }

      localMap = LInstance.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: false
      });

      LInstance.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(localMap);

      LInstance.control.zoom({ position: "bottomright" }).addTo(localMap);

      localMarker = LInstance.marker([lat, lng], { draggable: true }).addTo(localMap);
      
      localMarker.on("dragend", () => {
        const position = localMarker.getLatLng();
        setLat(position.lat);
        setLng(position.lng);
      });

      localMap.on("click", (e: any) => {
        const { lat: clickLat, lng: clickLng } = e.latlng;
        setLat(clickLat);
        setLng(clickLng);
        localMarker.setLatLng([clickLat, clickLng]);
      });

      mapRef.current = localMap;
      markerRef.current = localMarker;
      leafletLoadedRef.current = true;
    }).catch(err => console.error("Leaflet loader error:", err));

    return () => {
      // Destructor
    };
  }, [gpsCoords]);

  // Move marker when lat/lng change from database clicks
  const updateMapMarker = (reportLat: number, reportLng: number) => {
    if (mapRef.current && markerRef.current) {
      mapRef.current.setView([reportLat, reportLng], 15);
      markerRef.current.setLatLng([reportLat, reportLng]);
      setLat(reportLat);
      setLng(reportLng);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "resolved") {
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/20">
          {language === "en" ? "Resolved" : "সমাধানকৃত"}
        </span>
      );
    }
    if (status === "in_progress") {
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-[#4A89DA] border border-blue-100 dark:border-blue-900/20">
          {language === "en" ? "In Progress" : "চলমান"}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-500 border border-amber-100 dark:border-amber-900/20">
        {language === "en" ? "Pending" : "পেন্ডিং"}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-wider">
        <a href="/" className="hover:text-slate-700 dark:hover:text-slate-350 transition-colors">{t("home")}</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-white font-extrabold">{t("complaints")}</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Directory and Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card bg-white dark:bg-[#01205B] border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2">
              {language === "en" ? "Report Civic Issues" : "নাগরিক সমস্যা রিপোর্ট করুন"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === "en" 
                ? "File garbage complaints, broken street lights, or clogged drains directly to municipal volunteers." 
                : "রাস্তাঘাট, ড্রেনেজ বা ময়লা-আবর্জনা সংক্রান্ত যেকোনো অভিযোগ সরাসরি স্বেচ্ছাসেবকদের কাছে জানান।"}
            </p>

            {/* If user is not logged in, show auth prompt */}
            {!user ? (
              <div className="mt-6 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center py-8">
                <AlertCircle className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-bounce" />
                <h3 className="text-xs font-black text-slate-800 dark:text-slate-200">
                  {language === "en" ? "Authentication Required" : "লগইন করা আবশ্যক"}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">
                  {language === "en" ? "Sign in to submit complaints or vote for community improvements." : "অভিযোগ জানাতে বা ভোট দিতে অনুগ্রহ করে লগইন করুন।"}
                </p>
                <button
                  onClick={() => { setAuthMode("login"); setShowAuthModal(true); }}
                  className="mt-4 px-4 py-2 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md active:scale-95"
                >
                  {t("login")}
                </button>
              </div>
            ) : (
              /* Complaint submission form */
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {success && (
                  <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/35 text-[11px] font-bold">
                    {language === "en" ? "Report submitted successfully! Review queue starts now." : "অভিযোগ সফলভাবে দাখিল করা হয়েছে! স্বেচ্ছাসেবকরা খতিয়ে দেখছেন।"}
                  </div>
                )}
                {errorMsg && (
                  <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-100 dark:border-red-900/30 text-[11px] font-bold">
                    {errorMsg}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                      {language === "en" ? "Issue Title" : "অভিযোগের শিরোনাম"}
                    </label>
                    <input 
                      type="text" 
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Broken Street Light" 
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:border-blue-500/50 outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                      {language === "en" ? "Category" : "ক্যাটাগরি"}
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:border-blue-500/50 outline-none text-xs"
                    >
                      <option value="Garbage">{language === "en" ? "Garbage Accumulation" : "ময়লা-আবর্জনা"}</option>
                      <option value="Drainage">{language === "en" ? "Drainage & Clogging" : "ড্রেনেজ ও জলাবদ্ধতা"}</option>
                      <option value="Street Light">{language === "en" ? "Street Light Inactive" : "অনুপযুক্ত ল্যাম্পপোস্ট"}</option>
                      <option value="Road Repair">{language === "en" ? "Road Repair & Pot-hole" : "ভাঙা রাস্তা"}</option>
                      <option value="Other">{language === "en" ? "Other Civic Issues" : "অন্যান্য সমস্যা"}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    {language === "en" ? "Detailed Description" : "বিস্তারিত বিবরণ"}
                  </label>
                  <textarea 
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Describe where it is and details..." 
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:border-blue-500/50 outline-none text-xs"
                  />
                </div>

                {/* File Upload Attachment */}
                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    {language === "en" ? "Attach Photo (Optional)" : "ছবি যুক্ত করুন (ঐচ্ছিক)"}
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#010818] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-xs font-semibold cursor-pointer select-none">
                      <Upload className="w-4 h-4 text-blue-500" />
                      <span>{language === "en" ? "Choose Image File" : "ফাইল সিলেক্ট করুন"}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="hidden" 
                      />
                    </label>
                    {imagePreview && (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-10 h-10 object-cover rounded-lg border" 
                        />
                        <button
                          type="button"
                          onClick={() => { setImageFile(null); setImagePreview(null); }}
                          className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-red-500 rounded-full flex items-center justify-center text-white text-[8px] font-black"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hidden Lat/Lng Indicators */}
                <div className="flex gap-4 text-[9px] font-mono text-slate-400">
                  <span>LAT: {lat.toFixed(6)}</span>
                  <span>LNG: {lng.toFixed(6)}</span>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-blue-600 dark:bg-[#0CA671] hover:bg-blue-500 dark:hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{language === "en" ? "Submitting to Ward..." : "প্রেরণ করা হচ্ছে..."}</span>
                    </>
                  ) : (
                    <span>{language === "en" ? "Submit Report" : "রিপোর্ট সাবমিট করুন"}</span>
                  )}
                </button>

              </form>
            )}
          </div>

          {/* Directory Listings */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === "en" ? "Recent Civic Reports" : "সাম্প্রতিক অভিযোগ তালিকা"} ({reports.length})
            </h3>
            
            {reports.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-[#01205B] border rounded-xl text-xs text-slate-400">
                {language === "en" ? "No complaints recorded yet." : "কোনো অভিযোগ এখনও দাখিল করা হয়নি।"}
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((rep) => {
                  const isUpvoted = user ? (rep.upvotedBy || []).includes(user.uid) : false;
                  return (
                    <div 
                      key={rep.id} 
                      onClick={() => { setSelectedReport(rep); updateMapMarker(rep.lat, rep.lng); }}
                      className={`p-4 bg-white dark:bg-[#01205B] border rounded-xl shadow-sm transition-all cursor-pointer flex gap-4 ${
                        selectedReport?.id === rep.id 
                          ? "border-blue-500/80 dark:border-[#0CA671] ring-1 ring-blue-500/10" 
                          : "border-slate-200/60 dark:border-slate-800/40 hover:border-slate-350 dark:hover:border-slate-700"
                      }`}
                    >
                      {rep.imageUrl && (
                        <img 
                          src={rep.imageUrl} 
                          alt={rep.title} 
                          className="w-16 h-16 object-cover rounded-lg border shrink-0 bg-slate-50"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#04142F] text-slate-500 dark:text-slate-400">
                            {rep.category}
                          </span>
                          {getStatusBadge(rep.status)}
                        </div>
                        <h4 className="text-xs font-black text-slate-850 dark:text-slate-100 mt-2 truncate">
                          {rep.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 dark:text-[#859798] mt-1 leading-snug truncate">
                          {rep.description}
                        </p>

                        <div className="flex items-center justify-between mt-3 text-[9px] font-bold text-slate-400">
                          <span>By: {rep.userName}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleUpvote(rep.id, rep.upvotedBy); }}
                            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                              isUpvoted 
                                ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400" 
                                : "bg-slate-50 hover:bg-slate-100 dark:bg-[#04142F] hover:dark:bg-[#010818] text-slate-500 dark:text-slate-300"
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>{rep.votes || 0}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Map Viewer */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <div className="glass-card bg-white dark:bg-[#01205B] border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800/60 mb-4">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <MapIcon className="w-4.5 h-4.5 text-[#0CA671]" />
                <span className="text-xs font-black">{language === "en" ? "Complaint Location Tracker" : "অভিযোগের স্থান ম্যাপ"}</span>
              </div>
            </div>

            {/* Interactive map container */}
            <div 
              ref={mapContainerRef} 
              className="w-full h-80 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 z-10" 
            />
            
            <p className="text-[10px] text-slate-400 mt-3 font-semibold text-center leading-relaxed">
              {language === "en" 
                ? "Click anywhere on the map to change marker coordinate pins." 
                : "মার্কারের অবস্থান পরিবর্তন করতে ম্যাপের যেকোনো স্থানে ক্লিক করুন।"}
            </p>
          </div>

          {/* Details Card */}
          {selectedReport && (
            <div className="p-4 bg-white dark:bg-[#01205B] border rounded-xl shadow-sm space-y-3.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Report Details</span>
                {getStatusBadge(selectedReport.status)}
              </div>
              <h4 className="text-xs font-black text-slate-800 dark:text-white leading-tight">{selectedReport.title}</h4>
              <p className="text-[10px] text-slate-650 dark:text-[#859798] leading-relaxed font-bold">{selectedReport.description}</p>
              {selectedReport.imageUrl && (
                <img 
                  src={selectedReport.imageUrl} 
                  alt="Attachment" 
                  className="w-full h-40 object-cover rounded-lg border bg-slate-100" 
                />
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
