import React, { useState } from 'react';
import { ProjectOpportunity } from '../types/paper';
import { Rocket, Gauge, Wrench, Clock, Database, Flag, Copy, Check, ChevronRight } from 'lucide-react';

interface ProjectsSectionProps {
  projects: ProjectOpportunity[];
  paperTitle: string;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, paperTitle }) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyProposalMarkdown = (project: ProjectOpportunity) => {
    const text = `# Project Proposal: ${project.title}
Based on research paper: "${paperTitle}"

## Overview
- Difficulty: ${project.difficultyLevel}
- Estimated Timeline: ${project.estimatedDuration}
- Recommended Dataset: ${project.gettingStartedDataset}

## Problem Solved
${project.problemSolved}

## Proposed Engineering Methodology
${project.proposedMethod}

## Technology Stack
${project.technologies.join(', ')}

## Quantitative Performance Metrics & Targets
${project.performanceMetrics.map((m) => `- **${m.metricName}**: Target "${m.targetThreshold}" (Measured via: ${m.measurementMethod})`).join('\n')}

## Week 1 Feasibility Milestone
${project.firstMilestone}
`;

    navigator.clipboard.writeText(text);
    setCopiedId(project.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Rocket className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Future Opportunities: 3 Realistic Engineering Projects
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
          Actionable, realistic student projects derived from this paper's core innovations. Each project is calibrated for coursework, senior design capstones, or thesis research with concrete performance metrics.
        </p>
      </div>

      {/* 3 Project Cards */}
      <div className="space-y-6">
        {projects.map((project, index) => {
          const difficultyBadgeColors =
            project.difficultyLevel.includes('Beginner')
              ? 'text-emerald-700 dark:text-emerald-300'
              : project.difficultyLevel.includes('Intermediate')
              ? 'text-sky-700 dark:text-sky-300'
              : 'text-purple-700 dark:text-purple-300';

          return (
            <div
              key={project.id || index}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              {/* Project Meta Line */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className={`font-semibold ${difficultyBadgeColors}`}>
                    {project.difficultyLevel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{project.estimatedDuration}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Project 0{index + 1}</span>
                </div>

                <button
                  onClick={() => copyProposalMarkdown(project)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  {copiedId === project.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied Proposal</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Proposal Markdown</span>
                    </>
                  )}
                </button>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {project.title}
              </h3>

              {/* Problem Solved */}
              <div className="mb-4">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Practical Problem Solved
                </span>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {project.problemSolved}
                </p>
              </div>

              {/* Proposed Method */}
              <div className="mb-5 p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 block mb-1">
                  Proposed Engineering Method:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {project.proposedMethod}
                </p>
              </div>

              {/* Technology Stack Tags */}
              <div className="mb-6">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
                  Recommended Technology Stack:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Performance Metrics Table */}
              <div className="mb-5">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2.5">
                  Target Performance Metrics:
                </span>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-4 py-2.5 font-semibold">Evaluation Metric</th>
                        <th className="px-4 py-2.5 font-semibold">Target Threshold</th>
                        <th className="px-4 py-2.5 font-semibold">Measurement Methodology</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {project.performanceMetrics.map((metric, mIdx) => (
                        <tr key={mIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                            {metric.metricName}
                          </td>
                          <td className="px-4 py-3 font-mono font-medium text-indigo-600 dark:text-indigo-400 tabular-nums">
                            {metric.targetThreshold}
                          </td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                            {metric.measurementMethod}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dataset & Milestone footer strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-start gap-2">
                  <Database className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                      Recommended Open Dataset:
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {project.gettingStartedDataset}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Flag className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                      Week 1 Feasibility Milestone:
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {project.firstMilestone}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
