import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { VerificationScalarFieldEnumSchema } from "./enums/VerificationScalarFieldEnum.schema";
import { VerificationOrderByWithRelationInputObjectSchema } from "./objects/VerificationOrderByWithRelationInput.schema";
import { VerificationWhereInputObjectSchema } from "./objects/VerificationWhereInput.schema";
import { VerificationWhereUniqueInputObjectSchema } from "./objects/VerificationWhereUniqueInput.schema";

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const VerificationFindFirstSelectSchema: z.ZodType<Prisma.VerificationSelect> =
  z
    .object({
      id: z.boolean().optional(),
      identifier: z.boolean().optional(),
      value: z.boolean().optional(),
      expiresAt: z.boolean().optional(),
      createdAt: z.boolean().optional(),
      updatedAt: z.boolean().optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.VerificationSelect>;

export const VerificationFindFirstSelectZodSchema = z
  .object({
    id: z.boolean().optional(),
    identifier: z.boolean().optional(),
    value: z.boolean().optional(),
    expiresAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
  })
  .strict();

export const VerificationFindFirstSchema: z.ZodType<Prisma.VerificationFindFirstArgs> =
  z
    .object({
      select: VerificationFindFirstSelectSchema.optional(),
      orderBy: z
        .union([
          VerificationOrderByWithRelationInputObjectSchema,
          VerificationOrderByWithRelationInputObjectSchema.array(),
        ])
        .optional(),
      where: VerificationWhereInputObjectSchema.optional(),
      cursor: VerificationWhereUniqueInputObjectSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          VerificationScalarFieldEnumSchema,
          VerificationScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.VerificationFindFirstArgs>;

export const VerificationFindFirstZodSchema = z
  .object({
    select: VerificationFindFirstSelectSchema.optional(),
    orderBy: z
      .union([
        VerificationOrderByWithRelationInputObjectSchema,
        VerificationOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: VerificationWhereInputObjectSchema.optional(),
    cursor: VerificationWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([
        VerificationScalarFieldEnumSchema,
        VerificationScalarFieldEnumSchema.array(),
      ])
      .optional(),
  })
  .strict();
