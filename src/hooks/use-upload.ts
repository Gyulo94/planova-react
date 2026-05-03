import { imageUpload } from "@/features/image/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface UseImageUploadProps {
  maxImages?: number;
  onSuccess?: (urls: string[]) => void;
  initialImages?: string[];
}

export function useImageUpload({
  maxImages = 1,
  onSuccess,
  initialImages = [],
}: UseImageUploadProps = {}) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);

  const prevInitialImagesRef = useRef<string[]>(initialImages);

  useEffect(() => {
    if (
      JSON.stringify(initialImages) ===
      JSON.stringify(prevInitialImagesRef.current)
    ) {
      return;
    }

    setImages(initialImages);
    prevInitialImagesRef.current = initialImages;
  }, [initialImages]);

  const uploadImages = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        toast.error("업로드할 이미지를 선택해주세요.");
        return;
      }

      setUploading(true);

      try {
        const formData = new FormData();
        acceptedFiles.forEach((file) => formData.append("files", file));

        const uploadedUrls = await imageUpload(formData);

        if (!uploadedUrls?.length) return;

        setImages((prev) => {
          const newImages = [...prev, ...uploadedUrls].slice(-maxImages);
          onSuccess?.(newImages);
          return newImages;
        });
      } catch (error) {
        toast.error("이미지 업로드에 실패했습니다.");
      } finally {
        setUploading(false);
      }
    },
    [maxImages, onSuccess],
  );

  return {
    images,
    uploading,
    uploadImages,
  };
}
