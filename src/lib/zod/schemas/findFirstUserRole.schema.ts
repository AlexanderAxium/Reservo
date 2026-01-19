import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { UserRoleScalarFieldEnumSchema } from "./enums/UserRoleScalarFieldEnum.schema";
import { UserRoleIncludeObjectSchema } from "./objects/UserRoleInclude.schema";
import { UserRoleOrderByWithRelationInputObjectSchema } from "./objects/UserRoleOrderByWithRelationInput.schema";
import { UserRoleWhereInputObjectSchema } from "./objects/UserRoleWhereInput.schema";
import { UserRoleWhereUniqueInputObjectSchema } from "./objects/UserRoleWhereUniqueInput.schema";

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const UserRoleFindFirstSelectSchema: z.ZodType<Prisma.UserRoleSelect> = z
  .object({
    id: z.boolean().optional(),
    userId: z.boolean().optional(),
    roleId: z.boolean().optional(),
    assignedAt: z.boolean().optional(),
    assignedBy: z.boolean().optional(),
    expiresAt: z.boolean().optional(),
    role: z.boolean().optional(),
    user: z.boolean().optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.UserRoleSelect>;

export const UserRoleFindFirstSelectZodSchema = z
  .object({
    id: z.boolean().optional(),
    userId: z.boolean().optional(),
    roleId: z.boolean().optional(),
    assignedAt: z.boolean().optional(),
    assignedBy: z.boolean().optional(),
    expiresAt: z.boolean().optional(),
    role: z.boolean().optional(),
    user: z.boolean().optional(),
  })
  .strict();

export const UserRoleFindFirstSchema: z.ZodType<Prisma.UserRoleFindFirstArgs> =
  z
    .object({
      select: UserRoleFindFirstSelectSchema.optional(),
      include: UserRoleIncludeObjectSchema.optional(),
      orderBy: z
        .union([
          UserRoleOrderByWithRelationInputObjectSchema,
          UserRoleOrderByWithRelationInputObjectSchema.array(),
        ])
        .optional(),
      where: UserRoleWhereInputObjectSchema.optional(),
      cursor: UserRoleWhereUniqueInputObjectSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          UserRoleScalarFieldEnumSchema,
          UserRoleScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.UserRoleFindFirstArgs>;

export const UserRoleFindFirstZodSchema = z
  .object({
    select: UserRoleFindFirstSelectSchema.optional(),
    include: UserRoleIncludeObjectSchema.optional(),
    orderBy: z
      .union([
        UserRoleOrderByWithRelationInputObjectSchema,
        UserRoleOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: UserRoleWhereInputObjectSchema.optional(),
    cursor: UserRoleWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([
        UserRoleScalarFieldEnumSchema,
        UserRoleScalarFieldEnumSchema.array(),
      ])
      .optional(),
  })
  .strict();
