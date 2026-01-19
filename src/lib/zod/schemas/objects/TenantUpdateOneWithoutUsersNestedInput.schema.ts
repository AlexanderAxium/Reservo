import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TenantCreateOrConnectWithoutUsersInputObjectSchema } from "./TenantCreateOrConnectWithoutUsersInput.schema";
import { TenantCreateWithoutUsersInputObjectSchema } from "./TenantCreateWithoutUsersInput.schema";
import { TenantUncheckedCreateWithoutUsersInputObjectSchema } from "./TenantUncheckedCreateWithoutUsersInput.schema";
import { TenantUncheckedUpdateWithoutUsersInputObjectSchema } from "./TenantUncheckedUpdateWithoutUsersInput.schema";
import { TenantUpdateToOneWithWhereWithoutUsersInputObjectSchema } from "./TenantUpdateToOneWithWhereWithoutUsersInput.schema";
import { TenantUpdateWithoutUsersInputObjectSchema } from "./TenantUpdateWithoutUsersInput.schema";
import { TenantUpsertWithoutUsersInputObjectSchema } from "./TenantUpsertWithoutUsersInput.schema";
import { TenantWhereInputObjectSchema } from "./TenantWhereInput.schema";
import { TenantWhereUniqueInputObjectSchema } from "./TenantWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      create: z
        .union([
          z.lazy(() => TenantCreateWithoutUsersInputObjectSchema),
          z.lazy(() => TenantUncheckedCreateWithoutUsersInputObjectSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => TenantCreateOrConnectWithoutUsersInputObjectSchema)
        .optional(),
      upsert: z
        .lazy(() => TenantUpsertWithoutUsersInputObjectSchema)
        .optional(),
      disconnect: z
        .union([z.boolean(), z.lazy(() => TenantWhereInputObjectSchema)])
        .optional(),
      delete: z
        .union([z.boolean(), z.lazy(() => TenantWhereInputObjectSchema)])
        .optional(),
      connect: z.lazy(() => TenantWhereUniqueInputObjectSchema).optional(),
      update: z
        .union([
          z.lazy(() => TenantUpdateToOneWithWhereWithoutUsersInputObjectSchema),
          z.lazy(() => TenantUpdateWithoutUsersInputObjectSchema),
          z.lazy(() => TenantUncheckedUpdateWithoutUsersInputObjectSchema),
        ])
        .optional(),
    })
    .strict();
export const TenantUpdateOneWithoutUsersNestedInputObjectSchema: z.ZodType<Prisma.TenantUpdateOneWithoutUsersNestedInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantUpdateOneWithoutUsersNestedInput>;
export const TenantUpdateOneWithoutUsersNestedInputObjectZodSchema =
  makeSchema();
