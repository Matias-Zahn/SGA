// Datos simulados (mock). Reemplazan temporalmente al backend hasta que se
// conecten los endpoints reales en http://localhost:3000/api.

// Una fila de la planilla de asignaciones cuatrimestrales.
export interface FilaAsignacion {
  codigoMateria: string;
  idEspacio: string;
  legajo: string;
  dia: string;
  fInicio: string;
  fFin: string;
  hInicio: string;
  hFin: string;
}

// Resultado del procesamiento de una fila durante la importación.
export interface ResultadoImportacion {
  fila: FilaAsignacion;
  exito: boolean;
  mensaje?: string;
  error?: string;
}

// Prioridades disponibles para un evento (1 = Alta, 2 = Media, 3 = Baja).
export type Prioridad = "1" | "2" | "3";

// Datos de un evento único a registrar.
export interface DatosEvento {
  nombreEvento: string;
  nombreSolicitante: string;
  contactoSolicitante: string;
  idEspacio: string;
  dia: string;
  fecha: string;
  hInicio: string;
  hFin: string;
  prioridad: Prioridad;
}

// [NUEVO - Notificar a Responsable] Responsable de una actividad (docente de
// una clase o solicitante de un evento) al que se podría notificar.
export interface ResponsableActividad {
  nombre: string;
  contacto: string;
}

// [NUEVO - Notificar a Responsable] Datos de la actividad desplazada por una
// expropiación, que el back devuelve para habilitar la notificación.
export interface ActividadAfectada {
  nombre: string;
  tipo: string;
  idEspacio: string;
  dia: string;
  fecha: string;
  hInicio: string;
  hFin: string;
  responsable: ResponsableActividad;
}

// Resultado de registrar un evento.
export interface ResultadoEvento {
  exito: boolean;
  mensaje?: string;
  error?: string;
  // [NUEVO - Notificar a Responsable] Estado del registro ("EXPROPIACION_REALIZADA"
  // habilita el botón de notificar) y datos de la actividad desplazada.
  estado?: string;
  actividadAfectada?: ActividadAfectada | null;
}

// Planilla de ejemplo que simula lo que devolvería el parser de Excel.
export const planillaSimulada: FilaAsignacion[] = [
  {
    codigoMateria: "AYD",
    idEspacio: "AULA-101",
    legajo: "DOC-001",
    dia: "Lunes",
    fInicio: "2026-03-10",
    fFin: "2026-06-20",
    hInicio: "18:00",
    hFin: "21:00",
  },
  {
    codigoMateria: "ANALISIS-MAT",
    idEspacio: "AULA-101",
    legajo: "DOC-002",
    dia: "Lunes",
    fInicio: "2026-03-10",
    fFin: "2026-06-20",
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
];
