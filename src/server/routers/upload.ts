import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { isSysAdmin } from "../../services/rbacService";
import { protectedProcedure, router } from "../trpc";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;
const PRESIGNED_EXPIRES_IN = 3600; // 1 hour

const scopeSchema = z.enum([
  "tenant_logo",
  "tenant_favicon",
  "profile_avatar",
  "field",
  "sport_center",
]);

function getS3Client(): S3Client {
  const endpoint = process.env.NEXT_PUBLIC_CLOUDFLARE_ENDPOINT;
  const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_SECRET_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "R2 upload is not configured (missing env vars)",
    });
  }

  return new S3Client({
    region: "auto",
    endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

function buildKey(
  scope: z.infer<typeof scopeSchema>,
  tenantId: string,
  userId: string,
  fileName: string
): string {
  const sanitized = fileName.replace(/\s+/g, "-");
  const timestamp = Date.now();
  const prefix = `tenants/${tenantId}`;

  switch (scope) {
    case "tenant_logo":
      return `${prefix}/logo/${timestamp}-${sanitized}`;
    case "tenant_favicon":
      return `${prefix}/favicon/${timestamp}-${sanitized}`;
    case "profile_avatar":
      return `${prefix}/users/${userId}/avatar/${timestamp}-${sanitized}`;
    case "field":
      return `${prefix}/fields/${timestamp}-${sanitized}`;
    case "sport_center":
      return `${prefix}/sport-centers/${timestamp}-${sanitized}`;
    default:
      return `${prefix}/misc/${timestamp}-${sanitized}`;
  }
}

export const uploadRouter = router({
  getPresignedUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string().min(1),
        fileType: z
          .string()
          .refine(
            (t) =>
              ALLOWED_IMAGE_TYPES.includes(
                t as (typeof ALLOWED_IMAGE_TYPES)[number]
              ),
            { message: "Invalid image type. Allowed: jpeg, png, webp, gif" }
          ),
        scope: scopeSchema,
        tenantIdOverride: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const bucket = process.env.CLOUDFLARE_BUCKET_NAME;
      const imageDomain = process.env.NEXT_PUBLIC_IMAGE_DOMAIN;

      if (!bucket || !imageDomain) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "R2 upload is not configured (bucket or domain)",
        });
      }

      let tenantId = ctx.user.tenantId;

      if (input.tenantIdOverride) {
        const isSys = await isSysAdmin(ctx.user.id, ctx.user.tenantId ?? "");
        if (!isSys) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only system admin can upload for another tenant",
          });
        }
        tenantId = input.tenantIdOverride;
      }

      if (!tenantId && input.scope !== "profile_avatar") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Tenant context required for this upload scope",
        });
      }

      // For profile_avatar we still want a path; use a placeholder tenant if none
      const effectiveTenantId = tenantId ?? "personal";
      const key = buildKey(
        input.scope,
        effectiveTenantId,
        ctx.user.id,
        input.fileName
      );

      const s3 = getS3Client();
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: input.fileType,
      });

      const presignedUrl = await getSignedUrl(s3, command, {
        expiresIn: PRESIGNED_EXPIRES_IN,
      });

      const fileUrl = `${imageDomain.replace(/\/$/, "")}/${key}`;

      return { presignedUrl, fileUrl };
    }),
});
