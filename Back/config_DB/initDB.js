const db = require('./db');

async function crearTabla() {
  try {
    await db.sql(`CREATE TABLE IF NOT EXISTS Productos(
      Producto_ID INTEGER PRIMARY KEY AUTOINCREMENT,
      Nombre VARCHAR(100) NOT NULL,
      Precio REAL NOT NULL,
      Descripcion TEXT
    )`);
    console.log("✅ Tabla 'Productos' verificada/creada");
  } catch (err) {
    console.error("❌ Error creando tabla:", err);
  }
}

module.exports = crearTabla;
