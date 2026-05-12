import z from "zod/v3";

export const UserProfileSchema = z.object({
  name: z.string(),
  image: z.string().optional(),
});
