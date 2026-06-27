"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Uploader from "@/components/Uploader";
import ResultsView from "@/components/ResultsView";
import HistoryList, { HistoryItem } from "@/components/HistoryList";
import { Loader2, ShieldAlert, HeartPulse, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = "http://127.0.0.1:8000";

export default function Home() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<string>("");
  const [currentResult, setCurrentResult] = useState<any>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load history from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("smarttb_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history logs", e);
      }
    }
  }, []);

  // Sync dark mode configuration with document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleScanSubmit = async (file: File) => {
    setIsLoading(true);
    setErrorMsg(null);
    setLoadingStage("Establishing connection with AI node...");

    const stages = [
      "Reading raw chest X-ray image bytes...",
      "Resizing input array to 224x224 space...",
      "Normalizing RGB channels using ImageNet parameters...",
      "Executing DenseNet-121 feed-forward pipeline...",
      "Extracting feature activation tensors from features.norm5...",
      "Backpropagating class logit score...",
      "Calculating channel-wise average gradients...",
      "Synthesizing Grad-CAM visual heat map...",
      "Superimposing heatmap onto chest X-ray overlay...",
      "Structuring response JSON payload..."
    ];

    let currentStageIndex = 0;
    const stageInterval = setInterval(() => {
      if (currentStageIndex < stages.length) {
        setLoadingStage(stages[currentStageIndex]);
        currentStageIndex++;
      }
    }, 450);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${BACKEND_URL}/api/predict`, {
        method: "POST",
        body: formData,
      });

      clearInterval(stageInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Classification inference pipeline failed.");
      }

      const predictionData = await response.json();
      setCurrentResult(predictionData);

      // Save output log to local history
      const newHistoryItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        fileName: file.name,
        prediction: predictionData.prediction,
        confidence: predictionData.confidence,
        probabilities: predictionData.probabilities,
        images: predictionData.images
      };

      const updatedLogs = [newHistoryItem, ...history];
      setHistory(updatedLogs);
      localStorage.setItem("smarttb_history", JSON.stringify(updatedLogs));

    } catch (err: any) {
      clearInterval(stageInterval);
      console.error(err);
      setErrorMsg(err.message || "Failed to establish contact with the diagnostic API server.");
    } finally {
      setIsLoading(false);
      setLoadingStage("");
    }
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setCurrentResult({
      prediction: item.prediction,
      confidence: item.confidence,
      probabilities: item.probabilities,
      images: item.images
    });
    // Scroll to top to see results immediately
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter((x) => x.id !== id);
    setHistory(updated);
    localStorage.setItem("smarttb_history", JSON.stringify(updated));
  };

  const handleClearAllHistory = () => {
    if (confirm("Are you sure you want to delete all diagnostic history logs? This action is irreversible.")) {
      setHistory([]);
      localStorage.removeItem("smarttb_history");
    }
  };

  const handleReset = () => {
    setCurrentResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      
      {/* Navbar */}
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        backendUrl={BACKEND_URL} 
      />

      <main className="flex-grow pb-16">
        
        {/* Error Alert Display */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-2xl px-4 sm:px-6 mt-6"
            >
              <div className="rounded-xl border border-brand-rose/20 bg-brand-rose/10 p-4 flex gap-3 text-sm text-brand-rose">
                <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">System Connection Error</h4>
                  <p className="mt-1 text-xs opacity-90">{errorMsg}</p>
                  <button 
                    onClick={handleReset}
                    className="mt-3 text-xs font-semibold underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" /> Try Again
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Display Area */}
        <div className="w-full">
          {isLoading ? (
            /* Immersive Medical Loading Screen */
            <div className="flex flex-col items-center justify-center py-20 px-4 min-h-[50vh]">
              <div className="relative flex items-center justify-center mb-6">
                {/* Pulsing circular outer rings */}
                <div className="absolute h-24 w-24 rounded-full border border-brand-cyan/20 animate-medical-pulse" />
                <div className="absolute h-32 w-32 rounded-full border border-brand-indigo/10 animate-medical-pulse delay-75" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-indigo to-brand-cyan text-white shadow-lg shadow-brand-indigo/20">
                  <HeartPulse className="h-8 w-8 text-white animate-pulse" />
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-[var(--foreground)] tracking-wide">
                Analyzing Chest Radiograph
              </h3>
              
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800/50 px-4 py-2 rounded-full border border-[var(--border)] max-w-sm text-center">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-indigo shrink-0" />
                <span className="truncate">{loadingStage}</span>
              </div>
            </div>
          ) : currentResult ? (
            /* Analysis Results Dashboard */
            <ResultsView 
              result={currentResult} 
              onReset={handleReset} 
            />
          ) : (
            /* Dashboard Upload Main Screen */
            <>
              <Hero />
              <Uploader 
                onScan={handleScanSubmit} 
                isLoading={isLoading} 
              />
              <HistoryList 
                history={history} 
                onSelect={handleSelectHistoryItem}
                onDelete={handleDeleteHistoryItem}
                onClearAll={handleClearAllHistory}
              />
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--card)] py-6 mt-12 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400 dark:text-gray-500">
          <p>© 2026 SmartTB Screen AI Project. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-[var(--foreground)] transition-colors">DenseNet-121 Transfer Learning model</span>
            <span>•</span>
            <span className="hover:text-[var(--foreground)] transition-colors">Grad-CAM Explanation Framework</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
