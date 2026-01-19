import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionUncheckedUpdateWithoutTenantInputObjectSchema } from "./PermissionUncheckedUpdateWithoutTenantInput.schema";
import { PermissionUpdateWithoutTenantInputObjectSchema } from "./PermissionUpdateWithoutTenantInput.schema";
import { PermissionWhereUniqueInputObjectSchema } from "./PermissionWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => PermissionWhereUniqueInputObjectSchema),
      data: z.union([
        z.lazy(() => PermissionUpdateWithoutTenantInputObjectSchema),
        z.lazy(() => PermissionUncheckedUpdateWithoutTenantInputObjectSchema),
      ]),
    })
    .strict();
export const PermissionUpdateWithWhereUniqueWithoutTenantInputObjectSchema: z.ZodType<Prisma.PermissionUpdateWithWhereUniqueWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionUpdateWithWhereUniqueWithoutTenantInput>;
export const PermissionUpdateWithWhereUniqueWithoutTenantInputObjectZodSchema =
  makeSchema();
