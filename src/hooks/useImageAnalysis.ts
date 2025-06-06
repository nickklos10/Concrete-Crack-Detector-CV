import { useState, useCallback } from "react";
import axios from "axios";
import type {
  AnalysisResult,
  AnalysisState,
  ImageFile,
  ApiResponse,
} from "@/types";

export function useImageAnalysis() {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isAnalyzing: false,
    result: null,
    error: null,
    progress: 0,
  });

  const analyzeImage = useCallback(async (imageFile: ImageFile) => {
    setAnalysisState({
      isAnalyzing: true,
      result: null,
      error: null,
      progress: 0,
    });

    try {
      const formData = new FormData();
      formData.append("image", imageFile.file);

      // Start timing
      const startTime = Date.now();

      // Simulate progress updates
      setAnalysisState((prev) => ({ ...prev, progress: 25 }));

      const response = await axios.post<ApiResponse>("/api/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 50) / progressEvent.total
            );
            setAnalysisState((prev) => ({
              ...prev,
              progress: Math.min(progress, 50),
            }));
          }
        },
      });

      // Calculate actual processing time
      const endTime = Date.now();
      const processingTime = (endTime - startTime) / 1000; // Convert to seconds

      setAnalysisState((prev) => ({ ...prev, progress: 90 }));

      // Transform API response to AnalysisResult
      const result: AnalysisResult = {
        prediction:
          response.data.prediction.toLowerCase() === "crack"
            ? "crack"
            : "no_crack",
        confidence: response.data.confidence,
        probabilities: response.data.probabilities,
        processingTime: processingTime, // Add real processing time
      };

      setAnalysisState({
        isAnalyzing: false,
        result,
        error: null,
        progress: 100,
      });

      return result;
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || "Failed to analyze image"
        : "An unexpected error occurred";

      setAnalysisState({
        isAnalyzing: false,
        result: null,
        error: errorMessage,
        progress: 0,
      });

      throw new Error(errorMessage);
    }
  }, []);

  const resetAnalysis = useCallback(() => {
    setAnalysisState({
      isAnalyzing: false,
      result: null,
      error: null,
      progress: 0,
    });
  }, []);

  return {
    ...analysisState,
    analyzeImage,
    resetAnalysis,
  };
}
