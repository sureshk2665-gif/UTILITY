"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText } from "lucide-react";

interface FileDropzoneProps {
  files: File[];
  onFilesAdded: (files: File[]) => void;
  onRemove: (index: number) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxSize?: number;
}

export default function FileDropzone({
  files,
  onFilesAdded,
  onRemove,
  accept = { "application/pdf": [".pdf"] },
  multiple = true,
  maxSize = 25 * 1024 * 1024,
}: FileDropzoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      onFilesAdded(accepted);
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize,
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all
          ${isDragActive
            ? "border-primary bg-primary-light scale-[1.01]"
            : "border-border hover:border-primary/50 hover:bg-surface-alt"
          }
        `}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
        <p className="text-lg font-semibold mb-1">
          {isDragActive ? "Drop your files here" : "Select PDF files"}
        </p>
        <p className="text-sm text-muted">
          or drag and drop here &middot; Max {maxSize / (1024 * 1024)} MB per file
        </p>
      </div>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-3"
            >
              <FileText className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="flex-1 text-sm font-medium truncate">
                {file.name}
              </span>
              <span className="text-xs text-muted flex-shrink-0">
                {formatSize(file.size)}
              </span>
              <button
                onClick={() => onRemove(i)}
                className="text-muted hover:text-primary text-lg leading-none flex-shrink-0"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
