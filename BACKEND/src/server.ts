import express, { Request, Response } from "express";
import { CatalogoEspacios } from "./dominio/CatalogoEspacios";
import { CatalogoMaterias } from "./dominio/CatalogoMaterias";
import { CatalogoDocentes } from "./dominio/CatalogoDocentes";
import { ControladorImportarAsignacion } from "./controladores/ControladorImportarAsignacion";
import { ControladorRegistrarEvento } from "./controladores/ControladorRegistrarEvento";
import cors from "cors";
import { Espacio } from "./dominio/Espacio"; // Opcional, para crear un aula de prueba

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

// (Opcional) Creamos un aula de prueba para que los endpoints tengan donde guardar cosas
catalogoEspacios.agregarEspacio(
  new Espacio(
    "AULA-101",
    30,
    "Aula Híbrida",
    "Anexo",
    "Habilitado",
    "Proyector en mantenimiento",
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

// El controlador de eventos solo necesita conocer los espacios
const controladorEvento = new ControladorRegistrarEvento(catalogoEspacios);

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
  const { nombreEvento, idEspacio, dia, hInicio, hFin, fecha } = req.body;

  const resultado = controladorEvento.registrarEvento(
    nombreEvento,
    idEspacio,
    dia,
    fecha,
    hInicio,
    hFin,
  );

  if (resultado.exito) {
    res.status(200).json(resultado);
  } else {
    res.status(409).json(resultado); // 409 Conflict por choque de horarios
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
});
