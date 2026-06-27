"use client";

import React from "react";
import { Clock, Trash2, HeartPulse, ShieldCheck, ChevronRight, HardDriveDownload } from "lucide-react";

export interface HistoryItem {
  id: string;
  timestamp: string;
  fileName: string;
  prediction: string;
  confidence: number;
  probabilities: {
    Negative: number;
    Positive: number;
  };
  images: {
    original: string;
    heatmap: string;
    overlay: string;
  };
}

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export default function HistoryList({ history, onSelect, onDelete, onClearAll }: HistoryListProps) {
  if (history.length === 0) {
    return null; // Don't render anything if there is no history yet
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 mt-8">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-md transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-4">
          <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
            <Clock className="h-4.5 w-4.5 text-brand-indigo" /> Recent Diagnostic Logs
          </h3>
          <button
            onClick={onClearAll}
            className="text-[10px] text-brand-rose font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            Clear All
          </button>
        </div>

        {/* List of items */}
        <div className="divide-y divide-[var(--border)] max-h-[300px] overflow-y-auto pr-1">
          {history.map((item) => {
            const isPositive = item.prediction.toLowerCase() === "positive";
            
            return (
              <div 
                key={item.id} 
                className="flex items-center justify-between py-3 hover:bg-gray-50/50 dark:hover:bg-slate-800/10 rounded-lg px-2 group transition-colors"
              >
                {/* Details Trigger */}
                <button
                  onClick={() => onSelect(item)}
                  className="flex items-center gap-3 text-left flex-1 min-w-0 cursor-pointer"
                >
                  <div className={`rounded-lg p-2 shrink-0 ${isPositive ? "bg-brand-rose/10 text-brand-rose" : "bg-brand-teal/10 text-brand-teal"}`}>
                    {isPositive ? (
                      <HeartPulse className="h-4.5 w-4.5 animate-pulse" />
                    ) : (
                      <ShieldCheck className="h-4.5 w-4.5" />
                    )}
                  </div>
                  
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[var(--foreground)] truncate max-w-[240px]">
                      {item.fileName}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(item.timestamp).toLocaleString()} • Conf: {(item.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </button>

                {/* Right Side: Badge & Delete */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isPositive 
                      ? "bg-brand-rose/10 text-brand-rose" 
                      : "bg-brand-teal/10 text-brand-teal"
                  }`}>
                    {item.prediction}
                  </span>

                  <button
                    onClick={() => onDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-brand-rose rounded transition-opacity cursor-pointer"
                    title="Delete log"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
