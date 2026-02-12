/**
 * Extracts a user-friendly error message from various error types
 * while preserving technical details for console logging
 */
export function extractErrorMessage(error: unknown): string {
  // Handle Error objects
  if (error instanceof Error) {
    const message = error.message;
    
    // Check for common backend trap patterns
    if (message.includes('Unauthorized')) {
      if (message.includes('authenticated users')) {
        return 'You must be signed in to perform this action';
      }
      return 'You do not have permission to perform this action';
    }
    
    if (message.includes('anonymous')) {
      return 'Please sign in to continue';
    }
    
    if (message.includes('not found')) {
      return 'The requested resource was not found';
    }
    
    // Return the original message if it's already user-friendly
    return message;
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    if (error.includes('Unauthorized') || error.includes('anonymous')) {
      return 'You must be signed in to perform this action';
    }
    return error;
  }
  
  // Handle objects with message property
  if (error && typeof error === 'object' && 'message' in error) {
    return extractErrorMessage((error as { message: unknown }).message);
  }
  
  // Fallback for unknown error types
  return 'An unexpected error occurred';
}
