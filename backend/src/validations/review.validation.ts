import { z } from "zod";

export const CreateReviewSchema = z.object({
  photographerId: z
    .string({
      required_error: "Photographer ID is required",
      invalid_type_error: "Photographer ID must be a string",
    })
    .min(1, "Photographer ID cannot be empty"),
  rating: z
    .number({
      required_error: "Rating is required",
      invalid_type_error: "Rating must be a number",
    })
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  comment: z.string().optional(),
});

export const UpdateReviewSchema = z
  .object({
    rating: z
      .number({
        invalid_type_error: "Rating must be a number",
      })
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot exceed 5")
      .optional(),
    comment: z.string().optional(),
  })
  .strict();

export type CreateReviewType = z.infer<typeof CreateReviewSchema>;
export type UpdateReviewType = z.infer<typeof UpdateReviewSchema>;
