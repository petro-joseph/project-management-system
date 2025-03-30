
/**
 * Utility functions for safely handling mock data operations
 */

// Simulates an async operation with a small delay to prevent UI freezing
export const asyncOperation = <T>(
  operation: () => T, 
  delay: number = 100
): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = operation();
      resolve(result);
    }, delay);
  });
};

// Safely validates that string values aren't empty before using in SelectItems
export const ensureValidSelectValue = (value: string | number | undefined | null): string => {
  if (value === undefined || value === null || value === '') {
    return 'default-value'; // Fallback value to prevent errors
  }
  return String(value);
};

// Validation function for arrays to ensure they contain valid data
export const ensureValidArray = <T>(array: T[] | undefined | null): T[] => {
  if (!array || !Array.isArray(array)) {
    return [];
  }
  return array;
};

// Safe state update that uses requestAnimationFrame to prevent blocking the main thread
export const safeStateUpdate = <T>(
  updateFn: (value: T) => void,
  newValue: T
): void => {
  requestAnimationFrame(() => {
    updateFn(newValue);
  });
};
