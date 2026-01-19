import * as z from "zod";

export const PermissionResourceSchema = z.enum([
  "USER",
  "ROLE",
  "PERMISSION",
  "DASHBOARD",
  "ADMIN",
]);

export type PermissionResource = z.infer<typeof PermissionResourceSchema>;
