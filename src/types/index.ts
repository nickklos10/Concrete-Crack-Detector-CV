export interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

export interface AnalysisResult {
  prediction: "crack" | "no_crack";
  confidence: number;
  probabilities?: {
    crack: number;
    no_crack: number;
  };
  processingTime?: number; // Processing time in seconds
}

// Legacy type for backwards compatibility
export interface PredictionResult {
  prediction: string;
  confidence: number;
  probabilities: {
    crack: number;
    no_crack: number;
  };
}

export interface ApiResponse {
  prediction: string;
  confidence: number;
  probabilities: {
    crack: number;
    no_crack: number;
  };
}

export interface AnalysisState {
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
  progress: number;
}
