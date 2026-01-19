import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SessionCreateWithoutUserInputObjectSchema } from "./SessionCreateWithoutUserInput.schema";
import { SessionUncheckedCreateWithoutUserInputObjectSchema } from "./SessionUncheckedCreateWithoutUserInput.schema";
import { SessionWhereUniqueInputObjectSchema } from "./SessionWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => SessionWhereUniqueInputObjectSchema),
      create: z.union([
        z.lazy(() => SessionCreateWithoutUserInputObjectSchema),
        z.lazy(() => SessionUncheckedCreateWithoutUserInputObjectSchema),
      ]),
    })
    .strict();
export const SessionCreateOrConnectWithoutUserInputObjectSchema: z.ZodType<Prisma.SessionCreateOrConnectWithoutUserInput> =
  makeSchema() as unknown as z.ZodType<Prisma.SessionCreateOrConnectWithoutUserInput>;
export const SessionCreateOrConnectWithoutUserInputObjectZodSchema =
  makeSchema();
