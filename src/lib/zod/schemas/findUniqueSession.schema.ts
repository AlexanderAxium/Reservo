import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { SessionIncludeObjectSchema } from "./objects/SessionInclude.schema";
import { SessionSelectObjectSchema } from "./objects/SessionSelect.schema";
import { SessionWhereUniqueInputObjectSchema } from "./objects/SessionWhereUniqueInput.schema";

export const SessionFindUniqueSchema: z.ZodType<Prisma.SessionFindUniqueArgs> =
  z
    .object({
      select: SessionSelectObjectSchema.optional(),
      include: SessionIncludeObjectSchema.optional(),
      where: SessionWhereUniqueInputObjectSchema,
    })
    .strict() as unknown as z.ZodType<Prisma.SessionFindUniqueArgs>;

export const SessionFindUniqueZodSchema = z
  .object({
    select: SessionSelectObjectSchema.optional(),
    include: SessionIncludeObjectSchema.optional(),
    where: SessionWhereUniqueInputObjectSchema,
  })
  .strict();
