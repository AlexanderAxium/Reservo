import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TenantCreateOrConnectWithoutRolesInputObjectSchema } from "./TenantCreateOrConnectWithoutRolesInput.schema";
import { TenantCreateWithoutRolesInputObjectSchema } from "./TenantCreateWithoutRolesInput.schema";
import { TenantUncheckedCreateWithoutRolesInputObjectSchema } from "./TenantUncheckedCreateWithoutRolesInput.schema";
import { TenantWhereUniqueInputObjectSchema } from "./TenantWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      create: z
        .union([
          z.lazy(() => TenantCreateWithoutRolesInputObjectSchema),
          z.lazy(() => TenantUncheckedCreateWithoutRolesInputObjectSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => TenantCreateOrConnectWithoutRolesInputObjectSchema)
        .optional(),
      connect: z.lazy(() => TenantWhereUniqueInputObjectSchema).optional(),
    })
    .strict();
export const TenantCreateNestedOneWithoutRolesInputObjectSchema: z.ZodType<Prisma.TenantCreateNestedOneWithoutRolesInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantCreateNestedOneWithoutRolesInput>;
export const TenantCreateNestedOneWithoutRolesInputObjectZodSchema =
  makeSchema();
