# Proyecto P-Web3

## Descripción

Este proyecto corresponde al backend, base de datos y frontend de la aplicación desarrollada para la materia **Programación Web 3** (1° Cuatrimestre 2025). El frontend está desarrollado con HTML, CSS y JavaScript estático, consumiendo la API REST del backend para gestionar productos y usuarios.

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

### Frontend

- Desarrollado con **HTML**, **CSS** y **JavaScript** puro, sin frameworks.
- Arquitectura basada en archivos estáticos que consumen la API REST del backend.
- Gestión completa de productos y usuarios desde interfaces amigables.
- Uso de fetch API para autenticación, autorización, creación, edición y eliminación.
- Manejo dinámico del menú y vistas según el rol del usuario (admin, empleado, usuario).
- Diseño responsivo y accesible, con validación y mensajes claros.

---

## Estructura del proyecto

- `index.js`: Archivo principal que configura el servidor, las rutas, middleware y la conexión a la base de datos.
- `/Front/`: Carpeta con los archivos estáticos del frontend (HTML, CSS, JS, imágenes).

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

6. Accede a las vistas frontend desde la carpeta `/Front/` (por ejemplo, `http://localhost:3000/proyecto_PWeb3/Front/index.html`).

---

*Gracias por revisar el proyecto.*
