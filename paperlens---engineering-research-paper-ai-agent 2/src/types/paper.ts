export interface PaperMetadata {
  title: string;
  authors: string[];
  publicationName: string;
  publicationYear: number | string;
  citationCount: string;
  venueType: string;
  doiOrArxivId?: string;
  paperKeywords: string[];
}

export interface StepPipelineItem {
  step: string;
  description: string;
  engineeringSignificance: string;
}

export interface QuantitativeResult {
  metric: string;
  value: string;
  comparison: string;
}

export interface PaperSummary {
  oneLineHook: string;
  problemStatement: {
    simpleExplanation: string;
    keyObstacles: string[];
  };
  methodology: {
    simpleExplanation: string;
    stepByStepPipeline: StepPipelineItem[];
  };
  keyFindings: {
    simpleExplanation: string;
    quantitativeResults: QuantitativeResult[];
    limitations: string[];
  };
}

export interface ArchitectureComponent {
  name: string;
  role: string;
  engineeringTakeaway: string;
}

export interface ArchitectureFlowchart {
  mermaidCode: string;
  architectureWalkthrough: string;
  keyComponents: ArchitectureComponent[];
}

export interface ProjectMetric {
  metricName: string;
  targetThreshold: string;
  measurementMethod: string;
}

export interface ProjectOpportunity {
  id: number;
  title: string;
  difficultyLevel: 'Beginner / Course Final' | 'Intermediate / Capstone' | 'Advanced / Master\'s Thesis';
  estimatedDuration: string;
  problemSolved: string;
  proposedMethod: string;
  technologies: string[];
  performanceMetrics: ProjectMetric[];
  gettingStartedDataset: string;
  firstMilestone: string;
}

export interface PaperAnalysisResult {
  id?: string;
  metadata: PaperMetadata;
  summary: PaperSummary;
  architectureFlowchart: ArchitectureFlowchart;
  futureOpportunities: ProjectOpportunity[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
