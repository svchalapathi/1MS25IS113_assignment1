import React from 'react';
import { ArchitectureFlowchart } from '../types/paper';
import { MermaidViewer } from './MermaidViewer';
import { Network, Layers, GitBranch, Info } from 'lucide-react';

interface ArchitectureSectionProps {
  architecture: ArchitectureFlowchart;
  isDark: boolean;
}

export const ArchitectureSection: React.FC<ArchitectureSectionProps> = ({
  architecture,
  isDark,
}) => {
  return (
    <div className="space-y-8">
      {/* Overview & Walkthrough */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              System Architecture Flowchart
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive structural diagram generated with Mermaid.js showing pipeline stages and data flow
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          <span className="font-semibold text-slate-900 dark:text-white block mb-1">
            Dataflow & Computation Walkthrough:
          </span>
          {architecture.architectureWalkthrough}
        </div>

        {/* Mermaid.js Flowchart Viewer */}
        <MermaidViewer code={architecture.mermaidCode} isDark={isDark} />
      </div>

      {/* Component Breakdown Cards */}
      {architecture.keyComponents && architecture.keyComponents.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Sub-Module & Component Breakdown
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {architecture.keyComponents.map((comp, i) => (
              <div
                key={i}
                className="p-5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 block mb-1 tabular-nums">
                    Block 0{i + 1}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                    {comp.name}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {comp.role}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-indigo-700 dark:text-indigo-300">
                  <span className="font-semibold block mb-0.5">Engineering Principle:</span>
                  <span>{comp.engineeringTakeaway}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
