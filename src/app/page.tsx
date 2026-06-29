"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Cpu, Layers, HelpCircle, Activity, CheckCircle2, ShieldCheck, HeartPulse } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function HomePage() {
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Sync dark mode configuration with document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-150 transition-colors duration-300">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="flex-grow pb-16">
        {/* 1. Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-12 sm:pt-20 sm:pb-16 text-center">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_20rem_at_top,rgba(59,130,246,0.06),transparent)] dark:bg-[radial-gradient(45rem_20rem_at_top,rgba(59,130,246,0.1),transparent)]" />
          
          <motion.div 
            className="mx-auto max-w-5xl px-4 sm:px-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Decisive Support Badge */}
            <motion.div 
              className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 px-3.5 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50"
              variants={itemVariants}
            >
              <ShieldCheck className="h-4.5 w-4.5" />
              CAD4TB Decision Support Protocol
            </motion.div>

            {/* Title */}
            <motion.h1 
              className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl leading-[1.1]"
              variants={itemVariants}
            >
              AI-Powered Radiograph Screening <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 bg-clip-text text-transparent">
                For Early Tuberculosis
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              className="mx-auto mt-6 max-w-2xl text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed"
              variants={itemVariants}
            >
              SmartTB AI is a computer-aided screening application. Drop digital chest radiographs to execute instant classification. Map diagnostic markers through interactive Grad-CAM heatmap visualizations to support radiology workflows.
            </motion.p>

            {/* Analyze CTA Trigger Button */}
            <motion.div className="mt-8 flex justify-center" variants={itemVariants}>
              <Link
                href="/analyze"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 text-xs font-bold shadow-md shadow-blue-500/15 transition-all hover:scale-102 cursor-pointer"
              >
                Start Image Analysis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* Quick Model Performance Stats Panel */}
            <motion.div 
              className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl bg-white dark:bg-slate-900/40 p-5 shadow-sm"
              variants={itemVariants}
            >
              {[
                { val: "98.2%", label: "Sensitivity Model", color: "text-emerald-500" },
                { val: "< 1.5s", label: "Analysis Time", color: "text-blue-500" },
                { val: "DenseNet", label: "Backbone CNN", color: "text-indigo-500" },
                { val: "Grad-CAM", label: "Spatial Activation", color: "text-red-500" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <span className={`text-xl sm:text-2xl font-black block ${stat.color}`}>{stat.val}</span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mt-1 block">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* 2. How It Works Section */}
        <section className="py-12 border-t border-slate-200/50 dark:border-slate-800/40">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                Workflow Protocol
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                A simple three-step analysis pipeline.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  title: "Drop Chest Radiograph",
                  desc: "Submit X-ray image (PNG/JPEG) directly into the drag-and-drop zone. Visual size constraints are validated in the browser."
                },
                {
                  step: "02",
                  title: "Execute Deep Inference",
                  desc: "The classification engine processes the X-ray, evaluating texture density markers and generating categorical probabilities."
                },
                {
                  step: "03",
                  title: "Inspect Spatial Features",
                  desc: "Grad-CAM maps highlight regions of diagnostic importance. Use the opacity slider to blend the heatmap dynamically over the X-ray."
                }
              ].map((card, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/30 p-6 shadow-sm flex flex-col gap-3">
                  <span className="text-xs font-black text-blue-600 dark:text-blue-500 tracking-wider">
                    STEP {card.step}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {card.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. AI Model Details Section */}
        <section className="py-12 border-t border-slate-200/50 dark:border-slate-800/40">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900/50 p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center">
              
              {/* Technical Specifications details */}
              <div className="flex-1">
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                  Model Infrastructure Specs
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  SmartTB AI utilizes a **DenseNet-121** convolutional backbone, pre-trained on ImageNet and fine-tuned for thoracic pathology. The classifier resolves predictions into a binary space.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  To achieve explainability, the application generates **Grad-CAM** mappings targeting the final convolutional layer output (`norm5`). By computing logit gradients and pooling activations, it maps anomalies onto the X-ray.
                </p>
                
                {/* Tech specifications list */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {[
                    "Input dimension: 224x224x3",
                    "Target activation block: features.norm5",
                    "Parameter weights: ~7 Million parameters",
                    "Output space: Binary logits [Normal, TB]"
                  ].map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-350">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Graphic Icon Panel representing Neural Connections */}
              <div className="shrink-0 w-full md:w-60 h-44 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(100px_at_center,rgba(59,130,246,0.1),transparent)]" />
                <Layers className="h-10 w-10 text-blue-600 dark:text-blue-400 animate-pulse z-10" />
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-3 z-10">
                  DenseNet-121 Grid
                </span>
                <span className="text-[9px] text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded mt-2 border border-emerald-100 dark:border-emerald-900/50 z-10">
                  Active Features Map
                </span>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
