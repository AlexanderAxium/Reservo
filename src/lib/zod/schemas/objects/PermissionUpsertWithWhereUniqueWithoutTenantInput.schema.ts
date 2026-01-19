import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionCreateWithoutTenantInputObjectSchema } from "./PermissionCreateWithoutTenantInput.schema";
import { PermissionUncheckedCreateWithoutTenantInputObjectSchema } from "./PermissionUncheckedCreateWithoutTenantInput.schema";
import { PermissionUncheckedUpdateWithoutTenantInputObjectSchema } from "./PermissionUncheckedUpdateWithoutTenantInput.schema";
import { PermissionUpdateWithoutTenantInputObjectSchema } from "./PermissionUpdateWithoutTenantInput.schema";
import { PermissionWhereUniqueInputObjectSchema } from "./PermissionWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => PermissionWhereUniqueInputObjectSchema),
      update: z.union([
        z.lazy(() => PermissionUpdateWithoutTenantInputObjectSchema),
        z.lazy(() => PermissionUncheckedUpdateWithoutTenantInputObjectSchema),
      ]),
      create: z.union([
        z.lazy(() => PermissionCreateWithoutTenantInputObjectSchema),
        z.lazy(() => PermissionUncheckedCreateWithoutTenantInputObjectSchema),
      ]),
    })
    .strict();
export const PermissionUpsertWithWhereUniqueWithoutTenantInputObjectSchema: z.ZodType<Prisma.PermissionUpsertWithWhereUniqueWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionUpsertWithWhereUniqueWithoutTenantInput>;
export const PermissionUpsertWithWhereUniqueWithoutTenantInputObjectZodSchema =
  makeSchema();
