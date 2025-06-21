const ENDPOINT = `${window.BACKEND_URL}/api/productos`;

async function cargarProductos() {
  try {
    const resp = await fetch(ENDPOINT);
    if (!resp.ok) throw new Error("No se pudo cargar productos");
    const productos = await resp.json();

    const contenedor = document.getElementById("productos-contenedor");
    contenedor.innerHTML = "";

    if (!productos.length) {
      contenedor.innerHTML = "<p>No hay productos cargados.</p>";
      return;
    }

    productos.forEach((prod) => {
      const tarjeta = document.createElement("div");
      tarjeta.className = "tarjeta-producto";
      tarjeta.innerHTML = `
        <h3>${prod.Nombre}</h3>
        <div class="precio">$${parseFloat(prod.Precio).toFixed(2)}</div>
        <div class="descripcion">${prod.Descripcion || ""}</div>
        <div class="acciones">
          <a href="/editar_producto?id=${prod.Producto_ID}">
            <button>Editar</button>
          </a>
          <a href="/eliminarprod?id=${prod.Producto_ID}">
            <button class="eliminar">Eliminar</button>
          </a>
        </div>
      `;
      contenedor.appendChild(tarjeta);
    });
  } catch (err) {
    document.getElementById("productos-contenedor").innerHTML =
      "<p>Error cargando productos.</p>";
    console.error(err);
  }
}

window.onload = cargarProductos;
