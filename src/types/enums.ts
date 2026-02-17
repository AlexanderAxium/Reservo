/**
 * Type-safe enums and constants for the application
 * Centralized management of all enum values and their types
 */

// Language Enum
export const LANGUAGE = {
  EN: "EN",
  ES: "ES",
  PT: "PT",
} as const;

// Type definitions derived from the constants
export type Language = (typeof LANGUAGE)[keyof typeof LANGUAGE];

export const isValidLanguage = (lang: string): lang is Language => {
  return Object.values(LANGUAGE).includes(lang as Language);
};
