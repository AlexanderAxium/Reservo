import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionCreateWithoutTenantInputObjectSchema } from "./PermissionCreateWithoutTenantInput.schema";
import { PermissionUncheckedCreateWithoutTenantInputObjectSchema } from "./PermissionUncheckedCreateWithoutTenantInput.schema";
import { PermissionWhereUniqueInputObjectSchema } from "./PermissionWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => PermissionWhereUniqueInputObjectSchema),
      create: z.union([
        z.lazy(() => PermissionCreateWithoutTenantInputObjectSchema),
        z.lazy(() => PermissionUncheckedCreateWithoutTenantInputObjectSchema),
      ]),
    })
    .strict();
export const PermissionCreateOrConnectWithoutTenantInputObjectSchema: z.ZodType<Prisma.PermissionCreateOrConnectWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionCreateOrConnectWithoutTenantInput>;
export const PermissionCreateOrConnectWithoutTenantInputObjectZodSchema =
  makeSchema();
