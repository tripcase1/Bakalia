"use client";

import React from "react";
import { useAppContext } from "@/context/AppContext";

export default function Footer() {
  const { t } = useAppContext();

  return (
    <footer className="bg-slate-800 dark:bg-slate-950 text-slate-400 dark:text-slate-500 border-t border-slate-700 dark:border-slate-900 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 md:pb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Copyright */}
          <div className="text-center md:text-left text-xs font-bold text-slate-250 dark:text-slate-350">
            <span className="block text-slate-200 dark:text-slate-200">Bakalia Community</span>
            <span className="block text-[10px] mt-0.5 text-slate-400 dark:text-slate-500">{t("copyright")}</span>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-[10.5px] font-bold text-slate-400 dark:text-slate-500">
            <a href="/privacy" className="hover:text-slate-200 transition-colors">{t("privacy")}</a>
            <a href="/terms" className="hover:text-slate-200 transition-colors">{t("terms")}</a>
            <a href="/help" className="hover:text-slate-200 transition-colors">{t("help")}</a>
            <a href="/contact" className="hover:text-slate-200 transition-colors">{t("contact")}</a>
            <a href="/rules" className="hover:text-[#0CA671] transition-colors text-[#0CA671]">{t("downloadRules")}</a>
          </div>

        </div>
      </div>
    </footer>
  );
}
