import { z } from "zod";

// Esquema de validación de email usando Zod
export const emailSchema = z.string().email({ message: "Email inválido" });

// Email regex for client-side form validation (lighter than Zod for onChange)
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Función de validación de email
export const validateEmail = (email: string): boolean => {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
};

// Función de validación que lanza error si es inválido
export const validateEmailStrict = (email: string): string => {
  return emailSchema.parse(email);
};
