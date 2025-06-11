/**
 * Global Toast Standardizer
 * Applies enhanced legibility styles to all toast notifications across the system
 */

import { toast as originalToast } from "@/hooks/use-toast";

interface EnhancedToastProps {
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "warning";
  duration?: number;
}

// Enhanced toast with improved legibility
export const enhancedToast = ({
  title,
  description,
  variant = "default",
  duration = 5000,
}: EnhancedToastProps) => {
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case "destructive":
        return "toast-error-enhanced";
      case "success":
        return "toast-success-enhanced";
      case "warning":
        return "toast-warning-enhanced";
      default:
        return "toast-default-enhanced";
    }
  };

  return originalToast({
    title,
    description,
    variant: variant as any,
    duration,
    className: `toast-enhanced ${getVariantClasses(variant)}`,
  });
};

// Apply enhanced styles to all existing toast calls
export const applyGlobalToastStyles = () => {
  // Add global CSS for enhanced toast styling
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    .toast-enhanced {
      border: 2px solid !important;
      font-weight: 600 !important;
      font-size: 0.9rem !important;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
    }

    .toast-default-enhanced {
      background-color: var(--bg-primary) !important;
      color: var(--text-primary) !important;
      border-color: var(--border-medium) !important;
    }

    .toast-error-enhanced {
      background-color: var(--error-bg) !important;
      color: var(--error) !important;
      border-color: var(--error) !important;
    }

    .toast-success-enhanced {
      background-color: var(--success-bg) !important;
      color: var(--success) !important;
      border-color: var(--success) !important;
    }

    .toast-warning-enhanced {
      background-color: var(--warning-bg) !important;
      color: var(--warning) !important;
      border-color: var(--warning) !important;
    }

    .toast-enhanced .toast-title {
      font-weight: 700 !important;
      font-size: 1rem !important;
      margin-bottom: 0.25rem !important;
    }

    .toast-enhanced .toast-description {
      font-weight: 500 !important;
      font-size: 0.85rem !important;
      line-height: 1.4 !important;
    }
  `;
  
  if (!document.head.querySelector('[data-global-toast-styles]')) {
    styleSheet.setAttribute('data-global-toast-styles', 'true');
    document.head.appendChild(styleSheet);
  }
};

// Initialize on module load
if (typeof window !== 'undefined') {
  applyGlobalToastStyles();
}

// Replace default toast with enhanced version
export { enhancedToast as toast };