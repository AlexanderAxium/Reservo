import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TenantCreateWithoutPermissionsInputObjectSchema } from "./TenantCreateWithoutPermissionsInput.schema";
import { TenantUncheckedCreateWithoutPermissionsInputObjectSchema } from "./TenantUncheckedCreateWithoutPermissionsInput.schema";
import { TenantWhereUniqueInputObjectSchema } from "./TenantWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => TenantWhereUniqueInputObjectSchema),
      create: z.union([
        z.lazy(() => TenantCreateWithoutPermissionsInputObjectSchema),
        z.lazy(() => TenantUncheckedCreateWithoutPermissionsInputObjectSchema),
      ]),
    })
    .strict();
export const TenantCreateOrConnectWithoutPermissionsInputObjectSchema: z.ZodType<Prisma.TenantCreateOrConnectWithoutPermissionsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantCreateOrConnectWithoutPermissionsInput>;
export const TenantCreateOrConnectWithoutPermissionsInputObjectZodSchema =
  makeSchema();
