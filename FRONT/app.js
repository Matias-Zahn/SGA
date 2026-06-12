// Referencias a los elementos del DOM
const btnImportar = document.getElementById("btnImportar");
const formEvento = document.getElementById("formEvento");
const consola = document.getElementById("consola");

const URL_BASE = "http://localhost:3000/api";

// Función para imprimir en la pantalla negra
function imprimirEnConsola(data) {
  consola.textContent = JSON.stringify(data, null, 2);
}

// ==========================================
// CASO DE USO 1: IMPORTAR ASIGNACIÓN
// ==========================================
btnImportar.addEventListener("click", async () => {
  consola.textContent = "Procesando importación masiva...";

  // Simulamos el array que nos devolvería el parser del Excel
  const filasSimuladas = [
    {
      codigoMateria: "AYD",
      idEspacio: "AULA-101",
      legajo: "DOC-001",
      dia: "Lunes",
      fInicio: "2026-08-10",
      fFin: "2026-11-20",
      hInicio: "18:00",
      hFin: "21:00",
    },
    // Esta segunda fila va a fallar porque choca con la primera
    {
      codigoMateria: "ANALISIS-MAT",
      idEspacio: "AULA-101",
      legajo: "DOC-002",
      dia: "Lunes",
      fInicio: "2026-08-10",
      fFin: "2026-11-20",
      hInicio: "19:00",
      hFin: "22:00",
    },
  ];

  try {
    const respuesta = await fetch(`${URL_BASE}/importar-asignacion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filasSimuladas),
    });

    const datos = await respuesta.json();
    imprimirEnConsola(datos);
  } catch (error) {
    imprimirEnConsola({
      error: "No se pudo conectar con el servidor",
      detalle: error.message,
    });
  }
});

// ==========================================
// CASO DE USO 2: REGISTRAR EVENTO
// ==========================================
formEvento.addEventListener("submit", async (e) => {
  e.preventDefault(); // Evita que se recargue la página
  consola.textContent = "Registrando evento...";

  // Armamos el objeto con los datos del formulario
  const datosEvento = {
    nombreEvento: document.getElementById("evNombre").value,
    idEspacio: document.getElementById("evEspacio").value,
    dia: document.getElementById("evDia").value,
    fecha: document.getElementById("evFecha").value,
    hInicio: document.getElementById("evInicio").value,
    hFin: document.getElementById("evFin").value,
  };

  try {
    const respuesta = await fetch(`${URL_BASE}/registrar-evento`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosEvento),
    });

    const datos = await respuesta.json();
    imprimirEnConsola(datos);
  } catch (error) {
    imprimirEnConsola({
      error: "No se pudo conectar con el servidor",
      detalle: error.message,
    });
  }
});
