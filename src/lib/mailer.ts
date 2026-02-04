import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL ?? "noreply@canchalibre.com";
const FROM_NAME = process.env.SENDGRID_FROM_NAME ?? "CanchaLibre";
const CATEGORY = process.env.SENDGRID_CATEGORY ?? "CanchaLibre";

if (typeof SENDGRID_API_KEY === "string" && SENDGRID_API_KEY.length > 0) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export const sendMail = async (
  to: string,
  subject: string,
  content: string
) => {
  const isHtml = /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/.test(content);
  const msg = {
    to,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject,
    ...(isHtml ? { html: content } : { text: content }),
    categories: [CATEGORY],
  };
  if (!SENDGRID_API_KEY || SENDGRID_API_KEY.length === 0) {
    console.warn(
      "[mailer] SENDGRID_API_KEY no configurada, email no enviado:",
      {
        to,
        subject,
      }
    );
    return { messageId: "no-api-key" };
  }
  const [res] = await sgMail.send(msg);
  return { messageId: res.headers["x-message-id"] };
};

export const sendVerificationEmail = async (email: string, url: string) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirma tu cuenta</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #059669;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          color: #1f2937;
          margin: 0;
        }
        .content {
          margin-bottom: 30px;
        }
        .button {
          display: inline-block;
          background: #059669;
          color: white;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
          margin: 20px 0;
        }
        .button:hover {
          background: #047857;
        }
        .footer {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }
        .warning {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 6px;
          padding: 12px;
          margin: 20px 0;
          color: #92400e;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">CanchaLibre</div>
          <h1 class="title">Confirma tu cuenta</h1>
        </div>
        
        <div class="content">
          <p>¡Hola! 👋</p>
          <p>Gracias por registrarte en CanchaLibre. Para completar tu registro y activar tu cuenta, necesitas confirmar tu dirección de email.</p>
          
          <p>Haz clic en el botón de abajo para verificar tu cuenta:</p>
          
          <div style="text-align: center;">
            <a href="${url}" class="button">✅ Confirmar mi cuenta</a>
          </div>
          
          <div class="warning">
            <strong>⚠️ Importante:</strong> Este enlace expirará en 24 horas por seguridad.
          </div>
          
          <p>Si el botón no funciona, puedes copiar y pegar este enlace en tu navegador:</p>
          <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace;">${url}</p>
        </div>
        
        <div class="footer">
          <p>Si no creaste esta cuenta, puedes ignorar este email.</p>
          <p>© ${new Date().getFullYear()} CanchaLibre. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendMail(email, "Confirma tu cuenta - CanchaLibre", htmlContent);
};

export const sendResetPasswordEmail = async (email: string, url: string) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Restablece tu contraseña</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #059669;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          color: #1f2937;
          margin: 0;
        }
        .content {
          margin-bottom: 30px;
        }
        .button {
          display: inline-block;
          background: #059669;
          color: white;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
          margin: 20px 0;
        }
        .button:hover {
          background: #047857;
        }
        .footer {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }
        .warning {
          background: #fef2f2;
          border: 1px solid #fca5a5;
          border-radius: 6px;
          padding: 12px;
          margin: 20px 0;
          color: #dc2626;
        }
        .security-tips {
          background: #f0fdf4;
          border: 1px solid #86efac;
          border-radius: 6px;
          padding: 16px;
          margin: 20px 0;
          color: #166534;
        }
        .security-tips h3 {
          margin-top: 0;
          color: #166534;
        }
        .security-tips ul {
          margin: 10px 0;
          padding-left: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">CanchaLibre</div>
          <h1 class="title">Restablece tu contraseña</h1>
        </div>
        
        <div class="content">
          <p>¡Hola! 👋</p>
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en CanchaLibre. Si fuiste tú quien hizo esta solicitud, haz clic en el botón de abajo para crear una nueva contraseña.</p>
          
          <div style="text-align: center;">
            <a href="${url}" class="button">🔑 Restablecer contraseña</a>
          </div>
          
          <div class="warning">
            <strong>⚠️ Importante:</strong> Este enlace expirará en 1 hora por seguridad. Si no restableces tu contraseña en este tiempo, deberás solicitar uno nuevo.
          </div>
          
          <div class="security-tips">
            <h3>🛡️ Consejos de seguridad:</h3>
            <ul>
              <li>Usa una contraseña única y segura</li>
              <li>Combina letras, números y símbolos</li>
              <li>No uses información personal fácil de adivinar</li>
              <li>Considera usar un gestor de contraseñas</li>
            </ul>
          </div>
          
          <p>Si el botón no funciona, puedes copiar y pegar este enlace en tu navegador:</p>
          <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace;">${url}</p>
        </div>
        
        <div class="footer">
          <p><strong>¿No solicitaste este cambio?</strong></p>
          <p>Si no fuiste tú quien solicitó restablecer la contraseña, puedes ignorar este email. Tu cuenta permanecerá segura.</p>
          <p>© ${new Date().getFullYear()} CanchaLibre. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendMail(email, "Restablece tu contraseña - CanchaLibre", htmlContent);
};
