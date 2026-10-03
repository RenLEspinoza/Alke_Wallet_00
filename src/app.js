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

// configuración de Handlebars como motor de plantillas
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

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public"))); // Archivos estáticos

// Middleware global para habilitar la subida de archivos
app.use(
  fileUpload({
    createParentPath: true, // Crea automáticamente las carpetas si no existen
    limits: { fileSize: 10 * 1024 * 1024 }, // Límite por ejemplo: 10MB
  }),
);

// Ruta inicial pública
app.get("/", (req, res) => {
  res.render("home");
});

// Enrutador principal
app.use("/", userRoutes);
app.use("/", viewRoutes);
app.use("/", documentRoutes);

// // Ruta para el dashboard (vista protegida)
// app.get("/dashboard", (req, res) => {
//   res.render("dashboard"); // Renderiza dashboard.handlebars
// });

app.use(express.static("uploads"));

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).render("404", { layout: false });
});

// Inicialización del servidor
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log(" Conexión con PostgreSQL verificada correctamente.");

    app.listen(PORT, () => {
      console.log(` Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" Error al conectar con PostgreSQL:", error);
  }
};

startServer();
