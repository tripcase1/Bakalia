"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronRight, User, ShieldAlert, CheckCircle2, Clock, Eye, AlertCircle, Loader2, Phone, Mail, FileText, 
  MapPin, ShoppingCart, HelpCircle, Heart, Bell, Flame, Settings, LogOut, Search, Bed, Bath, Globe, Home
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

export default function CitizenDashboardPage() {
  const { 
    user, role, theme, language, t,
    setAuthMode, setShowAuthModal, triggerSOS, logout
  } = useAppContext();

  // Tab state
  const [activeTab, setActiveTab] = useState<"profile" | "complaints" | "lostfound" | "rentals" | "saved" | "notifications" | "sos" | "settings">("profile");

  // Profile update states
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [ward, setWard] = useState("Ward 17");
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Dynamic user specific directories
  const [myComplaints, setMyComplaints] = useState<any[]>([]);
  const [myLostItems, setMyLostItems] = useState<any[]>([]);
  const [myRentals, setMyRentals] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Sync profile details
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      // Load extra details from Firestore if available
      const loadUserDoc = async () => {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (userSnap.exists()) {
          const uData = userSnap.data() as any;
          setPhoneNumber(uData.phoneNumber || "");
          setAddress(uData.address || "");
          setWard(uData.ward || "Ward 17");
        }
      };
      loadUserDoc().catch(err => console.warn(err));
    }
  }, [user]);

  // Load complaints
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "civic_reports"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setMyComplaints(items);
    });
    return () => unsubscribe();
  }, [user]);

  // Load lost & found items
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "lost_found"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setMyLostItems(items);
    });
    return () => unsubscribe();
  }, [user]);

  // Load properties
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "listings"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setMyRentals(items);
    });
    return () => unsubscribe();
  }, [user]);

  // Load general notices as notifications
  useEffect(() => {
    const q = query(collection(db, "notices"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setNotifications(items);
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setUpdatingProfile(true);
    setProfileSuccess(false);

    try {
      await updateProfile(user, { displayName });
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName,
        phoneNumber,
        address,
        ward
      });
      setProfileSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingProfile(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "resolved") {
      return (
        <span className="px-2 py-0.5 rounded text-[8px] font-black bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/10">
          Resolved
        </span>
      );
    }
    if (status === "in_progress") {
      return (
        <span className="px-2 py-0.5 rounded text-[8px] font-black bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-[#4A89DA] border border-blue-100 dark:border-blue-900/10">
          In Progress
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[8px] font-black bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-500 border border-amber-100 dark:border-amber-900/10">
        Pending
      </span>
    );
  };

  // Helper import from firebase
  const getDoc = async (docRef: any) => {
    const snap = await docRef;
    // Client wrapper
    const { getDoc: getDocFs } = await import("firebase/firestore");
    return getDocFs(docRef);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-wider">
        <a href="/" className="hover:text-slate-700 dark:hover:text-slate-350 transition-colors">{t("home")}</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-white font-extrabold">Citizen Dashboard</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Sidebar Navigation Menu */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card bg-white dark:bg-[#01205B] border rounded-2xl p-4 shadow-sm space-y-2">
            <div className="flex items-center gap-3 p-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-[#4A89DA] flex items-center justify-center font-black">
                <User className="w-5.5 h-5.5" />
              </div>
              <div className="leading-tight min-w-0">
                <span className="block text-xs font-black text-slate-850 dark:text-white truncate">{user?.displayName || "Citizen User"}</span>
                <span className="text-[8px] font-black uppercase text-blue-500 dark:text-blue-400 tracking-wider">Citizen Account</span>
              </div>
            </div>

            {[
              { id: "profile", label: "My Profile", icon: User },
              { id: "complaints", label: "My Complaints", icon: ShieldAlert, badge: myComplaints.length },
              { id: "lostfound", label: "My Lost & Found", icon: Search, badge: myLostItems.length },
              { id: "rentals", label: "My Rentals", icon: Home, badge: myRentals.length },
              { id: "notifications", label: "Notifications", icon: Bell, badge: notifications.length },
              { id: "sos", label: "Emergency SOS", icon: Flame },
              { id: "settings", label: "Settings", icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-blue-600 dark:bg-[#0CA671] text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${activeTab === tab.id ? "bg-white text-slate-900" : "bg-slate-100 dark:bg-[#04142F] text-slate-500"}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <button 
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Right Side: Tab Contents Panel */}
        <div className="lg:col-span-9">
          
          {/* Tab 1: Profile View */}
          {activeTab === "profile" && (
            <div className="glass-card bg-white dark:bg-[#01205B] border p-6 rounded-2xl shadow-sm space-y-6 animate-in fade-in duration-200">
              <h3 className="text-base font-black text-slate-900 dark:text-white border-b pb-3">My Profile Information</h3>
              
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {profileSuccess && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border rounded-lg text-[10.5px] font-bold">
                    Profile successfully updated!
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Display Name</label>
                    <input 
                      type="text" 
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Phone Contact</label>
                    <input 
                      type="text" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 01712345678"
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Ward Area</label>
                    <select
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none font-bold"
                    >
                      <option value="Ward 17">Ward 17</option>
                      <option value="Ward 18">Ward 18</option>
                      <option value="Ward 19">Ward 19</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Registered Email</label>
                    <input 
                      type="email" 
                      disabled
                      value={user?.email || ""}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-100 dark:bg-[#010818]/40 border text-xs text-slate-400 outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Home Address</label>
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Block/Road details"
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={updatingProfile}
                  className="px-4 py-2 bg-blue-600 dark:bg-[#0CA671] text-white rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                >
                  {updatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Update Profile Info</span>
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: Complaints */}
          {activeTab === "complaints" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">My Filed Civic Complaints</h3>
              
              {myComplaints.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-[#01205B] border rounded-xl text-xs text-slate-400 space-y-2">
                  <FileText className="w-8 h-8 mx-auto text-slate-300" />
                  <p>You have not registered any complaints yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myComplaints.map(rep => (
                    <div key={rep.id} className="p-4 bg-white dark:bg-[#01205B] border rounded-xl shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-50 dark:bg-[#010818] text-slate-500">
                          {rep.category}
                        </span>
                        {getStatusBadge(rep.status)}
                      </div>
                      <h4 className="text-xs font-black text-slate-850 dark:text-white leading-snug">{rep.title}</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-bold">{rep.description}</p>
                      <div className="text-[8.5px] text-slate-400 font-mono">
                        Date: {new Date(rep.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Lost & Found */}
          {activeTab === "lostfound" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">My Lost & Found Listings</h3>
              
              {myLostItems.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-[#01205B] border rounded-xl text-xs text-slate-400 space-y-2">
                  <Search className="w-8 h-8 mx-auto text-slate-300" />
                  <p>You have not listed any lost/found items yet.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {myLostItems.map(item => (
                    <div key={item.id} className="p-4 bg-white dark:bg-[#01205B] border rounded-xl shadow-sm flex flex-col justify-between">
                      <div>
                        <span className="text-[8.5px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-600">{item.category}</span>
                        <h4 className="text-xs font-black text-slate-800 dark:text-white mt-2 truncate">{item.title}</h4>
                        <p className="text-[9.5px] text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                      </div>
                      <span className="block text-[8px] text-slate-400 mt-3 font-mono">Date: {new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Rentals */}
          {activeTab === "rentals" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">My Rental Advertisements</h3>
              
              {myRentals.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-[#01205B] border rounded-xl text-xs text-slate-400 space-y-2">
                  <Home className="w-8 h-8 mx-auto text-slate-300" />
                  <p>You have not published any apartment rentals yet.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {myRentals.map(prop => (
                    <div key={prop.id} className="p-4 bg-white dark:bg-[#01205B] border rounded-xl shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-[8.5px] font-black text-blue-600 uppercase">{prop.ward}</span>
                          <span className="text-xs font-black text-emerald-600 font-mono">৳ {prop.rentPrice.toLocaleString()} /mo</span>
                        </div>
                        <h4 className="text-xs font-black text-slate-800 dark:text-white mt-2 truncate">{prop.title}</h4>
                        <p className="text-[9px] text-slate-500 mt-0.5 truncate">{prop.address}</p>
                      </div>
                      <div className="flex gap-4 mt-3 text-[10px] text-slate-450 font-bold">
                        <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {prop.beds} Beds</span>
                        <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {prop.baths} Baths</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Notifications */}
          {activeTab === "notifications" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">System Notifications</h3>
              
              {notifications.length === 0 ? (
                <p className="p-8 text-center bg-white dark:bg-[#01205B] border rounded-xl text-xs text-slate-400">No recent notifications.</p>
              ) : (
                <div className="space-y-3">
                  {notifications.map(notif => (
                    <div key={notif.id} className="p-4 bg-white dark:bg-[#01205B] border rounded-xl shadow-sm">
                      <span className="block text-[8.5px] text-slate-400 font-mono">{new Date(notif.createdAt).toLocaleDateString()}</span>
                      <h4 className="text-xs font-black text-slate-850 dark:text-white mt-1">{notif.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-semibold">{notif.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 6: SOS Trigger */}
          {activeTab === "sos" && (
            <div className="p-6 bg-white dark:bg-[#01205B] border rounded-2xl shadow-sm text-center py-12 space-y-4 animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-rose-500/10 text-red-500 flex items-center justify-center mx-auto mb-2 animate-ping" />
              <h3 className="text-base font-black text-slate-900 dark:text-white">Emergency Assistance SOS</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Clicking below initiates a dynamic 24/7 SOS alert signal sending GPS coordinates pins directly to Wards police stations.
              </p>
              <button
                onClick={triggerSOS}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-lg shadow-red-500/20 active:scale-95 transition-all"
              >
                Trigger SOS Alert
              </button>
            </div>
          )}

          {/* Tab 7: Settings */}
          {activeTab === "settings" && (
            <div className="glass-card bg-white dark:bg-[#01205B] border p-6 rounded-2xl shadow-sm space-y-4 animate-in fade-in duration-200">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Portal Settings</h3>
              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-350">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#010818] rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="block font-black">Email Alerts Notifications</span>
                    <span className="text-[10px] text-slate-400">Receive weekly newsletter digests</span>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#010818] rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="block font-black">Anonymous Profile Search</span>
                    <span className="text-[10px] text-slate-400">Hide my phone number from directory lists</span>
                  </div>
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600" />
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
