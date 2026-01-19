import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserRoleCreateManyRoleInputEnvelopeObjectSchema } from "./UserRoleCreateManyRoleInputEnvelope.schema";
import { UserRoleCreateOrConnectWithoutRoleInputObjectSchema } from "./UserRoleCreateOrConnectWithoutRoleInput.schema";
import { UserRoleCreateWithoutRoleInputObjectSchema } from "./UserRoleCreateWithoutRoleInput.schema";
import { UserRoleUncheckedCreateWithoutRoleInputObjectSchema } from "./UserRoleUncheckedCreateWithoutRoleInput.schema";
import { UserRoleWhereUniqueInputObjectSchema } from "./UserRoleWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserRoleCreateWithoutRoleInputObjectSchema),
          z.lazy(() => UserRoleCreateWithoutRoleInputObjectSchema).array(),
          z.lazy(() => UserRoleUncheckedCreateWithoutRoleInputObjectSchema),
          z
            .lazy(() => UserRoleUncheckedCreateWithoutRoleInputObjectSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => UserRoleCreateOrConnectWithoutRoleInputObjectSchema),
          z
            .lazy(() => UserRoleCreateOrConnectWithoutRoleInputObjectSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => UserRoleCreateManyRoleInputEnvelopeObjectSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => UserRoleWhereUniqueInputObjectSchema),
          z.lazy(() => UserRoleWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();
export const UserRoleUncheckedCreateNestedManyWithoutRoleInputObjectSchema: z.ZodType<Prisma.UserRoleUncheckedCreateNestedManyWithoutRoleInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleUncheckedCreateNestedManyWithoutRoleInput>;
export const UserRoleUncheckedCreateNestedManyWithoutRoleInputObjectZodSchema =
  makeSchema();
