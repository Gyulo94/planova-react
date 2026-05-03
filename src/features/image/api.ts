import api from "@/lib/axios";

export async function imageUpload(formData: FormData): Promise<string[]> {
  const response = await api.post(`/image/upload`, formData);
  return response.data.body.images as string[];
}
