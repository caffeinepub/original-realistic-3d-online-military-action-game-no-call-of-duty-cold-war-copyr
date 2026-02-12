/**
 * Extracts a user-friendly error message from various error types
 * while preserving technical details for console logging
 */
export function extractErrorMessage(error: unknown): string {
  // Handle Error objects
  if (error instanceof Error) {
    const message = error.message;
    return parseErrorMessage(message);
  }
  
  // Handle IC agent error objects with reject_message or error_code
  if (error && typeof error === 'object') {
    // Check for reject_message (common in IC agent errors)
    if ('reject_message' in error && typeof error.reject_message === 'string') {
      return parseErrorMessage(error.reject_message);
    }
    
    // Check for message property
    if ('message' in error) {
      return extractErrorMessage((error as { message: unknown }).message);
    }
    
    // Check for error_code with additional context
    if ('error_code' in error) {
      const errorCode = (error as { error_code: unknown }).error_code;
      if (typeof errorCode === 'string') {
        return parseErrorMessage(errorCode);
      }
    }
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return parseErrorMessage(error);
  }
  
  // Fallback for unknown error types
  return 'An unexpected error occurred';
}

/**
 * Parses an error message string and returns a user-friendly version
 */
function parseErrorMessage(message: string): string {
  // Check for common backend trap patterns
  if (message.includes('Unauthorized')) {
    if (message.includes('authenticated users can join')) {
      return 'You must be signed in to create or join lobbies';
    }
    if (message.includes('authenticated users can leave')) {
      return 'You must be signed in to leave lobbies';
    }
    if (message.includes('authenticated users can update')) {
      return 'You must be signed in to update your position';
    }
    if (message.includes('authenticated users can view')) {
      return 'You must be signed in to view game state';
    }
    if (message.includes('authenticated users can select')) {
      return 'You must be signed in to select maps';
    }
    if (message.includes('authenticated users can start')) {
      return 'You must be signed in to start games';
    }
    if (message.includes('authenticated users can end')) {
      return 'You must be signed in to end games';
    }
    if (message.includes('host can select')) {
      return 'Only the lobby host can change the map';
    }
    if (message.includes('host can start')) {
      return 'Only the lobby host can start the game';
    }
    if (message.includes('not in this lobby')) {
      return 'You are not in this lobby';
    }
    if (message.includes('players in this game')) {
      return 'Only players in this game can perform this action';
    }
    return 'You do not have permission to perform this action';
  }
  
  if (message.includes('anonymous')) {
    return 'Please sign in to continue';
  }
  
  if (message.includes('not found')) {
    if (message.includes('Lobby')) {
      return 'Lobby not found or has been closed';
    }
    if (message.includes('Game')) {
      return 'Game not found or has ended';
    }
    return 'The requested resource was not found';
  }
  
  if (message.includes('Actor not available')) {
    return 'Connection to backend is not ready. Please wait a moment and try again';
  }
  
  // Return the original message if it's already user-friendly
  // (doesn't contain technical jargon)
  if (!message.includes('ic0.') && !message.includes('Wasm') && !message.includes('canister')) {
    return message;
  }
  
  // For technical errors, provide a generic message
  return 'An unexpected error occurred. Please try again';
}
