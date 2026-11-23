
/* ==========================================
   INVITACIÓN DE GRADUACIÓN UNIVERSITARIA
   ABRAHM TELIS — 17 DE DICIEMBRE DE 2026
========================================== */

/* 1. CONFIGURACIÓN DEL EVENTO */

const invitacion = {
  nombre: "Abrahm Telis",

  // Completar cuando confirmen la hora.
  // Ejemplo: "2026-12-17T17:00:00-06:00"
  fechaISO: "2026-12-17T19:00:00-06:00",

  fechaTexto: "17 de diciembre de 2026",

  lugar: "Casa Club, Condominio Terra Alta, km 16, Mixco, Guatemala",
  mapsURL: "https://www.google.com/maps/search/?api=1&query=Casa%20Club%20Condominio%20Terra%20Alta%20Mixco%20Guatemala",

  // Número con código de país, sin + ni espacios
  whatsapp: "50259936057"
};

/* 2. FUNCIONES AUXILIARES */

const $ = (id) => document.getElementById(id);

const nombre = $("nombre");
const firma = $("firma");
const lugarEvento = $("lugar-evento");
const fechaPortada = $("fecha-portada");
const fechaEvento = $("fecha-evento");
const horaEvento = $("hora-evento");
const avisoCuenta = $("aviso-cuenta");

const abrir = $("abrir");
const bienvenida = $("bienvenida");
const contenido = $("contenido");
const hero = document.querySelector(".hero");

/* 3. PERSONALIZAR LA INVITACIÓN */

nombre.textContent = invitacion.nombre;
firma.textContent = invitacion.nombre;

lugarEvento.textContent = invitacion.lugar;

fechaPortada.textContent = invitacion.fechaTexto;
fechaEvento.textContent = invitacion.fechaTexto;

horaEvento.textContent = "Hora pendiente de confirmar";

avisoCuenta.textContent =
  "Activaremos la cuenta regresiva cuando confirmen la hora.";

/* 4. ANIMACIONES AL DESPLAZARSE */

const elementosAnimados = document.querySelectorAll(
  ".reveal, .reveal-photo"
);

const reducirMovimiento = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

let observer = null;

function iniciarAnimaciones() {

  if (
    reducirMovimiento ||
    !("IntersectionObserver" in window)
  ) {
    elementosAnimados.forEach((elemento) => {
      elemento.classList.add("visible");
    });

    return;
  }

  observer = new IntersectionObserver(
    (entradas) => {

      entradas.forEach((entrada) => {

        if (entrada.isIntersecting) {

          entrada.target.classList.add("visible");

          observer.unobserve(entrada.target);
        }

      });

    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  elementosAnimados.forEach((elemento) => {
    observer.observe(elemento);
  });
}

/* 5. PANTALLA DE BIENVENIDA */

document.body.classList.add("locked");

// Mantener el contenido bloqueado hasta abrir.
contenido.inert = true;

// Enfocar el botón inicial.
abrir.focus({ preventScroll: true });

abrir.addEventListener("click", () => {

  // Evitar múltiples clics.
  abrir.disabled = true;

  // Ocultar suavemente la bienvenida.
  bienvenida.classList.add("welcome-hidden");

  // Activar contenido principal.
  contenido.inert = false;

  // Permitir desplazamiento.
  document.body.classList.remove("locked");

  // Regresar al inicio.
  window.scrollTo({
    top: 0,
    behavior: "instant"
  });

  // Activar animación de portada.
  hero.classList.add("hero-enter");

  // Iniciar animaciones interiores.
  iniciarAnimaciones();

  // Esperar a que termine la transición.
  const duracion = reducirMovimiento ? 0 : 700;

  setTimeout(() => {

    bienvenida.hidden = true;

    // Enfocar el título principal.
    const titulo = $("titulo");

    titulo.setAttribute("tabindex", "-1");

    titulo.focus({
      preventScroll: true
    });

  }, duracion);

});

/* 6. FECHA Y CUENTA REGRESIVA */

const fecha = invitacion.fechaISO
  ? new Date(invitacion.fechaISO)
  : null;

const fechaValida =
  fecha !== null &&
  !Number.isNaN(fecha.getTime());

if (fechaValida) {

  const formatoFecha = new Intl.DateTimeFormat(
    "es-GT",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "America/Guatemala"
    }
  );

  const formatoHora = new Intl.DateTimeFormat(
    "es-GT",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/Guatemala"
    }
  );

  fechaPortada.textContent = formatoFecha.format(fecha);

  fechaEvento.textContent = formatoFecha.format(fecha);

  horaEvento.textContent = formatoHora.format(fecha);

  avisoCuenta.hidden = true;

  function actualizarCuenta() {

    const restante = Math.max(
      0,
      fecha.getTime() - Date.now()
    );

    const total = Math.floor(restante / 1000);

    const dias = Math.floor(total / 86400);

    const horas = Math.floor(
      (total % 86400) / 3600
    );

    const minutos = Math.floor(
      (total % 3600) / 60
    );

    const segundos = total % 60;

    $("dias").textContent = dias;

    $("horas").textContent =
      String(horas).padStart(2, "0");

    $("minutos").textContent =
      String(minutos).padStart(2, "0");

    $("segundos").textContent =
      String(segundos).padStart(2, "0");

    if (restante === 0) {

      avisoCuenta.textContent =
        "¡Llegó el gran día!";

      avisoCuenta.hidden = false;

      return true;
    }

    return false;
  }

  if (!actualizarCuenta()) {

    const reloj = setInterval(() => {

      if (actualizarCuenta()) {
        clearInterval(reloj);
      }

    }, 1000);
  }

} else {

  // Mantener la cuenta regresiva oculta
  // mientras no tengamos la hora confirmada.
  $("cuenta").hidden = true;

  avisoCuenta.hidden = false;
}

/* 7. UBICACIÓN EN GOOGLE MAPS */

if (invitacion.mapsURL.trim() !== "") {

  try {

    const url = new URL(invitacion.mapsURL);

    if (
      url.protocol === "https:" ||
      url.protocol === "http:"
    ) {

      $("mapa").href = url.href;

      $("mapa").hidden = false;
    }

  } catch (error) {

    console.warn(
      "El enlace de Google Maps no es válido."
    );
  }
}

/* 8. CONFIRMACIÓN POR WHATSAPP */

const numeroWhatsApp = invitacion.whatsapp.trim();

if (/^\d{8,15}$/.test(numeroWhatsApp)) {

  const mensaje =
    "Hola, confirmo mi asistencia a la graduación de " +
    invitacion.nombre +
    ".";

  const enlaceWhatsApp =
    `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

  const botonConfirmar = $("confirmar");

  botonConfirmar.href = enlaceWhatsApp;

  botonConfirmar.hidden = false;
}
