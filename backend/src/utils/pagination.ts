import { Query } from "mongoose";

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    perPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * Apply pagination to a Mongoose query
 */
export const paginate = async <T>(
  query: Query<T[], T>,
  options: PaginationOptions = {},
): Promise<PaginatedResult<T>> => {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 15));
  const skip = (page - 1) * limit;

  // Clone query for count
  const countQuery = query.model.find(query.getFilter());
  const totalCount = await countQuery.countDocuments();

  // Apply sorting
  if (options.sortBy) {
    const sortOrder = options.sortOrder === "desc" ? -1 : 1;
    query.sort({ [options.sortBy]: sortOrder });
  }

  // Apply pagination
  const data = await query.skip(skip).limit(limit);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      perPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Parse pagination options from request query
 */
export const parsePaginationQuery = (query: {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}): PaginationOptions => {
  return {
    page: query.page ? parseInt(query.page, 10) : 1,
    limit: query.limit ? parseInt(query.limit, 10) : 15,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder === "desc" ? "desc" : "asc",
  };
};
