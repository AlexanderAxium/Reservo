import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleUncheckedUpdateWithoutTenantInputObjectSchema } from "./RoleUncheckedUpdateWithoutTenantInput.schema";
import { RoleUpdateWithoutTenantInputObjectSchema } from "./RoleUpdateWithoutTenantInput.schema";
import { RoleWhereUniqueInputObjectSchema } from "./RoleWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => RoleWhereUniqueInputObjectSchema),
      data: z.union([
        z.lazy(() => RoleUpdateWithoutTenantInputObjectSchema),
        z.lazy(() => RoleUncheckedUpdateWithoutTenantInputObjectSchema),
      ]),
    })
    .strict();
export const RoleUpdateWithWhereUniqueWithoutTenantInputObjectSchema: z.ZodType<Prisma.RoleUpdateWithWhereUniqueWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleUpdateWithWhereUniqueWithoutTenantInput>;
export const RoleUpdateWithWhereUniqueWithoutTenantInputObjectZodSchema =
  makeSchema();
