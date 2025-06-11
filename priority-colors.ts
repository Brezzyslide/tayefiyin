/**
 * STANDARDIZED PRIORITY COLOR SYSTEM
 * 
 * Use these consistent priority colors across ALL modules in the application.
 * This ensures visual consistency for case notes, incident reports, 
 * workflow tasks, medication alerts, and any other priority-based features.
 * 
 * Import: import { PRIORITY_COLORS, PRIORITY_ICONS } from "@/lib/priority-colors"
 */

// Standard priority color classes with proper light/dark mode support
export const PRIORITY_COLORS = {
  low: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-100 dark:border-green-700",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700", 
  high: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900 dark:text-orange-100 dark:border-orange-700",
  urgent: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-100 dark:border-red-700",
  critical: "bg-red-200 text-red-900 border-red-400 dark:bg-red-800 dark:text-red-50 dark:border-red-600",
} as const;

// Consistent priority icons
export const PRIORITY_ICONS = {
  low: "🟢",
  medium: "🟡",
  high: "🟠", 
  urgent: "🔴",
  critical: "⚠️",
} as const;

// Badge-specific priority colors (for smaller elements)
export const PRIORITY_BADGE_COLORS = {
  low: "bg-green-500 text-white",
  medium: "bg-yellow-500 text-white",
  high: "bg-orange-500 text-white", 
  urgent: "bg-red-500 text-white",
  critical: "bg-red-600 text-white",
} as const;

// Background colors for priority sections
export const PRIORITY_BACKGROUNDS = {
  low: "bg-green-50 dark:bg-green-950",
  medium: "bg-yellow-50 dark:bg-yellow-950",
  high: "bg-orange-50 dark:bg-orange-950",
  urgent: "bg-red-50 dark:bg-red-950", 
  critical: "bg-red-100 dark:bg-red-900",
} as const;

// Border colors for priority elements
export const PRIORITY_BORDERS = {
  low: "border-green-200 dark:border-green-800",
  medium: "border-yellow-200 dark:border-yellow-800",
  high: "border-orange-200 dark:border-orange-800",
  urgent: "border-red-200 dark:border-red-800",
  critical: "border-red-300 dark:border-red-700",
} as const;

// Text colors for priority content
export const PRIORITY_TEXT_COLORS = {
  low: "text-green-700 dark:text-green-300",
  medium: "text-yellow-700 dark:text-yellow-300",
  high: "text-orange-700 dark:text-orange-300",
  urgent: "text-red-700 dark:text-red-300",
  critical: "text-red-800 dark:text-red-200",
} as const;

// Priority levels for sorting and logic
export const PRIORITY_LEVELS = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
  critical: 5,
} as const;

// Type definitions
export type PriorityLevel = keyof typeof PRIORITY_COLORS;
export type PriorityValue = typeof PRIORITY_LEVELS[PriorityLevel];

// Helper functions
export const getPriorityColor = (priority: string): string => {
  const normalizedPriority = priority.toLowerCase() as PriorityLevel;
  return PRIORITY_COLORS[normalizedPriority] || PRIORITY_COLORS.medium;
};

export const getPriorityIcon = (priority: string): string => {
  const normalizedPriority = priority.toLowerCase() as PriorityLevel;
  return PRIORITY_ICONS[normalizedPriority] || PRIORITY_ICONS.medium;
};

export const getPriorityLevel = (priority: string): number => {
  const normalizedPriority = priority.toLowerCase() as PriorityLevel;
  return PRIORITY_LEVELS[normalizedPriority] || PRIORITY_LEVELS.medium;
};

export const sortByPriority = <T extends { priority: string }>(items: T[]): T[] => {
  return items.sort((a, b) => getPriorityLevel(b.priority) - getPriorityLevel(a.priority));
};

/**
 * USAGE EXAMPLES:
 * 
 * // Basic priority badge
 * <Badge className={getPriorityColor(task.priority)}>
 *   {getPriorityIcon(task.priority)} {task.priority}
 * </Badge>
 * 
 * // Priority background section
 * <div className={`p-4 rounded-lg ${PRIORITY_BACKGROUNDS[priority]}`}>
 *   <p className={PRIORITY_TEXT_COLORS[priority]}>Content here</p>
 * </div>
 * 
 * // Sort tasks by priority
 * const sortedTasks = sortByPriority(tasks);
 * 
 * MODULES TO UPDATE:
 * - Workflow Dashboard (✓ Already implemented)
 * - Incident Reports
 * - Case Notes
 * - Medication Alerts
 * - Hourly Observations
 * - Any other priority-based features
 */