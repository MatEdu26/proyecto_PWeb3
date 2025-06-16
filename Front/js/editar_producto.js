// Obtener el ID del producto desde la URL (?id=)
const urlParams = new URLSearchParams(window.location.search);
const productoId = urlParams.get("id");

const form = document.getElementById("form-editar-producto");
const mensaje = document.getElementById("mensaje");

if (!productoId) {
  mensaje.textContent = "ID de producto no especificado.";
  mensaje.classList.add("error");
} else {
  // Cargar datos del producto para editar
  async function cargarProducto() {
    try {
      const resp = await fetch(`/api/productos/${productoId}`, {
        credentials: "include",
      });
      if (!resp.ok) throw new Error("No se pudo cargar el producto.");
      const producto = await resp.json();

      form.nombre.value = producto.Nombre || "";
      form.precio.value = producto.Precio || "";
      form.descripcion.value = producto.Descripcion || "";
    } catch (err) {
      mensaje.textContent = err.message;
      mensaje.classList.add("error");
    }
  }

  cargarProducto();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    mensaje.textContent = "";
    mensaje.className = "mensaje";

    const data = {
      Nombre: form.nombre.value.trim(),
      Precio: parseFloat(form.precio.value),
      Descripcion: form.descripcion.value.trim(),
    };

    if (!data.Nombre || isNaN(data.Precio) || data.Precio < 0) {
      mensaje.textContent = "Por favor, complete los campos correctamente.";
      mensaje.classList.add("error");
      return;
    }

    try {
      const resp = await fetch(`/api/productos/${productoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.error || "Error al actualizar producto");
      }

      mensaje.textContent = "Producto actualizado con éxito.";
      mensaje.classList.add("exito");
    } catch (err) {
      mensaje.textContent = err.message;
      mensaje.classList.add("error");
    }
  });
}
