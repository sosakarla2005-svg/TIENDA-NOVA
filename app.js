
const PRODUCTS_DATA = [
  {id:1,name:"Bolso Klip Xtreme Capri KLB-461GR",category:"Accesorios",price:1099,stock:10,image:"imagenes/Bolso_Klip_Capri.png",description:"Bolso gris/blanco para laptop de 15.6 pulgadas."},
  {id:2,name:"Cable HDMI plano Xtech XTC-406",category:"Accesorios",price:279,stock:15,image:"imagenes/Cable_HDMI_Xtech.png",description:"Full HD, 1.8 metros, diseño plano."},
  {id:3,name:"Cable Klip Xtreme KAC-250 USB-C",category:"Accesorios",price:249,stock:10,image:"imagenes/Cable_USB_C_Klip.png",description:"USB-C a USB-C, 60 W, trenzado, 1.8 metros."},
  {id:4,name:"Laptop ASUS Vivobook 14",category:"Laptops",price:22999,stock:6,image:"imagenes/ASUS_Vivobook_14.png",description:"Intel Core 5 120U, 16 GB RAM, SSD 512 GB, Windows 11."},
  {id:5,name:"Laptop Dell Pro 14",category:"Laptops",price:38899,stock:3,image:"imagenes/Laptop_Dell_Pro_14.png",description:"Core Ultra 5 235U, 16 GB RAM, SSD 512 GB, Windows 11 Pro."},
  {id:6,name:"Laptop Dell Pro 14 Plus PB14250",category:"Laptops",price:55699,stock:3,image:"imagenes/Laptop_Dell_Pro_14_Plus.png",description:"Core Ultra 7 266V vPro, 16 GB RAM, SSD 512 GB."},
  {id:7,name:"Laptop HP Victus 15-fb3020la",category:"Laptops",price:52099,stock:5,image:"imagenes/Laptop_HP_Victus_15.png",description:"Ryzen 7 7445HS, RTX 3050 6 GB, 16 GB RAM, SSD 512 GB, 144 Hz."},
  {id:8,name:"Access Point Cambium XV2-2X",category:"Redes",price:3399,stock:10,image:"imagenes/Access_Point_Cambium.png",description:"Wi-Fi 6, 2×2, interior, conexión 2.5 GbE."},
  {id:9,name:"Teléfono IP Grandstream GRP2634",category:"Redes",price:3199,stock:20,image:"imagenes/Telefono_Grandstream.png",description:"8 líneas, 12 cuentas SIP, Wi-Fi 6 y Bluetooth."},
  {id:10,name:"Tablet Lenovo Idea Tab TB336FU",category:"Tablets",price:9099,stock:10,image:"imagenes/Tablet_Lenovo_Idea_Tab.png",description:"11 pulgadas 2.5K, 8 GB RAM, 128 GB, lápiz y funda."},
  {id:11,name:"Cargador Targus APA107BT",category:"Accesorios",price:1399,stock:10,image:"imagenes/Cargador_Targus_65W.png",description:"65 W, USB-C, Power Delivery 3.0."},
  {id:12,name:"Mochila Klip Xtreme XpandPack KNB-650BK",category:"Accesorios",price:1199,stock:30,image:"imagenes/Mochila_Klip_XpandPack.png",description:"Para laptop 15.6 pulgadas, expandible, diseño antirrobo."},
  {id:13,name:"Audífonos JBL Tune 520C",category:"Audio",price:1099,stock:10,image:"imagenes/Audifonos_JBL_Tune_520C.png",description:"On-ear con cable USB-C, Hi-Res Audio, negro."},
  {id:14,name:"UPS APC Easy UPS BV1000",category:"Energía",price:3099,stock:8,image:"imagenes/UPS_APC_Easy.png",description:"1000 VA / 600 W, 120 V, regulación AVR."},
  {id:15,name:"Router MikroTik hEX RB750Gr3",category:"Redes",price:2299,stock:10,image:"imagenes/Router_MikroTik_hEX.png",description:"5 puertos Gigabit, doble núcleo 880 MHz, USB y microSD."},
  {id:16,name:"Adaptador Dell DA305",category:"Accesorios",price:3199,stock:10,image:"imagenes/Adaptador_Dell_DA305.png",description:"Adaptador multipuerto USB-C, 6 en 1."}
];

const products = PRODUCTS_DATA;
const WHATSAPP_NUMBER = "50432283197";

const DELIVERY_RATES = {
  "Atlántida":180,"Choluteca":160,"Colón":180,
  "Comayagua":130,"Copán":190,"Cortés":150,
  "El Paraíso":120,"Francisco Morazán":120,
  "Gracias a Dios":300,"Intibucá":190,
  "Islas de la Bahía":300,"La Paz":160,
  "Lempira":220,"Ocotepeque":220,"Olancho":100,
  "Santa Bárbara":170,"Valle":160,"Yoro":170
};

const $ = id => document.getElementById(id);
const money = n => "L " + Number(n).toLocaleString("es-HN", {
  minimumFractionDigits:2,
  maximumFractionDigits:2
});
const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",
  '"':"&quot;","'":"&#39;"
}[c]));

let cart = {};
try {
  cart = JSON.parse(localStorage.getItem("tiendanova_cart_v1") || "{}") || {};
} catch (e) {
  cart = {};
}

for (const id of Object.keys(cart)) {
  const p = products.find(x => x.id === Number(id));
  if (!p) delete cart[id];
  else cart[id] = Math.max(0, Math.min(p.stock, Number(cart[id]) || 0));
}

const shipSelect = $("shipDepartment");
const cityInput = $("shipCity");

try {
  if (shipSelect) shipSelect.value = localStorage.getItem("tn_ship_dept") || "";
  if (cityInput) cityInput.value = localStorage.getItem("tn_ship_city") || "";
} catch (e) {}

function openTiendaNovaWhatsApp(message, destination = WHATSAPP_NUMBER) {
  const number = String(destination).replace(/\D/g, "");
  if (!number) {
    alert("No se ha configurado un número de WhatsApp.");
    return;
  }
  const url = "https://wa.me/" + number +
    "?text=" + encodeURIComponent(message);
  window.location.assign(url);
}

function getEntries() {
  return Object.entries(cart).filter(([id, qty]) =>
    Number(qty) > 0 && products.some(p => p.id === Number(id))
  );
}

function deliveryTotals() {
  const entries = getEntries();
  const subtotal = entries.reduce((sum, [id, qty]) => {
    const p = products.find(x => x.id === Number(id));
    return sum + p.price * Number(qty);
  }, 0);

  const dept = shipSelect ? shipSelect.value : "";
  const city = cityInput ? cityInput.value.trim() : "";

  let shipping = null;
  if (!entries.length) shipping = 0;
  else if (subtotal >= 10000) shipping = 0;
  else if (Object.prototype.hasOwnProperty.call(DELIVERY_RATES, dept)) {
    shipping = DELIVERY_RATES[dept];
  }

  return {
    entries,
    subtotal,
    shipping,
    grand: shipping === null ? null : subtotal + shipping,
    dept,
    city
  };
}

function save() {
  try {
    localStorage.setItem("tiendanova_cart_v1", JSON.stringify(cart));
  } catch (e) {}
  renderCart();
}

function getBrand(p) {
  const brands = [
    "ASUS","Dell","HP","Lenovo","JBL","Klip Xtreme",
    "Xtech","Cambium","Grandstream","Targus","APC","MikroTik"
  ];
  return brands.find(b =>
    p.name.toLowerCase().includes(b.toLowerCase())
  ) || "Otra marca";
}

function renderProducts() {
  const search = ($("search")?.value || "").toLowerCase().trim();
  const category = $("category")?.value || "";
  const sort = $("sort")?.value || "";
  const brand = $("brand")?.value || "";
  const range = $("priceRange")?.value || "";
  const availability = $("availability")?.value || "";

  let list = products.filter(p => {
    if (category && p.category !== category) return false;
    if (brand && getBrand(p) !== brand) return false;
    if (availability === "available" && p.stock <= 0) return false;
    if (availability === "soldout" && p.stock > 0) return false;

    if (range === "under500" && p.price >= 500) return false;
    if (range === "500to3000" && (p.price < 500 || p.price > 3000)) return false;
    if (range === "3000to10000" && (p.price <= 3000 || p.price > 10000)) return false;
    if (range === "over10000" && p.price <= 10000) return false;

    return (p.name + " " + p.description).toLowerCase().includes(search);
  });

  if (sort === "low") list.sort((a,b) => a.price - b.price);
  if (sort === "high") list.sort((a,b) => b.price - a.price);
  if (sort === "name") list.sort((a,b) => a.name.localeCompare(b.name, "es"));

  $("results").textContent = list.length + " productos";
  $("empty").hidden = list.length > 0;

  $("products").innerHTML = list.map(p => `
    <article class="product">
      <div class="product-image">
        <img loading="lazy" src="${p.image}" alt="Imagen ilustrativa de ${escapeHtml(p.name)}">
      </div>
      <div class="product-body">
        <span class="category">${escapeHtml(p.category)}</span>
        <h3>${escapeHtml(p.name)}</h3>
        <p class="desc">${escapeHtml(p.description)}</p>
        <div class="stock">${p.stock > 0 ? "● Disponible · " + p.stock + " unidades" : "● Agotado"}</div>
        <div class="price">${money(p.price)}</div>
        <button class="add" type="button" data-add="${p.id}" ${p.stock <= 0 ? "disabled" : ""}>＋ Agregar al carrito</button>
        <button class="wa-product" type="button" data-wa-product="${p.id}">✆ Pedir por WhatsApp</button>
        <button class="details-btn" type="button" data-detail="${p.id}">Ver características →</button>
      </div>
    </article>
  `).join("");
}

function renderCart() {
  const t = deliveryTotals();
  const count = t.entries.reduce((sum, [, qty]) => sum + Number(qty), 0);

  if ($("cartCount")) $("cartCount").textContent = count;
  if ($("cartTitleCount")) $("cartTitleCount").textContent = "(" + count + ")";

  $("cartItems").innerHTML = t.entries.length
    ? t.entries.map(([id, qty]) => {
        const p = products.find(x => x.id === Number(id));
        return `
          <div class="cart-item">
            <img src="${p.image}" alt="">
            <div>
              <h4>${escapeHtml(p.name)}</h4>
              <span class="unit-price">Precio unitario: ${money(p.price)} · Cantidad: ${qty}</span>
              <strong class="line-total">Subtotal: ${money(p.price * qty)}</strong>
              <div class="qty">
                <button data-minus="${id}" aria-label="Reducir cantidad">−</button>
                <span>${qty}</span>
                <button data-plus="${id}" aria-label="Aumentar cantidad">+</button>
                <button class="remove" data-remove="${id}">Quitar</button>
              </div>
            </div>
          </div>`;
      }).join("")
    : "<p>Tu carrito está vacío. ¡Explora el catálogo!</p>";

  if ($("cartSubtotal")) $("cartSubtotal").textContent = money(t.subtotal);

  if ($("cartShipping")) {
    $("cartShipping").textContent = !t.entries.length
      ? money(0)
      : t.shipping === null
        ? "Selecciona departamento"
        : t.shipping === 0 ? "GRATIS" : money(t.shipping);
  }

  if ($("cartTotal")) {
    $("cartTotal").textContent = t.grand === null
      ? "Pendiente de destino"
      : money(t.grand);
  }

  if ($("checkout")) $("checkout").disabled = !t.entries.length;
  if ($("copyOrder")) $("copyOrder").disabled = !t.entries.length;

  if ($("shippingProgressBar")) {
    $("shippingProgressBar").style.width =
      Math.min(100, t.subtotal / 10000 * 100) + "%";
  }

  if ($("shippingProgressText")) {
    $("shippingProgressText").textContent = t.subtotal >= 10000
      ? "¡Tu carrito supera el mínimo de referencia para envío gratis!"
      : "Subtotal de productos: " + money(t.subtotal);
  }

  if ($("shippingRemaining")) {
    const remaining = Math.max(0, 10000 - t.subtotal);
    $("shippingRemaining").textContent = remaining > 0
      ? "Faltan " + money(remaining) + " para el envío gratis."
      : "Envío gratis de demostración.";
  }

  updateQuote();
  return t;
}

function updateQuote() {
  const preview = $("shipDepartmentPreview");
  if (preview && shipSelect) preview.value = shipSelect.value;

  const result = $("shippingQuoteResult");
  if (!result) return;

  const t = deliveryTotals();

  if (!t.dept) {
    result.textContent = "Selecciona un departamento para ver el costo de envío.";
  } else if (t.subtotal >= 10000 && t.entries.length) {
    result.textContent = "Envío a " + t.dept + ": GRATIS.";
  } else if (Object.prototype.hasOwnProperty.call(DELIVERY_RATES, t.dept)) {
    result.textContent = "Envío a " + t.dept + ": " +
      money(DELIVERY_RATES[t.dept]) + ". Tarifa referencial.";
  } else {
    result.textContent = "Selecciona un departamento válido.";
  }
}

function add(id) {
  const p = products.find(x => x.id === Number(id));
  if (!p) return;

  if ((cart[id] || 0) >= p.stock) {
    alert("No hay más unidades disponibles de este producto.");
    return;
  }

  cart[id] = (Number(cart[id]) || 0) + 1;
  save();
  openCart();
}

function openCart() {
  $("cartPanel")?.classList.add("open");
  $("cartPanel")?.setAttribute("aria-hidden", "false");
  if ($("overlay")) $("overlay").hidden = false;
}

function closeCart() {
  $("cartPanel")?.classList.remove("open");
  $("cartPanel")?.setAttribute("aria-hidden", "true");
  if ($("overlay")) $("overlay").hidden = true;
}

function validateOrder() {
  const t = deliveryTotals();

  if (!t.entries.length) {
    alert("Agrega un producto al carrito.");
    return false;
  }
  if (!t.dept || !Object.prototype.hasOwnProperty.call(DELIVERY_RATES, t.dept)) {
    alert("Selecciona el departamento de entrega.");
    shipSelect?.focus();
    return false;
  }
  if (!t.city) {
    alert("Escribe el municipio de entrega.");
    cityInput?.focus();
    return false;
  }
  return true;
}

function orderText() {
  const t = deliveryTotals();

  const lines = t.entries.map(([id, qty]) => {
    const p = products.find(x => x.id === Number(id));
    return "• " + p.name +
      "\n  Cantidad: " + qty +
      "\n  Precio unitario: " + money(p.price) +
      "\n  Importe: " + money(p.price * qty);
  });

  return [
    "¡Hola! Pedido de TiendaNova - Grupo 1",
    "",
    ...lines,
    "",
    "Subtotal de productos: " + money(t.subtotal),
    "Departamento: " + t.dept,
    "Municipio: " + t.city,
    "Costo de envío: " + (t.shipping === 0 ? "GRATIS" : money(t.shipping)),
    "TOTAL A PAGAR: " + money(t.grand),
    "",
    "Por favor, confirmar dirección y entrega.",
    "Pedido de demostración académica; no constituye una compra real."
  ].join("\n");
}

function shareOrder() {
  if (!validateOrder()) return;
  openTiendaNovaWhatsApp(orderText());
}

function openProductDetail(id) {
  const p = products.find(x => x.id === Number(id));
  const dialog = $("productDialog");
  if (!p || !dialog || !$("modalContent")) return;

  $("modalContent").innerHTML = `
    <div class="modal-grid">
      <img src="${p.image}" alt="Imagen ilustrativa de ${escapeHtml(p.name)}">
      <div>
        <span class="category">${escapeHtml(p.category)}</span>
        <h2>${escapeHtml(p.name)}</h2>
        <p>${escapeHtml(p.description)}</p>
        <p>Existencias de demostración: <strong>${p.stock} unidades</strong></p>
        <div class="modal-price">${money(p.price)}</div>
        <p style="font-size:12px">Precio de referencia del proyecto académico.</p>
        <button class="modal-add" type="button" data-add="${p.id}">＋ Agregar al carrito</button>
      </div>
    </div>`;

  dialog.showModal();
}

function answer(q) {
  const s = q.toLowerCase();

  if (/hola|buenas|saludos/.test(s))
    return "¡Hola! Puedo ayudarte con productos, precios, inventario, carrito y entregas.";

  if (/garant[ií]a|devoluci[oó]n/.test(s))
    return "Las condiciones de garantía deben confirmarse con la tienda antes de una compra real.";

  if (/soporte|problema|ayuda t[eé]cnica/.test(s))
    return "Puedes consultar las características del producto o utilizar WhatsApp para solicitar orientación.";

  if (/env[ií]o|entrega|domicilio/.test(s))
    return "Selecciona tu departamento y municipio en el carrito. El costo del envío se suma al subtotal. Envío gratis desde L 10,000 en esta demostración.";

  if (/pago|tarjeta|transferencia|financiamiento/.test(s))
    return "Esta tienda es una demostración académica y no procesa pagos reales.";

  if (/carrito|comprar|pedido|whatsapp/.test(s))
    return "Agrega productos, selecciona el destino y pulsa Compartir pedido por WhatsApp.";

  if (/stock|inventario|disponible/.test(s))
    return "Cada producto muestra su inventario de demostración.";

  const matches = products.filter(p =>
    (p.name + " " + p.category).toLowerCase().split(" ")
      .some(w => w.length > 3 && s.includes(w))
  );

  if (matches.length) {
    return matches.slice(0,3).map(p =>
      p.name + ": " + money(p.price) + " (" + p.stock + " unidades)."
    ).join(" ");
  }

  return "Puedes consultar productos, envíos, garantías, soporte técnico y pedidos.";
}

function bubble(text, type) {
  const d = document.createElement("div");
  d.className = "bubble " + type;
  d.textContent = text;
  $("chatMessages").appendChild(d);
  $("chatMessages").scrollTop = $("chatMessages").scrollHeight;
}

function initialize() {
  if ($("category")) {
    $("category").innerHTML += [...new Set(products.map(p => p.category))]
      .sort().map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  }

  if ($("brand")) {
    $("brand").innerHTML += [...new Set(products.map(getBrand))]
      .sort().map(b => `<option value="${escapeHtml(b)}">${escapeHtml(b)}</option>`).join("");
  }

  ["search","category","sort","brand","priceRange","availability"].forEach(id => {
    const el = $(id);
    if (el) el.addEventListener(id === "search" ? "input" : "change", renderProducts);
  });

  if ($("resetFilters")) {
    $("resetFilters").onclick = () => {
      ["search","category","sort","brand","priceRange","availability"].forEach(id => {
        if ($(id)) $(id).value = "";
      });
      renderProducts();
    };
  }

  document.addEventListener("click", e => {
    const addButton = e.target.closest("[data-add]");
    const plus = e.target.closest("[data-plus]");
    const minus = e.target.closest("[data-minus]");
    const remove = e.target.closest("[data-remove]");
    const wa = e.target.closest("[data-wa-product]");
    const detail = e.target.closest("[data-detail]");

    if (addButton) {
      add(Number(addButton.dataset.add));
      if (addButton.closest("#modalContent")) $("productDialog")?.close();
    }

    if (plus) add(Number(plus.dataset.plus));

    if (minus) {
      const id = minus.dataset.minus;
      cart[id] = Math.max(0, (Number(cart[id]) || 0) - 1);
      save();
    }

    if (remove) {
      delete cart[remove.dataset.remove];
      save();
    }

    if (detail) openProductDetail(Number(detail.dataset.detail));

    if (wa) {
      const p = products.find(x => x.id === Number(wa.dataset.waProduct));
      if (p) {
        const message =
          "Hola, deseo consultar este producto de TiendaNova:\n\n" +
          p.name + "\n" +
          "Precio: " + money(p.price) + "\n" +
          "Disponibilidad: " + p.stock + " unidades.\n\n" +
          "¿Podrían darme más información?\n\n" +
          "Consulta de demostración académica.";
        openTiendaNovaWhatsApp(message);
      }
    }
  });

  if ($("cartToggle")) $("cartToggle").onclick = openCart;
  if ($("cartClose")) $("cartClose").onclick = closeCart;
  if ($("overlay")) $("overlay").onclick = closeCart;

  if ($("clearCart")) {
    $("clearCart").onclick = () => {
      cart = {};
      save();
    };
  }

  if ($("checkout")) $("checkout").onclick = shareOrder;

  if ($("copyOrder")) {
    $("copyOrder").onclick = async () => {
      if (!validateOrder()) return;
      const message = orderText();
      try {
        await navigator.clipboard.writeText(message);
        alert("Pedido copiado. Puedes compartirlo con tu cliente.");
      } catch (e) {
        prompt("Copia el pedido:", message);
      }
    };
  }

  if (shipSelect) {
    shipSelect.addEventListener("change", () => {
      try { localStorage.setItem("tn_ship_dept", shipSelect.value); } catch (e) {}
      renderCart();
    });
  }

  if (cityInput) {
    cityInput.addEventListener("input", () => {
      try { localStorage.setItem("tn_ship_city", cityInput.value); } catch (e) {}
      renderCart();
    });
  }

  if ($("shipDepartmentPreview")) {
    $("shipDepartmentPreview").addEventListener("change", e => {
      if (shipSelect) {
        shipSelect.value = e.target.value;
        shipSelect.dispatchEvent(new Event("change"));
      }
    });
  }

  if ($("shippingQuoteCart")) $("shippingQuoteCart").onclick = openCart;

  if ($("modalClose")) $("modalClose").onclick = () => $("productDialog")?.close();

  if ($("productDialog")) {
    $("productDialog").addEventListener("click", e => {
      if (e.target === $("productDialog")) $("productDialog").close();
    });
  }

  if ($("chatToggle")) $("chatToggle").onclick = () => {
    $("chat").hidden = !$("chat").hidden;
  };

  if ($("chatClose")) $("chatClose").onclick = () => {
    $("chat").hidden = true;
  };

  if ($("chatForm")) {
    $("chatForm").onsubmit = e => {
      e.preventDefault();
      const input = $("chatInput");
      const message = input.value.trim();
      if (!message) return;
      bubble(message, "human");
      bubble(answer(message), "bot");
      input.value = "";
    };
  }

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeCart();
      if ($("chat")) $("chat").hidden = true;
    }
  });

  if ($("year")) $("year").textContent = new Date().getFullYear();

  renderProducts();
  renderCart();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}
