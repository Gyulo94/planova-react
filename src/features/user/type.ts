export type Session = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  provider: Provider;
  createdAt: Date;
  updatedAt: Date;
};

export enum Provider {
  GOOGLE = "google",
  KAKAO = "kakao",
  LOCAL = "local",
}
