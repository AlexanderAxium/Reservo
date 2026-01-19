import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TenantCreateOrConnectWithoutPermissionsInputObjectSchema } from "./TenantCreateOrConnectWithoutPermissionsInput.schema";
import { TenantCreateWithoutPermissionsInputObjectSchema } from "./TenantCreateWithoutPermissionsInput.schema";
import { TenantUncheckedCreateWithoutPermissionsInputObjectSchema } from "./TenantUncheckedCreateWithoutPermissionsInput.schema";
import { TenantUncheckedUpdateWithoutPermissionsInputObjectSchema } from "./TenantUncheckedUpdateWithoutPermissionsInput.schema";
import { TenantUpdateToOneWithWhereWithoutPermissionsInputObjectSchema } from "./TenantUpdateToOneWithWhereWithoutPermissionsInput.schema";
import { TenantUpdateWithoutPermissionsInputObjectSchema } from "./TenantUpdateWithoutPermissionsInput.schema";
import { TenantUpsertWithoutPermissionsInputObjectSchema } from "./TenantUpsertWithoutPermissionsInput.schema";
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
      upsert: z
        .lazy(() => TenantUpsertWithoutPermissionsInputObjectSchema)
        .optional(),
      connect: z.lazy(() => TenantWhereUniqueInputObjectSchema).optional(),
      update: z
        .union([
          z.lazy(
            () => TenantUpdateToOneWithWhereWithoutPermissionsInputObjectSchema
          ),
          z.lazy(() => TenantUpdateWithoutPermissionsInputObjectSchema),
          z.lazy(
            () => TenantUncheckedUpdateWithoutPermissionsInputObjectSchema
          ),
        ])
        .optional(),
    })
    .strict();
export const TenantUpdateOneRequiredWithoutPermissionsNestedInputObjectSchema: z.ZodType<Prisma.TenantUpdateOneRequiredWithoutPermissionsNestedInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantUpdateOneRequiredWithoutPermissionsNestedInput>;
export const TenantUpdateOneRequiredWithoutPermissionsNestedInputObjectZodSchema =
  makeSchema();
