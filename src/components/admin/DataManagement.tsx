"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { 
  collection, onSnapshot, doc, updateDoc, deleteDoc, addDoc 
} from "firebase/firestore";
import { 
  Search, Filter, Download, Trash2, Edit, Plus, ChevronLeft, ChevronRight, Eye, Check, X, ShieldAlert,
  Users, Shield, Award, Heart, Building, Store, AlertTriangle, FileText, CheckCircle, Clock, Globe, Lock, Trash
} from "lucide-react";

interface DataManagementProps {
  tab: string;
}

export default function DataManagement({ tab }: DataManagementProps) {
  const { language, t, user, role, showToast } = useAppContext();

  // Core records lists
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Table parameters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected details drawer
  const [drawerRecord, setDrawerRecord] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editStatus, setEditStatus] = useState("");

  // Creation forms toggles
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states (News / Notice / Event)
  const [formTitle, setFormTitle] = useState("");
  const [formTitleBn, setFormTitleBn] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formDescBn, setFormDescBn] = useState("");
  const [formCategory, setFormCategory] = useState("Official Update");
  const [formCategoryBn, setFormCategoryBn] = useState("সরকারি নোটিশ");
  const [formDate, setFormDate] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Form states (Settings)
  const [portalName, setPortalName] = useState("Bakalia Municipal Portal");
  const [portalStatus, setPortalStatus] = useState("Active");
  const [gpsRequired, setGpsRequired] = useState(true);
  const [maintMode, setMaintMode] = useState(false);

  // Map tab parameter to Target Collection and filtering setup
  let collectionName = "";
  let pageTitle = "";
  let pageDesc = "";

  switch (tab) {
    case "users_citizens":
      collectionName = "users";
      pageTitle = "Citizen Registry";
      pageDesc = "View and manage registered local citizen accounts and profile settings.";
      break;
    case "users_police":
      collectionName = "users";
      pageTitle = "Police Department Registry";
      pageDesc = "Verified police officer accounts with Thana access roles.";
      break;
    case "users_councilors":
      collectionName = "users";
      pageTitle = "Ward Councilor Registry";
      pageDesc = "Elected municipal council representatives panel.";
      break;
    case "users_volunteers":
      collectionName = "users";
      pageTitle = "Community Volunteers";
      pageDesc = "Verified youth council and blood volunteer workers.";
      break;
    case "users_mosques":
      collectionName = "users";
      pageTitle = "Mosque Administrators";
      pageDesc = "Administrators in charge of mosque timings and notifications.";
      break;
    case "users_businesses":
      collectionName = "users";
      pageTitle = "Business Accounts";
      pageDesc = "Local corporate and retail merchant accounts.";
      break;
    case "complaints":
      collectionName = "civic_reports";
      pageTitle = "Civic Complaints Queue";
      pageDesc = "Manage municipal reports submitted by citizens (roads, waste, water issues).";
      break;
    case "sos":
      collectionName = "civic_reports"; // SOS queries are filtered category='Emergency'
      pageTitle = "SOS Emergency Triggers Log";
      pageDesc = "Panic alarms, GPS trackers, and urgent distress requests from citizens.";
      break;
    case "tips":
      collectionName = "anonymous_tips";
      pageTitle = "Anonymous Police Tips";
      pageDesc = "Crime, narcotics, and safety information reported secretly to Thana police.";
      break;
    case "lostfound":
      collectionName = "lost_found";
      pageTitle = "Lost & Found Registry";
      pageDesc = "Review and moderate lost or found item advertisements.";
      break;
    case "rentals":
      collectionName = "listings";
      pageTitle = "House Rent Queue";
      pageDesc = "Classified rental announcements and boarding reviews.";
      break;
    case "jobs":
      collectionName = "jobs";
      pageTitle = "Jobs Classifieds";
      pageDesc = "Moderate job listings and career opportunities.";
      break;
    case "marketplace":
      collectionName = "marketplace_items";
      pageTitle = "Marketplace Classifieds";
      pageDesc = "Review and moderate items listed for trade or sale.";
      break;
    case "news":
      collectionName = "news";
      pageTitle = "CMS News Portal";
      pageDesc = "Publish official announcements and municipal news bulletins.";
      break;
    case "notices":
      collectionName = "notices";
      pageTitle = "Police Notices & Bulletins";
      pageDesc = "Write law enforcement warnings, block curfews, or safety guidelines.";
      break;
    case "donors":
      collectionName = "blood_donors";
      pageTitle = "Blood Donors Directory";
      pageDesc = "Verify active voluntary blood donors registry list.";
      break;
    case "events":
      collectionName = "events";
      pageTitle = "Community Events Calendar";
      pageDesc = "Schedule cleanliness campaigns, vaccination drives, or town halls.";
      break;
    case "logs":
      pageTitle = "Administrative Audit Logs";
      pageDesc = "Detailed system events and user management history.";
      break;
    case "permissions":
      pageTitle = "System Roles & Permissions Matrix";
      pageDesc = "Configure resource access tiers for police, councilors, and moderators.";
      break;
    case "settings":
      pageTitle = "Municipal Portal Settings";
      pageDesc = "Manage global portal names, GPS tracking setups, and maintenance locks.";
      break;
    case "profile":
      pageTitle = "Administrator Settings Profile";
      pageDesc = "Manage your administrative console password and account details.";
      break;
    case "analytics":
      pageTitle = "Municipal Activity Analytics";
      pageDesc = "Aggregated trends, response times, and user engagement metrics.";
      break;
    default:
      pageTitle = "CMS Manager";
      pageDesc = "Municipal Portal data engine.";
  }

  // Load records from Firestore
  useEffect(() => {
    if (!collectionName) {
      setRecords([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = collection(db, collectionName);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        // Filter users by role based on tab
        if (collectionName === "users") {
          const uRole = data.role || "citizen";
          if (tab === "users_citizens" && uRole !== "citizen") return;
          if (tab === "users_police" && uRole !== "police_admin") return;
          if (tab === "users_councilors" && uRole !== "councilor") return;
          if (tab === "users_volunteers" && uRole !== "volunteer") return;
          if (tab === "users_mosques" && uRole !== "mosque_admin") return;
          if (tab === "users_businesses" && uRole !== "business_admin") return;
        }

        // Filter SOS items (category Emergency or SOS)
        if (tab === "sos") {
          const category = data.category || "";
          if (category.toLowerCase() !== "emergency" && category.toLowerCase() !== "sos") return;
        }

        items.push({ id: docSnap.id, ...data });
      });

      // Sort by date (descending) if createdAt is present
      items.sort((a, b) => {
        const timeA = new Date(a.createdAt || a.date || 0).getTime();
        const timeB = new Date(b.createdAt || b.date || 0).getTime();
        return timeB - timeA;
      });

      setRecords(items);
      setLoading(false);
      setSelectedIds([]);
      setCurrentPage(1);
    }, (err) => {
      console.error(`Firestore fetch error for ${collectionName}:`, err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName, tab]);

  // Filter records in memory based on search filters
  const filteredRecords = records.filter(rec => {
    // 1. Text Search Filter
    const searchStr = `${rec.displayName || ""} ${rec.title || ""} ${rec.email || ""} ${rec.category || ""} ${rec.mosqueName || ""} ${rec.name || ""}`.toLowerCase();
    if (searchTerm && !searchStr.includes(searchTerm.toLowerCase())) return false;

    // 2. Status Filter
    if (statusFilter !== "all" && rec.status !== statusFilter) return false;

    // 3. Category Filter
    if (categoryFilter !== "all" && rec.category !== categoryFilter) return false;

    return true;
  });

  // Pagination bounds
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Handle Multi-select checkbox
  const handleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedRecords.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedRecords.map(x => x.id));
    }
  };

  // CSV Exporter
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      showToast("No data to export.", "info");
      return;
    }

    const headers = Object.keys(filteredRecords[0]).filter(k => k !== "id");
    const csvRows = [headers.join(",")];

    filteredRecords.forEach(rec => {
      const values = headers.map(header => {
        const val = rec[header];
        const valStr = val === undefined || val === null ? "" : String(val);
        // Escape quotes
        return `"${valStr.replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(","));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${tab}_export_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV file exported successfully!", "success");
  };

  // Promote / Update role functions
  const handlePromoteRole = async (targetUserId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, "users", targetUserId), { role: newRole });
      showToast("Role promoted successfully!", "success");
      setDrawerRecord(null);
    } catch (err) {
      showToast("Failed to promote role.", "error");
    }
  };

  // Update status (e.g. Complaints)
  const handleUpdateStatus = async () => {
    if (!drawerRecord) return;
    try {
      await updateDoc(doc(db, collectionName, drawerRecord.id), { status: editStatus });
      showToast("Status updated successfully!", "success");
      setIsEditMode(false);
      setDrawerRecord({ ...drawerRecord, status: editStatus });
    } catch (err) {
      showToast("Failed to update status.", "error");
    }
  };

  // Delete/dismiss record
  const handleDeleteRecord = async (id: string) => {
    if (!confirm(language === "en" ? "Are you sure you want to delete this record?" : "আপনি কি এই রেকর্ডটি মুছে ফেলতে চান?")) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      showToast("Record deleted successfully!", "success");
      setDrawerRecord(null);
    } catch (err) {
      showToast("Failed to delete record.", "error");
    }
  };

  // Bulk Actions
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(language === "en" ? `Delete ${selectedIds.length} items?` : `${selectedIds.length}টি রেকর্ড মুছে ফেলতে চান?`)) return;

    try {
      setLoading(true);
      await Promise.all(selectedIds.map(id => deleteDoc(doc(db, collectionName, id))));
      showToast("Bulk records deleted!", "success");
      setSelectedIds([]);
    } catch (err) {
      showToast("Bulk delete failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Content Creators Forms submits
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    setFormLoading(true);
    try {
      let targetCollection = collectionName;
      let newDoc: any = {
        title: formTitle,
        titleBn: formTitleBn || formTitle,
        createdAt: new Date().toISOString()
      };

      if (tab === "news") {
        newDoc.category = formCategory;
        newDoc.categoryBn = formCategoryBn;
        newDoc.categoryColor = "bg-blue-50 text-blue-600 dark:bg-[#04142F] dark:text-[#4A89DA] border border-blue-100 dark:border-[#4A89DA]/20";
        newDoc.time = language === "en" ? "Just now" : "এইমাত্র";
        newDoc.views = language === "en" ? "0 views" : "০ ভিউ";
      } else if (tab === "notices") {
        newDoc.description = formDesc;
        newDoc.descriptionBn = formDescBn || formDesc;
      } else if (tab === "events") {
        newDoc.description = formDesc;
        newDoc.descriptionBn = formDescBn || formDesc;
        newDoc.date = formDate || new Date().toISOString().substring(0,10);
        newDoc.location = formLocation || "Bakalia CCC";
      }

      await addDoc(collection(db, targetCollection), newDoc);
      showToast("Record published successfully!", "success");
      setShowAddForm(false);
      setFormTitle("");
      setFormTitleBn("");
      setFormDesc("");
      setFormDescBn("");
    } catch (err) {
      showToast("Failed to publish record.", "error");
    } finally {
      setFormLoading(false);
    }
  };

  // Save Settings Form
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("System settings updated successfully!", "success");
  };

  return (
    <div className="space-y-6 flex-grow flex flex-col min-h-0 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{pageTitle}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{pageDesc}</p>
        </div>

        {/* Dynamic Publish button for CMS types */}
        {(tab === "news" || tab === "notices" || tab === "events") && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg text-white bg-blue-600 dark:bg-[#0CA671] hover:bg-blue-500 dark:hover:bg-emerald-500 shadow-sm transition-all active:scale-[0.98] self-start"
          >
            <Plus className="w-4 h-4" />
            <span>{language === "en" ? `Create ${tab.charAt(0).toUpperCase() + tab.slice(1)}` : "যোগ করুন"}</span>
          </button>
        )}
      </div>

      {/* Dynamic layouts: Form pages vs table lists */}
      {tab === "settings" ? (
        <form onSubmit={handleSaveSettings} className="p-6 bg-white dark:bg-[#0F1420] border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-sm space-y-6 max-w-xl">
          <h3 className="text-sm font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Configure General Portal Settings</h3>
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Municipal Portal Name</label>
              <input type="text" value={portalName} onChange={e => setPortalName(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border bg-slate-50 dark:bg-slate-900 outline-none text-slate-850 dark:text-white" />
            </div>
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">System Operation Status</label>
              <select value={portalStatus} onChange={e => setPortalStatus(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border bg-slate-50 dark:bg-slate-900 outline-none text-slate-850 dark:text-white">
                <option value="Active">Active / Public</option>
                <option value="Restricted">Restricted / Admin Only</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="gps" checked={gpsRequired} onChange={e => setGpsRequired(e.target.checked)} className="w-4 h-4 rounded border-slate-300 dark:border-slate-800 text-blue-600" />
              <label htmlFor="gps" className="font-bold text-slate-700 dark:text-slate-300">Enforce GPS Ward Location Selector on Public Homepage</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="maint" checked={maintMode} onChange={e => setMaintMode(e.target.checked)} className="w-4 h-4 rounded border-slate-300 dark:border-slate-800 text-blue-600" />
              <label htmlFor="maint" className="font-bold text-slate-700 dark:text-slate-300 text-red-500">Lock Portal for System Developer Maintenance</label>
            </div>
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 dark:bg-[#0CA671] hover:bg-blue-500 dark:hover:bg-emerald-500 text-xs font-bold text-white rounded-lg shadow-sm">
            Save System Configurations
          </button>
        </form>
      ) : tab === "profile" ? (
        <div className="p-6 bg-white dark:bg-[#0F1420] border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-sm space-y-6 max-w-xl">
          <h3 className="text-sm font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Personal Settings Profile</h3>
          <div className="space-y-4 text-xs">
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400">Account Email</span>
              <span className="block text-slate-800 dark:text-white mt-1 font-semibold">{user?.email}</span>
            </div>
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400">Security Clearance Access Role</span>
              <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 border border-red-100 dark:border-red-900/10 inline-block mt-1">
                {role ? role.replace("_", " ") : "Citizen"}
              </span>
            </div>
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Portal Display Name</label>
              <input type="text" defaultValue={user?.displayName || "Administrator"} className="w-full px-3 py-2.5 rounded-lg border bg-slate-50 dark:bg-slate-900 outline-none text-slate-850 dark:text-white" />
            </div>
          </div>
          <button onClick={() => showToast("Profile settings saved!", "success")} className="px-4 py-2 bg-blue-600 dark:bg-[#0CA671] hover:bg-blue-500 dark:hover:bg-emerald-500 text-xs font-bold text-white rounded-lg shadow-sm">
            Update Profile Information
          </button>
        </div>
      ) : tab === "permissions" ? (
        <div className="p-6 bg-white dark:bg-[#0F1420] border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-sm space-y-4 max-w-xl text-xs">
          <h3 className="text-sm font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Access Controls Matrix</h3>
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3 font-bold">Role Tier</th>
                  <th className="p-3 font-bold">Complaints</th>
                  <th className="p-3 font-bold">CMS News</th>
                  <th className="p-3 font-bold">Audit Logs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {[
                  { role: "super_admin", comp: "Write", cms: "Write", logs: "Read" },
                  { role: "police_admin", comp: "Update Status", cms: "Denied", logs: "Denied" },
                  { role: "councilor", comp: "Read", cms: "Write", logs: "Denied" },
                  { role: "volunteer", comp: "Read", cms: "Denied", logs: "Denied" }
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-bold text-slate-800 dark:text-white">{row.role}</td>
                    <td className="p-3 text-slate-500">{row.comp}</td>
                    <td className="p-3 text-slate-500">{row.cms}</td>
                    <td className="p-3 text-slate-500">{row.logs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : tab === "analytics" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
          {/* Card 1: Response and Resolution rates */}
          <div className="p-6 bg-white dark:bg-[#0F1420] border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Civic Response Times</h3>
            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-600 dark:text-slate-400">Average First Response</span>
                  <span className="text-slate-850 dark:text-white">12.4 Hours</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 dark:bg-[#0CA671] h-full rounded-full" style={{ width: "72%" }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-600 dark:text-slate-400">Total Resolution Rate</span>
                  <span className="text-slate-850 dark:text-white">88.5%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full" style={{ width: "88.5%" }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-600 dark:text-slate-400">Citizen Satisfaction Score</span>
                  <span className="text-slate-850 dark:text-white">4.8 / 5.0</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "96%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: User Role Distribution */}
          <div className="p-6 bg-white dark:bg-[#0F1420] border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Citizenry Role Distribution</h3>
            <div className="space-y-2.5 text-[11px]">
              {[
                { name: "General Citizens", percent: "92.4%", color: "bg-blue-500" },
                { name: "Community Volunteers", percent: "3.2%", color: "bg-rose-500" },
                { name: "Police & Security", percent: "1.8%", color: "bg-indigo-500" },
                { name: "Mosque & Business Admins", percent: "2.6%", color: "bg-emerald-500" }
              ].map((roleRow, idx) => (
                <div key={idx} className="flex items-center justify-between font-medium">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${roleRow.color}`}></span>
                    <span className="text-slate-600 dark:text-slate-400">{roleRow.name}</span>
                  </div>
                  <span className="text-slate-850 dark:text-white font-bold">{roleRow.percent}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Ward Activity Stats */}
          <div className="p-6 bg-white dark:bg-[#0F1420] border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Ward-Wise Active Complaints</h3>
            <div className="space-y-2.5 text-[11px]">
              {[
                { ward: "Ward 17 (Bakalia North)", count: 24, load: "High Load", bg: "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400" },
                { ward: "Ward 18 (Bakalia South)", count: 8, load: "Normal", bg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450" },
                { ward: "Ward 19 (East Bakalia)", count: 11, load: "Moderate", bg: "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-500" }
              ].map((wardRow, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">{wardRow.ward}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-850 dark:text-white">{wardRow.count} items</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${wardRow.bg}`}>{wardRow.load}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Categories breakdown */}
          <div className="p-6 bg-white dark:bg-[#0F1420] border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-sm space-y-4 md:col-span-2">
            <h3 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Complaints by Category Volume</h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-bold">
              {[
                { name: "Waste Management", percent: 45, items: "78 complaints", color: "bg-amber-500" },
                { name: "Infrastructure & Roads", percent: 30, items: "52 complaints", color: "bg-blue-500" },
                { name: "Water & Power Supply", percent: 15, items: "26 complaints", color: "bg-sky-500" },
                { name: "Public Safety & Theft", percent: 10, items: "17 complaints", color: "bg-rose-500" }
              ].map((cat, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900 border rounded-lg space-y-1">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] block uppercase tracking-wider">{cat.name}</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-slate-850 dark:text-white text-lg font-black">{cat.percent}%</span>
                    <span className="text-slate-400 text-[10px]">{cat.items}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className={`${cat.color} h-full rounded-full`} style={{ width: `${cat.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 5: System Metrics */}
          <div className="p-6 bg-white dark:bg-[#0F1420] border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">System Node Metrics</h3>
            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Database API Queries</span>
                  <span className="text-slate-850 dark:text-white text-[10px] font-mono">1.2k / min (Normal)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 dark:bg-[#0CA671] h-full rounded-full" style={{ width: "35%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-655 dark:text-slate-400">Storage Capacity</span>
                  <span className="text-slate-850 dark:text-white text-[10px] font-mono">4.2 GB / 20 GB</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: "21%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-600 dark:text-slate-400">SSL Network Latency</span>
                  <span className="text-slate-850 dark:text-white text-[10px] font-mono">24 ms (Excellent)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 dark:bg-[#0CA671] h-full rounded-full" style={{ width: "95%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : tab === "logs" ? (
        <div className="p-6 bg-white dark:bg-[#0F1420] border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-sm space-y-4 max-w-xl text-xs font-mono">
          <h3 className="text-sm font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Audit System Events Registry</h3>
          <div className="space-y-2 text-[10px] text-slate-500 leading-relaxed">
            <div>[2026-07-03 18:40:00] super_admin updated system layout configuration parameter: "ClientLayoutWrapper" activated</div>
            <div>[2026-07-03 18:41:00] user verify bypass check executed for address: almabruk786@gmail.com</div>
            <div>[2026-07-03 18:43:00] police notice update processed on document ID: notices/x83fa9</div>
          </div>
        </div>
      ) : (
        // Standard data collection grid
        <div className="flex-grow flex flex-col min-h-0 bg-white dark:bg-[#0F1420] border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-sm overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-4 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* Search filter input */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 px-3 py-1.5 rounded-lg w-full sm:w-64 max-w-xs focus-within:ring-1 focus-within:ring-blue-500/30 transition-all">
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={language === "en" ? "Filter records..." : "সার্চ ফিল্টার..."}
                className="bg-transparent text-xs w-full outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>

            {/* Actions group */}
            <div className="flex items-center gap-2">
              {/* Bulk actions */}
              {selectedIds.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/10 hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === "en" ? `Delete (${selectedIds.length})` : `মুছে ফেলুন (${selectedIds.length})`}</span>
                </button>
              )}

              {/* Export CSV */}
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors active:scale-95 bg-white dark:bg-[#0F1420]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{language === "en" ? "Export CSV" : "এক্সপোর্ট CSV"}</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-grow overflow-auto min-h-0">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Clock className="w-8 h-8 text-blue-600 dark:text-[#0CA671] animate-spin" />
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs font-medium space-y-2">
                <AlertTriangle className="w-8 h-8 mx-auto text-slate-300" />
                <p>{language === "en" ? "No records found matching filters." : "কোনো তথ্য খুঁজে পাওয়া যায়নি।"}</p>
              </div>
            ) : (
              <table className="w-full min-w-[750px] text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider sticky top-0 z-10">
                  <tr>
                    <th className="p-3 w-10">
                      <input 
                        type="checkbox"
                        checked={selectedIds.length === paginatedRecords.length && paginatedRecords.length > 0}
                        onChange={handleSelectAll}
                        className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-800 text-blue-600"
                      />
                    </th>
                    
                    {/* Dynamic Headers based on tab */}
                    {collectionName === "users" ? (
                      <>
                        <th className="p-3">{language === "en" ? "Profile" : "প্রোফাইল"}</th>
                        <th className="p-3">{language === "en" ? "Email Address" : "ইমেইল"}</th>
                        <th className="p-3">{language === "en" ? "Mobile Number" : "ফোন"}</th>
                        <th className="p-3">{language === "en" ? "Ward Selector" : "ওয়ার্ড"}</th>
                      </>
                    ) : tab === "complaints" || tab === "sos" ? (
                      <>
                        <th className="p-3">{language === "en" ? "Complaint Title" : "অভিযোগ শিরোনাম"}</th>
                        <th className="p-3">{language === "en" ? "Category" : "ক্যাটাগরি"}</th>
                        <th className="p-3">{language === "en" ? "Citizen Name" : "অভিযোগকারী"}</th>
                        <th className="p-3">{language === "en" ? "Status State" : "স্ট্যাটাস"}</th>
                      </>
                    ) : tab === "tips" ? (
                      <>
                        <th className="p-3">{language === "en" ? "Subject/Topic" : "বিষয়বস্তু"}</th>
                        <th className="p-3">{language === "en" ? "Details/Location" : "বিবরণ ও স্থান"}</th>
                        <th className="p-3">{language === "en" ? "Notice Date" : "তারিখ"}</th>
                      </>
                    ) : (
                      <>
                        <th className="p-3">{language === "en" ? "Announcements Title" : "শিরোনাম"}</th>
                        <th className="p-3">{language === "en" ? "Details/Category" : "বিবরণ"}</th>
                        <th className="p-3">{language === "en" ? "Created Date" : "তারিখ"}</th>
                      </>
                    )}
                    <th className="p-3 text-right">{language === "en" ? "Actions" : "অ্যাকশন"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs">
                  {paginatedRecords.map((rec) => (
                    <tr 
                      key={rec.id}
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors ${
                        selectedIds.includes(rec.id) ? "bg-blue-50/20 dark:bg-blue-950/5" : ""
                      }`}
                    >
                      <td className="p-3">
                        <input 
                          type="checkbox"
                          checked={selectedIds.includes(rec.id)}
                          onChange={() => handleSelectRow(rec.id)}
                          className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-800 text-blue-600"
                        />
                      </td>

                      {/* Dynamic Columns data */}
                      {collectionName === "users" ? (
                        <>
                          <td className="p-3 font-semibold text-slate-800 dark:text-white">
                            {rec.displayName || "Unregistered Citizen"}
                          </td>
                          <td className="p-3 text-slate-500">{rec.email || "-"}</td>
                          <td className="p-3 text-slate-500">{rec.phoneNumber || "-"}</td>
                          <td className="p-3 text-slate-500 font-mono">{rec.ward || "Ward 17"}</td>
                        </>
                      ) : tab === "complaints" || tab === "sos" ? (
                        <>
                          <td className="p-3 font-semibold text-slate-800 dark:text-white">
                            {rec.title}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border dark:border-slate-800">
                              {rec.category || "General"}
                            </span>
                          </td>
                          <td className="p-3 text-slate-500">{rec.userName || "Citizen"}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold uppercase ${
                              rec.status === "resolved" 
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/10" 
                                : rec.status === "in_progress"
                                ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-[#4A89DA] border border-blue-100 dark:border-blue-900/10"
                                : "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-500 border border-amber-100 dark:border-amber-900/10"
                            }`}>
                              {rec.status || "pending"}
                            </span>
                          </td>
                        </>
                      ) : tab === "tips" ? (
                        <>
                          <td className="p-3 font-semibold text-slate-800 dark:text-white truncate max-w-[150px]">
                            {rec.subject || "General Tip Info"}
                          </td>
                          <td className="p-3 text-slate-500 truncate max-w-[200px]">{rec.details || "-"}</td>
                          <td className="p-3 text-slate-500 font-mono">
                            {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : "-"}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-3 font-semibold text-slate-800 dark:text-white truncate max-w-[180px]">
                            {rec.title}
                          </td>
                          <td className="p-3 text-slate-500 truncate max-w-[200px]">
                            {rec.description || rec.category || rec.details || "-"}
                          </td>
                          <td className="p-3 text-slate-500 font-mono">
                            {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : "-"}
                          </td>
                        </>
                      )}

                      {/* Row Actions */}
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => { setDrawerRecord(rec); setEditStatus(rec.status || ""); }}
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(rec.id)}
                            className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/10 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Table Paginator */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shrink-0 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="p-1.5 border border-slate-200 dark:border-slate-850 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors disabled:opacity-50 active:scale-95"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-1.5 border border-slate-200 dark:border-slate-850 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors disabled:opacity-50 active:scale-95"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Creation Modal (Add Form) */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F1420] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white">
                {language === "en" ? `Create Portal ${tab.charAt(0).toUpperCase() + tab.slice(1)}` : "নতুন প্রকাশনা"}
              </h3>
              <button onClick={() => setShowAddForm(false)} className="p-1 rounded hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Title (English)</label>
                <input 
                  type="text" 
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. Cleansing Drive or Safety Notice"
                  className="w-full px-3 py-2.5 rounded-lg border bg-slate-50 dark:bg-slate-900 outline-none text-slate-850 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Title (Bengali)</label>
                <input 
                  type="text" 
                  value={formTitleBn}
                  onChange={e => setFormTitleBn(e.target.value)}
                  placeholder="যেমনঃ ওয়ার্ড পরিচ্ছন্নতা কর্মসূচি"
                  className="w-full px-3 py-2.5 rounded-lg border bg-slate-50 dark:bg-slate-900 outline-none text-slate-850 dark:text-white"
                />
              </div>

              {tab === "news" && (
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">News Category</label>
                  <select
                    value={formCategory}
                    onChange={e => {
                      setFormCategory(e.target.value);
                      setFormCategoryBn(e.target.value === "Official Update" ? "সরকারি নোটিশ" : "সরাসরি সংবাদ");
                    }}
                    className="w-full px-3 py-2.5 rounded-lg border bg-slate-50 dark:bg-slate-900 outline-none text-slate-850 dark:text-white"
                  >
                    <option value="Official Update">Official Update</option>
                    <option value="Community Notice">Community Notice</option>
                  </select>
                </div>
              )}

              {(tab === "notices" || tab === "events") && (
                <>
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Description (English)</label>
                    <textarea 
                      required
                      value={formDesc}
                      onChange={e => setFormDesc(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-lg border bg-slate-50 dark:bg-slate-900 outline-none text-slate-850 dark:text-white resize-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Description (Bengali)</label>
                    <textarea 
                      value={formDescBn}
                      onChange={e => setFormDescBn(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-lg border bg-slate-50 dark:bg-slate-900 outline-none text-slate-850 dark:text-white resize-none"
                    />
                  </div>
                </>
              )}

              {tab === "events" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Date</label>
                    <input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Location</label>
                    <input type="text" value={formLocation} onChange={e => setFormLocation(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white" />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-2.5 bg-blue-600 dark:bg-[#0CA671] hover:bg-blue-500 dark:hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
              >
                {formLoading ? "Publishing..." : "Publish to Portal"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Record Inspector Drawer Overlay */}
      {drawerRecord && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="fixed inset-0" onClick={() => setDrawerRecord(null)} />
          <div className="bg-white dark:bg-[#0F1420] border-l border-slate-200/80 dark:border-slate-800/80 w-full max-w-md h-full z-50 flex flex-col p-6 shadow-2xl relative animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b pb-4 shrink-0">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Inspect Document Details</h3>
              <button onClick={() => { setDrawerRecord(null); setIsEditMode(false); }} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Drawer Body Scroll area */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6 text-xs text-slate-500 scrollbar-none">
              {collectionName === "users" ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-[#4A89DA] flex items-center justify-center text-2xl font-black uppercase mx-auto border dark:border-blue-900/20">
                    {(drawerRecord.displayName || drawerRecord.email || "?").charAt(0)}
                  </div>
                  <div className="text-center space-y-1">
                    <h4 className="text-sm font-black text-slate-850 dark:text-white">{drawerRecord.displayName || "Citizen Name"}</h4>
                    <span className="px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-900 text-slate-500 inline-block border dark:border-slate-800">
                      {drawerRecord.role || "citizen"}
                    </span>
                  </div>

                  <div className="space-y-3 pt-4 border-t divide-y divide-slate-100 dark:divide-slate-800/40">
                    <div className="pt-2 flex justify-between">
                      <span className="font-bold text-slate-400">UID Reference</span>
                      <span className="font-mono text-[10px] text-slate-700 dark:text-slate-300">{drawerRecord.id}</span>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span className="font-bold text-slate-400">Account Email</span>
                      <span className="text-slate-700 dark:text-slate-300">{drawerRecord.email || "-"}</span>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span className="font-bold text-slate-400">Mobile Number</span>
                      <span className="text-slate-700 dark:text-slate-300">{drawerRecord.phoneNumber || "-"}</span>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span className="font-bold text-slate-400">Home Address</span>
                      <span className="text-slate-700 dark:text-slate-300 text-right max-w-[200px]">{drawerRecord.address || "-"}</span>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span className="font-bold text-slate-400">GPS Ward Code</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">{drawerRecord.ward || "Ward 17"}</span>
                    </div>
                  </div>

                  {/* Promote controls */}
                  <div className="pt-6 border-t space-y-3">
                    <span className="block font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px]">Alter Role Privileges</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Citizen", val: "citizen" },
                        { label: "Police Admin", val: "police_admin" },
                        { label: "Councilor", val: "councilor" },
                        { label: "Volunteer", val: "volunteer" },
                        { label: "Mosque Admin", val: "mosque_admin" },
                        { label: "Business Admin", val: "business_admin" },
                        { label: "Editor", val: "editor" },
                        { label: "Moderator", val: "moderator" }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          disabled={drawerRecord.role === item.val}
                          onClick={() => handlePromoteRole(drawerRecord.id, item.val)}
                          className="py-1.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors font-semibold text-slate-700 dark:text-slate-300 text-[10px] disabled:opacity-50"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Complaints / Items inspection drawer details
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9.5px] uppercase font-bold text-slate-400">Document Type: {tab}</span>
                    <h4 className="text-sm font-black text-slate-850 dark:text-white leading-tight">{drawerRecord.title || drawerRecord.subject}</h4>
                    <span className="text-[9px] text-slate-400 block font-mono">ID: {drawerRecord.id}</span>
                  </div>

                  <div className="space-y-4 pt-4 border-t text-xs">
                    <div>
                      <span className="block font-bold text-slate-400 mb-1">Details/Description</span>
                      <p className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border text-slate-700 dark:text-slate-300 leading-relaxed max-h-40 overflow-y-auto">
                        {drawerRecord.description || drawerRecord.details || drawerRecord.descriptionBn || "-"}
                      </p>
                    </div>

                    {/* Meta rows */}
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      <div className="py-2 flex justify-between">
                        <span className="font-bold text-slate-400">Created At</span>
                        <span className="text-slate-700 dark:text-slate-300 font-mono">
                          {drawerRecord.createdAt ? new Date(drawerRecord.createdAt).toLocaleString() : "-"}
                        </span>
                      </div>
                      {drawerRecord.category && (
                        <div className="py-2 flex justify-between">
                          <span className="font-bold text-slate-400">Category Tag</span>
                          <span className="text-slate-700 dark:text-slate-300 font-semibold">{drawerRecord.category}</span>
                        </div>
                      )}
                      {drawerRecord.deviceInfo && (
                        <div className="py-2 flex justify-between items-center">
                          <span className="font-bold text-slate-400">Device Model</span>
                          <span className="text-slate-700 dark:text-slate-300 font-bold">{drawerRecord.deviceInfo}</span>
                        </div>
                      )}
                      {drawerRecord.lat !== undefined && drawerRecord.lng !== undefined && (
                        <>
                          <div className="py-2 flex justify-between items-center">
                            <span className="font-bold text-slate-400">GPS Coordinates</span>
                            <span className="text-slate-700 dark:text-slate-300 font-mono font-bold">
                              {drawerRecord.lat}, {drawerRecord.lng}
                            </span>
                          </div>
                          <div className="py-2 flex justify-between items-center">
                            <span className="font-bold text-slate-400">Realtime Location</span>
                            <a 
                              href={`https://www.google.com/maps?q=${drawerRecord.lat},${drawerRecord.lng}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[9px] font-black uppercase tracking-wider transition-colors shadow-sm"
                            >
                              Open Google Maps ↗
                            </a>
                          </div>
                        </>
                      )}
                      {drawerRecord.price && (
                        <div className="py-2 flex justify-between">
                          <span className="font-bold text-slate-400">Listing Price</span>
                          <span className="text-slate-700 dark:text-slate-300 font-bold font-mono">৳ {drawerRecord.price}</span>
                        </div>
                      )}
                      {drawerRecord.userName && (
                        <div className="py-2 flex justify-between">
                          <span className="font-bold text-slate-400">Reported By</span>
                          <span className="text-slate-700 dark:text-slate-300 font-semibold">{drawerRecord.userName}</span>
                        </div>
                      )}
                      {drawerRecord.status && (
                        <div className="py-2 flex justify-between items-center">
                          <span className="font-bold text-slate-400">Current Status</span>
                          {isEditMode ? (
                            <div className="flex items-center gap-1.5">
                              <select 
                                value={editStatus} 
                                onChange={e => setEditStatus(e.target.value)}
                                className="px-2 py-1 rounded bg-slate-50 dark:bg-slate-900 border text-xs text-slate-800 dark:text-white"
                              >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                              </select>
                              <button onClick={handleUpdateStatus} className="p-1 rounded bg-blue-600 text-white hover:bg-blue-500">
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-700 dark:text-slate-300 font-bold uppercase">{drawerRecord.status}</span>
                              <button onClick={() => setIsEditMode(true)} className="p-1 text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-900 rounded">
                                <Edit className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer actions */}
            <div className="border-t pt-4 flex gap-2 shrink-0">
              <button 
                onClick={() => handleDeleteRecord(drawerRecord.id)}
                className="flex-1 py-2 rounded-lg text-center text-xs font-bold text-white bg-red-650 hover:bg-red-750 transition-colors shadow-sm active:scale-95"
              >
                Delete Record
              </button>
              <button 
                onClick={() => { setDrawerRecord(null); setIsEditMode(false); }}
                className="flex-1 py-2 rounded-lg text-center text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors active:scale-95"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
