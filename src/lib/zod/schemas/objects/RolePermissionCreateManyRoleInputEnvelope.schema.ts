import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionCreateManyRoleInputObjectSchema } from "./RolePermissionCreateManyRoleInput.schema";

const makeSchema = () =>
  z
    .object({
      data: z.union([
        z.lazy(() => RolePermissionCreateManyRoleInputObjectSchema),
        z.lazy(() => RolePermissionCreateManyRoleInputObjectSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();
export const RolePermissionCreateManyRoleInputEnvelopeObjectSchema: z.ZodType<Prisma.RolePermissionCreateManyRoleInputEnvelope> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionCreateManyRoleInputEnvelope>;
export const RolePermissionCreateManyRoleInputEnvelopeObjectZodSchema =
  makeSchema();
