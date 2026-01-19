import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { VerificationSelectObjectSchema } from "./VerificationSelect.schema";

const makeSchema = () =>
  z
    .object({
      select: z.lazy(() => VerificationSelectObjectSchema).optional(),
    })
    .strict();
export const VerificationArgsObjectSchema = makeSchema();
export const VerificationArgsObjectZodSchema = makeSchema();
