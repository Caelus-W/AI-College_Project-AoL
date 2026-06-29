"use client";

import React from "react";
import { motion } from "framer-motion";

interface ConfidenceBarProps {
  confidence: number;
  prediction: "Positive" | "Negative";
  probabilities: {
    Negative: number;
    Positive: number;
  };
}

export default function ConfidenceBar({ confidence, prediction, probabilities }: ConfidenceBarProps) {
  const isPositive = prediction === "Positive";
  const formattedConfidence = (confidence * 100).toFixed(1);

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
          Classification Confidence
        </span>
        <span 
          className={`text-xs font-black ${
            isPositive ? "text-red-500" : "text-emerald-500"
          }`}
        >
          {formattedConfidence}% Confidence
        </span>
      </div>

      {/* Main Bar Tracker */}
      <div className="mt-4">
        <div className="relative w-full h-3 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200/40 dark:border-slate-800/40">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidence * 100}%` }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            className={`h-full rounded-full bg-gradient-to-r ${
              isPositive 
                ? "from-red-400 to-red-600 dark:from-red-500 dark:to-red-600" 
                : "from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-600"
            }`}
          />
        </div>
      </div>

      {/* Probabilities Comparison */}
      <div className="mt-6 space-y-3.5 border-t border-slate-100 dark:border-slate-850 pt-5">
        <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
          Probability Breakdown
        </h5>
        
        {/* Normal Lobe probability */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-slate-500 dark:text-slate-400">Normal Lung Tissue</span>
            <span className="text-slate-850 dark:text-slate-250">
              {(probabilities.Negative * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${probabilities.Negative * 100}%` }}
              transition={{ duration: 0.85, ease: "easeOut" }}
              className="bg-emerald-500 h-full rounded-full"
            />
          </div>
        </div>

        {/* Tuberculosis Lobe probability */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-slate-500 dark:text-slate-400">Tuberculosis Abnormalities</span>
            <span className="text-slate-850 dark:text-slate-250">
              {(probabilities.Positive * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${probabilities.Positive * 100}%` }}
              transition={{ duration: 0.85, ease: "easeOut" }}
              className="bg-red-500 h-full rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
