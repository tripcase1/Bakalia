"use client";

import React, { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { 
  ChevronRight, Map as MapIcon, ShieldAlert, Home as HomeIcon, Layers, Filter, Eye, RefreshCw
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function FullMapViewPage() {
  const { language, t, gpsCoords } = useAppContext();

  // Filters state
  const [showComplaints, setShowComplaints] = useState(true);
  const [showMosques, setShowMosques] = useState(true);
  const [showRentals, setShowRentals] = useState(true);

  // Firestore raw states
  const [complaints, setComplaints] = useState<any[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);

  // Map references
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerGroupRef = useRef<any>(null);

  // Fixed mosques data
  const mosques = [
    { name: language === "en" ? "West Bakalia Jame Masjid" : "পশ্চিম বাকলিয়া জামে মসজিদ", lat: 22.3551, lng: 91.8402, category: "mosque" },
    { name: language === "en" ? "Baitul Mamur Jame Masjid" : "বাইতুল মামুর জামে মসজিদ", lat: 22.3470, lng: 91.8475, category: "mosque" },
    { name: language === "en" ? "Shah Amanat Jame Mosque" : "শাহ আমানত জামে মসজিদ", lat: 22.3395, lng: 91.8430, category: "mosque" }
  ];

  // Subscribe to complaints
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "civic_reports"), (snapshot) => {
      const items: any[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.lat && data.lng) {
          items.push({ id: docSnap.id, ...data, category: "complaint" });
        }
      });
      setComplaints(items);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to rentals
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "listings"), (snapshot) => {
      const items: any[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.lat && data.lng) {
          items.push({ id: docSnap.id, ...data, category: "rental" });
        }
      });
      // Fallback coordinates mock if missing lat/lng
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (!data.lat || !data.lng) {
          // Approximate around East Bakalia centroid
          items.push({ 
            id: docSnap.id, 
            ...data, 
            lat: 22.3475 + (Math.random() - 0.5) * 0.005, 
            lng: 91.8482 + (Math.random() - 0.5) * 0.005,
            category: "rental" 
          });
        }
      });
      setRentals(items);
    });
    return () => unsubscribe();
  }, []);

  // Initialize and Update Map markers
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let LInstance: any = null;
    let localMap: any = null;
    let localGroup: any = null;

    import("leaflet").then((LModule) => {
      LInstance = LModule;

      // Fix Leaflet icons assets paths
      delete LInstance.Icon.Default.prototype._getIconUrl;
      LInstance.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
      });

      // Avoid double map instantiations
      if (!mapRef.current) {
        const centerLat = gpsCoords?.lat || 22.3486;
        const centerLng = gpsCoords?.lng || 91.8436;

        localMap = LInstance.map(mapContainerRef.current, {
          center: [centerLat, centerLng],
          zoom: 14,
          zoomControl: false
        });

        LInstance.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(localMap);

        LInstance.control.zoom({ position: "bottomright" }).addTo(localMap);

        localGroup = LInstance.layerGroup().addTo(localMap);
        
        mapRef.current = localMap;
        markerGroupRef.current = localGroup;
      } else {
        localMap = mapRef.current;
        localGroup = markerGroupRef.current;
      }

      // Clear existing marker layer groups
      localGroup.clearLayers();

      // Custom color marker creators
      const createCustomColorIcon = (color: string) => {
        return LInstance.divIcon({
          className: "custom-map-pin",
          html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });
      };

      const complaintIcon = createCustomColorIcon("#EF4444"); // Red pin
      const mosqueIcon = createCustomColorIcon("#0CA671");    // Green pin
      const rentalIcon = createCustomColorIcon("#3B82F6");    // Blue pin

      // Append complaints pins
      if (showComplaints) {
        complaints.forEach(item => {
          const marker = LInstance.marker([item.lat, item.lng], { icon: complaintIcon });
          marker.bindPopup(`
            <div style="font-family: sans-serif; font-size: 11px; font-weight: bold; color: #1E293B; line-height: 1.4;">
              <span style="color: #EF4444; font-size: 8px; font-weight: 900; text-transform: uppercase;">Civic Complaint</span>
              <div style="margin-top: 4px; font-size: 11.5px; font-weight: 900;">${item.title}</div>
              <div style="margin-top: 2px; color: #64748B; font-weight: 500;">${item.description}</div>
              <div style="margin-top: 4px; font-size: 8px; font-weight: 900; text-transform: uppercase; color: #94A3B8;">STATUS: ${item.status}</div>
            </div>
          `);
          localGroup.addLayer(marker);
        });
      }

      // Append rentals pins
      if (showRentals) {
        rentals.forEach(item => {
          const marker = LInstance.marker([item.lat, item.lng], { icon: rentalIcon });
          marker.bindPopup(`
            <div style="font-family: sans-serif; font-size: 11px; font-weight: bold; color: #1E293B; line-height: 1.4;">
              <span style="color: #3B82F6; font-size: 8px; font-weight: 900; text-transform: uppercase;">To-Let Rent</span>
              <div style="margin-top: 4px; font-size: 11.5px; font-weight: 900;">${item.title}</div>
              <div style="margin-top: 2px; color: #10B981; font-weight: 900;">BDT ${item.rentPrice.toLocaleString()} /mo</div>
              <div style="margin-top: 2px; color: #64748B; font-weight: 500;">${item.address}</div>
            </div>
          `);
          localGroup.addLayer(marker);
        });
      }

      // Append Mosques pins
      if (showMosques) {
        mosques.forEach(item => {
          const marker = LInstance.marker([item.lat, item.lng], { icon: mosqueIcon });
          marker.bindPopup(`
            <div style="font-family: sans-serif; font-size: 11px; font-weight: bold; color: #1E293B; line-height: 1.4;">
              <span style="color: #0CA671; font-size: 8px; font-weight: 900; text-transform: uppercase;">Mosque</span>
              <div style="margin-top: 4px; font-size: 11.5px; font-weight: 900;">${item.name}</div>
            </div>
          `);
          localGroup.addLayer(marker);
        });
      }

    }).catch(err => console.error("Leaflet loader failed in FullMap:", err));

  }, [complaints, rentals, showComplaints, showMosques, showRentals, gpsCoords]);

  return (
    <div className="flex-1 flex flex-col relative h-[calc(100vh-64px)]">
      
      {/* Dynamic leafet map container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full bg-slate-100 z-10" 
      />

      {/* Floating control card overlay */}
      <div className="absolute top-4 left-4 z-20 max-w-sm w-72 glass-card bg-white/95 dark:bg-[#01205B]/95 border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/40 mb-3">
          <div className="flex items-center gap-2 text-slate-850 dark:text-white">
            <MapIcon className="w-4.5 h-4.5 text-[#0CA671]" />
            <span className="text-xs font-black">Bakalia Map Layers</span>
          </div>
          <button 
            onClick={() => {
              if (mapRef.current && gpsCoords) {
                mapRef.current.setView([gpsCoords.lat, gpsCoords.lng], 15);
              }
            }}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-4 leading-relaxed font-bold">
          Toggle pins checklist to customize dynamic overlays on the city map.
        </p>

        {/* Filter checklist */}
        <div className="space-y-2.5">
          <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#010818] border border-slate-150/40 dark:border-slate-800/30 cursor-pointer select-none active:scale-[0.99] transition-all">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>Complaints</span>
            </div>
            <input 
              type="checkbox" 
              checked={showComplaints}
              onChange={() => setShowComplaints(!showComplaints)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-transparent border-slate-200 dark:border-slate-800 outline-none"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#010818] border border-slate-150/40 dark:border-slate-800/30 cursor-pointer select-none active:scale-[0.99] transition-all">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>To-Let Rentals</span>
            </div>
            <input 
              type="checkbox" 
              checked={showRentals}
              onChange={() => setShowRentals(!showRentals)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-transparent border-slate-200 dark:border-slate-800 outline-none"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#010818] border border-slate-150/40 dark:border-slate-800/30 cursor-pointer select-none active:scale-[0.99] transition-all">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0CA671]" />
              <span>Mosques</span>
            </div>
            <input 
              type="checkbox" 
              checked={showMosques}
              onChange={() => setShowMosques(!showMosques)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-transparent border-slate-200 dark:border-slate-800 outline-none"
            />
          </label>
        </div>

      </div>

    </div>
  );
}
