import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { SessionCreateInputObjectSchema } from "./objects/SessionCreateInput.schema";
import { SessionIncludeObjectSchema } from "./objects/SessionInclude.schema";
import { SessionSelectObjectSchema } from "./objects/SessionSelect.schema";
import { SessionUncheckedCreateInputObjectSchema } from "./objects/SessionUncheckedCreateInput.schema";

export const SessionCreateOneSchema: z.ZodType<Prisma.SessionCreateArgs> = z
  .object({
    select: SessionSelectObjectSchema.optional(),
    include: SessionIncludeObjectSchema.optional(),
    data: z.union([
      SessionCreateInputObjectSchema,
      SessionUncheckedCreateInputObjectSchema,
    ]),
  })
  .strict() as unknown as z.ZodType<Prisma.SessionCreateArgs>;

export const SessionCreateOneZodSchema = z
  .object({
    select: SessionSelectObjectSchema.optional(),
    include: SessionIncludeObjectSchema.optional(),
    data: z.union([
      SessionCreateInputObjectSchema,
      SessionUncheckedCreateInputObjectSchema,
    ]),
  })
  .strict();
