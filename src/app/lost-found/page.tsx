"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Upload, ChevronRight, AlertCircle, ThumbsUp, Loader2, Info, Eye
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function LostFoundPage() {
  const { 
    user, theme, language, t,
    setAuthMode, setShowAuthModal
  } = useAppContext();

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Documents");
  const [contactPhone, setContactPhone] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Directory lists
  const [items, setItems] = useState<any[]>([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Load from Firestore
  useEffect(() => {
    const q = collection(db, "lost_found");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: any[] = [];
      snapshot.forEach(docSnap => {
        docs.push({ id: docSnap.id, ...docSnap.data() });
      });
      docs.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setItems(docs);
    });
    return () => unsubscribe();
  }, []);

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
        const storageRef = ref(storage, `lost_found/${Date.now()}_${imageFile.name}`);
        const uploadResult = await uploadBytes(storageRef, compressedBlob);
        imageUrl = await getDownloadURL(uploadResult.ref);
      }

      await addDoc(collection(db, "lost_found"), {
        title,
        description,
        category,
        contactPhone,
        imageUrl,
        userId: user.uid,
        userName: user.displayName || user.email || "Citizen",
        createdAt: new Date().toISOString()
      });

      setTitle("");
      setDescription("");
      setContactPhone("");
      setImageFile(null);
      setImagePreview(null);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to submit listing.");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchCategory = filterCategory === "All" || item.category === filterCategory;
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-wider">
        <a href="/" className="hover:text-slate-700 dark:hover:text-slate-350 transition-colors">{t("home")}</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-white font-extrabold">{t("lostFound")}</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Submit Item form */}
        <div className="lg:col-span-4">
          <div className="glass-card bg-white dark:bg-[#01205B] border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              {language === "en" ? "Report Lost or Found Item" : "হারানো বা প্রাপ্তি রিপোর্ট করুন"}
            </h2>
            <p className="text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
              {language === "en" 
                ? "Submit details of lost keys, wallets, or documents to help reunite them with owners." 
                : "হারানো বা খুঁজে পাওয়া জিনিসপত্রের বিবরণ দাখিল করুন যেন মালিক সহজে খুঁজে পান।"}
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
                    {language === "en" ? "Listing submitted successfully!" : "সফলভাবে তালিকাভুক্ত করা হয়েছে!"}
                  </div>
                )}
                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-600 border rounded-lg text-[10.5px] font-bold">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Item Name / Title</label>
                  <input 
                    type="text" 
                    required 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Black Leather Wallet"
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none focus:border-blue-500/40"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                  >
                    <option value="Documents">Documents & IDs</option>
                    <option value="Electronics">Electronics & Phones</option>
                    <option value="Keys">Keys</option>
                    <option value="Wallet">Wallet & Purses</option>
                    <option value="Pet">Pets</option>
                    <option value="Other">Other Items</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Contact Phone</label>
                  <input 
                    type="text" 
                    required 
                    value={contactPhone} 
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. 01712345678"
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Description</label>
                  <textarea 
                    required 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Where was it lost/found and special markings..."
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-850 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Upload Photo</label>
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
                  <span>Report Item</span>
                </button>
              </form>
            )}

          </div>
        </div>

        {/* Right Side: List and Filters */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-[#01205B] border rounded-xl shadow-sm">
            <div className="relative w-full sm:max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lost items..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-800 dark:text-white outline-none focus:border-blue-500/40"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto scrollbar-none">
              {["All", "Documents", "Electronics", "Keys", "Wallet", "Pet"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all ${
                    filterCategory === cat
                      ? "bg-blue-600 dark:bg-[#0CA671] text-white border-transparent"
                      : "bg-slate-50 dark:bg-[#010818] border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-400 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Items List Grid */}
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#01205B] border rounded-xl text-xs text-slate-450">
              No matching reported items found.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredItems.map(item => (
                <div key={item.id} className="p-4 bg-white dark:bg-[#01205B] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[8px] font-extrabold bg-blue-50 text-blue-605 dark:bg-blue-950/30 dark:text-[#4A89DA] uppercase border border-blue-100 dark:border-blue-900/10">
                        {item.category}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-xs font-black text-slate-850 dark:text-slate-100 mt-3 truncate">{item.title}</h3>
                    <p className="text-[10px] text-slate-500 dark:text-[#859798] mt-1.5 leading-snug line-clamp-2">{item.description}</p>
                    
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-32 object-cover rounded-lg border mt-3 bg-slate-50" loading="lazy" />
                    )}
                  </div>

                  <div className="pt-3.5 mt-3.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-400">By: {item.userName}</span>
                    <a 
                      href={`tel:${item.contactPhone}`}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-[#04142F] hover:dark:bg-[#010818] text-slate-700 dark:text-slate-250 rounded-lg transition-all"
                    >
                      Call Contact
                    </a>
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
