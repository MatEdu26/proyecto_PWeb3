async function cargarUsuario() {
  try {
    const res = await fetch(`${window.BACKEND_URL}/api/usuario`, { credentials: 'include' });
    if (!res.ok) throw new Error('No autorizado');
    const user = await res.json();

    const menuNav = document.getElementById('menu-nav');
    const userActions = document.getElementById('user-actions');

    if (user) {
      // Agregar link de gestión usuarios si es admin
      if (user.rol === 'admin') {
        const adminLink = document.createElement('a');
        adminLink.href = '/admin_usuarios'; // ruta limpia sin prefijo ni .html
        adminLink.textContent = 'Gestión de Usuarios';
        menuNav.appendChild(adminLink);
      }

      // Mostrar info de usuario y botón logout
      userActions.innerHTML = `
        <span class="user-info">Hola, ${user.usuario} (${user.rol})</span>
        <form id="logout-form" style="display:inline;">
          <button type="submit" class="btn-logout">Logout</button>
        </form>
      `;

      document.getElementById('logout-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await fetch(`${window.BACKEND_URL}/logout`, { method: 'POST', credentials: 'include' });
        window.location.href = '/login'; // ruta limpia sin prefijo ni .html
      });

    } else {
      // Mostrar botón login
      userActions.innerHTML = `<a href="/login" class="login-btn">Login</a>`; // ruta limpia
    }
  } catch (error) {
    const userActions = document.getElementById('user-actions');
    userActions.innerHTML = `<a href="/login" class="login-btn">Login</a>`; // ruta limpia
  }
}

cargarUsuario();
