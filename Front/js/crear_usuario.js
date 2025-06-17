const form = document.getElementById("form-crear-usuario");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  mensaje.textContent = "";
  mensaje.className = "mensaje";

  const data = {
    usuario: form.usuario.value.trim(),
    contraseña: form.contraseña.value,
    rol: form.rol.value,
  };

  if (!data.usuario || !data.contraseña || !data.rol) {
    mensaje.textContent = "Por favor, complete todos los campos.";
    mensaje.classList.add("error");
    return;
  }

  try {
    const resp = await fetch("/api/admin/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await resp.json();

    if (!resp.ok) {
      const errorMsg = result.errores
        ? result.errores.map((e) => e.msg).join(", ")
        : result.error || "Error al crear usuario";
      throw new Error(errorMsg);
    }

    mensaje.textContent = "Usuario creado con éxito.";
    mensaje.classList.add("exito");
    form.reset();

    setTimeout(() => {
      window.location.href = "/proyecto_PWeb3/Front/admin_usuarios.html";
    }, 1500);
  } catch (err) {
    mensaje.textContent = err.message;
    mensaje.classList.add("error");
  }
});
