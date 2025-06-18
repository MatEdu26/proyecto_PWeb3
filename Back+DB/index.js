const http = require("http");
const express = require("express");
const app = express();
const path = require("path");
const db = require("./config_DB/db");
const crearTabla = require("./config_DB/initDB");
const crearTablaUsuarios = require("./config_DB/initUsers");
const { body, validationResult, param } = require("express-validator");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const methodOverride = require("method-override");
const { rateLimit } = require('express-rate-limit');
const JWT_SECRET = "clave_token";
const session = require("express-session");
const cors = require("cors");

app.use(
  session({
    secret: "tu_secreto_de_sesion", // cambia por algo seguro
    resave: false,
    saveUninitialized: false,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 peticiones por IP
  message: "Demasiadas peticiones desde esta IP. Intenta más tarde.",
});

const limiterLogin = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos de login por IP
  message: "Demasiados intentos de login. Intenta más tarde.",
});

const limiterCRUD = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Demasiadas operaciones. Intenta más tarde.",
});

app.use(limiter);

app.use(morgan("combined"));

crearTabla();
crearTablaUsuarios();

app.use('/proyecto_PWeb3/Front', express.static(path.join(__dirname, 'Front')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const corsOptions = {
  origin: ["http://localhost:5501", "http://127.0.0.1:5501"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // booleano, no string
};

app.use(cors(corsOptions));


app.listen(3000);
console.log("Servidor funcionando en el puerto 3000");

function autenticarJWT(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "No autorizado" });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido" });
    }
    req.user = user;
    next();
  });
}


app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

function cargarUsuario(req, res, next) {
  const token = req.cookies.token; // lee token desde cookie
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) req.user = user;
      next();
    });
  } else {
    next();
  }
}

app.use(cargarUsuario);

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

function autorizarRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ mensaje: "No tienes permisos" });
    }
    next();
  };
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Front", "index.html"));
});

app.get("/nosotros", (req, res) => {
  res.sendFile(path.join(__dirname, "Front", "nosotros.html"));
});

app.get("/productos", (req, res) => {
  res.sendFile(path.join(__dirname, "Front", "productos.html"));
});

app.get("/api/productos", async (req, res) => {
  try {
    const result = await db.sql("SELECT * FROM Productos ORDER BY Nombre");
    res.json(result);
  } catch (err) {
    console.error("🚨 Error obteniendo productos:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.post(
  "/api/productos",
  autenticarJWT,
  autorizarRoles("empleado", "admin"),
  limiterCRUD,
  [
    body("Nombre")
      .trim()
      .notEmpty()
      .withMessage("El nombre es obligatorio")
      .escape(),
    body("Precio")
      .notEmpty()
      .withMessage("El precio es obligatorio")
      .isFloat({ gt: 0 })
      .withMessage("El precio debe ser un número positivo"),
    body("Descripcion").trim().escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    const { Nombre, Precio, Descripcion } = req.body;

    try {
      await db.sql`INSERT INTO Productos (Nombre, Precio, Descripcion) VALUES (${Nombre}, ${Precio}, ${Descripcion})`;
      res.status(201).json({ mensaje: "Producto creado con éxito" });
    } catch (err) {
      console.error("Error creando producto:", err);
      res.status(500).json({ error: "Error al crear producto" });
    }
  }
);

app.get(
  "/api/productos/:id",
  autenticarJWT,
  autorizarRoles("empleado", "admin"),
  [param("id").isInt({ gt: 0 }).withMessage("ID inválido")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "ID inválido" });
    }
    try {
      const result =
        await db.sql`SELECT * FROM Productos WHERE Producto_ID = ${req.params.id}`;
      if (result.length === 0) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.json(result[0]);
    } catch (err) {
      console.error("📝 Error obteniendo producto:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

app.get(
  "/crear",
  autenticarJWT,
  autorizarRoles("empleado", "admin"),
  (req, res) => {
    res.sendFile(path.join(__dirname, "Front", "crear_producto.html"));
  }
);

app.put(
  "/api/productos/:id",
  autenticarJWT,
  autorizarRoles("empleado", "admin"),
  limiterCRUD,
  [
    body("Nombre")
      .trim()
      .notEmpty()
      .withMessage("El nombre es obligatorio")
      .escape(),
    body("Precio")
      .notEmpty()
      .withMessage("El precio es obligatorio")
      .isFloat({ gt: 0 })
      .withMessage("El precio debe ser un número positivo"),
    body("Descripcion").trim().escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    try {
      const result = await db.sql`
        UPDATE Productos 
        SET Nombre = ${req.body.Nombre}, Precio = ${req.body.Precio}, Descripcion = ${req.body.Descripcion} 
        WHERE Producto_ID = ${req.params.id}
      `;
      res.json({ mensaje: "Producto actualizado con éxito" });
    } catch (err) {
      console.error("✏️ Error actualizando producto:", err);
      res.status(500).json({ error: "Error al actualizar producto" });
    }
  }
);

app.get(
  "/editar/:id",
  autenticarJWT,
  autorizarRoles("empleado", "admin"),
  [param("id").isInt({ gt: 0 }).withMessage("ID inválido")],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send("ID inválido");
    }
    res.sendFile(path.join(__dirname, "Front", "editar_producto.html"));
  }
);

app.delete(
  "/api/productos/:id",
  autenticarJWT,
  autorizarRoles("empleado", "admin"),
  limiterCRUD,
  [param("id").isInt({ gt: 0 }).withMessage("ID inválido")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    try {
      const result =
        await db.sql`DELETE FROM Productos WHERE Producto_ID = ${req.params.id}`;
      if (result.rowsAffected === 0) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.status(200).json({ mensaje: "Producto eliminado con éxito" });
    } catch (err) {
      console.error("🗑️ Error eliminando producto:", err);
      res.status(500).json({ error: "Error al eliminar producto" });
    }
  }
);

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "Front", "login.html"));
});

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

app.post("/login", limiterLogin, async (req, res) => {
  const { usuario, contraseña } = req.body;

  // Validar campos (puedes usar express-validator o manualmente)
  if (!usuario || !contraseña) {
    return res
      .status(400)
      .json({ errores: [{ msg: "Usuario y contraseña son obligatorios" }] });
  }

  try {
    const user =
      await db.sql`SELECT * FROM Usuarios WHERE usuario = ${usuario}`;

    if (!user[0]) {
      return res
        .status(401)
        .json({ errores: [{ msg: "Usuario o contraseña incorrectos" }] });
    }

    const match = await bcrypt.compare(contraseña, user[0].contraseña);
    if (!match) {
      return res
        .status(401)
        .json({ errores: [{ msg: "Usuario o contraseña incorrectos" }] });
    }

    const token = jwt.sign(
      { usuario: user[0].usuario, rol: user[0].rol },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Cambiar a true si usas HTTPS
      sameSite: "lax",
      maxAge: 2 * 60 * 60 * 1000,
    });

    return res.status(200).json({ mensaje: "Login exitoso" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ errores: [{ msg: "Error interno del servidor" }] });
  }
});

app.get("/api/usuario", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json(null);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json(null);
    res.json({ usuario: user.usuario, rol: user.rol });
  });
});

app.get(
  "/api/admin/usuarios",
  autenticarJWT,
  autorizarRoles("admin"),
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      const totalUsuarios = (
        await db.sql`SELECT COUNT(*) as count FROM Usuarios`
      )[0].count;
      const usuarios =
        await db.sql`SELECT id, usuario, rol, creado_en FROM Usuarios ORDER BY usuario LIMIT ${limit} OFFSET ${offset}`;

      const totalPages = Math.ceil(totalUsuarios / limit);

      res.json({ usuarios, page, totalPages });
    } catch (err) {
      console.error("Error obteniendo usuarios:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

app.post(
  "/api/admin/usuarios",
  autenticarJWT,
  autorizarRoles("admin"),
  [
    body("usuario")
      .trim()
      .notEmpty()
      .withMessage("Usuario es obligatorio")
      .escape(),
    body("contraseña").notEmpty().withMessage("Contraseña es obligatoria"),
    body("rol")
      .isIn(["admin", "empleado", "usuario"])
      .withMessage("Rol inválido"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    try {
      const hash = await bcrypt.hash(req.body.contraseña, 10);
      await db.sql`INSERT INTO Usuarios (usuario, contraseña, rol) VALUES (${req.body.usuario}, ${hash}, ${req.body.rol})`;
      res.status(201).json({ mensaje: "Usuario creado correctamente" });
    } catch (err) {
      console.error("Error creando usuario:", err);
      res.status(500).json({ error: "Error al crear usuario" });
    }
  }
);

app.delete(
  "/api/admin/usuarios/:id",
  autenticarJWT,
  autorizarRoles("admin"),
  async (req, res) => {
    try {
      const usuarioEliminar = (
        await db.sql`SELECT usuario FROM Usuarios WHERE id = ${req.params.id}`
      )[0];

      if (!usuarioEliminar) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      if (req.user.usuario === usuarioEliminar.usuario) {
        return res
          .status(400)
          .json({ error: "No puedes eliminar tu propio usuario" });
      }

      await db.sql`DELETE FROM Usuarios WHERE id = ${req.params.id}`;
      res.json({ mensaje: "Usuario eliminado correctamente" });
    } catch (err) {
      console.error("Error eliminando usuario:", err);
      res.status(500).json({ error: "Error al eliminar usuario" });
    }
  }
);

//este metodo siempre debe ir al final
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "Front", "404.html"));
});
