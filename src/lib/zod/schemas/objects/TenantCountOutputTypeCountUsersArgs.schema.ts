import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserWhereInputObjectSchema } from "./UserWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => UserWhereInputObjectSchema).optional(),
    })
    .strict();
export const TenantCountOutputTypeCountUsersArgsObjectSchema = makeSchema();
export const TenantCountOutputTypeCountUsersArgsObjectZodSchema = makeSchema();
