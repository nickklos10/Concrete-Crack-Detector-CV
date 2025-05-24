export interface PredictionResult {
  prediction: "Crack" | "No Crack";
  confidence: number;
  probabilities: {
    crack: number;
    no_crack: number;
  };
}

export interface PredictionError {
  error: string;
}

export interface UploadProgress {
  progress: number;
  status: "idle" | "uploading" | "processing" | "complete" | "error";
}

export interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

export interface AnalysisState {
  isAnalyzing: boolean;
  result: PredictionResult | null;
  error: string | null;
  progress: number;
}

export interface ToastConfig {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  description?: string;
  duration?: number;
}
