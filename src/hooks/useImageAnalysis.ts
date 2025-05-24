import { useState, useCallback } from "react";
import axios from "axios";
import type { PredictionResult, AnalysisState, ImageFile } from "@/types";

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

      // Simulate progress updates
      setAnalysisState((prev) => ({ ...prev, progress: 25 }));

      const response = await axios.post<PredictionResult>(
        "/api/predict",
        formData,
        {
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
        }
      );

      // Simulate processing
      setAnalysisState((prev) => ({ ...prev, progress: 75 }));

      await new Promise((resolve) => setTimeout(resolve, 500));

      setAnalysisState({
        isAnalyzing: false,
        result: response.data,
        error: null,
        progress: 100,
      });

      return response.data;
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
