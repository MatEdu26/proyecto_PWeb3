# Proyecto P-Web3

## Descripción

Este proyecto corresponde al backend y base de datos de la aplicación desarrollada para la materia **Programación Web 3** (1° Cuatrimestre 2025). Actualmente, el frontend está en desarrollo y será incorporado próximamente.

---

## Tecnologías y dependencias utilizadas

### Backend

El backend está desarrollado con **Node.js** y utiliza el framework **Express** para crear un servidor web robusto y escalable.

| Dependencia              | Uso / Funcionalidad                                                                                  |
|-------------------------|----------------------------------------------------------------------------------------------------|
| `express`               | Framework para crear el servidor HTTP y manejar rutas.                                              |
| `body-parser`           | Middleware para parsear cuerpos de solicitudes HTTP en formato JSON.                                |
| `cookie-parser`         | Manejo de cookies en solicitudes y respuestas HTTP.                                                |
| `express-session`       | Gestión de sesiones para mantener estado entre peticiones.                                         |
| `express-rate-limit`    | Limita la cantidad de peticiones para mejorar la seguridad y evitar abusos.                        |
| `express-validator`     | Validación y sanitización de datos recibidos en las peticiones.                                    |
| `bcryptjs`              | Encriptación y comparación segura de contraseñas.                                                  |
| `jsonwebtoken`          | Implementación de tokens JWT para autenticación y autorización.                                    |
| `method-override`       | Permite usar métodos HTTP como PUT o DELETE en entornos que no los soportan nativamente.           |
| `morgan`                | Middleware para registrar las peticiones HTTP en la consola (logs).                               |
| `@sqlitecloud/drivers`  | Driver para conexión y manejo de la base de datos SQLite en la nube.                               |

### Base de datos

- **SQLite**: Base de datos ligera, integrada y fácil de usar para almacenamiento local y desarrollo rápido.

---

## Estructura del proyecto

- `index.js`: Archivo principal que configura el servidor, las rutas, middleware y la conexión a la base de datos.

---

## Cómo ejecutar el proyecto

1. Clona el repositorio:

git clone <https://github.com/MatEdu26/proyecto_PWeb3>


2. Entra a la carpeta del proyecto:

cd <proyecto_PWeb3>


3. Instala las dependencias:

npm install


4. Ejecuta el servidor:

node index.js


5. El servidor estará corriendo en `http://localhost:3000` (o el puerto configurado en `index.js`).

---

## Próximos pasos

- Desarrollo del frontend para consumir la API del backend.
- Mejoras en la seguridad y manejo de errores.

---

*Gracias por revisar el proyecto.*
