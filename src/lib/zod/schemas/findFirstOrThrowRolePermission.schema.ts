import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { RolePermissionScalarFieldEnumSchema } from "./enums/RolePermissionScalarFieldEnum.schema";
import { RolePermissionIncludeObjectSchema } from "./objects/RolePermissionInclude.schema";
import { RolePermissionOrderByWithRelationInputObjectSchema } from "./objects/RolePermissionOrderByWithRelationInput.schema";
import { RolePermissionWhereInputObjectSchema } from "./objects/RolePermissionWhereInput.schema";
import { RolePermissionWhereUniqueInputObjectSchema } from "./objects/RolePermissionWhereUniqueInput.schema";

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const RolePermissionFindFirstOrThrowSelectSchema: z.ZodType<Prisma.RolePermissionSelect> =
  z
    .object({
      id: z.boolean().optional(),
      roleId: z.boolean().optional(),
      permissionId: z.boolean().optional(),
      createdAt: z.boolean().optional(),
      permission: z.boolean().optional(),
      role: z.boolean().optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.RolePermissionSelect>;

export const RolePermissionFindFirstOrThrowSelectZodSchema = z
  .object({
    id: z.boolean().optional(),
    roleId: z.boolean().optional(),
    permissionId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    permission: z.boolean().optional(),
    role: z.boolean().optional(),
  })
  .strict();

export const RolePermissionFindFirstOrThrowSchema: z.ZodType<Prisma.RolePermissionFindFirstOrThrowArgs> =
  z
    .object({
      select: RolePermissionFindFirstOrThrowSelectSchema.optional(),
      include: RolePermissionIncludeObjectSchema.optional(),
      orderBy: z
        .union([
          RolePermissionOrderByWithRelationInputObjectSchema,
          RolePermissionOrderByWithRelationInputObjectSchema.array(),
        ])
        .optional(),
      where: RolePermissionWhereInputObjectSchema.optional(),
      cursor: RolePermissionWhereUniqueInputObjectSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          RolePermissionScalarFieldEnumSchema,
          RolePermissionScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.RolePermissionFindFirstOrThrowArgs>;

export const RolePermissionFindFirstOrThrowZodSchema = z
  .object({
    select: RolePermissionFindFirstOrThrowSelectSchema.optional(),
    include: RolePermissionIncludeObjectSchema.optional(),
    orderBy: z
      .union([
        RolePermissionOrderByWithRelationInputObjectSchema,
        RolePermissionOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: RolePermissionWhereInputObjectSchema.optional(),
    cursor: RolePermissionWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([
        RolePermissionScalarFieldEnumSchema,
        RolePermissionScalarFieldEnumSchema.array(),
      ])
      .optional(),
  })
  .strict();
