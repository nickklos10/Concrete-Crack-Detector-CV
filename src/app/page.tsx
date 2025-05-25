"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Building2,
  Upload,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Zap,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
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
import { ThemeToggle } from "@/components/theme-toggle";
import { ImageUploader } from "@/components/ImageUploader";
import { AnalysisResults } from "@/components/AnalysisResults";
import { useImageAnalysis } from "@/hooks/useImageAnalysis";
import { cn } from "@/lib/utils";
import type { ImageFile } from "@/types";

export default function HomePage() {
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  const { isAnalyzing, result, error, progress, analyzeImage, resetAnalysis } =
    useImageAnalysis();

  const handleImageSelect = useCallback(
    async (imageFile: ImageFile) => {
      setSelectedImage(imageFile);
      setShowWelcome(false);

      try {
        await analyzeImage(imageFile);
      } catch (err) {
        console.error("Analysis failed:", err);
      }
    },
    [analyzeImage]
  );

  const handleRemoveImage = useCallback(() => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.preview);
      setSelectedImage(null);
    }
    resetAnalysis();
  }, [selectedImage, resetAnalysis]);

  const handleStartOver = useCallback(() => {
    handleRemoveImage();
    setShowWelcome(true);
  }, [handleRemoveImage]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Concrete Crack Detector</h1>
                <p className="text-sm text-muted-foreground">
                  AI-Powered Analysis
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="hidden sm:flex">
                ResNet-18
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {showWelcome && !selectedImage && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Advanced Concrete Analysis
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Upload concrete surface images for instant AI-powered crack
                  detection with detailed confidence analysis.
                </p>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  {
                    icon: Shield,
                    title: "High Accuracy",
                    description:
                      "ResNet-18 deep learning model trained on thousands of concrete images",
                  },
                  {
                    icon: Zap,
                    title: "Fast Analysis",
                    description:
                      "Get results in seconds with our optimized inference pipeline",
                  },
                  {
                    icon: Building2,
                    title: "Learning Project",
                    description:
                      "Exploring computer vision and AI applications in civil engineering",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * index }}
                  >
                    <Card className="text-center h-full">
                      <CardHeader>
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Upload Section */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="max-w-2xl mx-auto"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Start Analysis</CardTitle>
                    <CardDescription>
                      Upload an image of a concrete surface to detect potential
                      cracks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ImageUploader
                      onImageSelect={handleImageSelect}
                      onRemoveImage={handleRemoveImage}
                      selectedImage={selectedImage}
                      isAnalyzing={isAnalyzing}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {(selectedImage || isAnalyzing || result) && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Analysis Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>
                        Analysis {isAnalyzing ? "in Progress" : "Complete"}
                      </CardTitle>
                      <CardDescription>
                        {selectedImage?.file.name} •{" "}
                        {selectedImage &&
                          Math.round(selectedImage.file.size / 1024)}
                        KB
                      </CardDescription>
                    </div>

                    {!isAnalyzing && (
                      <Button onClick={handleStartOver} variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        New Analysis
                      </Button>
                    )}
                  </div>
                </CardHeader>
              </Card>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Image Preview */}
                <div className="space-y-4">
                  {selectedImage && (
                    <Card>
                      <CardContent className="p-0">
                        <Image
                          src={selectedImage.preview}
                          alt="Analysis preview"
                          width={400}
                          height={320}
                          className="w-full h-64 md:h-80 object-cover rounded-lg"
                          unoptimized
                        />
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Analysis Content */}
                <div className="space-y-4">
                  {isAnalyzing && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent mr-2" />
                          Processing...
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Progress value={progress} className="w-full" />
                        <p className="text-sm text-muted-foreground">
                          Analyzing concrete surface for structural issues...
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {result && !isAnalyzing && (
                    <AnalysisResults result={result} />
                  )}

                  {error && !isAnalyzing && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>
              Powered by ResNet-18 deep learning architecture • Built with
              React, Next.js, and Tailwind CSS
            </p>
            <p>
              A computer science student project exploring AI in civil engineering. 
              Not intended for professional structural assessments.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
