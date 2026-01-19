import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleCreateWithoutUserRolesInputObjectSchema } from "./RoleCreateWithoutUserRolesInput.schema";
import { RoleUncheckedCreateWithoutUserRolesInputObjectSchema } from "./RoleUncheckedCreateWithoutUserRolesInput.schema";
import { RoleWhereUniqueInputObjectSchema } from "./RoleWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => RoleWhereUniqueInputObjectSchema),
      create: z.union([
        z.lazy(() => RoleCreateWithoutUserRolesInputObjectSchema),
        z.lazy(() => RoleUncheckedCreateWithoutUserRolesInputObjectSchema),
      ]),
    })
    .strict();
export const RoleCreateOrConnectWithoutUserRolesInputObjectSchema: z.ZodType<Prisma.RoleCreateOrConnectWithoutUserRolesInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleCreateOrConnectWithoutUserRolesInput>;
export const RoleCreateOrConnectWithoutUserRolesInputObjectZodSchema =
  makeSchema();
