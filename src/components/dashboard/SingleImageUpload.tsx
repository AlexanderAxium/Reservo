"use client";

import { Button } from "@/components/ui/button";
import { type UploadScope, useR2SingleUpload } from "@/hooks/useR2SingleUpload";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { useId, useRef } from "react";
import { toast } from "sonner";

interface SingleImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  scope: UploadScope;
  tenantIdOverride?: string;
  accept?: string;
  maxSizeMb?: number;
  label?: string;
  /** Show compact preview (e.g. for avatar) */
  variant?: "default" | "avatar" | "logo";
}

export function SingleImageUpload({
  value,
  onChange,
  scope,
  tenantIdOverride,
  accept = "image/jpeg,image/png,image/webp,image/gif",
  maxSizeMb = 5,
  label,
  variant = "default",
}: SingleImageUploadProps) {
  const uploadInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading } = useR2SingleUpload({
    scope,
    tenantIdOverride,
    onSuccess: (url) => {
      onChange(url);
      toast.success("Image uploaded");
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxBytes = maxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error(`File too large (max ${maxSizeMb}MB)`);
      return;
    }

    await uploadFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isRound = variant === "avatar";
  const isLogo = variant === "logo";

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={uploadInputId}
          className="text-sm font-medium leading-none"
        >
          {label}
        </label>
      )}
      <div className="flex items-center gap-4">
        {value || isUploading ? (
          <div
            className={`relative shrink-0 overflow-hidden rounded-lg border bg-muted ${
              isRound ? "h-24 w-24 rounded-full" : "h-24 w-24"
            } ${isLogo ? "p-1" : ""}`}
          >
            {isUploading ? (
              <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : value ? (
              <>
                <img
                  src={value}
                  alt=""
                  className={`h-full w-full object-cover ${isLogo ? "object-contain" : ""}`}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full"
                  onClick={() => onChange(null)}
                  aria-label="Remove image"
                >
                  <X className="h-3 w-3" />
                </Button>
              </>
            ) : null}
          </div>
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {value ? "Change" : "Upload"}
          </Button>
          <input
            id={uploadInputId}
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            aria-label={label ?? "Subir imagen"}
          />
        </div>
      </div>
    </div>
  );
}
