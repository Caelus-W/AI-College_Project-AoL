"use client";

import React, { useState } from "react";
import { Eye, Layers, Download, Info } from "lucide-react";
import { motion } from "framer-motion";

interface ImageViewerProps {
  images: {
    original: string;
    heatmap: string;
    overlay: string;
  };
  fileName: string;
}

export default function ImageViewer({ images, fileName }: ImageViewerProps) {
  const [viewMode, setViewMode] = useState<"fader" | "grid">("fader");
  const [blendOpacity, setBlendOpacity] = useState<number>(50); // 0 to 100

  const handleDownload = (dataUrl: string, suffix: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    // Clean name: replace spaces and extensions
    const cleanName = fileName.replace(/\.[^/.]+$/, "");
    link.download = `${cleanName}_${suffix}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm flex flex-col transition-colors duration-300">
      
      {/* Visualizer Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Spatial Feature Localization
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Grad-CAM heatmap overlays highlighting regions of diagnostic import
          </p>
        </div>

        {/* Segmented Layout Toggler */}
        <div className="flex rounded-lg bg-slate-100 dark:bg-slate-950 p-0.5 text-[11px] font-bold self-start sm:self-auto shrink-0 border border-slate-200/40 dark:border-slate-800/40">
          <button
            onClick={() => setViewMode("fader")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
              viewMode === "fader" 
                ? "bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm" 
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-250"
            }`}
          >
            <Layers className="h-3.5 w-3.5" /> Fader Overlay
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
              viewMode === "grid" 
                ? "bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm" 
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-250"
            }`}
          >
            <Eye className="h-3.5 w-3.5" /> Side-by-Side
          </button>
        </div>
      </div>

      {/* Main Image Display */}
      <div className="mt-6 flex-1 flex flex-col justify-center items-center">
        {viewMode === "fader" ? (
          /* Interactive Fader Mode */
          <div className="w-full max-w-sm flex flex-col items-center">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black shadow-inner border border-slate-200 dark:border-slate-800">
              
              {/* Base layer: Original X-Ray */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images.original}
                alt="Chest X-Ray Original"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              />

              {/* Top layer: Grad-CAM Overlay */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images.overlay}
                alt="Grad-CAM Heatmap Blend"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-75"
                style={{ opacity: blendOpacity / 100 }}
              />
            </div>

            {/* Slider blending controls */}
            <div className="mt-5 w-full px-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                <span>Original Chest X-Ray</span>
                <span className="text-blue-600 dark:text-blue-400">Grad-CAM Overlay ({blendOpacity}%)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={blendOpacity}
                onChange={(e) => setBlendOpacity(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        ) : (
          /* Side by Side Grid Mode */
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Original X-Ray", img: images.original, key: "original" },
              { title: "Activation Profile", img: images.heatmap, key: "heatmap" },
              { title: "Blended Overlay", img: images.overlay, key: "overlay" }
            ].map((panel, idx) => (
              <div key={idx} className="flex flex-col rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 p-3 text-center">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-2">
                  {panel.title}
                </span>
                <div className="relative aspect-square w-full overflow-hidden bg-black rounded-lg border border-slate-200/50 dark:border-slate-800/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={panel.img}
                    alt={panel.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <button
                  onClick={() => handleDownload(panel.img, panel.key)}
                  className="mt-3 text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Download className="h-3 w-3" /> Export JPEG
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info footer */}
      <div className="mt-6 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-4">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-500 shrink-0" />
        <span>
          Red contours localize regions of significant network attention during binary classification.
        </span>
      </div>
    </div>
  );
}
