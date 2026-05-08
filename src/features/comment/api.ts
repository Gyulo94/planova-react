import api from "@/lib/axios";
import { Comment } from "./type";

export async function createComment(data: { content: string; taskId: string }) {
  const response = await api.post("/comments", data);
  return response.data.body;
}

export async function findCommentsByTaskId(taskId: string): Promise<Comment[]> {
  const response = await api.get(`/comments/task/${taskId}`);
  return response.data.body;
}

export async function updateComment(id: string, content: string) {
  const response = await api.put(`/comments/${id}`, { content });
  return response.data.body;
}

export async function deleteComment(id: string) {
  const response = await api.delete(`/comments/${id}`);
  return response.data.body;
}
