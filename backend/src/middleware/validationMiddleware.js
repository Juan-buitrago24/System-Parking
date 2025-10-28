// Middleware para validar los datos de entrada
export const validateRegister = (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  const errors = [];

  // Validar email
  if (!email || !email.trim()) {
    errors.push("El email es requerido.");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("El email no es válido.");
    }
  }

  // Validar contraseña
  if (!password || !password.trim()) {
    errors.push("La contraseña es requerida.");
  } else if (password.length < 6) {
    errors.push("La contraseña debe tener al menos 6 caracteres.");
  }

  // Validar nombre
  if (!firstName || !firstName.trim()) {
    errors.push("El nombre es requerido.");
  }

  // Validar apellido
  if (!lastName || !lastName.trim()) {
    errors.push("El apellido es requerido.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !email.trim()) {
    errors.push("El email es requerido.");
  }

  if (!password || !password.trim()) {
    errors.push("La contraseña es requerida.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors
    });
  }

  next();
};

export const validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({
      success: false,
      message: "El email es requerido."
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "El email no es válido."
    });
  }

  next();
};

export const validateResetPassword = (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const errors = [];

  if (!password || !password.trim()) {
    errors.push("La contraseña es requerida.");
  } else if (password.length < 6) {
    errors.push("La contraseña debe tener al menos 6 caracteres.");
  }

  if (!confirmPassword || !confirmPassword.trim()) {
    errors.push("Debes confirmar la contraseña.");
  }

  if (password !== confirmPassword) {
    errors.push("Las contraseñas no coinciden.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors
    });
  }

  next();
};

export const validateUpdateProfile = (req, res, next) => {
  const { firstName, lastName, phone } = req.body;
  const errors = [];

  if (firstName !== undefined && (!firstName || !firstName.trim())) {
    errors.push("El nombre no puede estar vacío.");
  }

  if (lastName !== undefined && (!lastName || !lastName.trim())) {
    errors.push("El apellido no puede estar vacío.");
  }

  if (phone !== undefined && phone && phone.trim()) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone)) {
      errors.push("El teléfono no es válido.");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors
    });
  }

  next();
};
