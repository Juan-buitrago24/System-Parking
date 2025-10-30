import { verifyJWT } from "../utils/generateToken.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Middleware para verificar que el usuario esté autenticado
export const protect = async (req, res, next) => {
  try {
    let token;

    // Verificar si el token viene en el header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No estás autorizado. Token no proporcionado."
      });
    }

    // Verificar el token
    const decoded = verifyJWT(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Token inválido o expirado."
      });
    }

    // Buscar el usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado."
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Por favor verifica tu cuenta primero."
      });
    }

    // Agregar el usuario al request
    req.user = user;
    next();
  } catch (error) {
    console.error("Error en middleware protect:", error);
    return res.status(500).json({
      success: false,
      message: "Error en la autenticación."
    });
  }
};

// Middleware para verificar roles específicos
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para realizar esta acción."
      });
    }
    next();
  };
};
