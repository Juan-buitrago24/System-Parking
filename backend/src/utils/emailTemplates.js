// Plantilla de email para verificación de cuenta
export const verificationEmailTemplate = (firstName, verificationLink) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚗 System Parking</h1>
        </div>
        <div class="content">
          <h2>¡Hola ${firstName}!</h2>
          <p>Gracias por registrarte en System Parking. Para completar tu registro, por favor verifica tu cuenta haciendo clic en el siguiente enlace:</p>
          <div style="text-align: center;">
            <a href="${verificationLink}" class="button">Verificar mi cuenta</a>
          </div>
          <p>O copia y pega este enlace en tu navegador:</p>
          <p style="word-break: break-all; color: #667eea;">${verificationLink}</p>
          <p><strong>Este enlace expirará en 24 horas.</strong></p>
          <p>Si no creaste esta cuenta, puedes ignorar este correo.</p>
        </div>
        <div class="footer">
          <p>© 2025 System Parking. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Plantilla de email para recuperación de contraseña
export const resetPasswordEmailTemplate = (firstName, resetLink) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Recuperar Contraseña</h1>
        </div>
        <div class="content">
          <h2>Hola ${firstName},</h2>
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en System Parking.</p>
          <p>Si fuiste tú quien solicitó esto, haz clic en el siguiente botón para crear una nueva contraseña:</p>
          <div style="text-align: center;">
            <a href="${resetLink}" class="button">Restablecer Contraseña</a>
          </div>
          <p>O copia y pega este enlace en tu navegador:</p>
          <p style="word-break: break-all; color: #f5576c;">${resetLink}</p>
          <div class="warning">
            <strong>⚠️ Importante:</strong> Este enlace expirará en 1 hora por seguridad.
          </div>
          <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este correo. Tu contraseña actual seguirá siendo válida.</p>
        </div>
        <div class="footer">
          <p>© 2025 System Parking. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Plantilla de email de bienvenida después de verificar cuenta
export const welcomeEmailTemplate = (firstName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 ¡Bienvenido a System Parking!</h1>
        </div>
        <div class="content">
          <h2>¡Hola ${firstName}!</h2>
          <p>Tu cuenta ha sido verificada exitosamente. Ya puedes acceder a todas las funcionalidades de nuestro sistema de gestión de parqueadero.</p>
          <p>Ahora puedes iniciar sesión y comenzar a utilizar la plataforma.</p>
          <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
          <p>¡Gracias por confiar en nosotros!</p>
        </div>
        <div class="footer">
          <p>© 2025 System Parking. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
