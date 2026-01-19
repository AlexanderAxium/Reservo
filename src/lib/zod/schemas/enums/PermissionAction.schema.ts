import * as z from "zod";

export const PermissionActionSchema = z.enum([
  "CREATE",
  "READ",
  "UPDATE",
  "DELETE",
  "MANAGE",
]);

export type PermissionAction = z.infer<typeof PermissionActionSchema>;
