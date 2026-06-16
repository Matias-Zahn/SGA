import express, { Request, Response } from "express";
import { CatalogoEspacios } from "./dominio/CatalogoEspacios";
import { CatalogoMaterias } from "./dominio/CatalogoMaterias";
import { CatalogoDocentes } from "./dominio/CatalogoDocentes";
import { ControladorImportarAsignacion } from "./controladores/ControladorImportarAsignacion";
import { ControladorRegistrarEvento } from "./controladores/ControladorRegistrarEvento";
import { ControladorConsultarGrilla } from "./controladores/ControladorConsultarGrilla";
import cors from "cors";
import { Espacio } from "./dominio/Espacio";
import { Materia } from "./dominio/Materia";
import { Docente } from "./dominio/Docente";
import materiasSeed from "./datos/materias.json";
import docentesSeed from "./datos/docentes.json";
import aulasSeed from "./datos/aulas.json";
import asignacionesSeed from "./datos/asignaciones.json";

const app = express();
app.use(express.json());
app.use(cors());
// ==========================================
// 1. SETUP DE LA INFRAESTRUCTURA (Memoria)
// ==========================================
// Instanciamos los Catálogos COMPARTIDOS (nuestra BD en memoria)
const catalogoEspacios = new CatalogoEspacios();
const catalogoMaterias = new CatalogoMaterias();
const catalogoDocentes = new CatalogoDocentes();

// SEED: cargamos los datos de prueba (src/datos/*.json) en los catálogos.
materiasSeed.forEach((m) =>
  catalogoMaterias.agregarMateria(new Materia(m.codigo, m.nombre)),
);
docentesSeed.forEach((d) =>
  catalogoDocentes.agregarDocente(
    new Docente(d.nombre, d.apellido, d.email, d.legajo),
  ),
);
aulasSeed.forEach((a) =>
  catalogoEspacios.agregarEspacio(
    new Espacio(
      a.idEspacio,
      a.capacidadMaxima,
      a.tipoEspacio,
      a.edificio,
      a.estado,
      a.observaciones,
    ),
  ),
);

// ==========================================
// 2. INYECCIÓN DE DEPENDENCIAS
// ==========================================
// El controlador de asignaciones ahora recibe los 3 catálogos (Patrón Experto)
const controladorAsignacion = new ControladorImportarAsignacion(
  catalogoEspacios,
  catalogoMaterias,
  catalogoDocentes,
);

// SEED: cargamos las asignaciones reutilizando el importador (valida y crea todo).
// [DESACTIVADO] Ahora las asignaciones se cargan desde el frontend importando el
// archivo CSV (FRONTEND-REACT/ejemplos/planilla-asignacion-ejemplo.csv), que ya
// contiene todas estas asignaciones. Descomentar para volver al seed automático.
// const reporteSeed =
//   controladorAsignacion.importarAsignacionMasiva(asignacionesSeed);
// const asignacionesOk = reporteSeed.filter((r) => r.exito).length;
console.log(
  `[Seed] Materias: ${materiasSeed.length} | Docentes: ${docentesSeed.length} | Aulas: ${aulasSeed.length} | Asignaciones: 0/${asignacionesSeed.length} (carga por CSV)`,
);

// El controlador de eventos solo necesita conocer los espacios
const controladorEvento = new ControladorRegistrarEvento(catalogoEspacios);

// El controlador de la grilla solo necesita leer los espacios
const controladorGrilla = new ControladorConsultarGrilla(catalogoEspacios);
// ==========================================
// 3. ENDPOINTS
// ==========================================

// --- ENDPOINT 1: IMPORTAR ASIGNACIÓN MASIVA (Simula el Lector de Excel) ---
app.post("/api/importar-asignacion", (req: Request, res: Response) => {
  // Recibimos directamente el Array limpio desde el Front (Mocking)
  const filasExcel = req.body;

  // Validación de formato sintáctico
  if (!Array.isArray(filasExcel) || filasExcel.length === 0) {
    return res.status(400).json({
      exito: false,
      error:
        "Formato de archivo inválido. Se esperaba una lista de asignaciones.",
    });
  }

  // Delegamos al Controlador (Validación semántica y de negocio)
  const resultados = controladorAsignacion.importarAsignacionMasiva(filasExcel);

  res.status(200).json({ reporte: resultados });
});

// --- ENDPOINT 2: REGISTRAR EVENTO (Formulario Web) ---
app.post("/api/registrar-evento", (req: Request, res: Response) => {
  const {
    nombreEvento,
    nombreSolicitante,
    contactoSolicitante,
    idEspacio,
    dia,
    hInicio,
    hFin,
    fecha,
    prioridadNueva,
    frontConfirmaExpropiacion,
  } = req.body;

  const resultado = controladorEvento.registrarEvento(
    nombreEvento,
    nombreSolicitante,
    contactoSolicitante,
    idEspacio,
    dia,
    fecha,
    hInicio,
    hFin,
    prioridadNueva,
    frontConfirmaExpropiacion,
  );

  // 3. Manejo de las tres respuestas posibles
  if (resultado.exito) {
    // Éxito absoluto (ya sea directo o tras expropiar)
    res.status(200).json(resultado);
  } else if (resultado.accion === "solicitarConfirmacion") {
    // Conflicto "blando": Hay choque, pero el front tiene que preguntar
    res.status(409).json(resultado);
  } else {
    // Conflicto "duro": Choque con algo de igual o mayor prioridad (Rechazo total)
    res.status(409).json(resultado);
  }
});

// --- ENDPOINT 3: CONSULTAR GRILLA (Línea de Tiempo) ---
app.get("/api/grilla", (req: Request, res: Response) => {
  // Extraemos los query params de la URL (ej: /api/grilla?dia=lunes&fecha=2026-08-10)
  const dia = req.query.dia as string;
  const fecha = req.query.fecha as string;

  if (!fecha) {
    return res.status(400).json({
      exito: false,
      error:
        "El parámetro 'fecha' es obligatorio en la URL (formato YYYY-MM-DD).",
    });
  }

  try {
    // Le pasamos el día (o string vacío si no viene) y la fecha al controlador
    const resultado = controladorGrilla.consultarLineaDeTiempo(
      dia || "",
      fecha,
    );

    // Devolvemos el JSON armado para que React dibuje la grilla
    res.status(200).json(resultado);
  } catch (error) {
    console.error("[Endpoint Grilla] Error:", error);
    res.status(500).json({
      exito: false,
      error: "Error interno al procesar la grilla.",
    });
  }
});

// ==========================================
// 4. INICIO DEL SERVIDOR
// ==========================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API del SGA corriendo en http://localhost:${PORT}`);
  console.log(`Endpoints activos:`);
  console.log(
    `- POST /api/importar-asignacion (Recibe un Array JSON simulando Excel)`,
  );
  console.log(
    `- POST /api/registrar-evento (Recibe un Objeto JSON del formulario)`,
  );
  console.log(
    `- GET  /api/grilla (Recibe query params ?dia=...&fecha=... para dibujar la Línea de Tiempo)`,
  );
});
