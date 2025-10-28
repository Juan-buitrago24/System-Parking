import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateJWT, generateRandomToken } from "../utils/generateToken.js";
import { sendMail } from "../config/mailer.js";
import {
  verificationEmailTemplate,
  resetPasswordEmailTemplate,
  welcomeEmailTemplate
} from "../utils/emailTemplates.js";

const prisma = new PrismaClient();

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un usuario con este email."
      });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generar token de verificación
    const verificationToken = generateRandomToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone?.trim() || null,
        role: role || "EMPLOYEE",
        verificationToken,
        verificationExpires
      }
    });

    // Crear enlace de verificación
    const verificationLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-account/${verificationToken}`;

    // Enviar email de verificación
    try {
      await sendMail(
        user.email,
        "Verifica tu cuenta - System Parking",
        verificationEmailTemplate(user.firstName, verificationLink)
      );
    } catch (emailError) {
      console.error("Error al enviar email:", emailError);
      // Continuar aunque el email falle
    }

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente. Por favor verifica tu email.",
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).json({
      success: false,
      message: "Error al registrar usuario."
    });
  }
};

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas."
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas."
      });
    }

    // Verificar si la cuenta está verificada
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Por favor verifica tu cuenta antes de iniciar sesión. Revisa tu email."
      });
    }

    // Actualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Generar token JWT
    const token = generateJWT(user.id, user.email, user.role);

    res.status(200).json({
      success: true,
      message: "Login exitoso.",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone
        }
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error al iniciar sesión."
    });
  }
};

// @desc    Verificar cuenta de usuario
// @route   GET /api/auth/verify/:token
// @access  Public
export const verifyAccount = async (req, res) => {
  try {
    const { token } = req.params;

    // Buscar usuario con el token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token de verificación inválido."
      });
    }

    // Verificar si el token expiró
    if (user.verificationExpires && new Date() > user.verificationExpires) {
      return res.status(400).json({
        success: false,
        message: "El token de verificación ha expirado. Solicita uno nuevo."
      });
    }

    // Verificar la cuenta
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationExpires: null
      }
    });

    // Enviar email de bienvenida
    try {
      await sendMail(
        user.email,
        "¡Bienvenido a System Parking!",
        welcomeEmailTemplate(user.firstName)
      );
    } catch (emailError) {
      console.error("Error al enviar email de bienvenida:", emailError);
    }

    res.status(200).json({
      success: true,
      message: "Cuenta verificada exitosamente. Ya puedes iniciar sesión."
    });
  } catch (error) {
    console.error("Error en verifyAccount:", error);
    res.status(500).json({
      success: false,
      message: "Error al verificar cuenta."
    });
  }
};

// @desc    Solicitar recuperación de contraseña
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      // Por seguridad, no revelar si el email existe o no
      return res.status(200).json({
        success: true,
        message: "Si el email existe, recibirás instrucciones para recuperar tu contraseña."
      });
    }

    // Generar token de reset
    const resetToken = generateRandomToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Guardar token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires
      }
    });

    // Crear enlace de reset
    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

    // Enviar email
    try {
      await sendMail(
        user.email,
        "Recuperar contraseña - System Parking",
        resetPasswordEmailTemplate(user.firstName, resetLink)
      );
    } catch (emailError) {
      console.error("Error al enviar email:", emailError);
      return res.status(500).json({
        success: false,
        message: "Error al enviar el email. Intenta nuevamente."
      });
    }

    res.status(200).json({
      success: true,
      message: "Si el email existe, recibirás instrucciones para recuperar tu contraseña."
    });
  } catch (error) {
    console.error("Error en forgotPassword:", error);
    res.status(500).json({
      success: false,
      message: "Error al procesar la solicitud."
    });
  }
};

// @desc    Restablecer contraseña
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Buscar usuario con el token
    const user = await prisma.user.findUnique({
      where: { resetPasswordToken: token }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token de recuperación inválido."
      });
    }

    // Verificar si el token expiró
    if (user.resetPasswordExpires && new Date() > user.resetPasswordExpires) {
      return res.status(400).json({
        success: false,
        message: "El token de recuperación ha expirado. Solicita uno nuevo."
      });
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar contraseña
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });

    res.status(200).json({
      success: true,
      message: "Contraseña actualizada exitosamente. Ya puedes iniciar sesión."
    });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    res.status(500).json({
      success: false,
      message: "Error al restablecer contraseña."
    });
  }
};

// @desc    Obtener perfil de usuario
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isVerified: true,
        createdAt: true,
        lastLogin: true
      }
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Error en getProfile:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener perfil."
    });
  }
};

// @desc    Actualizar perfil de usuario
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName.trim();
    if (lastName) updateData.lastName = lastName.trim();
    if (phone !== undefined) updateData.phone = phone?.trim() || null;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true
      }
    });

    res.status(200).json({
      success: true,
      message: "Perfil actualizado exitosamente.",
      data: user
    });
  } catch (error) {
    console.error("Error en updateProfile:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar perfil."
    });
  }
};

// @desc    Cambiar contraseña
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validar que se enviaron los campos
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Debes proporcionar la contraseña actual y la nueva."
      });
    }

    // Buscar usuario con contraseña
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "La contraseña actual es incorrecta."
      });
    }

    // Verificar que la nueva contraseña sea diferente
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "La nueva contraseña debe ser diferente a la actual."
      });
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    res.status(200).json({
      success: true,
      message: "Contraseña actualizada exitosamente."
    });
  } catch (error) {
    console.error("Error en changePassword:", error);
    res.status(500).json({
      success: false,
      message: "Error al cambiar contraseña."
    });
  }
};

// @desc    Cerrar sesión (lado servidor - opcional)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    // En este caso, el logout es principalmente del lado del cliente
    // eliminando el token del localStorage. Pero podemos registrarlo aquí.
    
    res.status(200).json({
      success: true,
      message: "Sesión cerrada exitosamente."
    });
  } catch (error) {
    console.error("Error en logout:", error);
    res.status(500).json({
      success: false,
      message: "Error al cerrar sesión."
    });
  }
};
