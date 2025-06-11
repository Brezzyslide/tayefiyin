/**
 * Global Toast Handler for Consistent Success/Error Messaging
 * 
 * This module provides a unified approach to displaying success and error messages
 * across all forms, updates, and save operations in the application.
 */

import { toast } from "@/hooks/use-toast";

export interface ToastConfig {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

export const showToast = (message: string, type: "success" | "error" = "success", description?: string) => {
  const config: ToastConfig = {
    title: message,
    description,
    variant: type === "error" ? "destructive" : "default",
  };

  toast(config);
};

// Predefined success messages for common operations
export const successMessages = {
  // Care Plans
  carePlanCreated: "Care plan created successfully",
  carePlanUpdated: "Care plan updated successfully", 
  carePlanDeleted: "Care plan deleted successfully",
  carePlanExported: "Care plan exported successfully",

  // Behavioural Response Plans
  behaviouralPlanCreated: "Behavioural response plan created successfully",
  behaviouralPlanUpdated: "Behavioural response plan updated successfully",
  behaviouralPlanDeleted: "Behavioural response plan deleted successfully",

  // Case Notes
  caseNoteCreated: "Case note created successfully",
  caseNoteUpdated: "Case note updated successfully",
  caseNoteDeleted: "Case note deleted successfully",
  caseNoteSubmitted: "Case note submitted successfully",

  // Allocations
  allocationCreated: "Allocation created successfully",
  allocationUpdated: "Allocation updated successfully",
  allocationDeleted: "Allocation removed successfully",
  allocationApproved: "Allocation approved successfully",

  // Risk Assessments
  riskAssessmentCreated: "Risk assessment created successfully",
  riskAssessmentUpdated: "Risk assessment updated successfully",
  riskAssessmentDeleted: "Risk assessment deleted successfully",

  // Medications
  medicationPlanCreated: "Medication plan created successfully",
  medicationPlanUpdated: "Medication plan updated successfully",
  medicationRecorded: "Medication administration recorded successfully",

  // Incidents
  incidentCreated: "Incident report created successfully",
  incidentUpdated: "Incident report updated successfully",
  incidentClosed: "Incident closed successfully",

  // General
  saved: "Changes saved successfully",
  updated: "Updated successfully",
  deleted: "Deleted successfully",
  submitted: "Submitted successfully",
  approved: "Approved successfully",
  rejected: "Rejected successfully",
};

// Predefined error messages for common operations
export const errorMessages = {
  // Care Plans
  carePlanCreateFailed: "Failed to create care plan. Please try again.",
  carePlanUpdateFailed: "Failed to update care plan. Please try again.",
  carePlanDeleteFailed: "Failed to delete care plan. Please try again.",

  // Behavioural Response Plans
  behaviouralPlanCreateFailed: "Failed to create behavioural response plan. Please try again.",
  behaviouralPlanUpdateFailed: "Failed to update behavioural response plan. Please try again.",

  // Case Notes
  caseNoteCreateFailed: "Failed to create case note. Please try again.",
  caseNoteUpdateFailed: "Failed to update case note. Please try again.",
  caseNoteSubmitFailed: "Failed to submit case note. Please try again.",

  // Allocations
  allocationCreateFailed: "Failed to create allocation. Please try again.",
  allocationUpdateFailed: "Failed to update allocation. Please try again.",
  allocationDeleteFailed: "Failed to remove allocation. Please try again.",

  // Risk Assessments
  riskAssessmentCreateFailed: "Failed to create risk assessment. Please try again.",
  riskAssessmentUpdateFailed: "Failed to update risk assessment. Please try again.",

  // Medications
  medicationPlanCreateFailed: "Failed to create medication plan. Please try again.",
  medicationRecordFailed: "Failed to record medication administration. Please try again.",

  // Incidents
  incidentCreateFailed: "Failed to create incident report. Please try again.",
  incidentUpdateFailed: "Failed to update incident report. Please try again.",

  // General
  saveFailed: "Failed to save changes. Please try again.",
  updateFailed: "Failed to update. Please try again.",
  deleteFailed: "Failed to delete. Please try again.",
  submitFailed: "Failed to submit. Please try again.",
  networkError: "Network error. Please check your connection and try again.",
  authenticationRequired: "Authentication required. Please log in again.",
  accessDenied: "Access denied. You don't have permission to perform this action.",
  validationFailed: "Please check all required fields and try again.",
  serverError: "Server error. Please try again later.",
};

// Helper functions for common operations
export const showSuccessToast = (operation: keyof typeof successMessages, customMessage?: string) => {
  const message = customMessage || successMessages[operation];
  showToast(message, "success");
};

export const showErrorToast = (operation: keyof typeof errorMessages, customMessage?: string, description?: string) => {
  const message = customMessage || errorMessages[operation];
  showToast(message, "error", description);
};

// Helper for API error handling
export const handleApiError = (error: any, fallbackOperation: keyof typeof errorMessages) => {
  let errorMessage = errorMessages[fallbackOperation];
  let description: string | undefined;

  if (error?.response?.status === 401) {
    errorMessage = errorMessages.authenticationRequired;
  } else if (error?.response?.status === 403) {
    errorMessage = errorMessages.accessDenied;
  } else if (error?.response?.status === 400) {
    errorMessage = errorMessages.validationFailed;
    description = error?.response?.data?.error || error?.message;
  } else if (error?.response?.status >= 500) {
    errorMessage = errorMessages.serverError;
  } else if (error?.message) {
    description = error.message;
  }

  showToast(errorMessage, "error", description);
};

// Loading state helper (optional)
export const withLoadingToast = async <T>(
  operation: () => Promise<T>,
  loadingMessage: string,
  successMessage: string,
  errorOperation: keyof typeof errorMessages
): Promise<T> => {
  const loadingToast = toast({
    title: loadingMessage,
    description: "Please wait...",
  });

  try {
    const result = await operation();
    loadingToast.dismiss();
    showToast(successMessage, "success");
    return result;
  } catch (error) {
    loadingToast.dismiss();
    handleApiError(error, errorOperation);
    throw error;
  }
};