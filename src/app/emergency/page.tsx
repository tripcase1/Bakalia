"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronRight, AlertTriangle, Phone, Shield, Flame, Hospital, 
  MapPin, Compass, Locate, Info, Navigation, Activity, ExternalLink
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface EmergencyService {
  id: string;
  name: string;
  nameBn?: string;
  type: "police" | "fire" | "ambulance" | "hospital" | "pharmacy";
  address: string;
  addressBn?: string;
  phone: string;
  lat: number;
  lng: number;
  status: string;
  statusBn?: string;
  distance?: number;
}

const DEFAULT_LAT = 22.3475;
const DEFAULT_LNG = 91.8482;

const fallbackServices: EmergencyService[] = [
  // Police
  {
    id: "pol-1",
    name: "Bakalia Thana Police Precinct",
    nameBn: "বাকলিয়া থানা পুলিশ স্টেশন",
    type: "police",
    address: "Bakalia Access Road, Chattogram",
    addressBn: "বাকলিয়া এক্সেস রোড, চট্টগ্রাম",
    phone: "+88031610424",
    lat: 22.3503,
    lng: 91.8415,
    status: "Open 24 Hours",
    statusBn: "২৪ ঘণ্টা খোলা"
  },
  {
    id: "pol-2",
    name: "Chawkbazar Police Station Outpost",
    nameBn: "চকবাজার থানা পুলিশ ফাঁড়ি",
    type: "police",
    address: "Chawkbazar Circle, Chattogram",
    addressBn: "চকবাজার মোড়, চট্টগ্রাম",
    phone: "+88031610425",
    lat: 22.3582,
    lng: 91.8385,
    status: "Open 24 Hours",
    statusBn: "২৪ ঘণ্টা খোলা"
  },
  {
    id: "pol-3",
    name: "Kotwali Thana Precinct Box",
    nameBn: "কোতোয়ালী থানা পুলিশ বক্স",
    type: "police",
    address: "Kotwali intersection, Chattogram",
    addressBn: "কোতোয়ালী মোড়, চট্টগ্রাম",
    phone: "+88031610426",
    lat: 22.3365,
    lng: 91.8356,
    status: "Open 24 Hours",
    statusBn: "২৪ ঘণ্টা খোলা"
  },
  // Fire
  {
    id: "fire-1",
    name: "Bakalia Fire Station Outpost",
    nameBn: "বাকলিয়া ফায়ার স্টেশন আউটপোস্ট",
    type: "fire",
    address: "TTC Road, East Bakalia, Chattogram",
    addressBn: "টিটিসি রোড, পূর্ব বাকলিয়া, চট্টগ্রাম",
    phone: "+88031713356",
    lat: 22.3485,
    lng: 91.8492,
    status: "Open 24 Hours",
    statusBn: "২৪ ঘণ্টা খোলা"
  },
  {
    id: "fire-2",
    name: "Agrabad Central Division Fire HQ",
    nameBn: "আগ্রাবাদ ফায়ার সার্ভিস ও সিভিল ডিফেন্স সদর দপ্তর",
    type: "fire",
    address: "Agrabad Commercial Area, Chattogram",
    addressBn: "আগ্রাবাদ বাণিজ্যিক এলাকা, চট্টগ্রাম",
    phone: "+88031713309",
    lat: 22.3298,
    lng: 91.8123,
    status: "Open 24 Hours",
    statusBn: "২৪ ঘণ্টা খোলা"
  },
  // Hospitals
  {
    id: "hosp-1",
    name: "Bakalia General Hospital",
    nameBn: "বাকলিয়া জেনারেল হাসপাতাল",
    type: "hospital",
    address: "Kalamia Bazar, Bakalia, Chattogram",
    addressBn: "কালামিয়া বাজার, বাকলিয়া, চট্টগ্রাম",
    phone: "+880312521526",
    lat: 22.3468,
    lng: 91.8465,
    status: "Open 24 Hours",
    statusBn: "২৪ ঘণ্টা খোলা"
  },
  {
    id: "hosp-2",
    name: "Chittagong Medical College Hospital",
    nameBn: "চট্টগ্রাম মেডিকেল কলেজ হাসপাতাল (চমেক)",
    type: "hospital",
    address: "CMCH Road, Chawkbazar, Chattogram",
    addressBn: "চমেক হাসপাতাল রোড, চকবাজার, চট্টগ্রাম",
    phone: "+880312521527",
    lat: 22.3595,
    lng: 91.8428,
    status: "Open 24 Hours",
    statusBn: "২৪ ঘণ্টা খোলা"
  },
  // Pharmacies
  {
    id: "pharm-1",
    name: "Lazz Pharma Bakalia Model Store",
    nameBn: "লাজ ফার্মা বাকলিয়া মডেল স্টোর",
    type: "pharmacy",
    address: "Kalamia Bazar Road, Bakalia, Chattogram",
    addressBn: "কালামিয়া বাজার রোড, বাকলিয়া, চট্টগ্রাম",
    phone: "+8801819322144",
    lat: 22.3512,
    lng: 91.8402,
    status: "Open 24 Hours",
    statusBn: "২৪ ঘণ্টা খোলা"
  },
  {
    id: "pharm-2",
    name: "Tamanna Model Pharmacy",
    nameBn: "তমন্না মডেল ফার্মেসি",
    type: "pharmacy",
    address: "DC Road, West Bakalia, Chattogram",
    addressBn: "ডিসি রোড, পশ্চিম বাকলিয়া, চট্টগ্রাম",
    phone: "+8801712345678",
    lat: 22.3491,
    lng: 91.8435,
    status: "Open: 8:00 AM - 12:00 AM",
    statusBn: "খোলা: সকাল ৮:০০ - রাত ১২:০০"
  },
  // Ambulances
  {
    id: "amb-1",
    name: "Bakalia Emergency Ambulance Dispatch",
    nameBn: "বাকলিয়া জরুরি অ্যাম্বুলেন্স সার্ভিস",
    type: "ambulance",
    address: "Hospital Road, Bakalia, Chattogram",
    addressBn: "হাসপাতাল রোড, বাকলিয়া, চট্টগ্রাম",
    phone: "+8801819322145",
    lat: 22.3470,
    lng: 91.8480,
    status: "Open 24 Hours",
    statusBn: "২৪ ঘণ্টা খোলা"
  },
  {
    id: "amb-2",
    name: "Al-Amin Civic Ambulance Service",
    nameBn: "আল-আমিন সিভিক অ্যাম্বুলেন্স সার্ভিস",
    type: "ambulance",
    address: "Chawkbazar Gate, Chattogram",
    addressBn: "চকবাজার গেট, চট্টগ্রাম",
    phone: "+8801712345679",
    lat: 22.3550,
    lng: 91.8410,
    status: "Open 24 Hours",
    statusBn: "২৪ ঘণ্টা খোলা"
  }
];

const toBanglaDigits = (numStr: string | number): string => {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(numStr).replace(/[0-9]/g, (digit) => banglaDigits[parseInt(digit)]);
};

const getServiceTypeLabel = (type: string, lang: string) => {
  if (lang === "bn") {
    switch (type) {
      case "police": return "পুলিশ";
      case "fire": return "ফায়ার সার্ভিস";
      case "hospital": return "হাসপাতাল";
      case "pharmacy": return "ফার্মেসি";
      case "ambulance": return "অ্যাম্বুলেন্স";
      default: return "জরুরি সেবা";
    }
  }
  return type.charAt(0).toUpperCase() + type.slice(1);
};

// Haversine formula to compute distance in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
};

const getServiceIcon = (type: string) => {
  switch (type) {
    case "police": return <Shield className="w-5 h-5 text-blue-500" />;
    case "fire": return <Flame className="w-5 h-5 text-amber-500" />;
    case "hospital": return <Hospital className="w-5 h-5 text-emerald-500" />;
    case "pharmacy": return <Activity className="w-5 h-5 text-purple-500" />;
    default: return <Hospital className="w-5 h-5 text-rose-500" />;
  }
};

const getServiceColor = (type: string) => {
  switch (type) {
    case "police": return "bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-900/20";
    case "fire": return "bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-900/20";
    case "hospital": return "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-900/20";
    case "pharmacy": return "bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-900/20";
    default: return "bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-900/20";
  }
};

export default function EmergencyPage() {
  const { language, t } = useAppContext();
  
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "loading" | "granted" | "denied">("loading");
  const [services, setServices] = useState<EmergencyService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    // 1. Fetch data from Firestore or fallback to static list
    const loadData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "emergency_services"));
        if (!querySnapshot.empty) {
          const list: EmergencyService[] = [];
          querySnapshot.forEach(docSnap => {
            const data = docSnap.data();
            list.push({
              id: docSnap.id,
              name: data.name,
              nameBn: data.nameBn || data.name,
              type: data.type,
              address: data.address,
              addressBn: data.addressBn || data.address,
              phone: data.phone,
              lat: Number(data.lat),
              lng: Number(data.lng),
              status: data.status || "Open 24 Hours",
              statusBn: data.statusBn || data.status || "২৪ ঘণ্টা খোলা"
            });
          });
          return list;
        }
      } catch (err) {
        console.warn("Firestore fetch error, loading backup catalog list:", err);
      }
      return fallbackServices;
    };

    // 2. Request user Geolocation
    const fetchLocationAndData = async () => {
      setLoading(true);
      const fetchedServices = await loadData();

      if (typeof window !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setGpsCoords({ lat, lng });
            setGpsStatus("granted");

            // Calculate distance and sort by nearest distance
            const processed = fetchedServices.map(item => ({
              ...item,
              distance: calculateDistance(lat, lng, item.lat, item.lng)
            })).sort((a, b) => (a.distance || 0) - (b.distance || 0));

            setServices(processed);
            setLoading(false);
          },
          (error) => {
            console.warn("Location permission denied/failed. Falling back to national listings.", error);
            setGpsStatus("denied");
            
            const processed = fetchedServices.map(item => ({
              ...item,
              distance: calculateDistance(DEFAULT_LAT, DEFAULT_LNG, item.lat, item.lng)
            })).sort((a, b) => (a.distance || 0) - (b.distance || 0));

            setServices(processed);
            setLoading(false);
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      } else {
        setGpsStatus("denied");
        setServices(fetchedServices);
        setLoading(false);
      }
    };

    fetchLocationAndData();
  }, []);

  const filteredServices = services.filter(s => {
    if (filterType === "all") return true;
    return s.type === filterType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-wider">
        <a href="/" className="hover:text-slate-700 dark:hover:text-slate-350 transition-colors">{t("home")}</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-white font-extrabold">{t("emergency")}</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-7">
        
        {/* Header Widget */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-red-700 to-rose-950 p-6 sm:p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 p-6 opacity-10 shrink-0 pointer-events-none select-none">
            <Activity className="w-40 h-40 animate-pulse text-white" />
          </div>
          <div className="relative z-10 max-w-lg space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black tracking-wider uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping inline-block" />
              <span>{language === "en" ? "Live GPS Response Outpost" : "জিপিএস রেসপন্স আউটপোস্ট"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {language === "en" ? "24/7 Smart Emergency Center" : "২৪/৭ স্মার্ট জরুরি কেন্দ্র"}
            </h2>
            <p className="text-xs sm:text-sm text-red-100 leading-relaxed font-bold">
              {language === "en"
                ? "Locate the nearest responder, police outpost, fire division, hospital, or medicine store sorted by distance."
                : "জিপিএস লোকেশনের মাধ্যমে সবচেয়ে কাছের police, ফায়ার স্টেশন, হাসপাতাল ও জরুরি ফার্মেসি শনাক্ত করুন।"}
            </p>
          </div>
        </div>

        {/* GPS Permission Denied fallback widget */}
        {gpsStatus === "denied" && (
          <div className="glass-card bg-red-500/10 border border-red-500/25 p-5 rounded-3xl shadow-sm space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-start gap-3.5">
              <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <h3 className="text-sm font-black text-red-650 dark:text-red-455 leading-tight">
                  {language === "en" ? "Location Access Denied" : "লোকেশন এক্সেস বন্ধ রয়েছে"}
                </h3>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                  {language === "en"
                    ? "For safety, the Bangladesh National Emergency Services have been displayed below. Enable browser location services to detect nearby units."
                    : "আপনার নিরাপত্তার স্বার্থে বাংলাদেশের জাতীয় জরুরি নাম্বারসমূহ নিচে প্রদর্শন করা হলো। নিকটস্থ পুলিশ, ফায়ার ও হাসপাতালের তথ্য পেতে জিপিএস চালু করুন।"}
                </p>
              </div>
            </div>

            {/* National hotline options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: language === "en" ? "National Help Desk" : "জাতীয় হেল্প ডেস্ক", phone: "999", color: "from-rose-600 to-red-500" },
                { name: language === "en" ? "Ambulance Dispatch" : "জরুরি অ্যাম্বুলেন্স", phone: "01819322145", color: "from-emerald-600 to-teal-500" },
                { name: language === "en" ? "Fire Control Outpost" : "ফায়ার সার্ভিস", phone: "+88031713356", color: "from-amber-600 to-orange-500" }
              ].map((hotline, idx) => (
                <div key={idx} className={`rounded-2xl p-4 bg-gradient-to-tr ${hotline.color} text-white shadow-sm flex items-center justify-between`}>
                  <div className="min-w-0 pr-1">
                    <span className="block text-[8px] uppercase tracking-wider font-extrabold text-white/80">{hotline.name}</span>
                    <span className="block text-lg font-black tracking-widest font-mono text-white mt-0.5 leading-none">
                      {language === "bn" ? toBanglaDigits(hotline.phone) : hotline.phone}
                    </span>
                  </div>
                  <a 
                    href={`tel:${hotline.phone}`}
                    className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 text-red-650 flex items-center justify-center shadow active:scale-90 transition-all shrink-0"
                    title={`Call ${hotline.phone}`}
                  >
                    <Phone className="w-4 h-4 text-rose-600" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories Tab Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {[
            { id: "all", label: language === "en" ? "All Services" : "সব সেবা" },
            { id: "police", label: language === "en" ? "Police" : "পুলিশ" },
            { id: "fire", label: language === "en" ? "Fire Service" : "ফায়ার" },
            { id: "hospital", label: language === "en" ? "Hospital" : "হাসপাতাল" },
            { id: "pharmacy", label: language === "en" ? "Pharmacy" : "ফার্মেসি" },
            { id: "ambulance", label: language === "en" ? "Ambulance" : "অ্যাম্বুলেন্স" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-black shrink-0 transition-all border ${
                filterType === tab.id 
                  ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-md" 
                  : "bg-white dark:bg-[#01205B] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-[#04142F]/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main List Area */}
        {loading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-5 bg-white dark:bg-[#01205B] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-850 shrink-0" />
                  <div className="space-y-2 w-full">
                    <div className="h-3 bg-slate-200 dark:bg-slate-850 rounded w-1/4" />
                    <div className="h-4.5 bg-slate-200 dark:bg-slate-850 rounded w-3/4" />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="h-3 bg-slate-200 dark:bg-slate-850 rounded w-5/6" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-850 rounded w-1/2" />
                </div>
                <div className="flex items-center justify-between pt-2 gap-3">
                  <div className="h-10 bg-slate-200 dark:bg-slate-850 rounded-2xl w-full" />
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-850 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredServices.length > 0 ? (
          /* Sorted Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div 
                key={service.id} 
                className="p-5 bg-white dark:bg-[#01205B] border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-350 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="space-y-3.5">
                  
                  {/* Top Category and Indicator */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center shrink-0 ${getServiceColor(service.type)}`}>
                        {getServiceIcon(service.type)}
                      </div>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500">
                        {language === "bn" ? getServiceTypeLabel(service.type, "bn") : service.type}
                      </span>
                    </div>
                    {service.status && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[8px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-[#0CA671]">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1" />
                        {language === "bn" && service.statusBn ? service.statusBn : service.status}
                      </span>
                    )}
                  </div>

                  {/* Service Details */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#4A89DA] transition-colors leading-tight">
                      {language === "bn" && service.nameBn ? service.nameBn : service.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-455 font-bold flex items-start gap-1 leading-snug">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      {language === "bn" && service.addressBn ? service.addressBn : service.address}
                    </p>
                  </div>

                  {/* Calculated Proximity Display */}
                  {service.distance !== undefined && (
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-600 dark:text-[#0CA671] bg-emerald-500/10 dark:bg-emerald-500/5 px-2.5 py-1 rounded-xl w-max">
                      <Navigation className="w-3.5 h-3.5 animate-pulse" />
                      <span>
                        {language === "bn"
                          ? (gpsStatus === "granted" 
                              ? `${toBanglaDigits(service.distance)} কি.মি. দূরে` 
                              : `${toBanglaDigits(service.distance)} কি.মি. কেন্দ্র হতে`)
                          : (gpsStatus === "granted" 
                              ? `${service.distance} km away` 
                              : `${service.distance} km from center`)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Call & Navigate Actions */}
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 mt-2">
                  {/* Smart phone number visibility and dialer */}
                  <a 
                    href={`tel:${service.phone}`}
                    className="w-full py-2.5 px-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-455 rounded-2xl flex items-center justify-between hover:bg-rose-100/50 dark:hover:bg-rose-950/30 active:scale-[0.99] transition-all group/call"
                  >
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-rose-500 animate-pulse" />
                      <span className="font-mono text-xs font-black tracking-wider">
                        {language === "bn" ? toBanglaDigits(service.phone) : service.phone}
                      </span>
                    </div>
                    <span className="text-[9px] uppercase font-black bg-rose-600 text-white px-2.5 py-1 rounded-xl group-hover/call:bg-rose-500 transition-colors">
                      {language === "bn" ? "কল করুন" : "CALL NOW"}
                    </span>
                  </a>

                  {/* Smart navigation directions */}
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${service.lat},${service.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3.5 bg-slate-900 dark:bg-[#04142F] border border-slate-800 text-white rounded-2xl text-[10px] font-black flex items-center justify-center gap-1.5 hover:bg-slate-800 dark:hover:bg-[#04142F]/80 active:scale-[0.99] transition-all select-none"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-350" />
                    <span>
                      {language === "bn" 
                        ? `দিকনির্দেশনা পান ${service.distance ? `(${toBanglaDigits(service.distance)} কি.মি.)` : ""}`
                        : `Navigate Responder ${service.distance ? `(${service.distance} km)` : ""}`}
                    </span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-[#01205B]">
            <AlertTriangle className="w-10 h-10 mx-auto text-slate-400 mb-2" />
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-300">
              {language === "en" ? "No services found" : "কোন সেবা পাওয়া যায়নি"}
            </h4>
          </div>
        )}

      </div>
    </div>
  );
}
