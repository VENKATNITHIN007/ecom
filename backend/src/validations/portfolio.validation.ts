import { z } from "zod";

export const AddPortfolioItemSchema = z.object({
  mediaUrl: z
    .string({
      required_error: "Media URL is required",
      invalid_type_error: "Media URL must be a string",
    })
    .url("Invalid media URL"),
  mediaType: z.enum(["image", "video"], {
    required_error: "Media type is required",
    invalid_type_error: "Media type must be 'image' or 'video'",
  }),
  category: z.string().optional(),
});

export const AddMultiplePortfolioItemsSchema = z.object({
  items: z
    .array(AddPortfolioItemSchema)
    .min(1, "At least one portfolio item is required")
    .max(20, "Cannot add more than 20 items at once"),
});

export const UpdatePortfolioItemSchema = z
  .object({
    category: z.string().optional(),
  })
  .strict();

export const DeletePortfolioItemsSchema = z.object({
  itemIds: z
    .array(
      z.string({
        invalid_type_error: "Item ID must be a string",
      }),
    )
    .min(1, "At least one item ID is required"),
});

export type AddPortfolioItemType = z.infer<typeof AddPortfolioItemSchema>;
export type AddMultiplePortfolioItemsType = z.infer<
  typeof AddMultiplePortfolioItemsSchema
>;
export type UpdatePortfolioItemType = z.infer<typeof UpdatePortfolioItemSchema>;
export type DeletePortfolioItemsType = z.infer<
  typeof DeletePortfolioItemsSchema
>;
