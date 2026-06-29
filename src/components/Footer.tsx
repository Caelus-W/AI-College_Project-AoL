"use client";

import React from "react";
import { Activity } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 transition-colors mt-auto">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
        
        {/* Left Side */}
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-slate-300 dark:text-slate-700" />
          <span>© 2026 SmartTB AI. Clinical screening decision support.</span>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            DenseNet-121 CNN Backbone
          </span>
          <span>•</span>
          <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            Grad-CAM Heatmap Profiler
          </span>
        </div>
      </div>
    </footer>
  );
}
