import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SessionCreateWithoutUserInputObjectSchema } from "./SessionCreateWithoutUserInput.schema";
import { SessionUncheckedCreateWithoutUserInputObjectSchema } from "./SessionUncheckedCreateWithoutUserInput.schema";
import { SessionUncheckedUpdateWithoutUserInputObjectSchema } from "./SessionUncheckedUpdateWithoutUserInput.schema";
import { SessionUpdateWithoutUserInputObjectSchema } from "./SessionUpdateWithoutUserInput.schema";
import { SessionWhereUniqueInputObjectSchema } from "./SessionWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => SessionWhereUniqueInputObjectSchema),
      update: z.union([
        z.lazy(() => SessionUpdateWithoutUserInputObjectSchema),
        z.lazy(() => SessionUncheckedUpdateWithoutUserInputObjectSchema),
      ]),
      create: z.union([
        z.lazy(() => SessionCreateWithoutUserInputObjectSchema),
        z.lazy(() => SessionUncheckedCreateWithoutUserInputObjectSchema),
      ]),
    })
    .strict();
export const SessionUpsertWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.SessionUpsertWithWhereUniqueWithoutUserInput> =
  makeSchema() as unknown as z.ZodType<Prisma.SessionUpsertWithWhereUniqueWithoutUserInput>;
export const SessionUpsertWithWhereUniqueWithoutUserInputObjectZodSchema =
  makeSchema();
