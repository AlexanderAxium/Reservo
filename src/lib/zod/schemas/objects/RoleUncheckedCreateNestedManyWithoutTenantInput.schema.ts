import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleCreateManyTenantInputEnvelopeObjectSchema } from "./RoleCreateManyTenantInputEnvelope.schema";
import { RoleCreateOrConnectWithoutTenantInputObjectSchema } from "./RoleCreateOrConnectWithoutTenantInput.schema";
import { RoleCreateWithoutTenantInputObjectSchema } from "./RoleCreateWithoutTenantInput.schema";
import { RoleUncheckedCreateWithoutTenantInputObjectSchema } from "./RoleUncheckedCreateWithoutTenantInput.schema";
import { RoleWhereUniqueInputObjectSchema } from "./RoleWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      create: z
        .union([
          z.lazy(() => RoleCreateWithoutTenantInputObjectSchema),
          z.lazy(() => RoleCreateWithoutTenantInputObjectSchema).array(),
          z.lazy(() => RoleUncheckedCreateWithoutTenantInputObjectSchema),
          z
            .lazy(() => RoleUncheckedCreateWithoutTenantInputObjectSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => RoleCreateOrConnectWithoutTenantInputObjectSchema),
          z
            .lazy(() => RoleCreateOrConnectWithoutTenantInputObjectSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => RoleCreateManyTenantInputEnvelopeObjectSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => RoleWhereUniqueInputObjectSchema),
          z.lazy(() => RoleWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();
export const RoleUncheckedCreateNestedManyWithoutTenantInputObjectSchema: z.ZodType<Prisma.RoleUncheckedCreateNestedManyWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleUncheckedCreateNestedManyWithoutTenantInput>;
export const RoleUncheckedCreateNestedManyWithoutTenantInputObjectZodSchema =
  makeSchema();
