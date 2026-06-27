"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Activity, ShieldCheck, Zap, HeartPulse } from "lucide-react";

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <section className="relative overflow-hidden py-12 lg:py-16">
      
      {/* Background medical grid glow pattern */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_20rem_at_top,rgba(6,182,212,0.06),transparent)] dark:bg-[radial-gradient(45rem_20rem_at_top,rgba(6,182,212,0.12),transparent)]" />
      
      <motion.div 
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* FDA/CE Simulation Badge */}
        <motion.div 
          className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-brand-indigo/10 dark:bg-brand-indigo/25 px-3 py-1 text-xs font-semibold text-brand-indigo dark:text-indigo-300 border border-brand-indigo/20"
          variants={itemVariants}
        >
          <ShieldCheck className="h-4.5 w-4.5" />
          Clinical Screening Decision Support System
        </motion.div>

        {/* Hero Headline */}
        <motion.h2 
          className="mt-6 text-4xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl"
          variants={itemVariants}
        >
          AI-Powered Early <br />
          <span className="bg-gradient-to-r from-brand-indigo via-brand-teal to-brand-cyan bg-clip-text text-transparent">
            Tuberculosis Detection
          </span>
        </motion.h2>

        {/* Hero Subtitle */}
        <motion.p 
          className="mx-auto mt-4 max-w-2xl text-base text-gray-500 dark:text-gray-400 sm:text-lg"
          variants={itemVariants}
        >
          Upload digital chest X-ray images for instantaneous deep-learning classification. 
          SmartTB Screen localizes visual abnormalities using Grad-CAM heatmaps to assist radiologists in triage.
        </motion.p>

        {/* Stats Grid */}
        <motion.div 
          className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4"
          variants={itemVariants}
        >
          {[
            { value: "98.2%", label: "Sensitivity", icon: HeartPulse, color: "text-brand-teal" },
            { value: "< 1.8s", label: "Analysis Time", icon: Zap, color: "text-brand-cyan" },
            { value: "DenseNet", label: "121 Backbone", icon: Activity, color: "text-brand-indigo" },
            { value: "Grad-CAM", label: "Localization", icon: ShieldCheck, color: "text-brand-rose" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition-transform hover:scale-102">
              <stat.icon className={`h-5 w-5 ${stat.color} mb-1.5`} />
              <span className="text-xl font-bold text-[var(--foreground)] sm:text-2xl">{stat.value}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
