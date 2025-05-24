"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Shield, Zap, ChevronRight, RefreshCw } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";
import { AnalysisResults } from "@/components/AnalysisResults";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/Button";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-8 pb-6"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center space-x-3 mb-4"
              >
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Concrete Crack Detector
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-white/80 max-w-2xl mx-auto"
              >
                Advanced AI-powered concrete crack detection using deep learning
                technology
              </motion.p>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <AnimatePresence mode="wait">
            {showWelcome && !selectedImage && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-12"
              >
                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: Shield,
                      title: "High Accuracy",
                      description:
                        "ResNet-18 deep learning model trained on thousands of concrete images",
                      color: "from-blue-500 to-blue-600",
                    },
                    {
                      icon: Zap,
                      title: "Fast Analysis",
                      description:
                        "Get results in seconds with our optimized inference pipeline",
                      color: "from-purple-500 to-purple-600",
                    },
                    {
                      icon: Building2,
                      title: "Professional Grade",
                      description:
                        "Trusted by construction professionals for structural assessment",
                      color: "from-green-500 to-green-600",
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 * index }}
                      className="glass rounded-xl p-6 text-center"
                    >
                      <div
                        className={cn(
                          "inline-flex p-3 rounded-full bg-gradient-to-r mb-4",
                          feature.color
                        )}
                      >
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-white/70 text-sm">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Upload Section */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="glass rounded-2xl p-8"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Start Your Analysis
                    </h2>
                    <p className="text-white/70">
                      Upload an image of a concrete surface to detect potential
                      cracks
                    </p>
                  </div>

                  <ImageUploader
                    onImageSelect={handleImageSelect}
                    onRemoveImage={handleRemoveImage}
                    selectedImage={selectedImage}
                    isAnalyzing={isAnalyzing}
                  />
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
                className="space-y-8"
              >
                {/* Analysis Header */}
                <div className="glass rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">
                        Analysis in Progress
                      </h2>
                      <p className="text-white/70 text-sm">
                        {selectedImage?.file.name}
                      </p>
                    </div>

                    {!isAnalyzing && (
                      <Button
                        onClick={handleStartOver}
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Start Over
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Image Preview */}
                  <div className="space-y-6">
                    {selectedImage && (
                      <div className="glass rounded-xl overflow-hidden">
                        <img
                          src={selectedImage.preview}
                          alt="Analysis preview"
                          className="w-full h-64 md:h-80 object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Analysis Content */}
                  <div>
                    {isAnalyzing && (
                      <LoadingSpinner
                        progress={progress}
                        message="Analyzing concrete surface for structural issues..."
                      />
                    )}

                    {result && !isAnalyzing && (
                      <AnalysisResults result={result} />
                    )}

                    {error && !isAnalyzing && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-crack-50/90 backdrop-blur-sm border border-crack-200 rounded-xl p-6"
                      >
                        <h3 className="text-lg font-semibold text-crack-900 mb-2">
                          Analysis Error
                        </h3>
                        <p className="text-crack-700 text-sm mb-4">{error}</p>
                        <Button
                          onClick={handleStartOver}
                          variant="destructive"
                          size="sm"
                        >
                          Try Again
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 pb-8"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass rounded-xl p-6">
              <div className="text-center text-white/60 text-sm">
                <p>
                  Powered by ResNet-18 deep learning architecture • Built with
                  React, Next.js, and Tailwind CSS
                </p>
                <p className="mt-2">
                  For professional use only. Always consult with structural
                  engineers for critical assessments.
                </p>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
