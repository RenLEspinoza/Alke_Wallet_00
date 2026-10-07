const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const fileUpload = require("express-fileupload");
const { engine } = require("express-handlebars");
const { sequelize } = require("./models");

const viewRoutes = require("./routes/viewRoutes");
const documentRoutes = require("./routes/documentRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.locals.authenticated = req.session?.user ? true : false;
  res.locals.user = req.session?.user || null;
  next();
});

// Configuración de Handlebars
app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
  }),
);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

// Middlewares base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- ARCHIVOS ESTÁTICOS (Irá a buscar imágenes y assets aquí primero) ---
app.use(express.static(path.join(__dirname, "../public")));

// Middleware para servir archivos subidos
app.use(express.static(path.join(__dirname, "uploads")));

// Middleware global para subida de archivos
app.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 },
  }),
);

// Ruta inicial pública
app.get("/", (req, res) => {
  res.render("home");
});

// Enrutadores principales
app.use("/", userRoutes);
app.use("/", viewRoutes);
app.use("/", documentRoutes);
app.use("/api", require("./routes/apiRoutes"));

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).render("404", { layout: false });
});

// Inicialización del servidor
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión con PostgreSQL verificada correctamente.");

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar con PostgreSQL:", error);
  }
};

startServer();
