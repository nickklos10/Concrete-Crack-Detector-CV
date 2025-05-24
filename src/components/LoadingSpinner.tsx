"use client";

import { motion } from "framer-motion";
import { Brain, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  progress: number;
  className?: string;
  message?: string;
}

export function LoadingSpinner({
  progress,
  className,
  message = "Analyzing image...",
}: LoadingSpinnerProps) {
  const getProgressMessage = (progress: number) => {
    if (progress < 25) return "Uploading image...";
    if (progress < 50) return "Processing image...";
    if (progress < 75) return "Running AI analysis...";
    if (progress < 100) return "Finalizing results...";
    return "Complete!";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-200",
        className
      )}
    >
      <div className="text-center space-y-6">
        {/* Animated Brain Icon */}
        <div className="relative mx-auto w-20 h-20">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute inset-0 bg-primary-100 rounded-full flex items-center justify-center"
          >
            <Brain className="w-10 h-10 text-primary-600" />
          </motion.div>

          {/* Orbit dots */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary-500 rounded-full"
              style={{
                top: "50%",
                left: "50%",
                transformOrigin: "0 0",
              }}
              animate={{
                rotate: 360,
                x: [0, 35, 0, -35, 0],
                y: [0, -35, 0, 35, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
            />
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>{Math.round(progress)}%</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Loading Message */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {getProgressMessage(progress)}
          </h3>
          <p className="text-sm text-gray-600 loading-dots">{message}</p>
        </div>

        {/* Scanning Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative"
        >
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-primary-500 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        {/* Processing Steps */}
        <div className="grid grid-cols-4 gap-2 text-xs">
          {["Upload", "Process", "Analyze", "Results"].map((step, index) => {
            const stepProgress = (index + 1) * 25;
            const isActive = progress >= stepProgress;
            const isCurrent =
              progress >= stepProgress - 25 && progress < stepProgress;

            return (
              <motion.div
                key={step}
                initial={{ opacity: 0.5 }}
                animate={{
                  opacity: isActive ? 1 : 0.5,
                  scale: isCurrent ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "p-2 rounded-lg border text-center",
                  isActive
                    ? "bg-primary-50 border-primary-200 text-primary-700"
                    : "bg-gray-50 border-gray-200 text-gray-500",
                  isCurrent && "ring-2 ring-primary-200"
                )}
              >
                <div className="flex items-center justify-center mb-1">
                  {isActive ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Loader2 className="w-3 h-3" />
                    </motion.div>
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-current opacity-30" />
                  )}
                </div>
                <span className="font-medium">{step}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
