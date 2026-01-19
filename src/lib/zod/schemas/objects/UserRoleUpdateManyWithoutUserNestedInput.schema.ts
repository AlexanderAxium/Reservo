import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserRoleCreateManyUserInputEnvelopeObjectSchema } from "./UserRoleCreateManyUserInputEnvelope.schema";
import { UserRoleCreateOrConnectWithoutUserInputObjectSchema } from "./UserRoleCreateOrConnectWithoutUserInput.schema";
import { UserRoleCreateWithoutUserInputObjectSchema } from "./UserRoleCreateWithoutUserInput.schema";
import { UserRoleScalarWhereInputObjectSchema } from "./UserRoleScalarWhereInput.schema";
import { UserRoleUncheckedCreateWithoutUserInputObjectSchema } from "./UserRoleUncheckedCreateWithoutUserInput.schema";
import { UserRoleUpdateManyWithWhereWithoutUserInputObjectSchema } from "./UserRoleUpdateManyWithWhereWithoutUserInput.schema";
import { UserRoleUpdateWithWhereUniqueWithoutUserInputObjectSchema } from "./UserRoleUpdateWithWhereUniqueWithoutUserInput.schema";
import { UserRoleUpsertWithWhereUniqueWithoutUserInputObjectSchema } from "./UserRoleUpsertWithWhereUniqueWithoutUserInput.schema";
import { UserRoleWhereUniqueInputObjectSchema } from "./UserRoleWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserRoleCreateWithoutUserInputObjectSchema),
          z.lazy(() => UserRoleCreateWithoutUserInputObjectSchema).array(),
          z.lazy(() => UserRoleUncheckedCreateWithoutUserInputObjectSchema),
          z
            .lazy(() => UserRoleUncheckedCreateWithoutUserInputObjectSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => UserRoleCreateOrConnectWithoutUserInputObjectSchema),
          z
            .lazy(() => UserRoleCreateOrConnectWithoutUserInputObjectSchema)
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () => UserRoleUpsertWithWhereUniqueWithoutUserInputObjectSchema
          ),
          z
            .lazy(
              () => UserRoleUpsertWithWhereUniqueWithoutUserInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => UserRoleCreateManyUserInputEnvelopeObjectSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => UserRoleWhereUniqueInputObjectSchema),
          z.lazy(() => UserRoleWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => UserRoleWhereUniqueInputObjectSchema),
          z.lazy(() => UserRoleWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => UserRoleWhereUniqueInputObjectSchema),
          z.lazy(() => UserRoleWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => UserRoleWhereUniqueInputObjectSchema),
          z.lazy(() => UserRoleWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () => UserRoleUpdateWithWhereUniqueWithoutUserInputObjectSchema
          ),
          z
            .lazy(
              () => UserRoleUpdateWithWhereUniqueWithoutUserInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => UserRoleUpdateManyWithWhereWithoutUserInputObjectSchema),
          z
            .lazy(() => UserRoleUpdateManyWithWhereWithoutUserInputObjectSchema)
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => UserRoleScalarWhereInputObjectSchema),
          z.lazy(() => UserRoleScalarWhereInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();
export const UserRoleUpdateManyWithoutUserNestedInputObjectSchema: z.ZodType<Prisma.UserRoleUpdateManyWithoutUserNestedInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleUpdateManyWithoutUserNestedInput>;
export const UserRoleUpdateManyWithoutUserNestedInputObjectZodSchema =
  makeSchema();
