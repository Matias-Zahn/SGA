// Datos simulados (mock). Reemplazan temporalmente al backend hasta que se
// conecten los endpoints reales en http://localhost:3000/api.

// Una fila de la planilla de asignaciones cuatrimestrales.
export interface FilaAsignacion {
  codigoMateria: string
  idEspacio: string
  legajo: string
  dia: string
  fInicio: string
  fFin: string
  hInicio: string
  hFin: string
}

// Resultado del procesamiento de una fila durante la importación.
export interface ResultadoImportacion {
  fila: FilaAsignacion
  exito: boolean
  mensaje?: string
  error?: string
}

// Prioridades disponibles para un evento (1 = Alta, 2 = Media, 3 = Baja).
export type Prioridad = "1" | "2" | "3"

// Datos de un evento único a registrar.
export interface DatosEvento {
  nombreEvento: string
  idEspacio: string
  dia: string
  fecha: string
  hInicio: string
  hFin: string
  prioridad: Prioridad
}

// Resultado de registrar un evento.
export interface ResultadoEvento {
  exito: boolean
  mensaje?: string
  error?: string
}

// Planilla de ejemplo que simula lo que devolvería el parser de Excel.
export const planillaSimulada: FilaAsignacion[] = [
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
  {
    codigoMateria: "ESTADISTICA",
    idEspacio: "AULA-101",
    legajo: "DOC-999",
    dia: "Martes",
    fInicio: "2026-08-10",
    fFin: "2026-11-20",
    hInicio: "15:00",
    hFin: "18:00",
  },
]


