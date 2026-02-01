// Auth
export const USER_EXISTS = "User Name or Email already exists";
export const AUTH_FAILED = "These credentials do not match our records.";
export const AUTH_PASS_FAIL = "The provided password is incorrect.";
export const AUTH_REQUIRED = "Authentication required. Please log in to access this resource.";
export const AUTH_RATE_LIMIT = "Too many login attempts. Please try again in :seconds seconds.";
export const FORBIDDEN_ACCESS = "Administrator privileges are required for this action.";

// Uploads
export const MAX_FILE_SIZE = 50 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

export const ACCEPTED_AUDIO_TYPES = [
    "audio/mpeg", // MP3
    "audio/mp4", // AAC
    "audio/wav", // WAV
];

// Pagination
export const paginateLabels = {
    totalDocs: 'totalCount',
    docs: 'data',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'next',
    prevPage: 'prev',
    totalPages: 'pageCount',
    hasPrevPage: 'hasPrev',
    hasNextPage: 'hasNext',
    pagingCounter: 'pageCounter',
};

export const paginateOptions = {
    page: 1,
    limit: 15,
    customLabels: paginateLabels
};