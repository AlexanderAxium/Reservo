import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TenantUncheckedUpdateWithoutUsersInputObjectSchema } from "./TenantUncheckedUpdateWithoutUsersInput.schema";
import { TenantUpdateWithoutUsersInputObjectSchema } from "./TenantUpdateWithoutUsersInput.schema";
import { TenantWhereInputObjectSchema } from "./TenantWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => TenantWhereInputObjectSchema).optional(),
      data: z.union([
        z.lazy(() => TenantUpdateWithoutUsersInputObjectSchema),
        z.lazy(() => TenantUncheckedUpdateWithoutUsersInputObjectSchema),
      ]),
    })
    .strict();
export const TenantUpdateToOneWithWhereWithoutUsersInputObjectSchema: z.ZodType<Prisma.TenantUpdateToOneWithWhereWithoutUsersInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantUpdateToOneWithWhereWithoutUsersInput>;
export const TenantUpdateToOneWithWhereWithoutUsersInputObjectZodSchema =
  makeSchema();
