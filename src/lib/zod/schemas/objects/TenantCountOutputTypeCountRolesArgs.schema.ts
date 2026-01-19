import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleWhereInputObjectSchema } from "./RoleWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => RoleWhereInputObjectSchema).optional(),
    })
    .strict();
export const TenantCountOutputTypeCountRolesArgsObjectSchema = makeSchema();
export const TenantCountOutputTypeCountRolesArgsObjectZodSchema = makeSchema();
