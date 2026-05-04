import { Project } from "../project/type";
import { Session } from "../user/type";

export type ProjectMember = {
  id: string;
  projectId: string;
  userId: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  joinedAt: string;
  user: Session;
  project: Project;
};

export type Role = "OWNER" | "ADMIN" | "MEMBER";
