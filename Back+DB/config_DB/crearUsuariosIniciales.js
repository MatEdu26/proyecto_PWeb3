const db = require('./db');
const bcrypt = require('bcryptjs');

async function crearUsuario(usuario, contraseña, rol) {
  const hash = await bcrypt.hash(contraseña, 10);
  await db.sql`INSERT INTO Usuarios (usuario, contraseña, rol) VALUES (${usuario}, ${hash}, ${rol})`;
  console.log(`Usuario ${usuario} creado`);
}

async function main() {
  await crearUsuario('admin', 'pass123', 'admin');
  await crearUsuario('empleado1', 'pass456', 'empleado');
  await crearUsuario('usuario1', 'pass789', 'usuario');
  process.exit();
}

main();
