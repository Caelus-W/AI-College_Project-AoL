"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Activity } from "lucide-react";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export default function Navbar({ darkMode, setDarkMode }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm dark:bg-blue-500">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              SmartTB <span className="text-blue-600 dark:text-blue-500 font-medium">AI</span>
            </span>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-1">
              Screening Support Node
            </p>
          </div>
        </Link>

        {/* Navigation & Theme Actions */}
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link 
              href="/" 
              className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                pathname === "/" ? "text-slate-900 dark:text-white font-semibold" : ""
              }`}
            >
              Home
            </Link>
            <Link 
              href="/analyze" 
              className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                pathname === "/analyze" ? "text-slate-900 dark:text-white font-semibold" : ""
              }`}
            >
              Analyze
            </Link>
          </nav>

          {/* Theme Toggler */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="h-4.5 w-4.5 text-amber-500 animate-spin-slow" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-blue-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
