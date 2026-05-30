// Small helper to upload images to Imgbb (client-side)
// Expects VITE_IMGBB_API_KEY to be set in your environment (.env)
export async function uploadImageToImgbb(file: File): Promise<string> {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("IMGBB API key not configured (VITE_IMGBB_API_KEY)");
  }

  const formData = new FormData();
  formData.append("image", file);

  const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Image upload failed: ${res.status} ${text}`);
  }

  const json = await res.json();
  // imgbb returns the uploaded URL under data.url or data.display_url
  const imageUrl: string | undefined = json?.data?.url || json?.data?.display_url;
  if (!imageUrl) {
    throw new Error("No image URL returned from Imgbb");
  }

  return imageUrl;
}
