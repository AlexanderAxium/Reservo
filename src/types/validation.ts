/**
 * Zod validation schemas using centralized enums
 * Reusable validation schemas for consistent validation across the app
 */

import { z } from "zod";
import { LANGUAGE } from "./enums";
import { DEFAULT_ROLES } from "./rbac";

// User validation schemas
export const userRoleSchema = z.enum([
  DEFAULT_ROLES.SYS_ADMIN,
  DEFAULT_ROLES.TENANT_ADMIN,
  DEFAULT_ROLES.TENANT_STAFF,
  DEFAULT_ROLES.CLIENT,
]);

export const languageSchema = z.enum([LANGUAGE.EN, LANGUAGE.ES, LANGUAGE.PT]);

// Common validation schemas
export const positiveNumberSchema = z.number().positive();
export const nonNegativeNumberSchema = z.number().min(0);
export { emailSchema } from "@/utils/validate";
export const passwordSchema = z.string().min(8);
export const phoneSchema = z.string().regex(/^\+?[\d\s\-()]+$/);

// String validation schemas
export const requiredStringSchema = z.string().min(1);
export const optionalStringSchema = z.string().optional();
