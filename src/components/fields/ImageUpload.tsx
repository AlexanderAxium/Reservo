"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/hooks/useTRPC";
import { Image as ImageIcon, Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export type ImageUploadScope = "field" | "sport_center";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  scope: ImageUploadScope;
  maxImages?: number;
  accept?: string;
}

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export function ImageUpload({
  images,
  onImagesChange,
  scope,
  maxImages = 10,
  accept = "image/*",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const getPresignedUrl = trpc.upload.getPresignedUrl.useMutation();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error(`Solo puedes subir hasta ${maxImages} imágenes`);
      return;
    }

    setUploading(true);
    const newImageUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (!file) continue;

        if (
          !file.type.startsWith("image/") ||
          !ALLOWED_IMAGE_TYPES.includes(file.type)
        ) {
          toast.error(
            `${file.name} no es una imagen válida (JPEG, PNG, WebP, GIF)`
          );
          continue;
        }
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`${file.name} es muy grande (máximo 5MB)`);
          continue;
        }

        const { presignedUrl, fileUrl } = await getPresignedUrl.mutateAsync({
          fileName: file.name,
          fileType: file.type,
          scope,
        });

        const putResponse = await fetch(presignedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!putResponse.ok) {
          toast.error(`Error subiendo ${file.name}`);
          continue;
        }
        newImageUrls.push(fileUrl);
      }

      if (newImageUrls.length > 0) {
        onImagesChange([...images, ...newImageUrls]);
        toast.success(`${newImageUrls.length} imagen(es) agregada(s)`);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error al subir imágenes:", error);
      toast.error("Error al subir las imágenes");
    } finally {
      setUploading(false);
    }
  };

  const addImageUrl = () => {
    if (!newImageUrl.trim()) {
      toast.error("Por favor ingresa una URL válida");
      return;
    }

    // Validar URL
    try {
      new URL(newImageUrl);
    } catch {
      toast.error("URL inválida");
      return;
    }

    if (images.length >= maxImages) {
      toast.error(`Solo puedes tener hasta ${maxImages} imágenes`);
      return;
    }

    onImagesChange([...images, newImageUrl.trim()]);
    setNewImageUrl("");
    toast.success("Imagen agregada");
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    toast.success("Imagen eliminada");
  };

  return (
    <div className="space-y-4">
      {/* Botón de subida de archivos */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
          className="flex items-center gap-2"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? "Subiendo..." : "Subir Imágenes"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <span className="text-sm text-muted-foreground">
          {images.length}/{maxImages} imágenes
        </span>
      </div>

      {/* Input para URL */}
      <div className="flex gap-2">
        <Input
          placeholder="O ingresa una URL de imagen"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addImageUrl();
            }
          }}
          disabled={images.length >= maxImages}
        />
        <Button
          type="button"
          variant="outline"
          onClick={addImageUrl}
          disabled={images.length >= maxImages || !newImageUrl.trim()}
        >
          Agregar URL
        </Button>
      </div>

      {/* Preview de imágenes */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images.map((url, index) => (
            <div
              key={url}
              className="relative group aspect-square border rounded-lg overflow-hidden bg-muted"
            >
              <img
                src={url}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover"
                onError={() => {
                  toast.error(`La imagen ${index + 1} no se pudo cargar`);
                  removeImage(index);
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                Imagen {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            No hay imágenes. Sube archivos o agrega URLs.
          </p>
        </div>
      )}
    </div>
  );
}
