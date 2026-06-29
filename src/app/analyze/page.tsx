"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UploadCard from "@/components/UploadCard";
import LoadingAnimation from "@/components/LoadingAnimation";
import ResultCard from "@/components/ResultCard";
import ImageViewer from "@/components/ImageViewer";
import DisclaimerCard from "@/components/DisclaimerCard";
import { simulateAnalysis, SimulationResult } from "@/utils/aiSimulator";
import { ShieldCheck, Sparkles, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnalyzePage() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [step, setStep] = useState<"upload" | "loading" | "result">("upload");
  const [loadingStage, setLoadingStage] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<SimulationResult | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  // Sync dark mode configuration with document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleScanSubmit = async (file: File, forcedPrediction?: "Positive" | "Negative") => {
    setUploadedFileName(file.name);
    setStep("loading");
    setLoadingStage("Initializing digital radiograph interface...");

    const stages = [
      "Accessing image canvas structure...",
      "Downsampling spatial resolution to 224x224 input grid...",
      "Executing DenseNet-121 feed-forward pipeline...",
      "Registering feature activation weights on features.norm5...",
      "Computing class logit gradients...",
      "Projecting activation maps (Grad-CAM colormap)...",
      "Rendering superimposed visual explanation overlay...",
      "Finalizing diagnostic classification..."
    ];

    let stageIdx = 0;
    const stageInterval = setInterval(() => {
      if (stageIdx < stages.length) {
        setLoadingStage(stages[stageIdx]);
        stageIdx++;
      }
    }, 450);

    try {
      // Run the client-side AI simulator
      const result = await simulateAnalysis(file, forcedPrediction);
      
      // Artificial minor delay to show the clinical stages
      await new Promise((resolve) => setTimeout(resolve, 3600));
      
      clearInterval(stageInterval);
      setAnalysisResult(result);
      setStep("result");
    } catch (err) {
      clearInterval(stageInterval);
      alert("Inference simulation failed. Please try a different image.");
      setStep("upload");
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setUploadedFileName("");
    setStep("upload");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-150 transition-colors duration-300">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="flex-grow py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          
          {/* Header Tagline */}
          {step !== "result" && (
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Workspace Analysis
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-md mx-auto">
                Submit digital radiographs to initiate DenseNet classification and Grad-CAM spatial features mapping.
              </p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === "upload" && (
              <motion.div
                key="upload-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="max-w-xl mx-auto">
                  <UploadCard onScan={handleScanSubmit} isLoading={false} />
                </div>
              </motion.div>
            )}

            {step === "loading" && (
              <motion.div
                key="loading-animation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="max-w-xl mx-auto"
              >
                <LoadingAnimation stage={loadingStage} />
              </motion.div>
            )}

            {step === "result" && analysisResult && (
              <motion.div
                key="results-layout"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 90 }}
                className="flex flex-col gap-8"
              >
                {/* Result Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-2">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                      Screening Assessment Report
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      File: {uploadedFileName} • Analyzed on: {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Two-Column results breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* Visualizer Panel (Left 7 Cols) */}
                  <div className="md:col-span-7">
                    <ImageViewer 
                      images={analysisResult.images} 
                      fileName={uploadedFileName} 
                    />
                  </div>

                  {/* Quantitative Report Card (Right 5 Cols) */}
                  <div className="md:col-span-5">
                    <ResultCard
                      prediction={analysisResult.prediction}
                      confidence={analysisResult.confidence}
                      probabilities={analysisResult.probabilities}
                      fileName={uploadedFileName}
                      onReset={handleReset}
                    />
                  </div>

                </div>

                {/* Compliance disclaimer */}
                <div className="mt-2">
                  <DisclaimerCard />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      <Footer />
    </div>
  );
}
