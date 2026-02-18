/**
 * Centralized error handling utility
 * Maps error responses to user-friendly messages with specific details
 */

const ERROR_MESSAGES = {
  // Network errors
  'NETWORK_ERROR': 'Network connection failed. Please check your internet and try again.',
  'TIMEOUT': 'Request timed out. Please try again.',
  'SERVER_ERROR': 'Server error occurred. Please try again later.',
  
  // Authentication errors
  'UNAUTHORIZED': 'You are not authenticated. Please log in and try again.',
  'FORBIDDEN': 'You do not have permission to perform this action.',
  'SESSION_EXPIRED': 'Your session has expired. Please log in again.',
  
  // Offer-related errors
  'OFFER_ALREADY_RESPONDED': 'This offer has already been accepted or rejected.',
  'OFFER_NOT_FOUND': 'The offer was not found. It may have been deleted.',
  'REQUEST_CLOSED': 'Cannot accept offers on closed requests. Please reopen the request first.',
  'INVALID_PRICE': 'Please enter a valid offer price.',
  'PRICE_TOO_LOW': 'Offer price is too low. Please enter a higher amount.',
  'PRICE_EXCEEDS_MAX': 'Offer price exceeds the maximum allowed amount.',
  
  // Request-related errors
  'REQUEST_NOT_FOUND': 'The request was not found. It may have been deleted.',
  'NOT_REQUEST_OWNER': 'You can only manage offers for your own requests.',
  'INVALID_REQUEST_STATUS': 'Invalid request status. Please refresh and try again.',
  
  // Validation errors
  'VALIDATION_ERROR': 'Please check your input and try again.',
  'REQUIRED_FIELD': 'Please fill in all required fields.',
  'INVALID_EMAIL': 'Please enter a valid email address.',
  'INVALID_LOCATION': 'Please select a valid location.',
  'INVALID_CATEGORY': 'Please select a valid category.',
  
  // Duplicate/Conflict errors
  'DUPLICATE_OFFER': 'You have already sent an offer for this request.',
  'OFFER_TO_OWN_REQUEST': 'You cannot send offers for your own requests.',
  
  // Default error
  'DEFAULT': 'Something went wrong. Please try again.',
};

/**
 * Parse error response and return user-friendly message
 * @param {Error|AxiosError} error - The error object
 * @returns {string} User-friendly error message
 */
export function getErrorMessage(error) {
  // Handle network errors
  if (!error.response) {
    if (error.message === 'Network Error') {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
    if (error.code === 'ECONNABORTED') {
      return ERROR_MESSAGES.TIMEOUT;
    }
    return ERROR_MESSAGES.DEFAULT;
  }

  const status = error.response?.status;
  const data = error.response?.data;
  const errorCode = data?.errorCode || data?.code;
  const message = data?.message;

  // Check for specific error code mapping
  if (errorCode && ERROR_MESSAGES[errorCode]) {
    return ERROR_MESSAGES[errorCode];
  }

  // Check for status-based errors
  switch (status) {
    case 400:
      // Bad request - use server message if available and detailed
      if (message && message.length < 200) {
        return message;
      }
      return ERROR_MESSAGES.VALIDATION_ERROR;

    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;

    case 403:
      // Use server message for forbidden if detailed
      if (message && message.length < 200) {
        return message;
      }
      return ERROR_MESSAGES.FORBIDDEN;

    case 404:
      if (message?.includes('offer')) {
        return ERROR_MESSAGES.OFFER_NOT_FOUND;
      }
      if (message?.includes('request')) {
        return ERROR_MESSAGES.REQUEST_NOT_FOUND;
      }
      return 'Resource not found.';

    case 409:
      // Conflict
      if (message && message.includes('offer')) {
        return ERROR_MESSAGES.DUPLICATE_OFFER;
      }
      return message || 'This action conflicts with existing data.';

    case 422:
      // Unprocessable entity - validation error
      if (message) {
        return message;
      }
      return ERROR_MESSAGES.VALIDATION_ERROR;

    case 429:
      return 'Too many requests. Please wait a moment and try again.';

    case 500:
    case 502:
    case 503:
    case 504:
      return ERROR_MESSAGES.SERVER_ERROR;

    default:
      // Use server message if it's reasonably short (less than 200 chars)
      if (message && typeof message === 'string' && message.length < 200) {
        return message;
      }
      return ERROR_MESSAGES.DEFAULT;
  }
}

/**
 * Get detailed error info for logging/debugging
 * @param {Error|AxiosError} error - The error object
 * @returns {Object} Detailed error information
 */
export function getDetailedError(error) {
  return {
    message: error.message,
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: error.response?.data,
    url: error.config?.url,
    method: error.config?.method,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Check if error is recoverable (user can retry)
 * @param {Error|AxiosError} error - The error object
 * @returns {boolean} Whether the error is recoverable
 */
export function isRecoverableError(error) {
  const status = error.response?.status;
  
  // Network errors are recoverable
  if (!error.response) {
    return true;
  }

  // 429 (rate limit), 503 (service unavailable), 504 (gateway timeout) are recoverable
  if (status === 429 || status === 503 || status === 504) {
    return true;
  }

  // 5xx errors (except 501) are usually recoverable
  if (status >= 500 && status !== 501) {
    return true;
  }

  return false;
}

/**
 * Format validation errors from server
 * @param {Object} errors - Validation errors object from server
 * @returns {string} Formatted error message
 */
export function formatValidationErrors(errors) {
  if (typeof errors === 'string') {
    return errors;
  }

  if (Array.isArray(errors)) {
    return errors.join(', ');
  }

  if (typeof errors === 'object') {
    return Object.values(errors)
      .flat()
      .join(', ');
  }

  return ERROR_MESSAGES.VALIDATION_ERROR;
}
