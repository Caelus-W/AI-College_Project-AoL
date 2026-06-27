"use client";

import React, { useEffect, useState } from "react";
import { Activity, Moon, Sun, ShieldAlert, Cpu } from "lucide-react";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  backendUrl: string;
}

export default function Navbar({ darkMode, setDarkMode, backendUrl }: NavbarProps) {
  const [systemStatus, setSystemStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    // Check backend health status
    const checkHealth = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/health`);
        const data = await res.json();
        if (res.ok && data.status === "healthy" && data.model_loaded) {
          setSystemStatus("online");
        } else {
          setSystemStatus("offline");
        }
      } catch (err) {
        setSystemStatus("offline");
      }
    };
    checkHealth();
    // Poll health status every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [backendUrl]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-cyan shadow-md shadow-brand-cyan/20">
            <Activity className="h-5.5 w-5.5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[var(--foreground)] flex items-center gap-1.5">
              SmartTB <span className="rounded-full bg-brand-cyan/15 px-2 py-0.5 text-xs font-semibold text-brand-cyan">Screen</span>
            </h1>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Clinical AI Diagnostic System</p>
          </div>
        </div>

        {/* System Monitor & Actions */}
        <div className="flex items-center gap-4">
          
          {/* Backend Online Indicator */}
          <div className="hidden md:flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] transition-all">
            {systemStatus === "checking" && (
              <>
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-gray-500 dark:text-gray-400">Verifying AI Node...</span>
              </>
            )}
            {systemStatus === "online" && (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Cpu className="h-3 w-3 inline" /> DenseNet-121 Online
                </span>
              </>
            )}
            {systemStatus === "offline" && (
              <>
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                <span className="font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3 inline" /> AI Node Offline
                </span>
              </>
            )}
          </div>

          {/* Theme Toggler */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="h-4.5 w-4.5 text-amber-500" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-indigo-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
