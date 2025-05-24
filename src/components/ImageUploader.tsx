"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  X,
  Image as ImageIcon,
  FileText,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn, validateImageFile, formatFileSize, generateId } from "@/lib/utils";
import type { ImageFile } from "@/types";

interface ImageUploaderProps {
  onImageSelect: (imageFile: ImageFile) => void;
  onRemoveImage: () => void;
  selectedImage: ImageFile | null;
  isAnalyzing: boolean;
  className?: string;
}

export function ImageUploader({
  onImageSelect,
  onRemoveImage,
  selectedImage,
  isAnalyzing,
  className,
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);

      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      const validation = validateImageFile(file);

      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        return;
      }

      const imageFile: ImageFile = {
        file,
        preview: URL.createObjectURL(file),
        id: generateId(),
      };

      onImageSelect(imageFile);
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    multiple: false,
    disabled: isAnalyzing,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => {
      setDragActive(false);
      setError("Please upload a valid image file (JPEG, JPG, or PNG)");
    },
  });

  const handleRemoveImage = useCallback(() => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.preview);
      onRemoveImage();
    }
  }, [selectedImage, onRemoveImage]);

  return (
    <div className={cn("w-full", className)}>
      <AnimatePresence mode="wait">
        {!selectedImage ? (
          <motion.div
            key="uploader"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300",
              "hover:border-primary-400 hover:bg-primary-50/50",
              isDragActive || dragActive
                ? "border-primary-500 bg-primary-100/50 scale-105"
                : "border-gray-300 bg-white/80",
              isAnalyzing && "pointer-events-none opacity-50",
              "backdrop-blur-sm"
            )}
          >
            <div {...getRootProps()}>
              <input {...getInputProps()} />

              <motion.div
                animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary-600" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Upload Concrete Image
                  </h3>
                  <p className="text-sm text-gray-600">
                    Drag and drop your image here, or click to select
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports JPEG, JPG, PNG files up to 5MB
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  disabled={isAnalyzing}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Choose Image
                </Button>
              </motion.div>

              {(isDragActive || dragActive) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-primary-500/10 rounded-xl flex items-center justify-center"
                >
                  <div className="text-primary-700 font-medium">
                    Drop image here
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="relative">
              <img
                src={selectedImage.preview}
                alt="Preview"
                className="w-full h-64 object-cover"
              />

              {!isAnalyzing && (
                <Button
                  onClick={handleRemoveImage}
                  variant="destructive"
                  size="icon"
                  className="absolute top-3 right-3 shadow-lg"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">
                  {selectedImage.file.name}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {formatFileSize(selectedImage.file.size)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 bg-crack-50 border border-crack-200 rounded-lg flex items-center space-x-2"
          >
            <AlertCircle className="w-4 h-4 text-crack-600 flex-shrink-0" />
            <p className="text-sm text-crack-700">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
