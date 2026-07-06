"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronRight, Users, Bell, Send, AlertCircle, Loader2, CheckCircle2, Clock, Trash2,
  FileText, Shield, Eye, ShieldAlert, BarChart3, HelpCircle, ShoppingBag, Plus, Star
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, addDoc } from "firebase/firestore";

export default function BusinessDashboardPage() {


  const { user, role, theme, language, t, authLoading } = useAppContext();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 dark:text-[#0CA671] animate-spin" />
      </div>
    );
  }

  // Tab: "profile" | "listings" | "analytics"
  const [activeTab, setActiveTab] = useState<"profile" | "listings" | "analytics">("profile");

  // Form states
  const [businessName, setBusinessName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("Retail");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Listing states
  const [itemTitle, setItemTitle] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [listingSuccess, setListingSuccess] = useState(false);
  const [listingLoading, setListingLoading] = useState(false);

  const [myListings, setMyListings] = useState<any[]>([]);

  const isAuthorized = role === "business_admin" || role === "super_admin";

  // Load business specific marketplace listings
  useEffect(() => {
    if (!isAuthorized || !user) return;
    const q = query(collection(db, "marketplace_items"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setMyListings(items);
    });
    return () => unsubscribe();
  }, [isAuthorized, user]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleAddListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setListingLoading(true);
    setListingSuccess(false);

    try {
      await addDoc(collection(db, "marketplace_items"), {
        title: itemTitle,
        price: Number(itemPrice),
        description: itemDesc,
        userId: user.uid,
        userName: businessName || user.displayName || "Store Owner",
        createdAt: new Date().toISOString()
      });
      setItemTitle("");
      setItemPrice("");
      setItemDesc("");
      setListingSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setListingLoading(false);
    }
  };

  if (!user || !isAuthorized) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white dark:bg-[#01205B] border rounded-2xl shadow-sm text-center py-10 space-y-4">
        <ShieldAlert className="w-10 h-10 text-red-500 mx-auto animate-bounce" />
        <h2 className="text-base font-black text-slate-905 dark:text-white">Business Account Required</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          This dashboard panel is restricted to verified local business accounts.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-wider">
        <a href="/" className="hover:text-slate-700 dark:hover:text-slate-350 transition-colors">{t("home")}</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-850 dark:text-white font-extrabold">Business Dashboard</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Sidebar menu tabs */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card bg-white dark:bg-[#01205B] border p-4 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center gap-3 p-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-[#4A89DA] flex items-center justify-center font-black">
                <ShoppingBag className="w-5.5 h-5.5 text-blue-500" />
              </div>
              <div className="leading-tight">
                <span className="block text-xs font-black text-slate-850 dark:text-white">Verified Business</span>
                <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Console Panel</span>
              </div>
            </div>

            {[
              { id: "profile", label: "Business Profile", icon: Users },
              { id: "listings", label: "Marketplace Listings", icon: Plus, badge: myListings.length },
              { id: "analytics", label: "Store Analytics", icon: BarChart3 }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-blue-600 dark:bg-[#0CA671] text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-355 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${activeTab === tab.id ? "bg-white text-slate-905" : "bg-slate-100 dark:bg-[#04142F] text-slate-500"}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Tab Contents Panel */}
        <div className="lg:col-span-9">
          
          {/* Tab 1: Profile View */}
          {activeTab === "profile" && (
            <div className="glass-card bg-white dark:bg-[#01205B] border p-6 rounded-2xl shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white">Business Store Profile</h3>
                <span className="text-[8.5px] font-black px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-100 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  <span>VERIFIED BADGE</span>
                </span>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {profileSuccess && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border rounded-lg text-[10.5px] font-bold">
                    Store details updated successfully!
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Business Name</label>
                    <input 
                      type="text" 
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Bakalia Grocery mart"
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Store Category</label>
                    <select
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none font-bold"
                    >
                      <option value="Retail">Retail Store</option>
                      <option value="Food">Restaurant / Food</option>
                      <option value="Services">Services Providers</option>
                    </select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Contact Phone</label>
                    <input 
                      type="text" 
                      value={businessPhone}
                      onChange={(e) => setBusinessPhone(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Registered Email</label>
                    <input 
                      type="email" 
                      disabled
                      value={user?.email || ""}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-100 dark:bg-[#010818]/45 border text-xs text-slate-400 outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Store Address</label>
                  <input 
                    type="text" 
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs outline-none"
                  />
                </div>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 dark:bg-[#0CA671] text-white rounded-lg text-xs font-bold shadow-md">
                  Update Store Profile
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: Marketplace Listings Form & lists */}
          {activeTab === "listings" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="glass-card bg-white dark:bg-[#01205B] border p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-base font-black text-slate-900 dark:text-white border-b pb-3">Publish Marketplace Item</h3>
                {listingSuccess && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border rounded-lg text-[10.5px] font-bold">
                    Marketplace listing published successfully!
                  </div>
                )}
                <form onSubmit={handleAddListing} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Item Name / Title</label>
                      <input 
                        type="text" 
                        required
                        value={itemTitle}
                        onChange={(e) => setItemTitle(e.target.value)}
                        placeholder="e.g. Fresh organic mangoes"
                        className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Price (৳)</label>
                      <input 
                        type="number" 
                        required
                        value={itemPrice}
                        onChange={(e) => setItemPrice(e.target.value)}
                        placeholder="e.g. 250"
                        className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Item Description</label>
                    <textarea 
                      required
                      rows={3}
                      value={itemDesc}
                      onChange={(e) => setItemDesc(e.target.value)}
                      placeholder="Add details, sizing, or store promotions context..."
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none resize-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={listingLoading}
                    className="px-4 py-2 bg-blue-600 dark:bg-[#0CA671] text-white rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    {listingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    <span>Publish Item</span>
                  </button>
                </form>
              </div>

              {/* My listings */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-405">My Store Items ({myListings.length})</h3>
                {myListings.length === 0 ? (
                  <p className="p-8 text-center bg-white dark:bg-[#01205B] border rounded-xl text-xs text-slate-400">No active products listed.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {myListings.map(lst => (
                      <div key={lst.id} className="p-4 bg-white dark:bg-[#01205B] border rounded-xl shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-[9.5px] font-black text-emerald-600 font-mono">৳ {lst.price}</span>
                          </div>
                          <h4 className="text-xs font-black text-slate-800 dark:text-white mt-1 truncate">{lst.title}</h4>
                          <p className="text-[9px] text-slate-500 mt-1 line-clamp-2">{lst.description}</p>
                        </div>
                        <span className="block text-[8px] text-slate-400 mt-3 font-mono">Date: {new Date(lst.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Analytics */}
          {activeTab === "analytics" && (
            <div className="glass-card bg-white dark:bg-[#01205B] border p-6 rounded-2xl shadow-sm py-12 text-center text-xs text-slate-455 animate-in fade-in duration-200">
              <BarChart3 className="w-8 h-8 mx-auto text-slate-350 mb-2 animate-bounce" />
              <h4 className="font-black text-slate-700 dark:text-slate-200">Marketplace Conversions Stats</h4>
              <p className="mt-1">Analyze product page views, items clicks, and store impressions logs.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
