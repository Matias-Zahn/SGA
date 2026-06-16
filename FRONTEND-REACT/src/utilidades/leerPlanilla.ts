// Lectura de planillas de asignación (.xlsx / .csv) en el navegador con SheetJS.
// La planilla la arma una persona, así que los encabezados son amigables en
// español; acá los mapeamos a los campos técnicos que espera el backend.

import * as XLSX from "xlsx"
import type { FilaAsignacion } from "@/datos/datosSimulados"

// Encabezado amigable (ya normalizado) → campo de FilaAsignacion.
// La normalización (minúsculas, sin acentos, sin espacios extra) hace que
// "Código Materia", "codigo materia" o "CODIGO  MATERIA" caigan todos acá.
const MAPEO_ENCABEZADOS: Record<string, keyof FilaAsignacion> = {
  "codigo materia": "codigoMateria",
  espacio: "idEspacio",
  legajo: "legajo",
  dia: "dia",
  "fecha inicio": "fInicio",
  "fecha fin": "fFin",
  "hora inicio": "hInicio",
  "hora fin": "hFin",
}

// Encabezados amigables esperados, en el orden en que conviene mostrarlos.
export const ENCABEZADOS_PLANILLA = [
  "Código Materia",
  "Espacio",
  "Legajo",
  "Día",
  "Fecha Inicio",
  "Fecha Fin",
  "Hora Inicio",
  "Hora Fin",
] as const

// Quita acentos, pasa a minúsculas y colapsa espacios para comparar encabezados
// sin depender de cómo los haya tipeado quien armó la planilla.
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
}

// Error de validación de la planilla (encabezados faltantes, hoja vacía, etc.).
// Se distingue de errores de lectura del archivo para mostrar mensajes claros.
export class ErrorPlanilla extends Error {
  constructor(mensaje: string) {
    super(mensaje)
    this.name = "ErrorPlanilla"
  }
}

// Lee un archivo .xlsx o .csv y devuelve las filas mapeadas a FilaAsignacion.
// Toma la primera hoja del libro. Lanza ErrorPlanilla si la estructura no es la
// esperada (faltan columnas o no hay datos).
export async function leerPlanilla(archivo: File): Promise<FilaAsignacion[]> {
  const buffer = await archivo.arrayBuffer()
  // raw:true evita que SheetJS reinterprete "2026-04-10" o "18:00" como fechas
  // y los reformatee: el dominio compara fechas/horas como strings ISO/HH:MM,
  // así que necesitamos el texto tal cual viene en la celda.
  const libro = XLSX.read(buffer, { type: "array", raw: true })

  const nombreHoja = libro.SheetNames[0]
  if (!nombreHoja) {
    throw new ErrorPlanilla("El archivo no contiene ninguna hoja de datos.")
  }
  const hoja = libro.Sheets[nombreHoja]
  if (!hoja) {
    throw new ErrorPlanilla("No se pudo leer la primera hoja del archivo.")
  }

  // raw:true devuelve el valor crudo de la celda (sin reformatear fechas/horas),
  // defval:"" evita celdas undefined. Cada elemento es { "<encabezado>": valor }.
  const filasCrudas = XLSX.utils.sheet_to_json<Record<string, unknown>>(hoja, {
    raw: true,
    defval: "",
  })

  if (filasCrudas.length === 0) {
    throw new ErrorPlanilla("La planilla no tiene filas de datos.")
  }

  // Validamos que estén todas las columnas esperadas antes de mapear.
  const encabezadosPresentes = new Set(
    Object.keys(filasCrudas[0] ?? {}).map(normalizar),
  )
  const faltantes = Object.keys(MAPEO_ENCABEZADOS).filter(
    (clave) => !encabezadosPresentes.has(clave),
  )
  if (faltantes.length > 0) {
    throw new ErrorPlanilla(
      `Faltan columnas en la planilla. Encabezados esperados: ${ENCABEZADOS_PLANILLA.join(", ")}.`,
    )
  }

  return filasCrudas.map((filaCruda) => {
    // Reindexamos la fila por encabezado normalizado para buscar cada campo.
    const porNormalizado: Record<string, string> = {}
    for (const [clave, valor] of Object.entries(filaCruda)) {
      porNormalizado[normalizar(clave)] = String(valor).trim()
    }

    const fila = {} as FilaAsignacion
    for (const [encabezado, campo] of Object.entries(MAPEO_ENCABEZADOS)) {
      fila[campo] = porNormalizado[encabezado] ?? ""
    }
    return fila
  })
}
