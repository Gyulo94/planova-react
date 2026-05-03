import { Session } from "../user/type";
import { Workspace } from "../workspace/type";

export type WorkspaceMember = {
  id: string;
  workspaceId: string;
  userId: string;
  role: Role;
  joinedAt: Date;
  user: Session;
  workspace: Workspace;
};

export enum Role {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}
