"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2, Link2, FolderUp } from "lucide-react";
import toast from "react-hot-toast";
import { uploadFile, type UploadFolder } from "@/lib/data/admin-media";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils/cn";

interface ImageUploaderProps {
  value: string;
  onChange: (result: { url: string; path: string }) => void;
  folder?: UploadFolder;
  label?: string;
}

type UploadMode = "file" | "url";

export function ImageUploader({ value, onChange, folder = "news-images", label = "Asosiy rasm" }: ImageUploaderProps) {
  const { user } = useAuth();
  const [mode, setMode] = useState<UploadMode>("file");
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [urlInput, setUrlInput] = useState("");

  const handleFile = useCallback(
    async (file: File) => {
      if (!user) return;
      if (!file.type.startsWith("image/")) {
        toast.error("Faqat rasm fayllarini yuklash mumkin");
        return;
      }
      setProgress(0);
      try {
        const result = await uploadFile(file, folder, user.uid, setProgress);
        onChange(result);
        toast.success("Rasm muvaffaqiyatli yuklandi");
      } catch {
        toast.error("Rasmni yuklashda xatolik yuz berdi");
      } finally {
        setProgress(null);
      }
    },
    [folder, onChange, user]
  );

  const handleUrlSubmit = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    try {
      new URL(trimmed);
    } catch {
      toast.error("To'g'ri havola (URL) kiriting");
      return;
    }
    onChange({ url: trimmed, path: "" });
    setUrlInput("");
    toast.success("Rasm havolasi qo'shildi");
  };

  const inputId = `file-input-${folder}-${label}`;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="block text-xs font-medium text-muted">{label}</label>
        {!value && (
          <div className="glass-chip flex gap-0.5 rounded-full p-0.5">
            <button
              type="button"
              onClick={() => setMode("file")}
              className={cn(
                "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition",
                mode === "file" ? "bg-accent text-white" : "text-muted hover:text-accent"
              )}
            >
              <FolderUp size={12} /> Fayl yuklash
            </button>
            <button
              type="button"
              onClick={() => setMode("url")}
              className={cn(
                "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition",
                mode === "url" ? "bg-accent text-white" : "text-muted hover:text-accent"
              )}
            >
              <Link2 size={12} /> Havola (URL)
            </button>
          </div>
        )}
      </div>

      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-line dark:border-line-dark">
          <Image src={value} alt="Yuklangan rasm" fill unoptimized className="object-cover" />
          <button
            type="button"
            onClick={() => onChange({ url: "", path: "" })}
            aria-label="Rasmni o'chirish"
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-white"
          >
            <X size={14} />
          </button>
        </div>
      ) : mode === "file" ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) void handleFile(file);
          }}
          className={cn(
            "flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition",
            dragging ? "border-accent bg-accent/5" : "border-line dark:border-line-dark"
          )}
          onClick={() => document.getElementById(inputId)?.click()}
        >
          {progress !== null ? (
            <>
              <Loader2 className="animate-spin text-accent" size={24} />
              <span className="mt-2 font-mono text-xs text-muted">{Math.round(progress)}%</span>
            </>
          ) : (
            <>
              <UploadCloud size={28} className="text-muted" />
              <span className="mt-2 text-sm text-muted">Rasmni shu yerga tashlang yoki bosing</span>
            </>
          )}
          <input
            id={inputId}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = "";
            }}
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-line px-6 dark:border-line-dark">
          <Link2 size={24} className="text-muted" />
          <div className="flex w-full max-w-sm gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleUrlSubmit();
                }
              }}
              placeholder="https://example.com/rasm.jpg"
              className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-line-dark"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="shrink-0 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
            >
              Qo'shish
            </button>
          </div>
          <span className="text-center text-xs text-muted">
            Tashqi manbadagi (masalan, IMDb yoki boshqa sayt) rasm havolasini kiriting
          </span>
        </div>
      )}
    </div>
  );
}
