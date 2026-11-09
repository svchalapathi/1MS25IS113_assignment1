import React, { useState } from 'react';
import { PaperMetadata } from '../types/paper';
import { Copy, Check, Quote, ExternalLink, Calendar, Users, BookOpen, Bookmark } from 'lucide-react';

interface MetadataSectionProps {
  metadata: PaperMetadata;
}

export const MetadataSection: React.FC<MetadataSectionProps> = ({ metadata }) => {
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [showBibtex, setShowBibtex] = useState(false);

  const generateBibtex = () => {
    const firstAuthorLastName = (metadata.authors[0] || 'Author')
      .split(' ')
      .pop()
      ?.toLowerCase()
      .replace(/[^a-z]/g, '') || 'author';
    const year = metadata.publicationYear || '2024';
    const cleanTitle = metadata.title.replace(/[\n\r]/g, ' ');

    return `@article{${firstAuthorLastName}${year},
  title={${cleanTitle}},
  author={${metadata.authors.join(' and ')}},
  journal={${metadata.publicationName}},
  year={${year}},
  note={${metadata.doiOrArxivId || 'PaperLens AI Analysis'}}
}`;
  };

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(generateBibtex());
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
      {/* Paper Title & Primary Metadata */}
      <div className="mb-6">
        {/* Unboxed clean metadata line with separators - complying with zero-pill discipline */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            {metadata.venueType || 'Scientific Paper'}
          </span>
          <span aria-hidden="true">·</span>
          <span>{metadata.publicationName}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums font-medium">{metadata.publicationYear}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums font-semibold text-slate-700 dark:text-slate-300">
            {metadata.citationCount}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
          {metadata.title}
        </h1>

        {metadata.doiOrArxivId && (
          <div className="mt-2 text-xs font-mono text-slate-500">
            <span>Reference: {metadata.doiOrArxivId}</span>
          </div>
        )}
      </div>

      {/* Structured 4-zone metadata grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-5 border-y border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-xs text-slate-400 dark:text-slate-500 block mb-1">
            Publication Venue
          </span>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {metadata.publicationName}
          </p>
        </div>

        <div>
          <span className="text-xs text-slate-400 dark:text-slate-500 block mb-1">
            Publication Year
          </span>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
            {metadata.publicationYear}
          </p>
        </div>

        <div>
          <span className="text-xs text-slate-400 dark:text-slate-500 block mb-1">
            Academic Impact
          </span>
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
            {metadata.citationCount}
          </p>
        </div>

        <div>
          <span className="text-xs text-slate-400 dark:text-slate-500 block mb-1">
            Primary Author
          </span>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
            {metadata.authors[0] || 'Principal Investigator'}
          </p>
        </div>
      </div>

      {/* Authors List */}
      <div className="mt-5">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-2">
          Full Author Roster ({metadata.authors.length} researchers):
        </span>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-700 dark:text-slate-300">
          {metadata.authors.map((author, index) => (
            <React.Fragment key={index}>
              <span className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {author}
              </span>
              {index < metadata.authors.length - 1 && (
                <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
                  ·
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Research Keywords - Rendered as clean text list */}
      {metadata.paperKeywords && metadata.paperKeywords.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-600 dark:text-slate-300">Domain Topics:</span>
          {metadata.paperKeywords.map((kw, i) => (
            <React.Fragment key={i}>
              <span>{kw}</span>
              {i < metadata.paperKeywords.length - 1 && <span aria-hidden="true">/</span>}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Action Row: BibTeX generator for student reports */}
      <div className="mt-6 flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setShowBibtex(!showBibtex)}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <Quote className="w-3.5 h-3.5" />
          <span>{showBibtex ? 'Hide BibTeX Citation' : 'Generate BibTeX Citation'}</span>
        </button>

        <div className="flex items-center gap-2">
          {metadata.doiOrArxivId && (
            <a
              href={
                metadata.doiOrArxivId.includes('arxiv:')
                  ? `https://arxiv.org/abs/${metadata.doiOrArxivId.replace('arxiv:', '').trim()}`
                  : `https://doi.org/${metadata.doiOrArxivId}`
              }
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <span>Original Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* BibTeX Code Dropdown */}
      {showBibtex && (
        <div className="mt-4 p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs relative">
          <button
            onClick={handleCopyBibtex}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-xs transition-colors"
          >
            {copiedBibtex ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedBibtex ? 'Copied' : 'Copy'}</span>
          </button>
          <pre className="overflow-x-auto pr-16">{generateBibtex()}</pre>
        </div>
      )}
    </div>
  );
};
