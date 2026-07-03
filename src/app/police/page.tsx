"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronRight, Shield, Bell, Send, AlertCircle, Loader2, CheckCircle2, Clock, Trash2, MessageSquare,
  FileText, Users, Eye, Plus, BarChart3
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, updateDoc, doc, deleteDoc, addDoc } from "firebase/firestore";

export default function PoliceDashboardPage() {
  const { 
    user, role, theme, language, t,
    setAuthMode, setShowAuthModal
  } = useAppContext();

  // Tab: "overview" | "complaints" | "tips" | "notices" | "tenants" | "crime" | "missing"
  const [activeTab, setActiveTab] = useState<"overview" | "complaints" | "tips" | "notices" | "tenants" | "crime" | "missing">("overview");

  // Directory lists
  const [complaints, setComplaints] = useState<any[]>([]);
  const [anonymousTips, setAnonymousTips] = useState<any[]>([]);
  const [tenantSubmissions, setTenantSubmissions] = useState<any[]>([]);
  const [policeNotices, setPoliceNotices] = useState<any[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Notice form states
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeTitleBn, setNoticeTitleBn] = useState("");
  const [noticeDesc, setNoticeDesc] = useState("");
  const [noticeDescBn, setNoticeDescBn] = useState("");
  const [postingNotice, setPostingNotice] = useState(false);
  const [noticeSuccess, setNoticeSuccess] = useState(false);

  // Check if role is authorized
  const isAuthorized = role === "police_admin" || role === "super_admin";

  // Load complaints
  useEffect(() => {
    if (!isAuthorized) return;
    const unsubscribe = onSnapshot(collection(db, "civic_reports"), (snapshot) => {
      const items: any[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setComplaints(items);
    });
    return () => unsubscribe();
  }, [isAuthorized]);

  // Load anonymous tips
  useEffect(() => {
    if (!isAuthorized) return;
    const unsubscribe = onSnapshot(collection(db, "anonymous_tips"), (snapshot) => {
      const items: any[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setAnonymousTips(items);
    });
    return () => unsubscribe();
  }, [isAuthorized]);

  // Load tenant verifications (submissions)
  useEffect(() => {
    if (!isAuthorized) return;
    const unsubscribe = onSnapshot(collection(db, "tenant_submissions"), (snapshot) => {
      const items: any[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setTenantSubmissions(items);
    });
    return () => unsubscribe();
  }, [isAuthorized]);

  // Load police notices
  useEffect(() => {
    if (!isAuthorized) return;
    const unsubscribe = onSnapshot(collection(db, "notices"), (snapshot) => {
      const items: any[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setPoliceNotices(items);
    });
    return () => unsubscribe();
  }, [isAuthorized]);

  // Update complaint status
  const handleUpdateStatus = async (complaintId: string, newStatus: string) => {
    setUpdatingId(complaintId);
    try {
      const docRef = doc(db, "civic_reports", complaintId);
      await updateDoc(docRef, { status: newStatus });
    } catch (err) {
      console.error("Status update failed:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete/dismiss anonymous tip
  const handleDismissTip = async (tipId: string) => {
    try {
      await deleteDoc(doc(db, "anonymous_tips", tipId));
    } catch (err) {
      console.error("Failed to dismiss tip:", err);
    }
  };

  // Approve tenant submission
  const handleApproveTenant = async (id: string) => {
    try {
      const docRef = doc(db, "tenant_submissions", id);
      await updateDoc(docRef, { verified: true, verifiedAt: new Date().toISOString() });
    } catch (err) {
      console.error(err);
    }
  };

  // Post Police Alert Notice
  const handlePostNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostingNotice(true);
    setNoticeSuccess(false);

    try {
      await addDoc(collection(db, "notices"), {
        title: noticeTitle,
        titleBn: noticeTitleBn,
        description: noticeDesc,
        descriptionBn: noticeDescBn,
        createdAt: new Date().toISOString()
      });
      setNoticeTitle("");
      setNoticeTitleBn("");
      setNoticeDesc("");
      setNoticeDescBn("");
      setNoticeSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setPostingNotice(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "resolved") {
      return (
        <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/10">
          Resolved
        </span>
      );
    }
    if (status === "in_progress") {
      return (
        <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-[#4A89DA] border border-blue-100 dark:border-blue-900/10">
          In Progress
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-500 border border-amber-100 dark:border-amber-900/10">
        Pending
      </span>
    );
  };

  if (!user || !isAuthorized) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white dark:bg-[#01205B] border rounded-2xl shadow-sm text-center py-10 space-y-4">
        <Shield className="w-10 h-10 text-red-500 mx-auto animate-pulse" />
        <h2 className="text-base font-black text-slate-900 dark:text-white">Authorized Access Only</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          This dashboard panel is restricted to verified police administration or precinct officers.
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
        <span className="text-slate-800 dark:text-white font-extrabold">Police Administration Panel</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Sidebar menu tabs */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card bg-white dark:bg-[#01205B] border p-4 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center gap-3 p-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-[#4A89DA] flex items-center justify-center font-black">
                <Shield className="w-5.5 h-5.5" />
              </div>
              <div className="leading-tight min-w-0">
                <span className="block text-xs font-black text-slate-850 dark:text-white truncate">Bakalia Thana</span>
                <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Precinct Console</span>
              </div>
            </div>

            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "complaints", label: "Complaints Registry", icon: Shield, badge: complaints.length },
              { id: "tips", label: "Anonymous Tips", icon: MessageSquare, badge: anonymousTips.length },
              { id: "notices", label: "Publish Alerts/Notices", icon: Bell, badge: policeNotices.length },
              { id: "tenants", label: "Tenant Verification", icon: Users, badge: tenantSubmissions.length },
              { id: "crime", label: "Crime Reports Log", icon: FileText },
              { id: "missing", label: "Missing Persons board", icon: Eye }
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
          
          {/* Tab 1: Overview stats */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">Thana Operations Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Active Complaints", value: complaints.filter(c => c.status !== "resolved").length },
                  { label: "Secret Tip-offs", value: anonymousTips.length },
                  { label: "Verifications Pending", value: tenantSubmissions.filter(t => !t.verified).length }
                ].map((stat, idx) => (
                  <div key={idx} className="p-4 bg-white dark:bg-[#01205B] border rounded-xl shadow-sm">
                    <span className="block text-[9.5px] text-slate-400 uppercase font-black">{stat.label}</span>
                    <span className="block text-2xl font-black text-slate-805 dark:text-white mt-1">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Complaints */}
          {activeTab === "complaints" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">Civic Complaints</h3>
              
              {complaints.length === 0 ? (
                <p className="p-8 text-center bg-white dark:bg-[#01205B] border rounded-xl text-xs text-slate-400">No complaints registered.</p>
              ) : (
                <div className="space-y-3">
                  {complaints.map(rep => (
                    <div key={rep.id} className="p-4 bg-white dark:bg-[#01205B] border rounded-xl shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[8.5px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-600">{rep.category}</span>
                        {getStatusBadge(rep.status)}
                      </div>
                      <h4 className="text-xs font-black text-slate-800 dark:text-white">{rep.title}</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">{rep.description}</p>
                      
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/40 flex items-center justify-between text-[9px] text-slate-400 font-bold">
                        <span>Submitted By: {rep.userName || "Citizen"}</span>
                        <div className="flex gap-2">
                          <button
                            disabled={updatingId === rep.id}
                            onClick={() => handleUpdateStatus(rep.id, "in_progress")}
                            className="text-blue-500 hover:underline"
                          >
                            Set In Progress
                          </button>
                          <button
                            disabled={updatingId === rep.id}
                            onClick={() => handleUpdateStatus(rep.id, "resolved")}
                            className="text-emerald-500 hover:underline"
                          >
                            Mark Resolved
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Anonymous Tips */}
          {activeTab === "tips" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">Secret Tip-offs</h3>
              
              {anonymousTips.length === 0 ? (
                <p className="p-8 text-center bg-white dark:bg-[#01205B] border rounded-xl text-xs text-slate-450">No tip-offs received.</p>
              ) : (
                <div className="space-y-3">
                  {anonymousTips.map(tip => (
                    <div key={tip.id} className="p-4 bg-[#0D1B2A] border border-slate-800 rounded-xl text-white space-y-3">
                      <p className="text-[10.5px] font-semibold leading-relaxed text-slate-100">{tip.details}</p>
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                        <span>AREA: {tip.location}</span>
                        <button
                          onClick={() => handleDismissTip(tip.id)}
                          className="text-red-500 hover:text-red-400 font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Dismiss</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Notices Form */}
          {activeTab === "notices" && (
            <div className="glass-card bg-white dark:bg-[#01205B] border p-6 rounded-2xl shadow-sm space-y-4 animate-in fade-in duration-200">
              <h3 className="text-base font-black text-slate-900 dark:text-white border-b pb-3">Publish Police Alert Notice</h3>
              
              {noticeSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border rounded-lg text-[10.5px] font-bold">
                  Police alert notice published successfully!
                </div>
              )}

              <form onSubmit={handlePostNotice} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Title (English)</label>
                    <input 
                      type="text" 
                      required
                      value={noticeTitle}
                      onChange={(e) => setNoticeTitle(e.target.value)}
                      placeholder="e.g. Block search notice"
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Title (Bangla)</label>
                    <input 
                      type="text" 
                      required
                      value={noticeTitleBn}
                      onChange={(e) => setNoticeTitleBn(e.target.value)}
                      placeholder="উদাঃ ব্লক তল্লাশি বিজ্ঞপ্তি"
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Description (EN)</label>
                    <textarea 
                      required
                      rows={3}
                      value={noticeDesc}
                      onChange={(e) => setNoticeDesc(e.target.value)}
                      placeholder="Details of the announcement"
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Description (BN)</label>
                    <textarea 
                      required
                      rows={3}
                      value={noticeDescBn}
                      onChange={(e) => setNoticeDescBn(e.target.value)}
                      placeholder="বিস্তারিত ঘোষণা বাংলায় লিখুন"
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-[#010818] border text-xs text-slate-805 dark:text-white outline-none resize-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={postingNotice}
                  className="px-4 py-2 bg-blue-600 dark:bg-[#0CA671] text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95"
                >
                  {postingNotice ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Publish Alert Notice</span>
                </button>
              </form>
            </div>
          )}

          {/* Tab 5: Tenant Verification */}
          {activeTab === "tenants" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">Tenant Form Submissions</h3>
              
              {tenantSubmissions.length === 0 ? (
                <p className="p-8 text-center bg-white dark:bg-[#01205B] border rounded-xl text-xs text-slate-450">No tenant forms registered yet.</p>
              ) : (
                <div className="space-y-3">
                  {tenantSubmissions.map(tn => (
                    <div key={tn.id} className="p-4 bg-white dark:bg-[#01205B] border rounded-xl shadow-sm space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black text-slate-800 dark:text-white">{tn.fullName}</h4>
                        {tn.verified ? (
                          <span className="text-[8px] font-black px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 uppercase border border-emerald-100">Verified</span>
                        ) : (
                          <button
                            onClick={() => handleApproveTenant(tn.id)}
                            className="text-[8px] font-black px-2 py-0.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all uppercase border border-blue-100"
                          >
                            Approve/Verify
                          </button>
                        )}
                      </div>
                      <p className="text-[9.5px] text-slate-500 font-semibold leading-relaxed">
                        NID: {tn.nid} | Phone: {tn.phone} | Home Address: {tn.homeAddress}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 6: Crime Reports */}
          {activeTab === "crime" && (
            <div className="glass-card bg-white dark:bg-[#01205B] border p-6 rounded-2xl shadow-sm py-12 text-center text-xs text-slate-400 animate-in fade-in duration-200">
              <FileText className="w-8 h-8 mx-auto text-slate-350 mb-2" />
              <h4 className="font-black text-slate-700 dark:text-slate-200">Crime Log Database</h4>
              <p className="mt-1">All database indices are encrypted and secured.</p>
            </div>
          )}

          {/* Tab 7: Missing Persons */}
          {activeTab === "missing" && (
            <div className="glass-card bg-white dark:bg-[#01205B] border p-6 rounded-2xl shadow-sm py-12 text-center text-xs text-slate-400 animate-in fade-in duration-200">
              <Eye className="w-8 h-8 mx-auto text-slate-355 mb-2" />
              <h4 className="font-black text-slate-700 dark:text-slate-200">Missing Persons Board</h4>
              <p className="mt-1">Synchronized with city central listings indices.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
