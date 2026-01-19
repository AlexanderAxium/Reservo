import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SessionUncheckedUpdateWithoutUserInputObjectSchema } from "./SessionUncheckedUpdateWithoutUserInput.schema";
import { SessionUpdateWithoutUserInputObjectSchema } from "./SessionUpdateWithoutUserInput.schema";
import { SessionWhereUniqueInputObjectSchema } from "./SessionWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => SessionWhereUniqueInputObjectSchema),
      data: z.union([
        z.lazy(() => SessionUpdateWithoutUserInputObjectSchema),
        z.lazy(() => SessionUncheckedUpdateWithoutUserInputObjectSchema),
      ]),
    })
    .strict();
export const SessionUpdateWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.SessionUpdateWithWhereUniqueWithoutUserInput> =
  makeSchema() as unknown as z.ZodType<Prisma.SessionUpdateWithWhereUniqueWithoutUserInput>;
export const SessionUpdateWithWhereUniqueWithoutUserInputObjectZodSchema =
  makeSchema();
