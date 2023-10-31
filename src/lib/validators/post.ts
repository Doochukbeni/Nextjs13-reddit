import { z } from "zod";

export const PostValidator = z.object({
  title: z
    .string()
    .min(4, { message: "Title must not be less than 4 characters" })
    .max(128, { message: "Title must not be longer than 128 characters" }),
  subredditId: z.string(),
  content: z.any(),
});

export type PostCreationRequest = z.infer<typeof PostValidator>;
