import { TRPCError } from "@trpc/server";

/**
 * Validates that a tenantId exists and returns it typed as string.
 * Throws UNAUTHORIZED if tenantId is null/undefined.
 */
export function requireTenantId(tenantId: string | undefined | null): string {
  if (!tenantId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Usuario sin tenant asignado",
    });
  }
  return tenantId;
}
