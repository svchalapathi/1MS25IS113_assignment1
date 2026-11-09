import React from 'react';
import { PaperSummary } from '../types/paper';
import { Lightbulb, Target, Cpu, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SummarySectionProps {
  summary: PaperSummary;
}

export const SummarySection: React.FC<SummarySectionProps> = ({ summary }) => {
  return (
    <div className="space-y-8">
      {/* 1-Line Elevator Pitch */}
      <div className="bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl p-6 sm:p-7">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 block mb-1">
              Executive Engineering Takeaway
            </span>
            <p className="text-base sm:text-lg font-medium text-slate-900 dark:text-white leading-relaxed">
              {summary.oneLineHook}
            </p>
          </div>
        </div>
      </div>

      {/* Part 1: Problem Statement */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Problem Statement
          </h2>
        </div>

        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          {summary.problemStatement.simpleExplanation}
        </p>

        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-3">
            Core Bottlenecks Faced by Prior State-of-the-Art:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {summary.problemStatement.keyObstacles.map((obstacle, i) => (
              <div
                key={i}
                className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800"
              >
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 block mb-1.5 tabular-nums">
                  Obstacle 0{i + 1}
                </span>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-normal">
                  {obstacle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Part 2: Methodology */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Engineering Methodology & Innovation
          </h2>
        </div>

        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          {summary.methodology.simpleExplanation}
        </p>

        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-3">
            Step-by-Step Technical Pipeline:
          </span>
          <div className="space-y-3">
            {summary.methodology.stepByStepPipeline.map((stepItem, i) => (
              <div
                key={i}
                className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-start gap-4"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0 tabular-nums">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                    {stepItem.step}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                    {stepItem.description}
                  </p>
                  <div className="text-xs text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/50 px-3 py-1.5 rounded-lg border border-indigo-100/80 dark:border-indigo-900/40">
                    <span className="font-semibold">Why this matters: </span>
                    {stepItem.engineeringSignificance}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Part 3: Key Findings */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Key Findings & Experimental Validation
          </h2>
        </div>

        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          {summary.keyFindings.simpleExplanation}
        </p>

        {/* Quantitative Benchmarks Grid */}
        <div className="mb-6">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-3">
            Experimental Benchmark Results:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {summary.keyFindings.quantitativeResults.map((result, i) => (
              <div
                key={i}
                className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/50"
              >
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                  {result.metric}
                </span>
                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400 tabular-nums mb-1">
                  {result.value}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {result.comparison}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Limitations & Engineering Trade-offs */}
        {summary.keyFindings.limitations && summary.keyFindings.limitations.length > 0 && (
          <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/50">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                Engineering Constraints & Known Limitations
              </span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pl-4 list-disc">
              {summary.keyFindings.limitations.map((lim, i) => (
                <li key={i}>{lim}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
