import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { SAMPLE_PAPERS } from './src/data/samplePapers';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parser with 40mb limit to comfortably handle large multi-page research PDFs
app.use(express.json({ limit: '40mb' }));
app.use(express.urlencoded({ extended: true, limit: '40mb' }));

// Initialize GoogleGenAI SDK as instructed in gemini_api skill
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const ANALYSIS_PROMPT = `
You are an expert Research Paper AI Agent designed specifically for undergraduate and graduate engineering students.
Analyze this research paper thoroughly and produce a structured, high-value, easy-to-understand breakdown.

You MUST respond with ONLY a valid, parseable JSON object matching this exact schema:
{
  "metadata": {
    "title": "Exact full paper title",
    "authors": ["Author 1", "Author 2", ...],
    "publicationName": "Conference, Journal or Venue name (e.g. IEEE CVPR, NeurIPS, Nature, arXiv preprint)",
    "publicationYear": 2024,
    "citationCount": "e.g. 12,000+ citations or Estimated citations based on scholarly records",
    "venueType": "Conference / Journal / Workshop / Preprint",
    "doiOrArxivId": "e.g. arXiv:XXXX.XXXX or DOI if found",
    "paperKeywords": ["Keyword1", "Keyword2", "Keyword3", "Keyword4", "Keyword5"]
  },
  "summary": {
    "oneLineHook": "A compelling 1-sentence engineering elevator pitch of what this paper achieved.",
    "problemStatement": {
      "simpleExplanation": "Plain English explanation of what fundamental technical or engineering problem the researchers tackled and why previous state-of-the-art methods failed or hit a bottleneck.",
      "keyObstacles": [
        "Concrete technical bottleneck 1",
        "Concrete technical bottleneck 2",
        "Concrete technical bottleneck 3"
      ]
    },
    "methodology": {
      "simpleExplanation": "Clear, student-friendly explanation of their core architectural or algorithmic innovation.",
      "stepByStepPipeline": [
        {
          "step": "Pipeline Step Name",
          "description": "Clear mechanical description of what happens at this step.",
          "engineeringSignificance": "Why this design choice matters from a systems or optimization perspective."
        }
      ]
    },
    "keyFindings": {
      "simpleExplanation": "Student-friendly explanation of the experimental breakthroughs and practical validation.",
      "quantitativeResults": [
        {
          "metric": "Benchmark / Metric Name",
          "value": "Measured quantitative score",
          "comparison": "How it compares to previous baselines or SOTA"
        }
      ],
      "limitations": [
        "Honest engineering trade-off or limitation 1",
        "Honest engineering trade-off or limitation 2"
      ]
    }
  },
  "architectureFlowchart": {
    "mermaidCode": "graph TD\\n  subgraph InputStage[Input Processing]\\n    Inp[Input Data] --> Proc[Preprocessing]\\n  end\\n  ...",
    "architectureWalkthrough": "2-3 sentences explaining the flow of tensors/data from input to final output for an undergraduate engineering student.",
    "keyComponents": [
      {
        "name": "Component Name",
        "role": "What this module does",
        "engineeringTakeaway": "Key algorithmic or mathematical insight"
      }
    ]
  },
  "futureOpportunities": [
    {
      "id": 1,
      "title": "Realistic Student Project Title",
      "difficultyLevel": "Beginner / Course Final",
      "estimatedDuration": "4 to 6 weeks",
      "problemSolved": "Practical engineering or real-world problem solved by this student project.",
      "proposedMethod": "How to adapt the paper's methods (e.g. quantization, distillation, edge deployment, applying to a new sensor or dataset).",
      "technologies": ["Tech 1", "Tech 2", "Tech 3"],
      "performanceMetrics": [
        {
          "metricName": "Metric 1",
          "targetThreshold": "Target threshold (e.g. < 40ms or > 92%)",
          "measurementMethod": "How the student measures it"
        },
        {
          "metricName": "Metric 2",
          "targetThreshold": "Target threshold",
          "measurementMethod": "How the student measures it"
        },
        {
          "metricName": "Metric 3",
          "targetThreshold": "Target threshold",
          "measurementMethod": "How the student measures it"
        }
      ],
      "gettingStartedDataset": "A specific, free open-access dataset students can download today.",
      "firstMilestone": "Specific 1-week feasibility milestone for the student."
    },
    {
      "id": 2,
      "title": "Realistic Student Project Title (Intermediate)",
      "difficultyLevel": "Intermediate / Capstone",
      "estimatedDuration": "8 to 12 weeks",
      "problemSolved": "...",
      "proposedMethod": "...",
      "technologies": ["Tech 1", "Tech 2", "Tech 3"],
      "performanceMetrics": [...],
      "gettingStartedDataset": "...",
      "firstMilestone": "..."
    },
    {
      "id": 3,
      "title": "Realistic Student Project Title (Advanced)",
      "difficultyLevel": "Advanced / Master's Thesis",
      "estimatedDuration": "14 to 18 weeks",
      "problemSolved": "...",
      "proposedMethod": "...",
      "technologies": ["Tech 1", "Tech 2", "Tech 3"],
      "performanceMetrics": [...],
      "gettingStartedDataset": "...",
      "firstMilestone": "..."
    }
  ]
}

CRITICAL RULES FOR MERMAID.JS FLOWCHART:
- Start with 'graph TD' or 'flowchart TD'.
- Use alphanumeric node identifiers ONLY (e.g. A, B, Inp, DecBlock, Out). NEVER use hyphens, spaces, or symbols inside node IDs.
- Put label strings in quotes: e.g. Inp["Input Sensor Data (N x D)"] --> Proc["Normalized Batch"].
- Use subgraphs with clean titles: subgraph InputBlock ["1. Input Pipeline"] ... end.
- Keep the flowchart readable, aesthetic, and syntactically valid for Mermaid version 11/12.
- Do NOT wrap in markdown codeblocks (no \`\`\`json); return ONLY the raw JSON string.
`;

// Helper to clean JSON string
function cleanJsonOutput(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

// GET Sample papers list
app.get('/api/sample-papers', (_req: Request, res: Response) => {
  const summaries = Object.values(SAMPLE_PAPERS).map((p) => ({
    id: p.id,
    title: p.metadata.title,
    authors: p.metadata.authors.slice(0, 3).join(', ') + (p.metadata.authors.length > 3 ? ' et al.' : ''),
    publicationName: p.metadata.publicationName,
    publicationYear: p.metadata.publicationYear,
    citationCount: p.metadata.citationCount,
  }));
  res.json({ samples: summaries });
});

// POST Analyze research paper
app.post('/api/analyze-paper', async (req: Request, res: Response) => {
  try {
    const { sampleId, pdfBase64, url, textContent } = req.body;

    // 1. If sampleId requested, return immediately
    if (sampleId && SAMPLE_PAPERS[sampleId]) {
      return res.json({ success: true, data: SAMPLE_PAPERS[sampleId] });
    }

    if (!apiKey) {
      // If API key is not configured, fallback gracefully to a representative sample or informative error
      if (sampleId && SAMPLE_PAPERS[sampleId]) {
        return res.json({ success: true, data: SAMPLE_PAPERS[sampleId] });
      }
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not set on the server. Please check the Secrets panel.',
      });
    }

    let contents: any[] = [];

    // 2. Direct PDF Upload via Base64
    if (pdfBase64) {
      const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
      contents = [
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: cleanBase64,
          },
        },
        {
          text: ANALYSIS_PROMPT,
        },
      ];
    }
    // 3. URL provided (arXiv or open access)
    else if (url && typeof url === 'string') {
      let trimmedUrl = url.trim();

      // Convert arXiv abstract URL to direct PDF URL
      let targetPdfUrl = trimmedUrl;
      if (trimmedUrl.includes('arxiv.org/abs/')) {
        const arxivId = trimmedUrl.split('arxiv.org/abs/')[1].split(/[#?]/)[0];
        targetPdfUrl = `https://arxiv.org/pdf/${arxivId}.pdf`;
      }

      let fetchedPdf = false;
      try {
        const response = await fetch(targetPdfUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PaperLens-Bot/1.0',
            Accept: 'application/pdf,text/html,*/*',
          },
        });

        const contentType = response.headers.get('content-type') || '';
        if (response.ok && (contentType.includes('application/pdf') || targetPdfUrl.endsWith('.pdf'))) {
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64Data = buffer.toString('base64');

          contents = [
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: base64Data,
              },
            },
            {
              text: `${ANALYSIS_PROMPT}\n\nNote: This paper was fetched directly from: ${trimmedUrl}`,
            },
          ];
          fetchedPdf = true;
        } else if (response.ok) {
          const text = await response.text();
          // Extract text content if it's an abstract or HTML
          const stripped = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .slice(0, 30000);

          contents = [
            {
              text: `Here is the research paper content / abstract fetched from URL ${trimmedUrl}:\n\n${stripped}\n\n${ANALYSIS_PROMPT}`,
            },
          ];
          fetchedPdf = true;
        }
      } catch (fetchErr) {
        console.warn('Direct fetch from URL failed, prompting Gemini with URL metadata:', fetchErr);
      }

      if (!fetchedPdf) {
        // If external site blocks bots/CORS, provide the URL and title hints to Gemini
        contents = [
          {
            text: `The student requested analysis for the research paper located at URL: "${trimmedUrl}".
Please retrieve the full scientific knowledge, architecture, methodology, authors, citation records, and experimental results for this exact research paper from your training corpus and academic literature.
${ANALYSIS_PROMPT}`,
          },
        ];
      }
    }
    // 4. Raw text content fallback
    else if (textContent) {
      contents = [
        {
          text: `Here is the research paper text content:\n\n${textContent.slice(0, 40000)}\n\n${ANALYSIS_PROMPT}`,
        },
      ];
    } else {
      return res.status(400).json({ error: 'Please provide either a PDF file, a paper URL, or select a sample paper.' });
    }

    // Call gemini-3.8-flash (Standard model as defined in gemini-api skill)
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction:
          'You are an authoritative engineering research paper analysis engine. Deliver precise technical details, accurate citations and authors, mathematically sound methodology breakdowns, and valid Mermaid.js diagrams.',
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '';
    const cleaned = cleanJsonOutput(responseText);
    const parsed = JSON.parse(cleaned);

    res.json({ success: true, data: parsed });
  } catch (err: any) {
    console.error('Error in /api/analyze-paper:', err);
    res.status(500).json({
      error: err.message || 'Failed to analyze research paper. Please try again or check the format.',
    });
  }
});

// POST Ask follow-up question on the analyzed paper
app.post('/api/ask-paper', async (req: Request, res: Response) => {
  try {
    const { paperContext, question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!apiKey) {
      return res.json({
        answer: `In this paper ("${paperContext?.metadata?.title || 'the paper'}"), the methodology focuses on overcoming traditional bottlenecks using modular engineering. For specific queries, make sure an API key is connected.`,
      });
    }

    const contextSnippet = JSON.stringify({
      title: paperContext?.metadata?.title,
      authors: paperContext?.metadata?.authors,
      summary: paperContext?.summary,
      architectureFlowchart: paperContext?.architectureFlowchart?.architectureWalkthrough,
      keyComponents: paperContext?.architectureFlowchart?.keyComponents,
    });

    const prompt = `You are a helpful, senior engineering professor and research mentor. 
A student is studying the following research paper:
Context: ${contextSnippet}

The student asks: "${question}"

Provide a direct, thorough, student-friendly engineering explanation:
1. Explain the underlying mathematical or hardware concept in accessible terms.
2. Relate it directly to practical implementation (e.g. PyTorch, CUDA, memory, compute FLOPs).
3. If relevant, include a tiny code snippet or equation using markdown.
Keep the tone encouraging, concise (2-4 paragraphs max), and free of filler.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ answer: response.text || 'No response generated.' });
  } catch (err: any) {
    console.error('Error in /api/ask-paper:', err);
    res.status(500).json({ error: err.message || 'Failed to answer student question.' });
  }
});

// Server boot: Vite in dev, static build in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Research Paper AI Agent running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
