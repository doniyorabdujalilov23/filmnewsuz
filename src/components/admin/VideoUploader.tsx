"use client";

import { useCallback, useState } from "react";
import { Link2, FolderUp, X, Loader2, Film } from "lucide-react";
import toast from "react-hot-toast";
import { uploadFile } from "@/lib/data/admin-media";
import { useAuth } from "@/context/AuthContext";
import { isYoutubeUrl } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

interface VideoUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

type VideoMode = "url" | "file";

export function VideoUploader({ value, onChange }: VideoUploaderProps) {
  const { user } = useAuth();
  const [mode, setMode] = useState<VideoMode>("url");
  const [urlInput, setUrlInput] = useState(value && isYoutubeUrl(value) ? value : "");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!user) return;
      if (!file.type.startsWith("video/")) {
        toast.error("Faqat video fayllarini yuklash mumkin");
        return;
      }
      setUploading(true);
      setProgress(0);
      try {
        const { url } = await uploadFile(file, "uploads", user.uid, setProgress);
        onChange(url);
        toast.success("Video muvaffaqiyatli yuklandi");
      } catch {
        toast.error("Videoni yuklashda xatolik yuz berdi");
      } finally {
        setUploading(false);
        setProgress(null);
      }
    },
    [onChange, user]
  );

  const handleUrlSubmit = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      onChange("");
      return;
    }
    try {
      new URL(trimmed);
    } catch {
      toast.error("To'g'ri havola (URL) kiriting");
      return;
    }
    onChange(trimmed);
    toast.success("Video havolasi qo'shildi");
  };

  const isUploadedFile = !!value && !isYoutubeUrl(value);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="block text-xs font-medium text-muted">Video (ixtiyoriy)</label>
        <div className="glass-chip flex gap-0.5 rounded-full p-0.5">
          <button
            type="button"
            onClick={() => setMode("url")}
            className={cn(
              "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition",
              mode === "url" ? "bg-accent text-white" : "text-muted hover:text-accent"
            )}
          >
            <Link2 size={12} /> YouTube havola
          </button>
          <button
            type="button"
            onClick={() => setMode("file")}
            className={cn(
              "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition",
              mode === "file" ? "bg-accent text-white" : "text-muted hover:text-accent"
            )}
          >
            <FolderUp size={12} /> Video fayl yuklash
          </button>
        </div>
      </div>

      {isUploadedFile ? (
        <div className="flex items-center justify-between rounded-lg border border-line px-3 py-2.5 dark:border-line-dark">
          <span className="flex items-center gap-2 text-sm text-muted">
            <Film size={15} /> Video fayl yuklandi
          </span>
          <button
            type="button"
            onClick={() => {
              onChange("");
              setUrlInput("");
            }}
            aria-label="Videoni o'chirish"
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:text-red-500"
          >
            <X size={14} />
          </button>
        </div>
      ) : mode === "url" ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onBlur={handleUrlSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleUrlSubmit();
              }
            }}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-line-dark"
          />
        </div>
      ) : (
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line px-4 py-4 text-sm text-muted transition hover:border-accent hover:text-accent dark:border-line-dark">
          {uploading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {progress !== null ? `${Math.round(progress)}%` : "Yuklanmoqda..."}
            </>
          ) : (
            <>
              <FolderUp size={16} /> Video faylni tanlash uchun bosing
            </>
          )}
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = "";
            }}
          />
        </label>
      )}
      <p className="mt-1.5 text-[11px] text-muted">
        Video hajmi 100 MB dan oshmasligi tavsiya etiladi.
      </p>
    </div>
  );
}
