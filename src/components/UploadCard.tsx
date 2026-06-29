"use client";

import React, { useState, useRef } from "react";
import { Upload, X, FileImage, ShieldAlert, Cpu, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadCardProps {
  onScan: (file: File, forcedPrediction?: "Positive" | "Negative") => void;
  isLoading: boolean;
}

export default function UploadCard({ onScan, isLoading }: UploadCardProps) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Simulated outcome toggle ("Auto", "Positive", "Negative")
  const [simulationMode, setSimulationMode] = useState<"auto" | "Positive" | "Negative">("auto");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    setErrorMsg(null);
    
    // Check if it is an image
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Invalid file type. Please upload a valid Chest X-ray image (PNG, JPG, or JPEG).");
      return;
    }
    
    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMsg("File is too large. Maximum allowed size is 10MB.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const clearSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      const forced = simulationMode === "auto" ? undefined : simulationMode;
      onScan(selectedFile, forced);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm transition-colors duration-300">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
        <FileImage className="h-5 w-5 text-blue-600 dark:text-blue-500" /> Upload Chest X-Ray
      </h3>

      {/* Drag & Drop Area */}
      {!previewUrl ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerClick}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-all cursor-pointer ${
            dragActive
              ? "border-blue-500 bg-blue-500/5 scale-[0.995]"
              : "border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/10"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.webp"
            onChange={handleChange}
            className="hidden"
          />
          <div className="rounded-full bg-blue-50 dark:bg-blue-950/40 p-4 text-blue-600 dark:text-blue-400 mb-4">
            <Upload className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Drag & drop chest radiograph here
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Supports PNG, JPEG, JPG, and WebP (up to 10MB)
          </p>
          <button
            type="button"
            className="mt-4 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Select File
          </button>
        </div>
      ) : (
        /* Image Preview Area */
        <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 p-4">
          <button
            onClick={clearSelection}
            disabled={isLoading}
            className="absolute top-6 right-6 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/70 hover:bg-slate-950/90 text-white transition-colors cursor-pointer"
            title="Clear image"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative aspect-square max-h-[300px] mx-auto overflow-hidden rounded-lg bg-black flex items-center justify-center shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Chest X-Ray Preview"
              className="max-h-[300px] object-contain w-full h-full"
            />
          </div>

          {/* File Metadata Details */}
          {selectedFile && (
            <div className="mt-4 flex flex-col gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-[300px]">
                    {selectedFile.name}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Size: {formatFileSize(selectedFile.size)} • Type: {selectedFile.type.split("/")[1].toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Advanced Simulator Parameters Override (Segmented Control) */}
              <div className="rounded-xl bg-slate-100 dark:bg-slate-950 p-3 border border-slate-200/50 dark:border-slate-800/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Cpu className="h-3.5 w-3.5 text-blue-600 dark:text-blue-500" />
                    Diagnostics Simulator Settings
                  </span>
                  <span className="text-[9px] text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded">
                    MVP Option
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 p-0.5 bg-slate-200/60 dark:bg-slate-900 rounded-lg text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setSimulationMode("auto")}
                    className={`py-1 rounded-md text-center cursor-pointer transition-all ${
                      simulationMode === "auto"
                        ? "bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"
                    }`}
                  >
                    Auto Heuristic
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimulationMode("Negative")}
                    className={`py-1 rounded-md text-center cursor-pointer transition-all ${
                      simulationMode === "Negative"
                        ? "bg-white dark:bg-slate-800 text-green-600 dark:text-green-400 shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"
                    }`}
                  >
                    Simulate Normal
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimulationMode("Positive")}
                    className={`py-1 rounded-md text-center cursor-pointer transition-all ${
                      simulationMode === "Positive"
                        ? "bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"
                    }`}
                  >
                    Simulate TB
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={clearSelection}
                  disabled={isLoading}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50"
                >
                  Reset
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs font-bold shadow-sm shadow-blue-500/10 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Analyze X-Ray
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Messaging */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 overflow-hidden text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-200/50 dark:border-red-950/40 font-medium flex gap-2"
          >
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
