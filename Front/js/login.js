document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const errorDiv = document.getElementById('error-messages');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.style.display = 'none';
    errorDiv.innerHTML = '';

    const usuario = form.usuario.value.trim();
    const contraseña = form.contraseña.value;

    if (!usuario || !contraseña) {
      errorDiv.style.display = 'block';
      errorDiv.textContent = 'Por favor, completa todos los campos.';
      return;
    }

    try {
      const response = await fetch(`${window.BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contraseña }),
        credentials: 'include' // para enviar cookies
      });

      if (response.ok) {
        // Login exitoso, redirigir a inicio
        window.location.href = '/'; // ruta limpia
      } else if (response.status === 401) {
        const data = await response.json();
        errorDiv.style.display = 'block';
        errorDiv.textContent = data.errores ? data.errores.map(e => e.msg).join(', ') : 'Usuario o contraseña incorrectos';
      } else {
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Error en el servidor, intenta más tarde.';
      }
    } catch (error) {
      errorDiv.style.display = 'block';
      errorDiv.textContent = 'Error de conexión, intenta más tarde.';
    }
  });
});
