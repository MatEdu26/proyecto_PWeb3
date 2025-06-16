const form = document.getElementById("form-crear-producto");
const mensaje = document.getElementById("mensaje");

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
    const resp = await fetch("/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!resp.ok) {
      const errorData = await resp.json();
      throw new Error(errorData.error || "Error al crear producto");
    }

    mensaje.textContent = "Producto creado con éxito.";
    mensaje.classList.add("exito");
    form.reset();
  } catch (err) {
    mensaje.textContent = err.message;
    mensaje.classList.add("error");
  }
});
