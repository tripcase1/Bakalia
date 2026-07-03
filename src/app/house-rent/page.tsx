"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Upload, ChevronRight, AlertCircle, Loader2, Home as HomeIcon, Bed, Bath, DollarSign, Phone
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function HouseRentPage() {
  const { 
    user, theme, language, t,
    setAuthMode, setShowAuthModal
  } = useAppContext();

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rentPrice, setRentPrice] = useState("");
  const [beds, setBeds] = useState("2");
  const [baths, setBaths] = useState("2");
  const [address, setAddress] = useState("");
  const [ward, setWard] = useState("Ward 17");
  const [contactPhone, setContactPhone] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Directory lists
  const [properties, setProperties] = useState<any[]>([]);
  const [filterPrice, setFilterPrice] = useState<number>(30000); // Max Rent Price filter
  const [filterBeds, setFilterBeds] = useState("All");
  const [filterWard, setFilterWard] = useState("All");

  // Load from Firestore
  useEffect(() => {
    const q = collection(db, "listings");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: any[] = [];
      snapshot.forEach(docSnap => {
        docs.push({ id: docSnap.id, ...docSnap.data() });
      });
      docs.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setProperties(docs);
    });
    return () => unsubscribe();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

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
        const storageRef = ref(storage, `listings/${Date.now()}_${imageFile.name}`);
        const uploadResult = await uploadBytes(storageRef, compressedBlob);
        imageUrl = await getDownloadURL(uploadResult.ref);
      }

      await addDoc(collection(db, "listings"), {
        title,
        description,
        rentPrice: parseInt(rentPrice, 10),
        beds: parseInt(beds, 10),
        baths: parseInt(baths, 10),
        address,
        ward,
        contactPhone,
        imageUrl,
        userId: user.uid,
        userName: user.displayName || user.email || "Citizen",
        createdAt: new Date().toISOString()
      });

      setTitle("");
      setDescription("");
      setRentPrice("");
      setAddress("");
      setContactPhone("");
      setImageFile(null);
      setImagePreview(null);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to submit property listing.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(prop => {
    const matchPrice = prop.rentPrice <= filterPrice;
    const matchBeds = filterBeds === "All" || prop.beds.toString() === filterBeds;
    const matchWard = filterWard === "All" || prop.ward === filterWard;
    return matchPrice && matchBeds && matchWard;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-wider">
        <a href="/" className="hover:text-slate-700 dark:hover:text-slate-350 transition-colors">{t("home")}</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-white font-extrabold">{t("houseRent")}</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Submit listing */}
        <div className="lg:col-span-4">
          <div className="glass-card bg-white dark:bg-[#01205B] border-slate-200 dark:border-[#01205B]/85 p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              {language === "en" ? "Post a House Rent (To-Let)" : "ভাড়া বাসার বিজ্ঞাপন দিন"}
            </h2>
            <p className="text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
              {language === "en" 
                ? "List your apartment or flat available for rent in Bakalia Wards." 
                : "বাকলিয়ার যে কোনো ওয়ার্ডে আপনার টু-লেট বা ভাড়া বাসার বিজ্ঞাপন প্রকাশ করুন।"}
            </p>

            {!user ? (
              <div className="p-4 border border-dashed rounded-xl text-center py-6">
                <AlertCircle className="w-6 h-6 text-blue-500 mx-auto mb-2 animate-bounce" />
                <h3 className="text-xs font-black text-slate-850 dark:text-slate-200">{t("login")}</h3>
                <button
                  onClick={() => { setAuthMode("login"); setShowAuthModal(true); }}
                  className="mt-3 px-4 py-2 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md active:scale-95"
                >
                  {t("login")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {success && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border rounded-lg text-[10.5px] font-bold">
                    {language === "en" ? "Listing posted successfully!" : "সফলভাবে বিজ্ঞাপন প্রকাশ করা হয়েছে!"}
                  </div>
                )}
                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-600 border rounded-lg text-[10.5px] font-bold">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider font-mono">Title</label>
                  <input 
                    type="text" 
                    required 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Spacious 3 Bed Flat"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Rent (BDT)</label>
                    <input 
                      type="number" 
                      required 
                      value={rentPrice} 
                      onChange={(e) => setRentPrice(e.target.value)}
                      placeholder="15000"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Ward</label>
                    <select
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                    >
                      <option value="Ward 17">Ward 17</option>
                      <option value="Ward 18">Ward 18</option>
                      <option value="Ward 19">Ward 19</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Beds</label>
                    <select
                      value={beds}
                      onChange={(e) => setBeds(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                    >
                      <option value="1">1 Bed</option>
                      <option value="2">2 Beds</option>
                      <option value="3">3 Beds</option>
                      <option value="4">4+ Beds</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Baths</label>
                    <select
                      value={baths}
                      onChange={(e) => setBaths(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                    >
                      <option value="1">1 Bath</option>
                      <option value="2">2 Baths</option>
                      <option value="3">3 Baths</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Full Address</label>
                  <input 
                    type="text" 
                    required 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Flat B3, Road 4, West Bakalia"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Contact Phone</label>
                  <input 
                    type="text" 
                    required 
                    value={contactPhone} 
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. 01812345678"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Property Photo</label>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 px-3 py-2 border rounded-lg bg-slate-50 dark:bg-[#010818] text-xs font-semibold cursor-pointer">
                      <Upload className="w-4 h-4 text-blue-500" />
                      <span>Choose File</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" className="w-8 h-8 object-cover rounded border" />
                    )}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-2.5 bg-blue-600 dark:bg-[#0CA671] text-white rounded-lg text-xs font-bold shadow-md hover:bg-blue-550 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Publish advertisement</span>
                </button>
              </form>
            )}

          </div>
        </div>

        {/* Right Side: List and Filters */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Filters Bar */}
          <div className="grid sm:grid-cols-3 gap-4 p-4 bg-white dark:bg-[#01205B] border rounded-xl shadow-sm">
            <div>
              <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                Max Rent BDT: {filterPrice.toLocaleString()}
              </label>
              <input 
                type="range" 
                min="5000" 
                max="50000" 
                step="1000"
                value={filterPrice}
                onChange={(e) => setFilterPrice(parseInt(e.target.value, 10))}
                className="w-full accent-blue-500 dark:accent-[#0CA671]"
              />
            </div>

            <div>
              <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Bedrooms</label>
              <select
                value={filterBeds}
                onChange={(e) => setFilterBeds(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none"
              >
                <option value="All">All Bedroom Counts</option>
                <option value="1">1 Bed</option>
                <option value="2">2 Beds</option>
                <option value="3">3 Beds</option>
                <option value="4">4+ Beds</option>
              </select>
            </div>

            <div>
              <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Ward Area</label>
              <select
                value={filterWard}
                onChange={(e) => setFilterWard(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none"
              >
                <option value="All">All Wards</option>
                <option value="Ward 17">Ward 17</option>
                <option value="Ward 18">Ward 18</option>
                <option value="Ward 19">Ward 19</option>
              </select>
            </div>
          </div>

          {/* Properties Grid */}
          {filteredProperties.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#01205B] border rounded-xl text-xs text-slate-450">
              No matching properties available for rent.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredProperties.map(prop => (
                <div key={prop.id} className="bg-white dark:bg-[#01205B] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
                  
                  {prop.imageUrl ? (
                    <img src={prop.imageUrl} alt={prop.title} className="w-full h-40 object-cover bg-slate-55" />
                  ) : (
                    <div className="w-full h-40 bg-slate-100 dark:bg-slate-800/40 flex items-center justify-center text-slate-400 dark:text-slate-650">
                      <HomeIcon className="w-8 h-8" />
                    </div>
                  )}

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase">{prop.ward}</span>
                        <span className="text-xs font-black text-emerald-600 dark:text-[#0CA671] flex items-center font-mono">
                          ৳ {prop.rentPrice.toLocaleString()} /mo
                        </span>
                      </div>

                      <h3 className="text-xs font-black text-slate-850 dark:text-slate-100 mt-2.5 truncate">{prop.title}</h3>
                      <p className="text-[9.5px] text-slate-450 dark:text-[#859798] mt-1 truncate">{prop.address}</p>

                      {/* Rooms specifications */}
                      <div className="flex gap-4 mt-3 text-[10px] font-bold text-slate-500">
                        <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5 text-blue-500" /> {prop.beds} Beds</span>
                        <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-emerald-505" /> {prop.baths} Baths</span>
                      </div>
                    </div>

                    <div className="pt-3.5 mt-3.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-400">Owner: {prop.userName}</span>
                      <a 
                        href={`tel:${prop.contactPhone}`}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-[#04142F] hover:dark:bg-[#010818] text-slate-700 dark:text-slate-250 rounded-lg transition-all flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-emerald-500" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
