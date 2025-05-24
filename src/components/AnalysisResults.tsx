"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Info,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import type { AnalysisResult } from "@/types";

interface AnalysisResultsProps {
  result: AnalysisResult;
}

const ConfidenceLevel = ({ confidence }: { confidence: number }) => {
  const getLevel = () => {
    if (confidence >= 0.8)
      return {
        label: "Very High",
        variant: "default" as const,
        color: "text-green-600 dark:text-green-400",
      };
    if (confidence >= 0.6)
      return {
        label: "High",
        variant: "secondary" as const,
        color: "text-blue-600 dark:text-blue-400",
      };
    if (confidence >= 0.4)
      return {
        label: "Medium",
        variant: "outline" as const,
        color: "text-yellow-600 dark:text-yellow-400",
      };
    return {
      label: "Low",
      variant: "destructive" as const,
      color: "text-red-600 dark:text-red-400",
    };
  };

  const level = getLevel();

  return (
    <div className="flex items-center space-x-2">
      <Badge variant={level.variant}>{level.label}</Badge>
      <span className={cn("text-sm font-mono", level.color)}>
        {(confidence * 100).toFixed(1)}%
      </span>
    </div>
  );
};

const getRecommendations = (hasCrack: boolean, confidence: number) => {
  if (hasCrack && confidence > 0.7) {
    return {
      primary: "Cracks detected with high confidence",
      actions: [
        "Schedule professional structural inspection",
        "Document crack locations and dimensions",
        "Monitor for progression over time",
        "Consider immediate safety measures if extensive",
      ],
      severity: "high" as const,
    };
  }

  if (hasCrack && confidence > 0.4) {
    return {
      primary: "Potential cracks detected",
      actions: [
        "Conduct visual inspection by qualified personnel",
        "Take additional photos from different angles",
        "Re-analyze with better lighting conditions",
        "Schedule follow-up assessment",
      ],
      severity: "medium" as const,
    };
  }

  if (!hasCrack && confidence > 0.7) {
    return {
      primary: "No significant cracks detected",
      actions: [
        "Continue regular maintenance schedule",
        "Periodic re-inspection recommended",
        "Monitor for environmental changes",
        "Keep photographic records for future reference",
      ],
      severity: "low" as const,
    };
  }

  return {
    primary: "Inconclusive results",
    actions: [
      "Retake photo with better lighting",
      "Clean surface before re-analysis",
      "Use higher resolution image",
      "Consult professional inspector",
    ],
    severity: "medium" as const,
  };
};

export function AnalysisResults({ result }: AnalysisResultsProps) {
  const hasCrack = result.prediction === "crack";
  const confidence = result.confidence;
  const recommendations = getRecommendations(hasCrack, confidence);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return AlertTriangle;
      case "medium":
        return AlertCircle;
      default:
        return CheckCircle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 dark:text-red-400";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400";
      default:
        return "text-green-600 dark:text-green-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Main Result */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              {hasCrack ? (
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              )}
              <span>{hasCrack ? "Cracks Detected" : "No Cracks Detected"}</span>
            </CardTitle>
            <ConfidenceLevel confidence={confidence} />
          </div>
          <CardDescription>
            AI analysis result based on ResNet-18 deep learning model
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Confidence Score</span>
              <span className="font-mono">
                {(confidence * 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={confidence * 100} className="h-2" />
          </div>

          {confidence < 0.6 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Low confidence detected. Consider retaking the photo with better
                lighting or cleaning the surface.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {React.createElement(getSeverityIcon(recommendations.severity), {
              className: cn(
                "h-5 w-5",
                getSeverityColor(recommendations.severity)
              ),
            })}
            <span>Recommendations</span>
          </CardTitle>
          <CardDescription>{recommendations.primary}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recommendations.actions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{action}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Technical Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Model</span>
              <p className="font-mono">ResNet-18</p>
            </div>
            <div>
              <span className="text-muted-foreground">Classification</span>
              <p className="font-mono">{result.prediction}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Confidence</span>
              <p className="font-mono">{(confidence * 100).toFixed(2)}%</p>
            </div>
            <div>
              <span className="text-muted-foreground">Processing Time</span>
              <p className="font-mono">~2.3s</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Disclaimer:</strong> This AI analysis is for preliminary
          assessment only. For critical structural decisions, always consult
          with a qualified structural engineer.
        </AlertDescription>
      </Alert>
    </motion.div>
  );
}
