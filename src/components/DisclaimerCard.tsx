"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";

export default function DisclaimerCard() {
  return (
    <div className="w-full rounded-2xl border border-amber-500/25 bg-amber-500/5 dark:bg-amber-500/10 p-5 flex gap-4 transition-colors duration-300">
      <ShieldAlert className="h-5.5 w-5.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div>
        <h4 className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-300 tracking-wider">
          Decision Support System Regulatory Notice
        </h4>
        <p className="text-[10.5px] text-amber-700 dark:text-amber-250/90 mt-1 leading-relaxed">
          <strong>WARNING:</strong> SmartTB AI is a screening assistance software application based on convolutional neural network visual mapping. It has not received formal regulatory clearance (such as FDA 510k, CE mark) for diagnostic determination.
          This analysis is a preliminary radiological screen and does not constitute a final medical diagnosis. Clinical judgment, patient symptomatology, and diagnostic laboratory confirmatory tests (including GeneXpert molecular assays and sputum cultures) are strictly mandatory prior to initiating treatment protocols.
        </p>
      </div>
    </div>
  );
}
