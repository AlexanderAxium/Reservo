import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionCreateManyPermissionInputObjectSchema } from "./RolePermissionCreateManyPermissionInput.schema";

const makeSchema = () =>
  z
    .object({
      data: z.union([
        z.lazy(() => RolePermissionCreateManyPermissionInputObjectSchema),
        z
          .lazy(() => RolePermissionCreateManyPermissionInputObjectSchema)
          .array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();
export const RolePermissionCreateManyPermissionInputEnvelopeObjectSchema: z.ZodType<Prisma.RolePermissionCreateManyPermissionInputEnvelope> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionCreateManyPermissionInputEnvelope>;
export const RolePermissionCreateManyPermissionInputEnvelopeObjectZodSchema =
  makeSchema();
