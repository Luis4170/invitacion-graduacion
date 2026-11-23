const invitacion = {
  nombre: "Abrahm Telis",

  fechaISO: "2026-12-17T19:00:00-06:00",

  fechaTexto: "17 de diciembre de 2026",

  lugar: "Casa Club, Condominio Terra Alta, km 16, Mixco, Guatemala",

  mapsURL: "https://www.google.com/maps/search/?api=1&query=Casa%20Club%20Condominio%20Terra%20Alta%20Mixco%20Guatemala",

  whatsapp: "50259936057"
};

const $ = (id) => document.getElementById(id);

const reducirMovimiento = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// ======================================
// DATOS PRINCIPALES
// ======================================

$("nombre").textContent = invitacion.nombre;
$("firma").textContent = invitacion.nombre;
$("lugar-evento").textContent = invitacion.lugar;
$("fecha-portada").textContent = invitacion.fechaTexto;
$("fecha-evento").textContent = invitacion.fechaTexto;

// ======================================
// MÚSICA DE FONDO
// ======================================

const musica = $("musica");
const controlMusica = $("control-musica");
const iconoMusica = $("icono-musica");

musica.volume = 0.35;

function actualizarControlMusica() {
  const reproduciendo = !musica.paused;

  controlMusica.classList.toggle(
    "playing",
    reproduciendo
  );

  iconoMusica.textContent = reproduciendo ? "♫" : "♪";

  controlMusica.setAttribute(
    "aria-label",
    reproduciendo
      ? "Pausar música"
      : "Reproducir música"
  );

  controlMusica.setAttribute(
    "aria-pressed",
    String(reproduciendo)
  );
}

function reproducirMusica() {
  musica.play().catch((error) => {
    console.warn(
      "No se pudo reproducir la música:",
      error
    );

    actualizarControlMusica();
  });
}

musica.addEventListener(
  "play",
  actualizarControlMusica
);

musica.addEventListener(
  "pause",
  actualizarControlMusica
);

controlMusica.addEventListener("click", () => {
  if (musica.paused) {
    reproducirMusica();
  } else {
    musica.pause();
  }
});

// ======================================
// ANIMACIÓN DE BIRRETES Y ESTRELLAS
// ======================================

function lanzarCelebracion() {

  if (reducirMovimiento) return;

  const contenedor = $("particulas");

  contenedor.replaceChildren();

  const cantidad = 35;

  const simbolos = [
    "🎓",
    "🎓",
    "🎓",
    "✦",
    "✧",
    "✨"
  ];

  for (let i = 0; i < cantidad; i++) {

    const particula = document.createElement("span");

    const simbolo = simbolos[
      Math.floor(Math.random() * simbolos.length)
    ];

    particula.classList.add("particle");

    if (simbolo !== "🎓") {
      particula.classList.add("star");
    }

    particula.textContent = simbolo;

    const posicion = Math.random() * 100;

    const tamano = 14 + Math.random() * 24;

    const duracion = 2.2 + Math.random() * 1.4;

    const retraso = Math.random() * 0.4;

    const desplazamiento = -80 + Math.random() * 160;

    const rotacion = -360 + Math.random() * 720;

    particula.style.setProperty(
      "--left",
      posicion + "%"
    );

    particula.style.setProperty(
      "--size",
      tamano + "px"
    );

    particula.style.setProperty(
      "--duration",
      duracion + "s"
    );

    particula.style.setProperty(
      "--delay",
      retraso + "s"
    );

    particula.style.setProperty(
      "--drift",
      desplazamiento + "px"
    );

    particula.style.setProperty(
      "--rotation",
      rotacion + "deg"
    );

    contenedor.appendChild(particula);

    particula.addEventListener(
      "animationend",
      () => particula.remove(),
      { once: true }
    );
  }

  // Limpieza de seguridad
  setTimeout(() => {
    contenedor.replaceChildren();
  }, 4500);
}

// ======================================
// PANTALLA DE BIENVENIDA
// ======================================

const abrir = $("abrir");
const bienvenida = $("bienvenida");
const contenido = $("contenido");

document.body.classList.add("locked");

abrir.addEventListener("click", () => {

  abrir.disabled = true;

  // La música comienza con la interacción
  // directa del invitado.
  reproducirMusica();

  // Lanzar birretes y estrellas.
  lanzarCelebracion();

  // Ocultar pantalla inicial.
  bienvenida.classList.add("welcome-hidden");

  contenido.inert = false;

  document.body.classList.remove("locked");

  // Animación de entrada de la portada.
  if (!reducirMovimiento) {
    document.querySelector(".hero")
      .classList.add("celebration-enter");
  }

  const finalizarApertura = () => {

    bienvenida.hidden = true;

    controlMusica.hidden = false;

    actualizarControlMusica();

    $("titulo").setAttribute("tabindex", "-1");

    $("titulo").focus({
      preventScroll: true
    });

    iniciarAnimacionesScroll();
  };

  if (reducirMovimiento) {
    finalizarApertura();
  } else {
    setTimeout(finalizarApertura, 650);
  }

}, { once: true });

abrir.focus();

// ======================================
// FECHA Y CUENTA REGRESIVA
// ======================================

const fecha = new Date(invitacion.fechaISO);

const fechaValida = !Number.isNaN(fecha.getTime());

if (fechaValida) {

  const formatoFecha = new Intl.DateTimeFormat("es-GT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Guatemala"
  });

  const formatoHora = new Intl.DateTimeFormat("es-GT", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Guatemala"
  });

  $("fecha-portada").textContent =
    formatoFecha.format(fecha);

  $("fecha-evento").textContent =
    formatoFecha.format(fecha);

  $("hora-evento").textContent =
    formatoHora.format(fecha);

  $("aviso-cuenta").hidden = true;

  const actualizar = () => {

    const restante = Math.max(
      0,
      fecha.getTime() - Date.now()
    );

    const total = Math.floor(restante / 1000);

    $("dias").textContent =
      Math.floor(total / 86400);

    $("horas").textContent = String(
      Math.floor(total / 3600) % 24
    ).padStart(2, "0");

    $("minutos").textContent = String(
      Math.floor(total / 60) % 60
    ).padStart(2, "0");

    $("segundos").textContent = String(
      total % 60
    ).padStart(2, "0");

    if (restante === 0) {

      $("aviso-cuenta").textContent =
        "¡Llegó el gran día!";

      $("aviso-cuenta").hidden = false;

      return true;
    }

    return false;
  };

  if (!actualizar()) {

    const reloj = setInterval(() => {

      if (actualizar()) {
        clearInterval(reloj);
      }

    }, 1000);
  }
}

// ======================================
// GOOGLE MAPS
// ======================================

if (/^https:\/\/[^\s]+$/i.test(invitacion.mapsURL)) {

  $("mapa").href = invitacion.mapsURL;

  $("mapa").hidden = false;
}

// ======================================
// CONFIRMACIÓN POR WHATSAPP
// ======================================

if (/^\d{8,15}$/.test(invitacion.whatsapp)) {

  const mensaje =
    "Hola, confirmo mi asistencia a la graduación de " +
    invitacion.nombre +
    " el 17 de diciembre de 2026 a las 7:00 p. m.";

  $("confirmar").href =
    "https://wa.me/" +
    invitacion.whatsapp +
    "?text=" +
    encodeURIComponent(mensaje);

  $("confirmar").hidden = false;
}

// ======================================
// AÑADIR AL CALENDARIO DE GOOGLE
// ======================================

if (fechaValida) {

  const formatoCalendario = (valor) =>
    valor.toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");

  // Duración provisional de tres horas.
  const fechaFin = new Date(
    fecha.getTime() + 3 * 60 * 60 * 1000
  );

  const inicio = formatoCalendario(fecha);
  const fin = formatoCalendario(fechaFin);

  const parametros = new URLSearchParams({

    action: "TEMPLATE",

    text:
      "Graduación universitaria de " +
      invitacion.nombre,

    dates: inicio + "/" + fin,

    details:
      "Te invito a celebrar mi graduación universitaria.",

    location: invitacion.lugar,

    ctz: "America/Guatemala"

  });

  $("agregar-calendario").href =
    "https://calendar.google.com/calendar/render?" +
    parametros.toString();
}

// ======================================
// ANIMACIONES AL DESPLAZARSE
// ======================================

function iniciarAnimacionesScroll() {

  const elementos = document.querySelectorAll(
    ".reveal, .reveal-photo"
  );

  if (
    reducirMovimiento ||
    !("IntersectionObserver" in window)
  ) {

    elementos.forEach((elemento) => {
      elemento.classList.add("visible");
    });

    return;
  }

  const observer = new IntersectionObserver(

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

  elementos.forEach((elemento) => {
    observer.observe(elemento);
  });
}