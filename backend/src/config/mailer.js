import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

// Inicializar Resend con la API Key
const resend = new Resend(process.env.RESEND_API_KEY);

// Función para enviar emails usando Resend
export const sendMail = async (to, subject, html) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "System Parking <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("Error enviando email con Resend:", error);
      throw error;
    }

    console.log("✅ Email enviado exitosamente:", data);
    return data;
  } catch (error) {
    console.error("Error en sendMail:", error);
    throw error;
  }
};
