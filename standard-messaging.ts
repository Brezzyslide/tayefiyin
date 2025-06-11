/**
 * STANDARD MESSAGING SYSTEM FOR ALL FUTURE DEVELOPMENT
 * 
 * This file defines the standardized error and success messaging patterns
 * used throughout the application. All new features should follow these
 * patterns for consistency with the medication tracker messaging style.
 * 
 * Usage:
 * - Import { useStandardToast } from "@/lib/standard-messaging"
 * - Use standardSuccess(), standardError(), standardWarning(), standardInfo()
 * - Use handleStandardApiError() for consistent API error handling
 */

import { useEnhancedToast } from "@/hooks/use-enhanced-toast";

// Standard message types for consistency
export interface StandardMessageConfig {
  operation: string;
  entity: string;
  details?: string;
}

export function useStandardToast() {
  const { showSuccess, showError, showWarning, showInfo, handleApiError } = useEnhancedToast();

  // Standard success patterns
  const standardSuccess = (config: StandardMessageConfig) => {
    const { operation, entity, details } = config;
    const title = `${entity} ${operation}`;
    const description = details || `${entity} has been ${operation.toLowerCase()} successfully.`;
    
    showSuccess(title, description);
  };

  // Standard error patterns  
  const standardError = (config: StandardMessageConfig) => {
    const { operation, entity, details } = config;
    const title = `Failed to ${operation} ${entity}`;
    const description = details || `Unable to ${operation.toLowerCase()} the ${entity.toLowerCase()}. Please try again.`;
    
    showError(title, description);
  };

  // Standard warning patterns
  const standardWarning = (config: StandardMessageConfig) => {
    const { operation, entity, details } = config;
    const title = `${entity} ${operation} Warning`;
    const description = details || `${operation} completed with warnings for ${entity.toLowerCase()}.`;
    
    showWarning(title, description);
  };

  // Standard info patterns
  const standardInfo = (config: StandardMessageConfig) => {
    const { operation, entity, details } = config;
    const title = `${entity} ${operation}`;
    const description = details || `${operation} information for ${entity.toLowerCase()}.`;
    
    showInfo(title, description);
  };

  // Standard API error handling with consistent messaging
  const handleStandardApiError = (error: any, operation: string, entity: string) => {
    console.error(`${operation} ${entity} failed:`, error);
    handleApiError(error, `${operation} ${entity}`);
  };

  return {
    standardSuccess,
    standardError,
    standardWarning,
    standardInfo,
    handleStandardApiError,
    // Re-export original functions for backward compatibility
    showSuccess,
    showError,
    showWarning,
    showInfo,
    handleApiError,
  };
}

// Pre-defined message templates for common operations
export const STANDARD_MESSAGES = {
  // Task operations
  TASK_CREATED: { operation: "Created", entity: "Task", details: "New task has been added to the workflow board successfully." },
  TASK_MOVED: { operation: "Moved", entity: "Task", details: "Task has been moved to the new column successfully." },
  TASK_UPDATED: { operation: "Updated", entity: "Task", details: "Task information has been updated successfully." },
  TASK_DELETED: { operation: "Deleted", entity: "Task", details: "Task has been removed from the workflow board." },
  
  // Board operations
  BOARD_CREATED: { operation: "Created", entity: "Board", details: "New workflow board has been created successfully." },
  BOARD_UPDATED: { operation: "Updated", entity: "Board", details: "Workflow board has been updated successfully." },
  BOARD_DELETED: { operation: "Deleted", entity: "Board", details: "Workflow board has been deleted successfully." },
  
  // User operations
  USER_CREATED: { operation: "Created", entity: "User", details: "New user account has been created successfully." },
  USER_UPDATED: { operation: "Updated", entity: "User", details: "User information has been updated successfully." },
  USER_DELETED: { operation: "Deleted", entity: "User", details: "User account has been deactivated successfully." },
  
  // Client operations
  CLIENT_CREATED: { operation: "Created", entity: "Client", details: "New client profile has been created successfully." },
  CLIENT_UPDATED: { operation: "Updated", entity: "Client", details: "Client information has been updated successfully." },
  CLIENT_DELETED: { operation: "Deleted", entity: "Client", details: "Client profile has been deactivated successfully." },
  
  // Medication operations
  MEDICATION_ADMINISTERED: { operation: "Administered", entity: "Medication", details: "Medication administration has been recorded successfully." },
  MEDICATION_UPDATED: { operation: "Updated", entity: "Medication", details: "Medication plan has been updated successfully." },
  MEDICATION_REMINDER: { operation: "Reminder", entity: "Medication", details: "Medication reminder has been set successfully." },
  
  // Case note operations
  CASE_NOTE_CREATED: { operation: "Created", entity: "Case Note", details: "New case note has been saved successfully." },
  CASE_NOTE_UPDATED: { operation: "Updated", entity: "Case Note", details: "Case note has been updated successfully." },
  CASE_NOTE_DELETED: { operation: "Deleted", entity: "Case Note", details: "Case note has been removed successfully." },
  
  // Incident operations
  INCIDENT_CREATED: { operation: "Created", entity: "Incident Report", details: "Incident report has been submitted successfully." },
  INCIDENT_UPDATED: { operation: "Updated", entity: "Incident Report", details: "Incident report has been updated successfully." },
  INCIDENT_RESOLVED: { operation: "Resolved", entity: "Incident", details: "Incident has been marked as resolved successfully." },
  
  // Authentication operations
  LOGIN_SUCCESS: { operation: "Successful", entity: "Login", details: "You have been logged in successfully." },
  LOGOUT_SUCCESS: { operation: "Successful", entity: "Logout", details: "You have been logged out successfully." },
  SESSION_EXPIRED: { operation: "Expired", entity: "Session", details: "Your session has expired. Please log in again." },
  
  // File operations
  FILE_UPLOADED: { operation: "Uploaded", entity: "File", details: "File has been uploaded successfully." },
  FILE_DELETED: { operation: "Deleted", entity: "File", details: "File has been removed successfully." },
  
  // Permission operations
  PERMISSION_GRANTED: { operation: "Granted", entity: "Permission", details: "Access permission has been granted successfully." },
  PERMISSION_DENIED: { operation: "Denied", entity: "Permission", details: "You don't have permission to perform this action." },
};

// Helper function to get standard message
export const getStandardMessage = (messageKey: keyof typeof STANDARD_MESSAGES) => {
  return STANDARD_MESSAGES[messageKey];
};

/**
 * DEVELOPMENT GUIDELINES FOR FUTURE FEATURES:
 * 
 * 1. Always import and use useStandardToast() instead of direct toast calls
 * 2. Use standardSuccess(), standardError(), etc. for consistent messaging
 * 3. Use STANDARD_MESSAGES constants when possible, or create new ones following the same pattern
 * 4. Use handleStandardApiError() for all API error handling
 * 5. Follow the pattern: { operation: "Action", entity: "Thing", details: "Descriptive message" }
 * 
 * Example usage:
 * ```
 * const { standardSuccess, handleStandardApiError } = useStandardToast();
 * 
 * // On success
 * standardSuccess(STANDARD_MESSAGES.TASK_CREATED);
 * 
 * // On error
 * handleStandardApiError(error, "Create", "Task");
 * ```
 */