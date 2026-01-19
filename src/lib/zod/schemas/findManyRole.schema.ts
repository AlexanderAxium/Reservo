import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { RoleScalarFieldEnumSchema } from "./enums/RoleScalarFieldEnum.schema";
import { RoleIncludeObjectSchema } from "./objects/RoleInclude.schema";
import { RoleOrderByWithRelationInputObjectSchema } from "./objects/RoleOrderByWithRelationInput.schema";
import { RoleWhereInputObjectSchema } from "./objects/RoleWhereInput.schema";
import { RoleWhereUniqueInputObjectSchema } from "./objects/RoleWhereUniqueInput.schema";

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const RoleFindManySelectSchema: z.ZodType<Prisma.RoleSelect> = z
  .object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    displayName: z.boolean().optional(),
    description: z.boolean().optional(),
    isActive: z.boolean().optional(),
    isSystem: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    tenantId: z.boolean().optional(),
    rolePermissions: z.boolean().optional(),
    tenant: z.boolean().optional(),
    userRoles: z.boolean().optional(),
    _count: z.boolean().optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.RoleSelect>;

export const RoleFindManySelectZodSchema = z
  .object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    displayName: z.boolean().optional(),
    description: z.boolean().optional(),
    isActive: z.boolean().optional(),
    isSystem: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    tenantId: z.boolean().optional(),
    rolePermissions: z.boolean().optional(),
    tenant: z.boolean().optional(),
    userRoles: z.boolean().optional(),
    _count: z.boolean().optional(),
  })
  .strict();

export const RoleFindManySchema: z.ZodType<Prisma.RoleFindManyArgs> = z
  .object({
    select: RoleFindManySelectSchema.optional(),
    include: RoleIncludeObjectSchema.optional(),
    orderBy: z
      .union([
        RoleOrderByWithRelationInputObjectSchema,
        RoleOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: RoleWhereInputObjectSchema.optional(),
    cursor: RoleWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([RoleScalarFieldEnumSchema, RoleScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.RoleFindManyArgs>;

export const RoleFindManyZodSchema = z
  .object({
    select: RoleFindManySelectSchema.optional(),
    include: RoleIncludeObjectSchema.optional(),
    orderBy: z
      .union([
        RoleOrderByWithRelationInputObjectSchema,
        RoleOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: RoleWhereInputObjectSchema.optional(),
    cursor: RoleWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([RoleScalarFieldEnumSchema, RoleScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict();
