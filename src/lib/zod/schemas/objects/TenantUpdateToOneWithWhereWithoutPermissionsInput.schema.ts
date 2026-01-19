import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TenantUncheckedUpdateWithoutPermissionsInputObjectSchema } from "./TenantUncheckedUpdateWithoutPermissionsInput.schema";
import { TenantUpdateWithoutPermissionsInputObjectSchema } from "./TenantUpdateWithoutPermissionsInput.schema";
import { TenantWhereInputObjectSchema } from "./TenantWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => TenantWhereInputObjectSchema).optional(),
      data: z.union([
        z.lazy(() => TenantUpdateWithoutPermissionsInputObjectSchema),
        z.lazy(() => TenantUncheckedUpdateWithoutPermissionsInputObjectSchema),
      ]),
    })
    .strict();
export const TenantUpdateToOneWithWhereWithoutPermissionsInputObjectSchema: z.ZodType<Prisma.TenantUpdateToOneWithWhereWithoutPermissionsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantUpdateToOneWithWhereWithoutPermissionsInput>;
export const TenantUpdateToOneWithWhereWithoutPermissionsInputObjectZodSchema =
  makeSchema();
