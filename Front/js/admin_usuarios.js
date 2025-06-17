const tablaUsuarios = document
  .getElementById("usuarios-table")
  .querySelector("tbody");
const mensajeDiv = document.getElementById("mensaje");
const btnCrearUsuario = document.getElementById("btn-crear-usuario");

// Cargar usuarios
async function cargarUsuarios() {
  mensajeDiv.textContent = "";
  try {
    const resp = await fetch("/api/admin/usuarios", { credentials: "include" });
    if (!resp.ok) throw new Error("No se pudieron obtener los usuarios");
    const data = await resp.json();
    const usuarios = data.usuarios || [];
    tablaUsuarios.innerHTML = "";

    if (usuarios.length === 0) {
      tablaUsuarios.innerHTML =
        '<tr><td colspan="5" style="text-align:center;">No hay usuarios registrados.</td></tr>';
      return;
    }

    usuarios.forEach((u) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.id}</td>
        <td>${u.usuario}</td>
        <td>${u.rol}</td>
        <td>${new Date(u.creado_en).toLocaleString()}</td>
        <td class="acciones">
          <button data-id="${u.id}" class="eliminar-btn">Eliminar</button>
        </td>
      `;
      tablaUsuarios.appendChild(tr);
    });

    // Asignar eventos eliminar
    document.querySelectorAll(".eliminar-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = btn.getAttribute("data-id");
        if (confirm("¿Seguro que deseas eliminar este usuario?")) {
          await eliminarUsuario(id);
        }
      });
    });
  } catch (err) {
    mensajeDiv.textContent = err.message;
    mensajeDiv.classList.add("error");
  }
}

// Eliminar usuario
async function eliminarUsuario(id) {
  mensajeDiv.textContent = "";
  try {
    const resp = await fetch(`/api/admin/usuarios/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || "Error al eliminar usuario");
    mensajeDiv.textContent = data.mensaje;
    mensajeDiv.className = "mensaje exito";
    cargarUsuarios();
  } catch (err) {
    mensajeDiv.textContent = err.message;
    mensajeDiv.className = "mensaje error";
  }
}

// Redirigir a crear usuario
btnCrearUsuario.addEventListener("click", () => {
  window.location.href = "/proyecto_PWeb3/Front/crear_usuario.html";
});

// Inicializar
window.onload = cargarUsuarios;
