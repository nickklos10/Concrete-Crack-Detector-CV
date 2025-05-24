"use client";

import React, { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import type { ImageFile } from "@/types";

interface ImageUploaderProps {
  onImageSelect: (imageFile: ImageFile) => void;
  onRemoveImage?: () => void;
  selectedImage?: ImageFile | null;
  isAnalyzing?: boolean;
  className?: string;
}

export function ImageUploader({
  onImageSelect,
  onRemoveImage,
  selectedImage,
  isAnalyzing = false,
  className,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        if (file.size > 10 * 1024 * 1024) {
          return;
        }

        const imageFile: ImageFile = {
          file,
          preview: URL.createObjectURL(file),
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };

        onImageSelect(imageFile);
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png", ".webp"],
      },
      multiple: false,
      maxSize: 10 * 1024 * 1024,
      disabled: isAnalyzing,
    });

  const handleRemove = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.preview);
    }
    onRemoveImage?.();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (selectedImage) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="relative group">
          <img
            src={selectedImage.preview}
            alt="Selected image"
            className="w-full h-48 object-cover rounded-lg border"
          />

          {!isAnalyzing && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <Button
                onClick={handleRemove}
                variant="destructive"
                size="sm"
                className="bg-red-600 hover:bg-red-700"
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          )}

          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
              <div className="bg-background/90 rounded-lg px-3 py-2 text-sm font-medium">
                Analyzing...
              </div>
            </div>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            <strong>File:</strong> {selectedImage.file.name}
          </p>
          <p>
            <strong>Size:</strong> {Math.round(selectedImage.file.size / 1024)}{" "}
            KB
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive && !isDragReject && "border-primary bg-primary/5",
          isDragReject && "border-destructive bg-destructive/5",
          !isDragActive &&
            !isDragReject &&
            "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50",
          isAnalyzing && "cursor-not-allowed opacity-50"
        )}
      >
        <input {...getInputProps()} ref={fileInputRef} />

        <motion.div
          animate={{
            scale: isDragActive ? 1.05 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="space-y-4"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            {isDragActive ? (
              <motion.div
                animate={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Upload className="h-6 w-6 text-primary" />
              </motion.div>
            ) : (
              <ImageIcon className="h-6 w-6 text-primary" />
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {isDragActive ? "Drop your image here" : "Upload concrete image"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop an image, or{" "}
              <button
                type="button"
                onClick={handleClick}
                className="font-medium text-primary hover:underline"
              >
                browse files
              </button>
            </p>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>Supported formats: JPEG, PNG, WebP</p>
            <p>Maximum size: 10MB</p>
          </div>
        </motion.div>
      </div>

      {isDragReject && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Invalid file type. Please upload a JPEG, PNG, or WebP image.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
