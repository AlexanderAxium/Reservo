import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleCreateOrConnectWithoutUserRolesInputObjectSchema } from "./RoleCreateOrConnectWithoutUserRolesInput.schema";
import { RoleCreateWithoutUserRolesInputObjectSchema } from "./RoleCreateWithoutUserRolesInput.schema";
import { RoleUncheckedCreateWithoutUserRolesInputObjectSchema } from "./RoleUncheckedCreateWithoutUserRolesInput.schema";
import { RoleWhereUniqueInputObjectSchema } from "./RoleWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      create: z
        .union([
          z.lazy(() => RoleCreateWithoutUserRolesInputObjectSchema),
          z.lazy(() => RoleUncheckedCreateWithoutUserRolesInputObjectSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => RoleCreateOrConnectWithoutUserRolesInputObjectSchema)
        .optional(),
      connect: z.lazy(() => RoleWhereUniqueInputObjectSchema).optional(),
    })
    .strict();
export const RoleCreateNestedOneWithoutUserRolesInputObjectSchema: z.ZodType<Prisma.RoleCreateNestedOneWithoutUserRolesInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleCreateNestedOneWithoutUserRolesInput>;
export const RoleCreateNestedOneWithoutUserRolesInputObjectZodSchema =
  makeSchema();
