// Obtener el ID del producto desde la URL (?id=)
const urlParams = new URLSearchParams(window.location.search);
const productoId = urlParams.get("id");

const productoInfoDiv = document.getElementById("producto-info");
const btnEliminar = document.getElementById("btn-eliminar");
const btnCancelar = document.getElementById("btn-cancelar");
const mensajeDiv = document.getElementById("mensaje");

// Función para cargar los datos del producto
async function cargarProductoParaEliminar() {
  if (!productoId) {
    productoInfoDiv.innerHTML = "<p>Error: ID de producto no especificado.</p>";
    btnEliminar.disabled = true; // Deshabilita el botón si no hay ID
    return;
  }

  try {
    const resp = await fetch(`/api/productos/${productoId}`, {
      credentials: "include",
    });

    if (!resp.ok) {
      if (resp.status === 404) {
        productoInfoDiv.innerHTML = "<p>Producto no encontrado.</p>";
      } else {
        throw new Error("No se pudo cargar la información del producto.");
      }
      btnEliminar.disabled = true;
      return;
    }

    const producto = await resp.json();
    productoInfoDiv.innerHTML = `
      <p>¿Estás seguro de que quieres eliminar el siguiente producto?</p>
      <p><strong>ID:</strong> ${producto.Producto_ID}</p>
      <p><strong>Nombre:</strong> ${producto.Nombre}</p>
      <p><strong>Precio:</strong> $${parseFloat(producto.Precio).toFixed(2)}</p>
      <p><strong>Descripción:</strong> ${producto.Descripcion || "N/A"}</p>
    `;
    btnEliminar.disabled = false;
  } catch (err) {
    productoInfoDiv.innerHTML = `<p class="error">${err.message}</p>`;
    btnEliminar.disabled = true;
  }
}

// Función para eliminar el producto
async function eliminarProducto() {
  try {
    const resp = await fetch(`/api/productos/${productoId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!resp.ok) {
      const errorData = await resp.json();
      throw new Error(errorData.error || "Error al eliminar producto.");
    }

    mensajeDiv.textContent = "Producto eliminado con éxito.";
    mensajeDiv.classList.add("exito");
    // Redirigir a la lista de productos después de un breve retraso
    setTimeout(() => {
      window.location.href = "/proyecto_PWeb3/Front/productos.html";
    }, 1500);
  } catch (err) {
    mensajeDiv.textContent = err.message;
    mensajeDiv.classList.add("error");
  }
}

// Event Listeners
btnEliminar.addEventListener("click", eliminarProducto);
btnCancelar.addEventListener("click", () => {
  window.location.href = "/proyecto_PWeb3/Front/productos.html";
});

// Cargar el producto al cargar la página
window.onload = cargarProductoParaEliminar;
