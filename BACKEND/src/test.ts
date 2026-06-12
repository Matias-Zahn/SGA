import { CatalogoEspacios } from "./dominio/CatalogoEspacios";
import { CatalogoMaterias } from "./dominio/CatalogoMaterias";
import { CatalogoDocentes } from "./dominio/CatalogoDocentes";
import { ControladorImportarAsignacion } from "./controladores/ControladorImportarAsignacion";
import { Espacio } from "./dominio/Espacio";

// ==========================================
// 1. SETUP DE LA INFRAESTRUCTURA (Memoria)
// ==========================================
const catMaterias = new CatalogoMaterias(); // Ya trae "AYD", "ANALISIS-MAT"
const catDocentes = new CatalogoDocentes(); // Ya trae "DOC-001", "DOC-002"
const catEspacios = new CatalogoEspacios();

// Vamos a crear un aula y meterla al catálogo para poder usarla
const aula101 = new Espacio(
  "AULA-101",
  30,
  "Aula Híbrida",
  "Anexo",
  "Habilitado",
  "Proyector en mantenimiento",
); // (Asumiendo que tu constructor es id, capacidad)
catEspacios.agregarEspacio(aula101);

// ==========================================
// 2. INSTANCIAR EL CONTROLADOR
// ==========================================
const controlador = new ControladorImportarAsignacion(
  catEspacios,
  catMaterias,
  catDocentes,
);

// ==========================================
// 3. SIMULAR EL EXCEL PARSEADO (El Array de JSON)
// ==========================================
const filasExcelSimuladas = [
  // CASO 1: ÉXITO - Todo está libre y los datos existen
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
  // CASO 2: COLISIÓN - Falla porque pisa el horario de la fila 1 (19:00 a 22:00 choca con 18:00 a 21:00)
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
  // CASO 3: ERROR DE DATOS - Falla porque el docente no existe en el catálogo
  {
    codigoMateria: "ESTADISTICA",
    idEspacio: "AULA-101",
    legajo: "DOC-999", // Este legajo no lo creamos
    dia: "Martes",
    fInicio: "2026-08-10",
    fFin: "2026-11-20",
    hInicio: "15:00",
    hFin: "18:00",
  },
];

// ==========================================
// 4. EJECUCIÓN DEL CASO DE USO
// ==========================================
console.log("Iniciando importación masiva de Asignaciones...\n");

const reporteFinal = controlador.importarAsignacionMasiva(filasExcelSimuladas);

// Mostramos el reporte formateado en consola
console.log("=== REPORTE DE EJECUCIÓN ===");
console.log(JSON.stringify(reporteFinal, null, 2));
