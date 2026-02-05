// Auth
export const USER_EXISTS = "User Name or Email already exists";
export const AUTH_FAILED = "These credentials do not match our records.";
export const AUTH_PASS_FAIL = "The provided password is incorrect.";
export const AUTH_REQUIRED =
  "Authentication required. Please log in to access this resource.";
export const AUTH_RATE_LIMIT =
  "Too many login attempts. Please try again in :seconds seconds.";
export const FORBIDDEN_ACCESS =
  "Administrator privileges are required for this action.";
export const USER_NOT_FOUND = "User not found.";
export const INVALID_TOKEN = "Invalid or expired token.";

// Photographer
export const PHOTOGRAPHER_NOT_FOUND = "Photographer not found.";
export const PHOTOGRAPHER_ONLY = "Only photographers can access this resource.";
export const USERNAME_TAKEN = "Username is already taken.";
export const PROFILE_EXISTS =
  "Photographer profile already exists for this user.";

// Booking
export const BOOKING_NOT_FOUND = "Booking not found.";
export const CANNOT_BOOK_SELF = "You cannot book yourself.";
export const BOOKING_EXISTS =
  "You already have a pending or accepted booking with this photographer for this date.";
export const BOOKING_CANNOT_MODIFY = "This booking cannot be modified.";
export const BOOKING_CANNOT_CANCEL = "This booking cannot be cancelled.";
export const BOOKING_INVALID_TRANSITION = "Invalid status transition.";
export const BOOKING_UPDATE_STATUS_FAILED =
  "Something went wrong while updating booking status.";

// Booking status transitions (valid state machine)
export const BOOKING_STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ["accepted", "rejected"],
  accepted: ["completed", "rejected"],
  rejected: [],
  completed: [],
};

// Review
export const REVIEW_NOT_FOUND = "Review not found.";
export const CANNOT_REVIEW_SELF = "You cannot review yourself.";
export const REVIEW_REQUIRES_BOOKING =
  "You can only review photographers after a completed booking.";
export const REVIEW_EXISTS = "You have already reviewed this photographer.";

// Portfolio
export const PORTFOLIO_ITEM_NOT_FOUND = "Portfolio item not found.";

// Grouped error messages for cleaner imports
export const ERROR_MESSAGES = {
  AUTH: {
    UNAUTHORIZED: AUTH_REQUIRED,
    INVALID_CREDENTIALS: AUTH_FAILED,
    WRONG_PASSWORD: AUTH_PASS_FAIL,
    USER_EXISTS: USER_EXISTS,
    USER_NOT_FOUND: USER_NOT_FOUND,
    INVALID_TOKEN: INVALID_TOKEN,
    FORBIDDEN: FORBIDDEN_ACCESS,
    RATE_LIMIT: AUTH_RATE_LIMIT,
  },
  PHOTOGRAPHER: {
    NOT_FOUND: PHOTOGRAPHER_NOT_FOUND,
    ONLY: PHOTOGRAPHER_ONLY,
    USERNAME_TAKEN: USERNAME_TAKEN,
    PROFILE_EXISTS: PROFILE_EXISTS,
  },
  BOOKING: {
    NOT_FOUND: BOOKING_NOT_FOUND,
    CANNOT_BOOK_SELF: CANNOT_BOOK_SELF,
    EXISTS: BOOKING_EXISTS,
    CANNOT_MODIFY: BOOKING_CANNOT_MODIFY,
    CANNOT_CANCEL: BOOKING_CANNOT_CANCEL,
    INVALID_TRANSITION: BOOKING_INVALID_TRANSITION,
    UPDATE_STATUS_FAILED: BOOKING_UPDATE_STATUS_FAILED,
    PHOTOGRAPHER_ONLY: PHOTOGRAPHER_ONLY,
  },
  REVIEW: {
    NOT_FOUND: REVIEW_NOT_FOUND,
    CANNOT_REVIEW_SELF: CANNOT_REVIEW_SELF,
    REQUIRES_BOOKING: REVIEW_REQUIRES_BOOKING,
    EXISTS: REVIEW_EXISTS,
  },
  PORTFOLIO: {
    ITEM_NOT_FOUND: PORTFOLIO_ITEM_NOT_FOUND,
  },
} as const;

// Uploads
export const MAX_FILE_SIZE = 50 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
];

export const ACCEPTED_AUDIO_TYPES = [
  "audio/mpeg", // MP3
  "audio/mp4", // AAC
  "audio/wav", // WAV
];

// Pagination
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 15;
export const MAX_LIMIT = 100;

export const paginateLabels = {
  totalDocs: "totalCount",
  docs: "data",
  limit: "perPage",
  page: "currentPage",
  nextPage: "next",
  prevPage: "prev",
  totalPages: "pageCount",
  hasPrevPage: "hasPrev",
  hasNextPage: "hasNext",
  pagingCounter: "pageCounter",
};

export const paginateOptions = {
  page: 1,
  limit: 15,
  customLabels: paginateLabels,
};
