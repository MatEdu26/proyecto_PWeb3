const db = require("./db");

async function crearTablaUsuarios() {
  try {
    await db.sql(`CREATE TABLE IF NOT EXISTS Usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario VARCHAR(50) NOT NULL UNIQUE,
      contraseña VARCHAR(255) NOT NULL,
      rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'empleado', 'usuario')),
      creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    console.log("✅ Tabla 'Usuarios' verificada/creada");
  } catch (err) {
    console.error("❌ Error creando tabla Usuarios:", err);
  }
}

module.exports = crearTablaUsuarios;
