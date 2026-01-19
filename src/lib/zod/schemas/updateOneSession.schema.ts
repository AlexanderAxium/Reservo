import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { SessionIncludeObjectSchema } from "./objects/SessionInclude.schema";
import { SessionSelectObjectSchema } from "./objects/SessionSelect.schema";
import { SessionUncheckedUpdateInputObjectSchema } from "./objects/SessionUncheckedUpdateInput.schema";
import { SessionUpdateInputObjectSchema } from "./objects/SessionUpdateInput.schema";
import { SessionWhereUniqueInputObjectSchema } from "./objects/SessionWhereUniqueInput.schema";

export const SessionUpdateOneSchema: z.ZodType<Prisma.SessionUpdateArgs> = z
  .object({
    select: SessionSelectObjectSchema.optional(),
    include: SessionIncludeObjectSchema.optional(),
    data: z.union([
      SessionUpdateInputObjectSchema,
      SessionUncheckedUpdateInputObjectSchema,
    ]),
    where: SessionWhereUniqueInputObjectSchema,
  })
  .strict() as unknown as z.ZodType<Prisma.SessionUpdateArgs>;

export const SessionUpdateOneZodSchema = z
  .object({
    select: SessionSelectObjectSchema.optional(),
    include: SessionIncludeObjectSchema.optional(),
    data: z.union([
      SessionUpdateInputObjectSchema,
      SessionUncheckedUpdateInputObjectSchema,
    ]),
    where: SessionWhereUniqueInputObjectSchema,
  })
  .strict();
