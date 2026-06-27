"use client";

import React, { useState } from "react";
import { 
  AlertTriangle, ShieldCheck, Download, RefreshCw, Eye, 
  Layers, Info, FileText, ChevronRight, Activity, ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

interface ResultsViewProps {
  result: {
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
  };
  onReset: () => void;
}

export default function ResultsView({ result, onReset }: ResultsViewProps) {
  const [viewMode, setViewMode] = useState<"fader" | "grid">("fader");
  const [blendOpacity, setBlendOpacity] = useState<number>(50); // 0 to 100

  const isPositive = result.prediction.toLowerCase() === "positive";
  const confidencePercent = (result.confidence * 100).toFixed(1);
  
  // Custom circular gauge configuration
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.confidence * circumference);

  const downloadImage = (dataUrl: string, name: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getClinicalActions = () => {
    if (isPositive) {
      return [
        { title: "Sputum Examination", desc: "Request sputum smear microscopy and GeneXpert MTB/RIF molecular testing." },
        { title: "Clinical Correlation", desc: "Correlate with respiratory symptoms (prolonged cough, hemoptysis, night sweats)." },
        { title: "Isolation Precautions", desc: "Initiate contact precaution protocols in waiting areas if patient is actively coughing." },
        { title: "Referral to Pulmonologist", desc: "Refer immediately to infectious disease or pulmonary specialist for formal diagnostic workup." }
      ];
    } else {
      return [
        { title: "Monitor Symptoms", desc: "Advise patient to return if respiratory symptoms persist beyond 2-3 weeks." },
        { title: "Secondary Diagnosis", desc: "Explore alternative causes for cough or lung marks (e.g. bacterial pneumonia, bronchitis, asthma)." },
        { title: "Maintain Records", desc: "Archive this chest X-ray in patient's electronic health record (EHR) for baseline tracking." }
      ];
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Diagnostics & Report (5 Cols) */}
        <motion.div 
          className="lg:col-span-5 flex flex-col gap-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Diagnostic Result Card */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-md overflow-hidden relative">
            
            {/* Top diagnostic status bar */}
            <div className={`absolute top-0 left-0 right-0 h-2 ${isPositive ? "bg-brand-rose" : "bg-brand-teal"}`} />
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Diagnostic Analysis
              </span>
              <span className="text-xs text-gray-400">
                Patient Ref: #{Math.floor(100000 + Math.random() * 900000)}
              </span>
            </div>

            <div className="mt-4 flex items-start gap-4">
              <div className={`rounded-xl p-3 shrink-0 ${isPositive ? "bg-brand-rose/15 text-brand-rose" : "bg-brand-teal/15 text-brand-teal"}`}>
                {isPositive ? (
                  <AlertTriangle className="h-7 w-7 animate-bounce" />
                ) : (
                  <ShieldCheck className="h-7 w-7" />
                )}
              </div>
              <div>
                <h4 className="text-xs text-gray-500 dark:text-gray-400 font-medium">Diagnostic Classification</h4>
                <p className={`text-2xl font-extrabold tracking-tight ${isPositive ? "text-brand-rose" : "text-brand-teal"}`}>
                  Tuberculosis {result.prediction}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {isPositive 
                    ? "Infiltration or abnormalities consistent with Tuberculosis detected." 
                    : "No clear radiographic signs of Tuberculosis identified."
                  }
                </p>
              </div>
            </div>

            {/* Circular Confidence Gauge */}
            <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-6">
              <div className="flex items-center gap-4">
                <div className="relative flex items-center justify-center">
                  <svg className="h-20 w-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r={radius}
                      className="text-gray-100 dark:text-gray-800"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r={radius}
                      className={isPositive ? "text-brand-rose" : "text-brand-teal"}
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
                    />
                  </svg>
                  <span className="absolute text-sm font-black text-[var(--foreground)]">
                    {confidencePercent}%
                  </span>
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[var(--foreground)]">Confidence Score</h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    DenseNet-121 classifier probability
                  </p>
                </div>
              </div>
            </div>

            {/* Probability Bars */}
            <div className="mt-6 space-y-3">
              <h5 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
                Likelihood Assessment
              </h5>
              
              {/* Normal probability */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Normal (Negative)</span>
                  <span className="text-[var(--foreground)]">{(result.probabilities.Negative * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-brand-teal h-full transition-all duration-1000" 
                    style={{ width: `${result.probabilities.Negative * 100}%` }}
                  />
                </div>
              </div>

              {/* TB probability */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Tuberculosis (Positive)</span>
                  <span className="text-[var(--foreground)]">{(result.probabilities.Positive * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-brand-rose h-full transition-all duration-1000" 
                    style={{ width: `${result.probabilities.Positive * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Action List */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-md">
            <h4 className="text-sm font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-brand-indigo" /> Recommended Action Items
            </h4>
            <div className="space-y-4">
              {getClinicalActions().map((action, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-indigo/10 text-brand-indigo text-xs font-bold mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[var(--foreground)]">{action.title}</h5>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{action.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Visualization Panel (7 Cols) */}
        <motion.div 
          className="lg:col-span-7 flex flex-col gap-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-md flex flex-col h-full">
            
            {/* Visualizer Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border)] gap-2">
              <div>
                <h3 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                  <Activity className="h-5 w-5 text-brand-cyan" /> Visual explanation
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Localization of diagnostic features via Grad-CAM
                </p>
              </div>

              {/* View Switchers */}
              <div className="flex rounded-lg bg-gray-100 dark:bg-slate-800 p-0.5 text-xs">
                <button
                  onClick={() => setViewMode("fader")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
                    viewMode === "fader" 
                      ? "bg-[var(--card)] text-[var(--foreground)] font-bold shadow-sm" 
                      : "text-gray-500 dark:text-gray-400 hover:text-[var(--foreground)]"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" /> Fader
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
                    viewMode === "grid" 
                      ? "bg-[var(--card)] text-[var(--foreground)] font-bold shadow-sm" 
                      : "text-gray-500 dark:text-gray-400 hover:text-[var(--foreground)]"
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" /> Side-by-Side
                </button>
              </div>
            </div>

            {/* Visualizer Display Area */}
            <div className="mt-6 flex-1 flex flex-col justify-center items-center">
              {viewMode === "fader" ? (
                /* Cross Fader Mode */
                <div className="w-full max-w-md flex flex-col items-center">
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black shadow-inner border border-[var(--border)]">
                    
                    {/* Bottom layer: Original Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.images.original}
                      alt="Chest X-Ray Original"
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    />

                    {/* Top layer: Grad-CAM Overlay */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.images.overlay}
                      alt="Grad-CAM Heatmap Blend"
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-75"
                      style={{ opacity: blendOpacity / 100 }}
                    />
                  </div>

                  {/* Slider controls */}
                  <div className="mt-4 w-full px-2">
                    <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                      <span>Original Chest X-Ray</span>
                      <span className="text-brand-cyan">Grad-CAM Overlay ({blendOpacity}%)</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={blendOpacity}
                      onChange={(e) => setBlendOpacity(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-cyan"
                    />
                  </div>
                </div>
              ) : (
                /* Side by Side Grid Mode */
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "Original X-Ray", img: result.images.original, name: "original.jpg" },
                    { title: "Heatmap Profile", img: result.images.heatmap, name: "heatmap.jpg" },
                    { title: "Overlay Blend", img: result.images.overlay, name: "overlay.jpg" }
                  ].map((panel, idx) => (
                    <div key={idx} className="flex flex-col rounded-lg border border-[var(--border)] bg-black/5 dark:bg-black/20 p-2 text-center">
                      <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        {panel.title}
                      </span>
                      <div className="relative aspect-square w-full overflow-hidden bg-black rounded-md">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={panel.img}
                          alt={panel.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <button
                        onClick={() => downloadImage(panel.img, `smarttb_${panel.name}`)}
                        className="mt-2 text-[10px] text-brand-indigo font-semibold hover:underline flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Download className="h-3 w-3" /> Download JPEG
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reset / Actions bottom bar */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-[var(--border)] pt-4 gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Info className="h-4 w-4 text-brand-indigo shrink-0" />
                <span>
                  Red regions represent high visual diagnostic contribution.
                </span>
              </div>
              <div className="flex gap-3 w-full sm:w-auto shrink-0 justify-end">
                <button
                  onClick={onReset}
                  className="w-full sm:w-auto rounded-lg border border-[var(--border)] px-4 py-2.5 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center justify-center gap-1 text-[var(--foreground)]"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Analyze Another
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Regulatory Compliance Medical Disclaimer */}
      <div className="mt-8 rounded-2xl border border-amber-500/25 bg-amber-500/5 dark:bg-amber-500/10 p-5 flex gap-4">
        <Info className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-black uppercase text-amber-800 dark:text-amber-300 tracking-wider">
            Clinical Decision Support Disclaimer
          </h4>
          <p className="text-[11px] text-amber-700 dark:text-amber-200 mt-1 leading-relaxed">
            <strong>ATTENTION:</strong> SmartTB Screen is an Artificial Intelligence software tool designed to act as an initial screening and computer-aided detection (CAD) decision support utility. It has NOT been approved as a standalone diagnostic system by any official drug/medical administration (e.g. FDA, CE).
            This analysis is based on radiological characteristics mapped using neural network activation profiles. It does NOT substitute clinical judgements, patient examination, or laboratory microbiology evaluations. Confirmatory testing is strictly mandatory before finalizing therapeutic schedules.
          </p>
        </div>
      </div>
    </div>
  );
}
