"use client";

import React from "react";
import PredictionCard from "./PredictionCard";
import ConfidenceBar from "./ConfidenceBar";
import { FileText, RefreshCw, ChevronRight } from "lucide-react";

interface ResultCardProps {
  prediction: "Positive" | "Negative";
  confidence: number;
  probabilities: {
    Negative: number;
    Positive: number;
  };
  fileName: string;
  onReset: () => void;
}

export default function ResultCard({
  prediction,
  confidence,
  probabilities,
  fileName,
  onReset
}: ResultCardProps) {
  const isPositive = prediction === "Positive";

  const getClinicalActions = () => {
    if (isPositive) {
      return [
        { title: "Sputum Culture & GeneXpert", desc: "Order rapid sputum molecular testing and GeneXpert MTB/RIF." },
        { title: "Symptomatic Assessment", desc: "Check for active cough, hemoptysis, weight loss, and night sweats." },
        { title: "Triage & Infection Control", desc: "Isolate patient or enforce strict masks in clinical areas." },
        { title: "Specialist Referral", desc: "Refer to a pulmonologist or infectious disease specialist for workup." }
      ];
    } else {
      return [
        { title: "Symptom Surveillance", desc: "Advise patient to return if chronic respiratory symptoms persist." },
        { title: "Investigate Alternates", desc: "Consider bacterial pneumonia, COPD flares, or severe bronchitis." },
        { title: "Archive Records", desc: "Upload radiograph and screening logs to patient's EHR baseline." }
      ];
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Composited Classification Badge Card */}
      <PredictionCard prediction={prediction} confidence={confidence} />

      {/* Composited Confidence Analysis Progress Card */}
      <ConfidenceBar 
        confidence={confidence} 
        prediction={prediction} 
        probabilities={probabilities} 
      />

      {/* Recommended Follow-up Action Checklist */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm transition-colors duration-300">
        <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
          <FileText className="h-4.5 w-4.5 text-blue-600 dark:text-blue-500" />
          Recommended Action Checklist
        </h4>
        <div className="space-y-4">
          {getClinicalActions().map((action, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold mt-0.5">
                {idx + 1}
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {action.title}
                </h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {action.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Scan Trigger Button */}
      <button
        onClick={onReset}
        className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 py-3.5 text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 border border-transparent dark:border-slate-800"
      >
        <RefreshCw className="h-4 w-4" />
        Analyze Another Image
      </button>
    </div>
  );
}
