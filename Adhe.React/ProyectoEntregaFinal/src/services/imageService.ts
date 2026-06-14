import type { ImgbbResponse } from "../types/imgbb";

export const imageService: {
  uploadImageToImgbb: (file: File) => Promise<string>;
} = {
  uploadImageToImgbb: async (file: File): Promise<string> => {
    const apiKey: string = import.meta.env.VITE_IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error("IMGBB API key not configured (VITE_IMGBB_API_KEY)");
    }

    const formData: FormData = new FormData();
    formData.append("image", file);

    const url: string = `https://api.imgbb.com/1/upload?key=${apiKey}`;
    const res: Response = await fetch(url, { method: "POST", body: formData });

    if (!res.ok) {
      const text: string = await res.text().catch(() => "");
      throw new Error(`Image upload failed: ${res.status} ${text}`);
    }

    const json: ImgbbResponse = await res.json();
    const imageUrl: string | undefined = json?.data?.url || json?.data?.display_url;

    if (!imageUrl) {
      throw new Error("No image URL returned from Imgbb");
    }

    return imageUrl;
  },
};
