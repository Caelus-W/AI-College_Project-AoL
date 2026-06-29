"use client";

import React from "react";
import { Loader2, HeartPulse } from "lucide-react";

interface LoadingAnimationProps {
  stage: string;
}

export default function LoadingAnimation({ stage }: LoadingAnimationProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 min-h-[40vh] w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm transition-colors duration-300">
      
      {/* Visual Pulsing Heart/Scanner Rings */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute h-20 w-20 rounded-full border border-blue-500/20 animate-medical-pulse" />
        <div className="absolute h-28 w-28 rounded-full border border-blue-600/10 animate-medical-pulse delay-75" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
          <HeartPulse className="h-7 w-7 text-white animate-pulse" />
        </div>
      </div>
      
      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-wide text-center">
        Running Radiograph Inference Pipeline
      </h3>
      
      {/* Current stage indicator */}
      <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-4 py-2 rounded-full border border-slate-200/50 dark:border-slate-800/40 max-w-xs sm:max-w-sm text-center">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600 dark:text-blue-500 shrink-0" />
        <span className="truncate">{stage}</span>
      </div>
    </div>
  );
}
