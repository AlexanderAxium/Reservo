import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { SessionCreateInputObjectSchema } from "./objects/SessionCreateInput.schema";
import { SessionIncludeObjectSchema } from "./objects/SessionInclude.schema";
import { SessionSelectObjectSchema } from "./objects/SessionSelect.schema";
import { SessionUncheckedCreateInputObjectSchema } from "./objects/SessionUncheckedCreateInput.schema";
import { SessionUncheckedUpdateInputObjectSchema } from "./objects/SessionUncheckedUpdateInput.schema";
import { SessionUpdateInputObjectSchema } from "./objects/SessionUpdateInput.schema";
import { SessionWhereUniqueInputObjectSchema } from "./objects/SessionWhereUniqueInput.schema";

export const SessionUpsertOneSchema: z.ZodType<Prisma.SessionUpsertArgs> = z
  .object({
    select: SessionSelectObjectSchema.optional(),
    include: SessionIncludeObjectSchema.optional(),
    where: SessionWhereUniqueInputObjectSchema,
    create: z.union([
      SessionCreateInputObjectSchema,
      SessionUncheckedCreateInputObjectSchema,
    ]),
    update: z.union([
      SessionUpdateInputObjectSchema,
      SessionUncheckedUpdateInputObjectSchema,
    ]),
  })
  .strict() as unknown as z.ZodType<Prisma.SessionUpsertArgs>;

export const SessionUpsertOneZodSchema = z
  .object({
    select: SessionSelectObjectSchema.optional(),
    include: SessionIncludeObjectSchema.optional(),
    where: SessionWhereUniqueInputObjectSchema,
    create: z.union([
      SessionCreateInputObjectSchema,
      SessionUncheckedCreateInputObjectSchema,
    ]),
    update: z.union([
      SessionUpdateInputObjectSchema,
      SessionUncheckedUpdateInputObjectSchema,
    ]),
  })
  .strict();
