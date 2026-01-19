import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { PermissionScalarFieldEnumSchema } from "./enums/PermissionScalarFieldEnum.schema";
import { PermissionIncludeObjectSchema } from "./objects/PermissionInclude.schema";
import { PermissionOrderByWithRelationInputObjectSchema } from "./objects/PermissionOrderByWithRelationInput.schema";
import { PermissionWhereInputObjectSchema } from "./objects/PermissionWhereInput.schema";
import { PermissionWhereUniqueInputObjectSchema } from "./objects/PermissionWhereUniqueInput.schema";

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const PermissionFindManySelectSchema: z.ZodType<Prisma.PermissionSelect> =
  z
    .object({
      id: z.boolean().optional(),
      action: z.boolean().optional(),
      resource: z.boolean().optional(),
      description: z.boolean().optional(),
      isActive: z.boolean().optional(),
      createdAt: z.boolean().optional(),
      updatedAt: z.boolean().optional(),
      tenantId: z.boolean().optional(),
      tenant: z.boolean().optional(),
      rolePermissions: z.boolean().optional(),
      _count: z.boolean().optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.PermissionSelect>;

export const PermissionFindManySelectZodSchema = z
  .object({
    id: z.boolean().optional(),
    action: z.boolean().optional(),
    resource: z.boolean().optional(),
    description: z.boolean().optional(),
    isActive: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    tenantId: z.boolean().optional(),
    tenant: z.boolean().optional(),
    rolePermissions: z.boolean().optional(),
    _count: z.boolean().optional(),
  })
  .strict();

export const PermissionFindManySchema: z.ZodType<Prisma.PermissionFindManyArgs> =
  z
    .object({
      select: PermissionFindManySelectSchema.optional(),
      include: PermissionIncludeObjectSchema.optional(),
      orderBy: z
        .union([
          PermissionOrderByWithRelationInputObjectSchema,
          PermissionOrderByWithRelationInputObjectSchema.array(),
        ])
        .optional(),
      where: PermissionWhereInputObjectSchema.optional(),
      cursor: PermissionWhereUniqueInputObjectSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          PermissionScalarFieldEnumSchema,
          PermissionScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.PermissionFindManyArgs>;

export const PermissionFindManyZodSchema = z
  .object({
    select: PermissionFindManySelectSchema.optional(),
    include: PermissionIncludeObjectSchema.optional(),
    orderBy: z
      .union([
        PermissionOrderByWithRelationInputObjectSchema,
        PermissionOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: PermissionWhereInputObjectSchema.optional(),
    cursor: PermissionWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([
        PermissionScalarFieldEnumSchema,
        PermissionScalarFieldEnumSchema.array(),
      ])
      .optional(),
  })
  .strict();
