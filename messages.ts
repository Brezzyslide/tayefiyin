// Standardized message system for consistent user experience across the application

export const messages = {
  // Success Messages
  success: {
    // Generic success
    operationComplete: "Operation completed successfully",
    changesSaved: "Changes saved successfully",
    
    // Authentication
    loginSuccess: "Welcome back! You have been logged in successfully",
    logoutSuccess: "You have been logged out successfully",
    passwordChanged: "Password updated successfully",
    profileUpdated: "Profile updated successfully",
    
    // Data Operations
    created: (item: string) => `${item} created successfully`,
    updated: (item: string) => `${item} updated successfully`,
    deleted: (item: string) => `${item} deleted successfully`,
    uploaded: (item: string) => `${item} uploaded successfully`,
    
    // Specific Modules
    caseNoteCreated: "Case note created successfully",
    observationCreated: "Observation recorded successfully",
    incidentReported: "Incident report submitted successfully",
    shiftAssigned: "Shift assigned successfully",
    medicationRecorded: "Medication administration recorded successfully",
    carePlanSaved: "Care plan saved successfully",
    
    // Export Operations
    pdfExported: (count?: number) => count ? `${count} records exported to PDF successfully` : "PDF exported successfully",
    excelExported: (count?: number) => count ? `${count} records exported to Excel successfully` : "Excel exported successfully",
    
    // Communication
    messageSent: "Message sent successfully",
    notificationSent: "Notification sent successfully",
    
    // System Operations
    syncComplete: "Data synchronized successfully",
    backupComplete: "Backup completed successfully",
  },

  // Error Messages
  error: {
    // Generic errors
    operationFailed: "Operation failed. Please try again",
    unexpectedError: "An unexpected error occurred. Please contact support if this persists",
    networkError: "Network error. Please check your connection and try again",
    
    // Authentication
    loginFailed: "Login failed. Please check your credentials and try again",
    sessionExpired: "Your session has expired. Please log in again",
    accessDenied: "Access denied. You don't have permission to perform this action",
    invalidCredentials: "Invalid username or password",
    
    // Validation
    requiredField: (field: string) => `${field} is required`,
    invalidFormat: (field: string) => `${field} format is invalid`,
    tooShort: (field: string, min: number) => `${field} must be at least ${min} characters`,
    tooLong: (field: string, max: number) => `${field} must not exceed ${max} characters`,
    
    // Data Operations
    createFailed: (item: string) => `Failed to create ${item}. Please try again`,
    updateFailed: (item: string) => `Failed to update ${item}. Please try again`,
    deleteFailed: (item: string) => `Failed to delete ${item}. Please try again`,
    loadFailed: (item: string) => `Failed to load ${item}. Please refresh and try again`,
    uploadFailed: (item: string) => `Failed to upload ${item}. Please check file format and try again`,
    
    // Specific Modules
    caseNoteError: "Unable to save case note. Please check all required fields are completed",
    observationError: "Unable to record observation. Please check all fields and try again",
    incidentError: "Unable to submit incident report. Please verify all required information",
    shiftError: "Unable to process shift request. Please try again",
    medicationError: "Unable to record medication. Please verify client and medication details",
    carePlanError: "Unable to save care plan. Please check all sections are complete",
    
    // Export Operations
    exportFailed: "Export failed. Please try again or contact support",
    noDataToExport: "No data available for export",
    
    // File Operations
    fileTooBig: (maxSize: string) => `File too large. Maximum size is ${maxSize}`,
    invalidFileType: "Invalid file type. Please select a supported format",
    
    // System Errors
    serverError: "Server error. Please try again later",
    maintenanceMode: "System is currently under maintenance. Please try again later",
  },

  // Warning Messages
  warning: {
    // Data Loss
    unsavedChanges: "You have unsaved changes. Are you sure you want to leave?",
    permanentAction: "This action cannot be undone. Are you sure you want to continue?",
    dataOverwrite: "This will overwrite existing data. Continue?",
    
    // Validation
    incompleteForm: "Some fields are incomplete. Please review and complete all required information",
    duplicateEntry: "A similar entry already exists. Do you want to continue?",
    
    // System
    slowConnection: "Connection is slow. Some features may be delayed",
    browserSupport: "Your browser may not support all features. Consider updating for the best experience",
    
    // Security
    passwordWeak: "Password strength is weak. Consider using a stronger password",
    securityRisk: "This action may pose a security risk. Please verify you intended to do this",
  },

  // Information Messages
  info: {
    // Loading States
    loading: "Loading, please wait...",
    processing: "Processing your request...",
    uploading: "Uploading file, please wait...",
    saving: "Saving changes...",
    
    // Empty States
    noData: "No data available",
    noResults: "No results found",
    emptyList: "List is empty",
    
    // Instructions
    selectItem: "Please select an item to continue",
    fillRequired: "Please fill in all required fields",
    reviewBefore: "Please review your information before submitting",
    
    // Features
    featureComingSoon: "This feature is coming soon",
    betaFeature: "This is a beta feature. Your feedback is welcome",
    
    // Help
    needHelp: "Need help? Contact support or check our documentation",
    tipOfDay: "Tip: Use keyboard shortcuts for faster navigation",
  },

  // Welcome Messages
  welcome: {
    // Login Greetings
    firstLogin: "Welcome to the Care and Support Management System! Let's get you started",
    returningUser: "Welcome back! Here's what's new since your last visit",
    morningGreeting: "Good morning! Ready to provide excellent care today?",
    afternoonGreeting: "Good afternoon! Let's continue delivering quality support",
    eveningGreeting: "Good evening! Thank you for your continued dedication",
    
    // Role-based welcomes
    staff: "Welcome! Access your shifts, case notes, and client information here",
    admin: "Welcome to the admin dashboard. Manage your organization and oversee operations",
    superAdmin: "Welcome to the system administration panel. Full system access enabled",
    teamLeader: "Welcome! Monitor your team's performance and coordinate care delivery",
    
    // Feature introductions
    newFeature: (feature: string) => `Introducing ${feature}! Click here to learn more`,
    tutorial: "New here? Take our quick tutorial to get familiar with the system",
  },

  // Progress Messages
  progress: {
    step: (current: number, total: number) => `Step ${current} of ${total}`,
    completion: (percentage: number) => `${percentage}% complete`,
    timeRemaining: (time: string) => `Estimated time remaining: ${time}`,
    itemsProcessed: (current: number, total: number) => `Processing ${current} of ${total} items`,
  }
};

// Helper function to get contextual messages based on user role and time
export function getContextualMessage(user: any) {
  const hour = new Date().getHours();
  let greeting = messages.welcome.morningGreeting;
  
  if (hour >= 12 && hour < 17) {
    greeting = messages.welcome.afternoonGreeting;
  } else if (hour >= 17) {
    greeting = messages.welcome.eveningGreeting;
  }
  
  // Role-based welcome
  if (user?.roleId === 1) return messages.welcome.staff;
  if (user?.roleId === 2) return messages.welcome.teamLeader;
  if (user?.roleId === 3) return messages.welcome.admin;
  if (user?.roleId === 4) return messages.welcome.superAdmin;
  
  return greeting;
}

// Helper to format error messages consistently
export function formatError(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return messages.error.unexpectedError;
}