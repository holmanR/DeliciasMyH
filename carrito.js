let carrito = [];

// Agregar producto tomando nombre y precio reales desde la card
function agregarDesdeCard(btn) {
  // Animación visual
  btn.classList.add("agregado");
  btn.textContent = "Agregado ✓";

  setTimeout(() => {
    btn.classList.remove("agregado");
    btn.textContent = "Agregar";
  }, 900);

  // Lógica del carrito
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
    carrito.push({
      nombre,
      precio,
      cantidad: 1
    });
  }

  renderCarrito();
}

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
          <strong class="item-nombre">${p.nombre}</strong>

          <div class="item-detalles">
            <span>Cantidad: ${p.cantidad}</span>
            <span>Subtotal: $${formatearPrecio(subtotal)}</span>
          </div>

          <div class="item-precio">
            Precio unitario: $${formatearPrecio(p.precio)}
          </div>
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


function toggleCarrito() {
  document.getElementById("carrito-panel").classList.toggle("activo");
  document.getElementById("overlay-carrito").classList.toggle("activo");
}

function enviarPedidoWhatsApp() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  const nombre = document.getElementById("nombreCliente").value.trim();
  const direccion = document.getElementById("direccionCliente").value.trim();
  const pago = document.getElementById("metodoPago").value;

  if (!nombre) {
    alert("Por favor ingresa tu nombre");
    return;
  }

  if (!direccion) {
    alert("Por favor ingresa la dirección de entrega");
    return;
  }

  if (!pago) {
    alert("Selecciona un método de pago");
    return;
  }

  let mensaje = `Hola, soy ${nombre} \n\n *MI PEDIDO*:\n`;
  let total = 0;

  carrito.forEach(producto => {
    mensaje += `• ${producto.nombre} x${producto.cantidad} = $${producto.precio * producto.cantidad}\n`;
    total += producto.precio * producto.cantidad;
  });

  mensaje += `\n *Total:* $${total}`;
  mensaje += `\n *Dirección:* ${direccion}`;
  mensaje += `\n *Pago:* ${pago}`;

  let telefono = "573216454377"; // TU NÚMERO
  let url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
}

function formatearPrecio(valor) {
  return valor.toLocaleString('es-CO');
}
