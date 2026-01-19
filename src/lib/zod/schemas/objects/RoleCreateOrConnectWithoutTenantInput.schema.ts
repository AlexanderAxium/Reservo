import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleCreateWithoutTenantInputObjectSchema } from "./RoleCreateWithoutTenantInput.schema";
import { RoleUncheckedCreateWithoutTenantInputObjectSchema } from "./RoleUncheckedCreateWithoutTenantInput.schema";
import { RoleWhereUniqueInputObjectSchema } from "./RoleWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => RoleWhereUniqueInputObjectSchema),
      create: z.union([
        z.lazy(() => RoleCreateWithoutTenantInputObjectSchema),
        z.lazy(() => RoleUncheckedCreateWithoutTenantInputObjectSchema),
      ]),
    })
    .strict();
export const RoleCreateOrConnectWithoutTenantInputObjectSchema: z.ZodType<Prisma.RoleCreateOrConnectWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleCreateOrConnectWithoutTenantInput>;
export const RoleCreateOrConnectWithoutTenantInputObjectZodSchema =
  makeSchema();
