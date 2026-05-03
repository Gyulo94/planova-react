export type Workspace = {
  id: string;
  name: string;
  inviteCode: string | null;
  ownerId: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
};
