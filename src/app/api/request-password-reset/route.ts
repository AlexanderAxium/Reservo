import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

/**
 * POST /api/request-password-reset
 * Verifica si el email está registrado antes de enviar el correo de recuperación.
 * - Si no está registrado: devuelve 200 con { success: false, code: "NOT_REGISTERED" }
 * - Si está registrado: envía el email vía Better Auth y devuelve { success: true }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json(
        { success: false, code: "INVALID_EMAIL", message: "Correo requerido" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          code: "NOT_REGISTERED",
          message: "No hay ninguna cuenta registrada con este correo.",
        },
        { status: 200 }
      );
    }

    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: `${SITE_URL}/reset-password`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Si el correo está registrado, recibirás instrucciones.",
    });
  } catch (error) {
    console.error("[request-password-reset]", error);
    return NextResponse.json(
      {
        success: false,
        code: "SERVER_ERROR",
        message: "Error al procesar la solicitud. Intenta de nuevo más tarde.",
      },
      { status: 500 }
    );
  }
}
