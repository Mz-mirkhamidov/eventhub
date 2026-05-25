"use client";

import { useRef, useState } from "react";
import { apiUploadImage } from "@/lib/api";

export default function ImageUpload({
  value,
  onChange,
  label = "Rasm yuklash",
  multiple = false,
  maxFiles = 10,
}: {
  value: string | string[];
  onChange: (url: string | string[]) => void;
  label?: string;
  multiple?: boolean;
  maxFiles?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const urls = Array.isArray(value) ? value : value ? [value] : [];

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const uploaded: string[] = [];
      const limit = multiple ? Math.min(files.length, maxFiles - urls.length) : 1;
      for (let i = 0; i < limit; i++) {
        const { url } = await apiUploadImage(files[i]);
        uploaded.push(url);
      }
      if (multiple) {
        onChange([...urls, ...uploaded].slice(0, maxFiles));
      } else {
        onChange(uploaded[0] ?? "");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yuklash amalga oshmadi");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    if (multiple) {
      onChange(urls.filter((_, i) => i !== index));
    } else {
      onChange("");
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="mt-1 flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-[#1A56DB] hover:bg-blue-50/50"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-[#1A56DB]" />
        ) : (
          <>
            <p className="text-sm font-medium text-slate-700">Bosing yoki sudrab tashlang</p>
            <p className="mt-1 text-xs text-slate-500">JPG, PNG, WEBP · maks. 10MB</p>
          </>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {urls.length > 0 && (
        <div className={`mt-3 grid gap-2 ${multiple ? "grid-cols-3 sm:grid-cols-4" : ""}`}>
          {urls.map((url, i) => (
            <div key={url + i} className="group relative overflow-hidden rounded-lg border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-24 w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-1 right-1 rounded bg-red-600 px-1.5 py-0.5 text-xs text-white opacity-0 transition group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
