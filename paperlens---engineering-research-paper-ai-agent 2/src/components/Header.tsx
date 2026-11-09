import React from 'react';
import { Sun, Moon, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  hasPaper: boolean;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  activeTab,
  onSelectTab,
  hasPaper,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element wordmark, display face) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onReset}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:bg-indigo-700 transition-colors">
              P
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              PaperLens
            </span>
          </button>
        </div>

        {/* Zone 2: 4-5 Concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onSelectTab('overview')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'overview'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onSelectTab('summary')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'summary'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Paper Summary
          </button>
          <button
            onClick={() => onSelectTab('architecture')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'architecture'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Architecture
          </button>
          <button
            onClick={() => onSelectTab('projects')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'projects'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Project Ideas
          </button>
          <button
            onClick={() => onSelectTab('qa')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'qa'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Paper Q&A
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {hasPaper ? (
            <button
              onClick={onReset}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              Analyze New Paper
            </button>
          ) : (
            <a
              href="#paper-input-area"
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Upload Paper
            </a>
          )}
        </div>
      </div>
    </header>
  );
};
