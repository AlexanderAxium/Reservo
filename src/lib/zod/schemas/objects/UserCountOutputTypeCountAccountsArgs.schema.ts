import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { AccountWhereInputObjectSchema } from "./AccountWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => AccountWhereInputObjectSchema).optional(),
    })
    .strict();
export const UserCountOutputTypeCountAccountsArgsObjectSchema = makeSchema();
export const UserCountOutputTypeCountAccountsArgsObjectZodSchema = makeSchema();
