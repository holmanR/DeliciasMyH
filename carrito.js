let carrito = [];

// ==========================
// AGREGAR PRODUCTOS
// ==========================
function agregarDesdeCard(btn) {
  btn.classList.add("agregado");
  btn.textContent = "Agregado ✓";

  setTimeout(() => {
    btn.classList.remove("agregado");
    btn.textContent = "Comprar";
  }, 900);

  const card = btn.closest('.card');
  const nombre = card.querySelector('h3').innerText.trim();
  const precioTexto = card.querySelector('p').innerText;
  const precio = parseInt(precioTexto.replace(/[^0-9]/g, ''));

  agregarAlCarrito(nombre, precio);
}

function agregarAlCarrito(nombre, precio) {
  const item = carrito.find(p => p.nombre === nombre);

  if (item) {
    item.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }

  renderCarrito();
}

// ==========================
// MODIFICAR CANTIDADES
// ==========================
function cambiarCantidad(nombre, delta) {
  const item = carrito.find(p => p.nombre === nombre);
  if (!item) return;

  item.cantidad += delta;

  if (item.cantidad <= 0) {
    carrito = carrito.filter(p => p.nombre !== nombre);
  }

  renderCarrito();
}

function eliminarProducto(nombre) {
  carrito = carrito.filter(p => p.nombre !== nombre);
  renderCarrito();
}

// ==========================
// RENDER DEL CARRITO
// ==========================
function renderCarrito() {
  const contenedor = document.getElementById("items-carrito");
  const totalEl = document.getElementById("total-carrito");

  contenedor.innerHTML = "";
  let total = 0;

  carrito.forEach(p => {
    const subtotal = p.precio * p.cantidad;
    total += subtotal;

    contenedor.innerHTML += `
      <div class="item-carrito">
        <div class="item-info">
          <strong>${p.nombre}</strong>
          <div>Cantidad: ${p.cantidad}</div>
          <div>Subtotal: $${formatearPrecio(subtotal)}</div>
        </div>

        <div class="controles">
          <button onclick="cambiarCantidad('${p.nombre}', -1)">➖</button>
          <button onclick="cambiarCantidad('${p.nombre}', 1)">➕</button>
          <button onclick="eliminarProducto('${p.nombre}')">❌</button>
        </div>
      </div>
      <hr>
    `;
  });

  totalEl.textContent = '$' + formatearPrecio(total);
  document.getElementById("contador-carrito").textContent =
    carrito.reduce((acc, p) => acc + p.cantidad, 0);
}

// ==========================
// ABRIR / CERRAR CARRITO
// ==========================
function toggleCarrito() {
  document.getElementById("carrito-panel").classList.toggle("activo");
  document.getElementById("overlay-carrito").classList.toggle("activo");
}

// ==========================
// MODAL CLIENTE (ARREGLADO)
// ==========================
function abrirModalCliente() {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  // ABRIR MODAL
  document.getElementById("modalCliente").style.display = "block";

  // CERRAR CARRITO
  document.getElementById("carrito-panel").classList.remove("activo");
  document.getElementById("overlay-carrito").classList.remove("activo");

  // BLOQUEAR SCROLL
  document.body.style.overflow = "hidden";
}

function cerrarModalCliente() {
  document.getElementById("modalCliente").style.display = "none";

  // VOLVER A MOSTRAR CARRITO
  document.getElementById("carrito-panel").classList.add("activo");
  document.getElementById("overlay-carrito").classList.add("activo");

  // RESTAURAR SCROLL
  document.body.style.overflow = "auto";
}

// ==========================
// WHATSAPP
// ==========================
function enviarPedidoWhatsApp() {
  const nombre = document.getElementById("nombreCliente").value;
  const telefono = document.getElementById("telefonoCliente").value;
  const direccion = document.getElementById("direccionCliente").value;
  const nota = document.getElementById("notaCliente").value;

  if (!nombre || !telefono || !direccion) {
    alert("Por favor completa los datos obligatorios");
    return;
  }

  let mensaje = `*Pedido Delicias MyH* \n\n`;
  carrito.forEach(p => {
    mensaje += `• ${p.nombre} x${p.cantidad} = $${p.precio * p.cantidad}\n`;
  });

  mensaje += `\n *Cliente:* ${nombre}`;
  mensaje += `\n *Tel:* ${telefono}`;
  mensaje += `\n *Dirección:* ${direccion}`;
  if (nota) mensaje += `\n *Nota:* ${nota}`;

  const url = `https://wa.me/573216454377?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");

  cerrarModalCliente();
}

// ==========================
function formatearPrecio(valor) {
  return valor.toLocaleString('es-CO');
}

