"use client";

import { trpc } from "@/hooks/useTRPC";
import { useCallback, useState } from "react";

export type UploadScope =
  | "tenant_logo"
  | "tenant_favicon"
  | "profile_avatar"
  | "field"
  | "sport_center";

interface UseR2SingleUploadOptions {
  scope: UploadScope;
  tenantIdOverride?: string;
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

export function useR2SingleUpload({
  scope,
  tenantIdOverride,
  onSuccess,
  onError,
}: UseR2SingleUploadOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const getPresignedUrl = trpc.upload.getPresignedUrl.useMutation();

  const uploadFile = useCallback(
    async (file: File): Promise<string | null> => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        const err = "Invalid image type. Allowed: JPEG, PNG, WebP, GIF";
        onError?.(err);
        return null;
      }

      const maxSize = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxSize) {
        const err = "File too large (max 5MB)";
        onError?.(err);
        return null;
      }

      setIsUploading(true);
      try {
        const { presignedUrl, fileUrl } = await getPresignedUrl.mutateAsync({
          fileName: file.name,
          fileType: file.type,
          scope,
          tenantIdOverride,
        });

        const putResponse = await fetch(presignedUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!putResponse.ok) {
          const err = "Upload to storage failed";
          onError?.(err);
          return null;
        }

        onSuccess?.(fileUrl);
        return fileUrl;
      } catch (e) {
        const message = e instanceof Error ? e.message : "Upload failed";
        onError?.(message);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [scope, tenantIdOverride, getPresignedUrl, onSuccess, onError]
  );

  return { uploadFile, isUploading };
}
