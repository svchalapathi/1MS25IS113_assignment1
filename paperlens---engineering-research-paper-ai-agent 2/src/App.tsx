import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PaperInput } from './components/PaperInput';
import { MetadataSection } from './components/MetadataSection';
import { SummarySection } from './components/SummarySection';
import { ArchitectureSection } from './components/ArchitectureSection';
import { ProjectsSection } from './components/ProjectsSection';
import { StudentChatSection } from './components/StudentChatSection';
import { SAMPLE_PAPERS } from './data/samplePapers';
import { PaperAnalysisResult } from './types/paper';
import {
  FileText,
  Network,
  Rocket,
  HelpCircle,
  Download,
  Share2,
  Check,
  Sparkles,
  ArrowUpRight,
  BookOpen,
} from 'lucide-react';

export default function App() {
  // Theme state: dark mode support
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Active paper analysis result
  // Pre-load benchmark paper "Attention Is All You Need" so the student sees immediate, high-fidelity results
  const [currentPaper, setCurrentPaper] = useState<PaperAnalysisResult>(SAMPLE_PAPERS.transformer);

  // Active tab: 'overview' | 'summary' | 'architecture' | 'projects' | 'qa'
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // Handle PDF upload analysis
  const handleAnalyzePdf = async (base64: string, filename: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStep(`Uploading ${filename} and decoding PDF stream...`);

    const timer1 = setTimeout(() => {
      setLoadingStep('Extracting problem statement & methodology with Gemini 3.8 Flash...');
    }, 1800);

    const timer2 = setTimeout(() => {
      setLoadingStep('Synthesizing Mermaid.js architecture flowchart and project opportunities...');
    }, 4500);

    try {
      const response = await fetch('/api/analyze-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfBase64: base64, filename }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to analyze paper');
      }

      setCurrentPaper(resData.data);
      setActiveTab('overview');
      window.scrollTo({ top: 380, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(
        err.message || 'Error communicating with analysis agent. Falling back to benchmark mode.'
      );
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Handle URL analysis
  const handleAnalyzeUrl = async (url: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStep(`Resolving academic URL: ${url}...`);

    const timer1 = setTimeout(() => {
      setLoadingStep('Parsing scholarly text & methodology with Gemini 3.8 Flash...');
    }, 2000);

    const timer2 = setTimeout(() => {
      setLoadingStep('Generating Mermaid architecture & 3 student capstone projects...');
    }, 4500);

    try {
      const response = await fetch('/api/analyze-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to analyze paper URL');
      }

      setCurrentPaper(resData.data);
      setActiveTab('overview');
      window.scrollTo({ top: 380, behavior: 'smooth' });
    } catch (err: any) {
      console.error('URL Analysis error:', err);
      setErrorMessage(
        err.message || 'Error fetching paper from URL. Please ensure it is publicly accessible or upload the PDF.'
      );
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Handle instant sample selection
  const handleSelectSample = (sampleId: string) => {
    if (SAMPLE_PAPERS[sampleId]) {
      setCurrentPaper(SAMPLE_PAPERS[sampleId]);
      setActiveTab('overview');
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  // Download complete student study guide
  const handleDownloadStudyGuide = () => {
    if (!currentPaper) return;
    const md = `# Research Paper Study Guide: ${currentPaper.metadata.title}
Authors: ${currentPaper.metadata.authors.join(', ')}
Published: ${currentPaper.metadata.publicationName} (${currentPaper.metadata.publicationYear})
Citations: ${currentPaper.metadata.citationCount}

---

## 1. Quick Summary
${currentPaper.summary.oneLineHook}

### Problem Statement
${currentPaper.summary.problemStatement.simpleExplanation}

Key Obstacles:
${currentPaper.summary.problemStatement.keyObstacles.map((o) => `- ${o}`).join('\n')}

### Methodology
${currentPaper.summary.methodology.simpleExplanation}

Pipeline Steps:
${currentPaper.summary.methodology.stepByStepPipeline
  .map((s, i) => `${i + 1}. **${s.step}**: ${s.description}\n   *Significance*: ${s.engineeringSignificance}`)
  .join('\n')}

### Key Findings
${currentPaper.summary.keyFindings.simpleExplanation}

Quantitative Metrics:
${currentPaper.summary.keyFindings.quantitativeResults
  .map((q) => `- **${q.metric}**: ${q.value} (${q.comparison})`)
  .join('\n')}

Limitations:
${currentPaper.summary.keyFindings.limitations.map((l) => `- ${l}`).join('\n')}

---

## 2. System Architecture Flowchart (Mermaid)
\`\`\`mermaid
${currentPaper.architectureFlowchart.mermaidCode}
\`\`\`

Walkthrough:
${currentPaper.architectureFlowchart.architectureWalkthrough}

---

## 3. Future Opportunities & Project Ideas
${currentPaper.futureOpportunities
  .map(
    (p, i) => `### Project ${i + 1}: ${p.title} (${p.difficultyLevel})
- **Duration**: ${p.estimatedDuration}
- **Problem**: ${p.problemSolved}
- **Method**: ${p.proposedMethod}
- **Technologies**: ${p.technologies.join(', ')}
- **Recommended Dataset**: ${p.gettingStartedDataset}
- **Week 1 Milestone**: ${p.firstMilestone}
- **Performance Targets**:
${p.performanceMetrics.map((m) => `  * ${m.metricName}: ${m.targetThreshold} (${m.measurementMethod})`).join('\n')}
`
  )
  .join('\n')}
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentPaper.metadata.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 40)}-study-guide.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `PaperLens: ${currentPaper.metadata.title}`,
          text: `Check out the AI breakdown and architecture flowchart for "${currentPaper.metadata.title}"`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col font-sans">
      {/* Header conforming to 3-zone contract */}
      <Header
        isDark={isDark}
        onToggleTheme={toggleTheme}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        hasPaper={!!currentPaper}
        onReset={() => {
          setActiveTab('overview');
          const element = document.getElementById('paper-input-area');
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10">
        {/* Hero Section */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
            <span>Engineering Research Companion</span>
            <span aria-hidden="true">·</span>
            <span>Gemini Multimodal Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
            Demystify Complex Engineering Research Papers
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Upload any academic PDF or arXiv link to extract simple explanations, render interactive Mermaid.js system architecture flowcharts, and discover 3 realistic student project opportunities with performance metrics.
          </p>
        </div>

        {/* Input Area (Upload PDF or Enter URL) */}
        <PaperInput
          onAnalyzePdf={handleAnalyzePdf}
          onAnalyzeUrl={handleAnalyzeUrl}
          onSelectSample={handleSelectSample}
          isLoading={isLoading}
          loadingStep={loadingStep}
        />

        {/* Error notification if any */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-sm text-rose-800 dark:text-rose-200 flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-semibold underline ml-4 hover:opacity-80"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Results Area */}
        {currentPaper && (
          <div className="space-y-8 pt-4">
            {/* Action Bar & Section Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              {/* Segmented Controls for Features */}
              <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-xl overflow-x-auto">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Overview & Metadata
                </button>
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                    activeTab === 'summary'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Paper Summary
                </button>
                <button
                  onClick={() => setActiveTab('architecture')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                    activeTab === 'architecture'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Network className="w-3.5 h-3.5" />
                  Architecture Flowchart
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                    activeTab === 'projects'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Rocket className="w-3.5 h-3.5" />
                  Project Ideas (3)
                </button>
                <button
                  onClick={() => setActiveTab('qa')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                    activeTab === 'qa'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Paper Q&A
                </button>
              </div>

              {/* Utility actions: Download guide & share */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleDownloadStudyGuide}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-800"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Study Guide</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-800"
                >
                  {copiedShare ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Link Copied</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* TAB CONTENT */}

            {/* Tab: Overview (Feature 4: Metadata + Highlights) */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Feature 4: Paper Metadata */}
                <MetadataSection metadata={currentPaper.metadata} />

                {/* Quick Snapshot cards leading to other sections */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Summary preview */}
                  <div
                    onClick={() => setActiveTab('summary')}
                    className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                        <FileText className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        Problem & Methodology Summary
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {currentPaper.summary.oneLineHook}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      <span>Read complete breakdown</span>
                      <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </div>

                  {/* Architecture preview */}
                  <div
                    onClick={() => setActiveTab('architecture')}
                    className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-3">
                        <Network className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        Mermaid.js Flowchart
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {currentPaper.architectureFlowchart.architectureWalkthrough}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      <span>View interactive diagram</span>
                      <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </div>

                  {/* Projects preview */}
                  <div
                    onClick={() => setActiveTab('projects')}
                    className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                        <Rocket className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        3 Student Project Ideas
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {currentPaper.futureOpportunities[0]?.title} + 2 more realistic capstones with target thresholds.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      <span>Explore all 3 projects</span>
                      <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </div>
                </div>

                {/* Also render the full paper summary on overview for seamless reading */}
                <SummarySection summary={currentPaper.summary} />
              </div>
            )}

            {/* Tab: Feature 1 - Paper Summary */}
            {activeTab === 'summary' && (
              <SummarySection summary={currentPaper.summary} />
            )}

            {/* Tab: Feature 2 - Architecture Flowchart */}
            {activeTab === 'architecture' && (
              <ArchitectureSection
                architecture={currentPaper.architectureFlowchart}
                isDark={isDark}
              />
            )}

            {/* Tab: Feature 3 - Future Opportunities */}
            {activeTab === 'projects' && (
              <ProjectsSection
                projects={currentPaper.futureOpportunities}
                paperTitle={currentPaper.metadata.title}
              />
            )}

            {/* Tab: Paper Q&A */}
            {activeTab === 'qa' && (
              <StudentChatSection paper={currentPaper} />
            )}
          </div>
        )}
      </main>

      {/* Footer conforming to anti-slop rules (no fake engines or telemetry) */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">PaperLens AI</span>
            <span aria-hidden="true">·</span>
            <span>Engineering Research Agent for Undergraduate & Graduate Students</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>Powered by Gemini 3.8 Flash & Mermaid.js</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
