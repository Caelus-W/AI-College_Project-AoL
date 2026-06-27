"use client";

import React, { useState, useRef } from "react";
import { Upload, X, FileImage, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UploaderProps {
  onScan: (file: File) => void;
  isLoading: boolean;
}

export default function Uploader({ onScan, isLoading }: UploaderProps) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
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
    
    // Validate file type (must be image)
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Invalid file type. Please upload an image file (PNG, JPG, JPEG).");
      return;
    }
    
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMsg("File size exceeds 10MB limit. Please upload a smaller image.");
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

  const handleScanSubmit = () => {
    if (selectedFile) {
      onScan(selectedFile);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-md transition-all">
        <h3 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
          <FileImage className="h-5 w-5 text-brand-indigo" /> Upload Chest X-Ray
        </h3>
        
        {/* Drag and Drop Zone */}
        {!previewUrl ? (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerClick}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all cursor-pointer ${
              dragActive
                ? "border-brand-cyan bg-brand-cyan/5 scale-99"
                : "border-[var(--border)] hover:border-brand-indigo hover:bg-gray-50/50 dark:hover:bg-gray-800/10"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.webp"
              onChange={handleChange}
              className="hidden"
            />
            <div className="rounded-full bg-brand-indigo/10 p-4 text-brand-indigo mb-4">
              <Upload className="h-6 w-6 animate-bounce" />
            </div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Drag & drop chest X-ray image here
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Supports PNG, JPEG, or JPG (max. 10MB)
            </p>
            <button
              type="button"
              className="mt-4 rounded-lg bg-[var(--foreground)] text-[var(--background)] px-4 py-2 text-xs font-semibold hover:opacity-90 cursor-pointer"
            >
              Browse Files
            </button>
          </div>
        ) : (
          /* Preview Area */
          <div className="relative rounded-xl overflow-hidden border border-[var(--border)] bg-black/5 dark:bg-black/20 p-4">
            <button
              onClick={clearSelection}
              disabled={isLoading}
              className="absolute top-6 right-6 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/85 disabled:opacity-50 cursor-pointer transition-colors"
              title="Remove image"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="relative aspect-square max-h-[320px] mx-auto overflow-hidden rounded-lg bg-black flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Chest X-Ray Preview"
                className="max-h-[320px] object-contain w-full h-full"
              />
              
              {/* Scan effect lines if loading */}
              {isLoading && (
                <div className="animate-scan" />
              )}
            </div>

            {/* Metadata and Stats */}
            {selectedFile && (
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-[var(--border)] pt-4 gap-2">
                <div>
                  <p className="text-sm font-bold text-[var(--foreground)] truncate max-w-[280px]">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    File size: {formatFileSize(selectedFile.size)} • Type: {selectedFile.type.split("/")[1].toUpperCase()}
                  </p>
                </div>
                
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={clearSelection}
                    disabled={isLoading}
                    className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 cursor-pointer text-[var(--foreground)]"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleScanSubmit}
                    disabled={isLoading}
                    className="relative flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-cyan text-white px-4 py-2 text-xs font-semibold hover:opacity-95 shadow-md shadow-brand-indigo/15 disabled:opacity-50 cursor-pointer overflow-hidden"
                  >
                    <ShieldCheck className="h-4.5 w-4.5" />
                    {isLoading ? "Analyzing..." : "Scan X-Ray"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error messaging */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 overflow-hidden text-xs text-brand-rose bg-brand-rose/10 p-2.5 rounded-lg border border-brand-rose/20 font-medium"
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
