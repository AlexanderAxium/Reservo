import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";
import { RoleOrderByWithRelationInputObjectSchema } from "./RoleOrderByWithRelationInput.schema";
import { SortOrderInputObjectSchema } from "./SortOrderInput.schema";
import { UserOrderByWithRelationInputObjectSchema } from "./UserOrderByWithRelationInput.schema";

const makeSchema = () =>
  z
    .object({
      id: SortOrderSchema.optional(),
      userId: SortOrderSchema.optional(),
      roleId: SortOrderSchema.optional(),
      assignedAt: SortOrderSchema.optional(),
      assignedBy: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      expiresAt: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      role: z.lazy(() => RoleOrderByWithRelationInputObjectSchema).optional(),
      user: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
    })
    .strict();
export const UserRoleOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.UserRoleOrderByWithRelationInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleOrderByWithRelationInput>;
export const UserRoleOrderByWithRelationInputObjectZodSchema = makeSchema();
