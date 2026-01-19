import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserRoleCreateManyRoleInputEnvelopeObjectSchema } from "./UserRoleCreateManyRoleInputEnvelope.schema";
import { UserRoleCreateOrConnectWithoutRoleInputObjectSchema } from "./UserRoleCreateOrConnectWithoutRoleInput.schema";
import { UserRoleCreateWithoutRoleInputObjectSchema } from "./UserRoleCreateWithoutRoleInput.schema";
import { UserRoleScalarWhereInputObjectSchema } from "./UserRoleScalarWhereInput.schema";
import { UserRoleUncheckedCreateWithoutRoleInputObjectSchema } from "./UserRoleUncheckedCreateWithoutRoleInput.schema";
import { UserRoleUpdateManyWithWhereWithoutRoleInputObjectSchema } from "./UserRoleUpdateManyWithWhereWithoutRoleInput.schema";
import { UserRoleUpdateWithWhereUniqueWithoutRoleInputObjectSchema } from "./UserRoleUpdateWithWhereUniqueWithoutRoleInput.schema";
import { UserRoleUpsertWithWhereUniqueWithoutRoleInputObjectSchema } from "./UserRoleUpsertWithWhereUniqueWithoutRoleInput.schema";
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
      upsert: z
        .union([
          z.lazy(
            () => UserRoleUpsertWithWhereUniqueWithoutRoleInputObjectSchema
          ),
          z
            .lazy(
              () => UserRoleUpsertWithWhereUniqueWithoutRoleInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => UserRoleCreateManyRoleInputEnvelopeObjectSchema)
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
            () => UserRoleUpdateWithWhereUniqueWithoutRoleInputObjectSchema
          ),
          z
            .lazy(
              () => UserRoleUpdateWithWhereUniqueWithoutRoleInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => UserRoleUpdateManyWithWhereWithoutRoleInputObjectSchema),
          z
            .lazy(() => UserRoleUpdateManyWithWhereWithoutRoleInputObjectSchema)
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
export const UserRoleUpdateManyWithoutRoleNestedInputObjectSchema: z.ZodType<Prisma.UserRoleUpdateManyWithoutRoleNestedInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleUpdateManyWithoutRoleNestedInput>;
export const UserRoleUpdateManyWithoutRoleNestedInputObjectZodSchema =
  makeSchema();
