"use client";

import React from "react";
import { AlertCircle, ShieldCheck, HelpCircle } from "lucide-react";

interface PredictionCardProps {
  prediction: "Positive" | "Negative";
  confidence: number;
}

export default function PredictionCard({ prediction, confidence }: PredictionCardProps) {
  const isPositive = prediction === "Positive";

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm relative overflow-hidden transition-colors duration-300">
      
      {/* Visual Accent Bar */}
      <div 
        className={`absolute top-0 left-0 right-0 h-1.5 ${
          isPositive ? "bg-red-500" : "bg-emerald-500"
        }`} 
      />

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
          Diagnostic Outcome
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">
          DenseNet-121 Classifier
        </span>
      </div>

      <div className="mt-4 flex items-start gap-4">
        {/* Diagnostic Status Icon */}
        <div 
          className={`rounded-xl p-3 shrink-0 ${
            isPositive 
              ? "bg-red-50 dark:bg-red-950/30 text-red-500" 
              : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500"
          }`}
        >
          {isPositive ? (
            <AlertCircle className="h-6 w-6" />
          ) : (
            <ShieldCheck className="h-6 w-6" />
          )}
        </div>

        <div>
          <h4 className="text-xs text-slate-500 dark:text-slate-400 font-medium">Radiological Classification</h4>
          <p 
            className={`text-xl font-black tracking-tight mt-0.5 ${
              isPositive ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            Tuberculosis Detected: {isPositive ? "YES" : "NO"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {isPositive 
              ? "The neural network has localized density markers or infiltrates consistent with Tuberculosis pathology. Prompt pulmonology consultation is recommended."
              : "No significant visual patterns or consolidation zones corresponding to Tuberculosis were identified. Maintain standard patient surveillance."
            }
          </p>
        </div>
      </div>
    </div>
  );
}
