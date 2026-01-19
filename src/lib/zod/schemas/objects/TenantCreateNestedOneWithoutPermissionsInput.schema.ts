import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TenantCreateOrConnectWithoutPermissionsInputObjectSchema } from "./TenantCreateOrConnectWithoutPermissionsInput.schema";
import { TenantCreateWithoutPermissionsInputObjectSchema } from "./TenantCreateWithoutPermissionsInput.schema";
import { TenantUncheckedCreateWithoutPermissionsInputObjectSchema } from "./TenantUncheckedCreateWithoutPermissionsInput.schema";
import { TenantWhereUniqueInputObjectSchema } from "./TenantWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      create: z
        .union([
          z.lazy(() => TenantCreateWithoutPermissionsInputObjectSchema),
          z.lazy(
            () => TenantUncheckedCreateWithoutPermissionsInputObjectSchema
          ),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => TenantCreateOrConnectWithoutPermissionsInputObjectSchema)
        .optional(),
      connect: z.lazy(() => TenantWhereUniqueInputObjectSchema).optional(),
    })
    .strict();
export const TenantCreateNestedOneWithoutPermissionsInputObjectSchema: z.ZodType<Prisma.TenantCreateNestedOneWithoutPermissionsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantCreateNestedOneWithoutPermissionsInput>;
export const TenantCreateNestedOneWithoutPermissionsInputObjectZodSchema =
  makeSchema();
