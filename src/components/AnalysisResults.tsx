"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, Brain, Target, Clock } from "lucide-react";
import { formatConfidence, cn } from "@/lib/utils";
import type { PredictionResult } from "@/types";

interface AnalysisResultsProps {
  result: PredictionResult;
  className?: string;
}

export function AnalysisResults({ result, className }: AnalysisResultsProps) {
  const isCrack = result.prediction === "Crack";

  const confidencePercentage = Math.round(result.confidence * 100);
  const crackProbability = Math.round(result.probabilities.crack * 100);
  const noCrackProbability = Math.round(result.probabilities.no_crack * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn("w-full space-y-6", className)}
    >
      {/* Main Result */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className={cn(
          "p-6 rounded-xl border-2 shadow-lg backdrop-blur-sm",
          isCrack
            ? "bg-crack-50/80 border-crack-200 text-crack-900"
            : "bg-success-50/80 border-success-200 text-success-900"
        )}
      >
        <div className="flex items-center space-x-4">
          <div
            className={cn(
              "p-3 rounded-full",
              isCrack ? "bg-crack-100" : "bg-success-100"
            )}
          >
            {isCrack ? (
              <AlertTriangle className="w-8 h-8 text-crack-600" />
            ) : (
              <CheckCircle className="w-8 h-8 text-success-600" />
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">
              {isCrack ? "Crack Detected" : "No Crack Detected"}
            </h2>
            <p className="text-sm opacity-80">
              {isCrack
                ? "Structural issues identified in the concrete surface"
                : "Concrete surface appears to be in good condition"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Confidence Score */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Target className="w-5 h-5 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Confidence Score
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">
              {result.prediction}
            </span>
            <span className="text-lg font-bold text-gray-900">
              {formatConfidence(result.confidence)}
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidencePercentage}%` }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className={cn(
                "h-full rounded-full transition-colors",
                confidencePercentage >= 80
                  ? "bg-success-500"
                  : confidencePercentage >= 60
                  ? "bg-yellow-500"
                  : "bg-crack-500"
              )}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </motion.div>

      {/* Detailed Probabilities */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Brain className="w-5 h-5 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Detailed Analysis
          </h3>
        </div>

        <div className="space-y-4">
          {/* Crack Probability */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Crack Probability
              </span>
              <span className="text-sm font-bold text-crack-700">
                {crackProbability}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${crackProbability}%` }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="h-full bg-crack-500 rounded-full"
              />
            </div>
          </div>

          {/* No Crack Probability */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                No Crack Probability
              </span>
              <span className="text-sm font-bold text-success-700">
                {noCrackProbability}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${noCrackProbability}%` }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="h-full bg-success-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Model Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 1.4 }}
        className="bg-slate-100/80 backdrop-blur-sm rounded-lg p-4 border border-slate-200"
      >
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <Clock className="w-4 h-4" />
          <span>Analyzed using ResNet-18 deep learning model</span>
        </div>
      </motion.div>

      {/* Recommendations */}
      {isCrack && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.6 }}
          className="bg-orange-50/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200"
        >
          <h4 className="text-lg font-semibold text-orange-900 mb-3">
            Recommendations
          </h4>
          <ul className="space-y-2 text-sm text-orange-800">
            <li>• Schedule a professional structural inspection</li>
            <li>• Monitor crack progression over time</li>
            <li>• Consider repair options to prevent further damage</li>
            <li>• Document crack location and dimensions</li>
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
}
