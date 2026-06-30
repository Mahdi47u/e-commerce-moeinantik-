import { API_BASE_URL } from "@/config/runtime";
import type { MediaAsset } from "@/types/media";

export async function uploadAdminMedia(token: string, file: File, altText?: string) {
  const formData = new FormData();
  formData.append("file", file);
  if (altText?.trim()) {
    formData.append("altText", altText.trim());
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/admin/media`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  } catch {
    throw new Error("ارتباط با سرور برقرار نشد. لطفا دوباره تلاش کنید.");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "آپلود فایل ناموفق بود.");
  }

  return response.json() as Promise<MediaAsset>;
}
