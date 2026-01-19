import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TenantUncheckedUpdateWithoutRolesInputObjectSchema } from "./TenantUncheckedUpdateWithoutRolesInput.schema";
import { TenantUpdateWithoutRolesInputObjectSchema } from "./TenantUpdateWithoutRolesInput.schema";
import { TenantWhereInputObjectSchema } from "./TenantWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => TenantWhereInputObjectSchema).optional(),
      data: z.union([
        z.lazy(() => TenantUpdateWithoutRolesInputObjectSchema),
        z.lazy(() => TenantUncheckedUpdateWithoutRolesInputObjectSchema),
      ]),
    })
    .strict();
export const TenantUpdateToOneWithWhereWithoutRolesInputObjectSchema: z.ZodType<Prisma.TenantUpdateToOneWithWhereWithoutRolesInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantUpdateToOneWithWhereWithoutRolesInput>;
export const TenantUpdateToOneWithWhereWithoutRolesInputObjectZodSchema =
  makeSchema();
