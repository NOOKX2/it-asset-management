"use client";

import { useRef, useState } from "react";

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ACCEPTED_FILE_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);
export const FILE_ACCEPT = ".pdf,.jpg,.jpeg,.png";

export type UploadedFile = {
  id: string;
  file: File;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isAcceptedFile(file: File) {
  if (ACCEPTED_FILE_TYPES.has(file.type)) return true;
  return /\.(pdf|jpe?g|png)$/i.test(file.name);
}

export function FileUploadZone({
  files,
  onFilesChange,
  hint,
  subhint,
  removeLabel,
  fileTooLarge,
  invalidFileType,
}: {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  hint: string;
  subhint: string;
  removeLabel: string;
  fileTooLarge: string;
  invalidFileType: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = (fileList: FileList | File[]) => {
    const incoming = Array.from(fileList);
    if (incoming.length === 0) return;

    const next = [...files];
    let hadError = false;

    for (const file of incoming) {
      if (!isAcceptedFile(file)) {
        setError(invalidFileType);
        hadError = true;
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(fileTooLarge);
        hadError = true;
        continue;
      }
      next.push({
        id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
        file,
      });
    }

    if (next.length > files.length) {
      onFilesChange(next);
      if (!hadError) setError(null);
    }
  };

  const removeFile = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id));
    setError(null);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors cursor-pointer ${
          dragOver
            ? "border-[var(--primary-green)] bg-[var(--light-green-bg)]"
            : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100/80"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={FILE_ACCEPT}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <svg
          className="mb-3 h-10 w-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-sm font-medium text-gray-700">{hint}</p>
        <p className="mt-1 text-xs text-gray-500">{subhint}</p>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>
      )}

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map(({ id, file }) => (
            <li
              key={id}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5"
            >
              <svg
                className="h-5 w-5 shrink-0 text-[var(--primary-green)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(id)}
                className="shrink-0 text-sm font-medium text-gray-500 transition-colors hover:text-red-600"
              >
                {removeLabel}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
