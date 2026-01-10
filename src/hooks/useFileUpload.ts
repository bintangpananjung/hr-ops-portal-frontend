import { useState } from "react";

interface UseFileUploadOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
  onError?: (error: string) => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const {
    maxSizeMB = 10,
    allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
    onError,
  } = options;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const errorMsg = `File size must be less than ${maxSizeMB}MB`;
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      const errorMsg = `Only ${allowedTypes
        .map((t) => t.split("/")[1].toUpperCase())
        .join(", ")} images are allowed`;
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError("");
  };

  const clearFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl("");
    setError("");
  };

  return {
    selectedFile,
    previewUrl,
    error,
    handleFileChange,
    clearFile,
    setError,
  };
}
