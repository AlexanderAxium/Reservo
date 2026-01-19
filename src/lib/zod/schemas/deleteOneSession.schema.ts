import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { SessionIncludeObjectSchema } from "./objects/SessionInclude.schema";
import { SessionSelectObjectSchema } from "./objects/SessionSelect.schema";
import { SessionWhereUniqueInputObjectSchema } from "./objects/SessionWhereUniqueInput.schema";

export const SessionDeleteOneSchema: z.ZodType<Prisma.SessionDeleteArgs> = z
  .object({
    select: SessionSelectObjectSchema.optional(),
    include: SessionIncludeObjectSchema.optional(),
    where: SessionWhereUniqueInputObjectSchema,
  })
  .strict() as unknown as z.ZodType<Prisma.SessionDeleteArgs>;

export const SessionDeleteOneZodSchema = z
  .object({
    select: SessionSelectObjectSchema.optional(),
    include: SessionIncludeObjectSchema.optional(),
    where: SessionWhereUniqueInputObjectSchema,
  })
  .strict();
