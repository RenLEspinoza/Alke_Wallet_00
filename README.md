# Alke Wallet - Billetera Digital Backend (Node.js, Express, Sequelize & JWT)

Evolución del sistema backend para la billetera digital **Alke Wallet**, desarrollado como hito integrador. En esta etapa se implementó una **API RESTful completa**, integrada con **Sequelize ORM** sobre PostgreSQL para la gestión relacional, autenticación securizada mediante **JSON Web Tokens (JWT)**, middlewares de validación y carga controlada de archivos multipartes.

---

## 📋 Requisitos del Sistema

- **Node.js** (v18.x o superior)
- **npm** (gestor de paquetes de Node.js)
- **PostgreSQL** (instancia local o remota en ejecución)
- Cliente HTTP para pruebas de endpoints (Postman o Thunder Client)

---

## 🛠️ Instalación y Configuración

1. **Clonar o descargar el repositorio:**

   ```bash
   git clone [https://github.com/RenLEspinoza/alke-wallet.git](https://github.com/RenLEspinoza/alke-wallet.git)
   cd alke-wallet
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

## 🛠️ Stack de Dependencias

    **express:** Framework web para la estructura del servidor y ruteo.

    **sequelize & pg / pg-hstore:** ORM y drivers para PostgreSQL.

    **jsonwebtoken: Implementación de autenticación basada en tokens JWT.

    **bcryptjs:** Encriptado seguro de contraseñas de usuarios.

    **multer / express-fileupload:** Gestión y control de carga de archivos en el servidor.

    **express-handlebars / hbs:** Motor de plantillas para las vistas dinámicas.

    **dotenv:** Manejo seguro de variables de entorno.

    **nodemon:** Entorno de desarrollo para reinicio automático del servidor.

## 🛠️ Configurar variables de entorno (.env)

Crea un archivo .env en la raíz del proyecto basándote en la siguient configuración:

```bash
   PORT=3000
   NODE_ENV=development

   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=tu_usuario
   DB_NAME=alke_wallet_db
   DB_PASS=tu_contraseña
   DB_DIALECT=postgres

   JWT_SECRET=tu_clave_secreta_jwt
```

## 🚀 Ejecutar la Aplicación

Modo Desarrollo (auto-reload con nodemon):

```bash
    npm run dev
```

Modo Producción:

```bash
    npm start
```

Servidor disponible en: http://localhost:3000

## 🚀 Ejemplos de Uso y Rutas (API REST & Vistas)

### 🔑 Autenticación y Gestión de Usuarios (userRoutes.js)

| Método     | Ruta               | Descripción                                               | Seguridad | Tipo de Respuesta |
| :--------- | :----------------- | :-------------------------------------------------------- | :-------- | :---------------- |
| **GET**    | `/orm-users`       | Obtiene todos los usuarios registrados mediante Sequelize | Pública   | JSON              |
| **GET**    | `/orm-users/:id`   | Obtiene usuario específico con sus relaciones anidadas    | Pública   | JSON              |
| **GET**    | `/balance/:id`     | Consulta el saldo asociado a un usuario                   | Pública   | JSON              |
| **POST**   | `/users`           | Registro de nuevo usuario con sus entidades asociadas     | Pública   | JSON              |
| **POST**   | `/login`           | Autenticación de usuario y generación de token JWT        | Pública   | JSON (Token)      |
| **PUT**    | `/users/:id/email` | Actualiza el correo electrónico del usuario               | 🔒 JWT    | JSON              |
| **PUT**    | `/users/:id/name`  | Actualiza el nombre del usuario                           | 🔒 JWT    | JSON              |
| **DELETE** | `/users/:id`       | Elimina un usuario por su ID                              | 🔒 JWT    | JSON              |

### 💸 Transacciones Financieras (apiRoutes.js)

| Método   | Ruta        | Descripción                                       | Seguridad | Tipo de Respuesta |
| :------- | :---------- | :------------------------------------------------ | :-------- | :---------------- |
| **POST** | `/transfer` | Ejecuta una transferencia de fondos entre cuentas | 🔒 JWT    | JSON              |
| **POST** | `/deposit`  | Realiza un depósito a la cuenta del usuario       | 🔒 JWT    | JSON              |

### 📁 Gestión de Archivos (documentRoutes.js)

| Método     | Ruta              | Descripción                             | Seguridad | Tipo de Respuesta |
| :--------- | :---------------- | :-------------------------------------- | :-------- | :---------------- |
| **POST**   | `/upload`         | Carga de archivos/documentos generales  | Pública   | JSON              |
| **POST**   | `/upload/avatar`  | Carga y actualización de foto de perfil | Pública   | JSON              |
| **DELETE** | `/upload/:nombre` | Elimina un archivo guardado por nombre  | Pública   | JSON              |

### 🖥️ Rutas de Interfaz Web (viewRoutes.js)

| Método  | Ruta         | Vista Renderizada | Descripción                             |
| :------ | :----------- | :---------------- | :-------------------------------------- |
| **GET** | `/`          | `home.hbs`        | Página principal / Landing              |
| **GET** | `/register`  | `register.hbs`    | Formulario de registro de usuario       |
| **GET** | `/login`     | `login.hbs`       | Formulario de inicio de sesión          |
| **GET** | `/dashboard` | `dashboard.hbs`   | Panel principal del usuario             |
| **GET** | `/deposit`   | `deposit.hbs`     | Formulario de depósito de dinero        |
| **GET** | `/transfer`  | `transfer.hbs`    | Formulario para realizar transferencias |

## 📁 Estructura del Proyecto

```
alke-wallet/
├── public/
│   ├── css/                     # Estilos CSS de la interfaz
│   └── js/                      # Lógica cliente (dashboard, login, transfer, etc.)
│
├── src/
│   ├── config/
│   │   └── database.js          # Configuración y conexión a PostgreSQL
│   │
│   ├── controllers/
│   │   ├── documentController.js# Control de carga y borrado de archivos
│   │   ├── userController.js    # Lógica de login y utilidades de usuario
│   │   ├── usersControllerORM.js# Operaciones CRUD sobre Usuario con Sequelize
│   │   └── walletController.js  # Lógica de depósitos y transferencias
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js    # Verificación de Token JWT en peticiones
│   │   ├── uploadMiddleware.js  # Filtrado de tipo y tamaño en archivos
│   │   └── validateInput.js     # Validaciones de cuerpo/payload de peticiones
│   │
│   ├── models/
│   │   ├── index.js             # Definición de relaciones y exportación de modelos
│   │   ├── Account.js           # Modelo de Cuenta
│   │   ├── Currency.js          # Modelo de Tipo de Moneda
│   │   ├── Transaction.js       # Modelo de Transacción
│   │   ├── User.js              # Modelo de Usuario
│   │   └── sync.js              # Sincronización del esquema de DB
│   │
│   ├── routes/
│   │   ├── apiRoutes.js         # Rutas protegidas para operaciones financieras
│   │   ├── documentRoutes.js    # Rutas para carga de archivos
│   │   ├── userRoutes.js        # Rutas de API REST para usuarios y auth
│   │   └── viewRoutes.js        # Rutas para el renderizado de plantillas Handlebars
│   │
│   ├── services/
│   │   └── documentService.js   # Manejo en sistema de archivos del servidor
│   │
│   ├── views/
│   │   ├── layouts/             # Layouts globales de Handlebars
│   │   ├── 404.hbs              # Vista de error
│   │   ├── dashboard.hbs        # Panel del usuario
│   │   ├── deposit.hbs          # Vista para depósito
│   │   ├── home.hbs             # Vista de inicio
│   │   ├── login.hbs            # Vista de inicio de sesión
│   │   ├── register.hbs         # Vista de registro
│   │   ├── transactions.hbs     # Historial de transacciones
│   │   └── transfer.hbs         # Vista para transferencias
│   │
│   └── app.js                   # Configuración global del servidor Express
│
├── uploads/                     # Directorio de almacenamiento de archivos públicos
├── .env                         # Variables de entorno (excluido de Git)
├── .gitignore
├── package.json                 # Dependencias y scripts de ejecución
└── README.md
```

## 🏛️ Justificación y Reflexión Técnica

Para proteger operaciones críticas en la aplicación (como transferencias, modificaciones de datos de usuario y eliminaciones),
se implementó un flujo de autenticación stateless mediante JWT:

    1. - El usuario realiza un POST /login proporcionando sus credenciales. Al autenticarse correctamente, el servidor firma un token codificando su ID.
    2. - En cada petición a rutas protegidas, el cliente envía el token en el encabezado Authorization: Bearer <token>.
    3. - El middleware authMiddleware.js intercepta la petición, valida la firma y vigila la fecha de expiración mediante jsonwebtoken.
         Si el token no está presente, es alterado o vence, la petición se detiene inmediatamente respondiendo con un status 401 Unauthorized o 403 Forbidden.

## 📂 Subida y Control de Archivos en Servidor

El manejo de uploads en documentRoutes.js se diseñó garantizando integridad y seguridad mediante uploadMiddleware.js:

    1. - Manejo de tipo de archivo: Se restringen las extensiones permitidas (ej. .png, .jpg, .jpeg) rechazando cualquier formato no autorizado.
    2. - Control de peso: Se estableció un límite estricto en el tamaño del archivo subido en bytes para prevenir saturaciones de almacenamiento en el servidor.
    3. - Persistencia: Los archivos aprobados se almacenan físicamente en el directorio público uploads/ y su ruta se vincula opcionalmente al modelo User como avatar.

## 🔗 Modelado de Relaciones con Sequelize ORM

Se implementó un esquema relacional para soportar el funcionamiento de la billetera digital:

    - Relación (1:1) User - Account: Cada usuario tiene asignada una cuenta bancaria/digital.
    - Relación (1:N) Account - Transaction: Una cuenta puede originar o recibir múltiples transacciones.
    - Relación (1:N) Currency - Account: Un tipo de moneda está asociado a múltiples cuentas.

## ⚡ Organización Modular (MVC y Capas)

Separar las responsabilidades en capas distintas (routes/, controllers/, middlewares/, models/ y services/) permitió:

    - Aislar el control de errores en middlewares específicos.
    - Reutilizar la lógica de persistencia y relaciones sin duplicación de código.
    - Escalar la API REST de forma totalmente independiente del motor de renderizado Handlebars.

## 📷 Screenshots y Evidencias de Funcionamiento

### Creación de Usuario completo con ORM

![Creación de Usuario completo con ORM](/images/user_create_orm.png)

### Eliminación de Usuario exitosa

![Eliminación de Usuario exitosa](/images/delete_user.png)

### Rechazo de petición por Token JWT erróneo o alterado

![Rechazo de petición por Token JWT erróneo o alterado](/images/invalid_token.png)

### Rechazo de petición por Token JWT expirado

![Rechazo de petición por Token JWT expirado](/images/expired_token.png)

### Éxito en Transferencia entre cuentas

![Éxito en Transferencia entre cuentas](/images/transfer_success.png)

## 🤖 Declaración de uso de IA y Referencias

**El desarrollo de este proyecto se fundamentó en los contenidos y requerimientos prácticos dictados en las clases del Bootcamp.**

Se utilizó Gemini (Google) como asistente de desarrollo para:

    - Revisión de lógica en middlewares de autenticación (JWT) y depuración del flujo de verificación.

    - Estructuración de endpoints RESTful bajo mejores prácticas.

    - Redacción y organización estructurada de la documentación técnica en Markdown para el archivo README.md.
