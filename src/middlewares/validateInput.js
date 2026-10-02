const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "El correo electrónico y la contraseña son obligatorios.",
    });
  }

  next();
};

module.exports = { validateLogin };
