import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SessionWhereInputObjectSchema } from "./SessionWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => SessionWhereInputObjectSchema).optional(),
    })
    .strict();
export const UserCountOutputTypeCountSessionsArgsObjectSchema = makeSchema();
export const UserCountOutputTypeCountSessionsArgsObjectZodSchema = makeSchema();
