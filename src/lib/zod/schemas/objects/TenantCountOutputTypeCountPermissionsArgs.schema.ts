import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionWhereInputObjectSchema } from "./PermissionWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => PermissionWhereInputObjectSchema).optional(),
    })
    .strict();
export const TenantCountOutputTypeCountPermissionsArgsObjectSchema =
  makeSchema();
export const TenantCountOutputTypeCountPermissionsArgsObjectZodSchema =
  makeSchema();
