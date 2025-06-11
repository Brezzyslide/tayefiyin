import { useToast } from "@/hooks/use-toast";

interface EnhancedToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function useEnhancedToast() {
  const { toast } = useToast();

  const showToast = (options: EnhancedToastOptions) => {
    const { title, description, variant = "default", duration = 5000, action } = options;
    
    // Enhanced error messages with specific guidance
    let enhancedDescription = description;
    if (variant === "destructive" && !description) {
      enhancedDescription = "Please try again or contact support if the issue persists.";
    }

    toast({
      title,
      description: enhancedDescription,
      variant: variant === "destructive" ? "destructive" : "default",
      duration,
      className: variant === "success" 
        ? "toast-success text-high-contrast font-semibold"
        : variant === "warning"
        ? "toast-warning text-high-contrast font-semibold"
        : variant === "info"
        ? "toast-info text-high-contrast font-semibold"
        : variant === "destructive"
        ? "toast-error text-high-contrast font-semibold"
        : "text-high-contrast font-medium",
    });
  };

  const showSuccess = (title: string, description?: string) => {
    showToast({ 
      title, 
      description, 
      variant: "success",
      duration: 4000 
    });
  };

  const showError = (title: string, description?: string, action?: { label: string; onClick: () => void }) => {
    showToast({ 
      title, 
      description: description || "An unexpected error occurred. Please try again.", 
      variant: "destructive",
      duration: 8000,
      action 
    });
  };

  const showWarning = (title: string, description?: string) => {
    showToast({ 
      title, 
      description, 
      variant: "warning",
      duration: 6000 
    });
  };

  const showInfo = (title: string, description?: string) => {
    showToast({ 
      title, 
      description, 
      variant: "info",
      duration: 5000 
    });
  };

  // Enhanced error handling for common API errors
  const handleApiError = (error: any, operation: string) => {
    console.error(`${operation} failed:`, error);
    
    let title = `${operation} Failed`;
    let description = "An unexpected error occurred.";
    
    if (error?.message) {
      if (error.message.includes("Authentication required") || error.message.includes("401")) {
        title = "Authentication Required";
        description = "Your session has expired. Please refresh the page and log in again.";
      } else if (error.message.includes("403")) {
        title = "Access Denied";
        description = "You don't have permission to perform this action. Contact your administrator if you believe this is an error.";
      } else if (error.message.includes("404")) {
        title = "Not Found";
        description = "The requested resource could not be found. It may have been moved or deleted.";
      } else if (error.message.includes("500")) {
        title = "Server Error";
        description = "A server error occurred. Please try again in a few moments or contact support.";
      } else if (error.message.includes("Network")) {
        title = "Connection Error";
        description = "Unable to connect to the server. Please check your internet connection and try again.";
      } else {
        description = error.message;
      }
    }

    showError(title, description, {
      label: "Retry",
      onClick: () => window.location.reload()
    });
  };

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    handleApiError,
  };
}