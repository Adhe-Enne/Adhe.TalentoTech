import { useCallback } from "react";

import type { Tag } from "../models";

import { useCancelable } from "../components/product/product-form/hooks/useCancelable";
import { imageService } from "../services/imageService";

interface UseProductUploadReturn {
  fileToDataUrl: (file: File) => Promise<string>;
  resolveTagIds: (tags?: string[], categoryId?: string) => Promise<string[]>;
  simulateDelay: (ms: number) => Promise<void>;
  uploadAdditionalImages: (files: File[]) => Promise<string[]>;
  uploadMainImage: (file: File) => Promise<string>;
}

const useProductUpload: (createTag: (name: string, categoryId: string) => Promise<Tag | undefined>) => UseProductUploadReturn = (
  createTag: (name: string, categoryId: string) => Promise<Tag | undefined>,
): UseProductUploadReturn => {
  const { fileToDataUrl, simulateDelay } = useCancelable();

  const resolveTagIds: (tags?: string[], categoryId?: string) => Promise<string[]> = useCallback(
    async (tags?: string[], categoryId?: string): Promise<string[]> => {
      const ids: string[] = [];
      if (!tags?.length) {
        return ids;
      }
      for (const name of tags) {
        const createdTag: Tag | undefined = await createTag(name, categoryId ?? "");
        if (createdTag) {
          ids.push(createdTag.id);
        }
      }
      return ids;
    },
    [createTag],
  );

  const uploadMainImage: (file: File) => Promise<string> = useCallback(
    async (file: File): Promise<string> => {
      const imgbbKey: string | undefined = import.meta.env.VITE_IMGBB_API_KEY;
      if (imgbbKey) {
        return await imageService.uploadImageToImgbb(file);
      }
      await simulateDelay(1500);
      return await fileToDataUrl(file);
    },
    [fileToDataUrl, simulateDelay],
  );

  const uploadAdditionalImages: (files: File[]) => Promise<string[]> = useCallback(
    async (files: File[]): Promise<string[]> => {
      if (!files.length) {
        return [];
      }
      const imgbbKey: string | undefined = import.meta.env.VITE_IMGBB_API_KEY;
      const uploads: Promise<string>[] = files.map(async (f) => {
        if (imgbbKey) {
          return await imageService.uploadImageToImgbb(f);
        }
        await simulateDelay(800);
        return await fileToDataUrl(f);
      });
      return await Promise.all(uploads);
    },
    [fileToDataUrl, simulateDelay],
  );

  return { fileToDataUrl, simulateDelay, uploadMainImage, uploadAdditionalImages, resolveTagIds };
};

export default useProductUpload;
