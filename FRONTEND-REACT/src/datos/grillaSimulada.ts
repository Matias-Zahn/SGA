// Datos simulados (mock) que imitan la respuesta del endpoint del backend:
//   GET /api/grilla?dia=<dia-semana>&fecha=<YYYY-MM-DD>
// Cuando se conecte el backend real, estos tipos siguen valiendo; solo cambia
// la fuente de datos (ver servicios/grilla.ts).

export type TipoActividad = "Asignacion" | "Evento"

// Una actividad ocupando un rango horario en un aula.
export interface ActividadGrilla {
  nombre: string
  inicio: string // "HH:MM"
  fin: string // "HH:MM"
  tipo: TipoActividad
  estado: string // "Confirmado" | "Activa" | "A Reprogramar"
}

export interface AulaGrilla {
  aula: string
  actividades: ActividadGrilla[]
}

export interface RespuestaGrilla {
  exito: boolean
  fechaConsultada: string // YYYY-MM-DD
  grilla: AulaGrilla[]
}

// Rango horario que cubre la grilla (eje X).
export const HORA_INICIO = 8
export const HORA_FIN = 22

// Aulas del mock (con IDs al estilo del backend).
const AULAS = Array.from({ length: 12 }, (_, i) => `AULA-1${String(i).padStart(2, "0")}`)

// PRNG determinista (mulberry32): misma semilla => misma grilla.
function mulberry32(semilla: number) {
  return function () {
    semilla |= 0
    semilla = (semilla + 0x6d2b79f5) | 0
    let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Semilla estable a partir de un texto (para que cada aula/día sea reproducible).
function semillaDe(texto: string): number {
  let h = 0
  for (const c of texto) h = (Math.imul(h, 31) + c.charCodeAt(0)) | 0
  return h >>> 0
}

function hora(decimal: number): string {
  const h = Math.floor(decimal)
  const m = Math.round((decimal - h) * 60)
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

// Genera actividades "normales" (asignaciones activas) para un aula en un día.
function actividadesDe(aula: string, dia: string): ActividadGrilla[] {
  const rand = mulberry32(semillaDe(aula + "|" + dia))
  const elegir = <T,>(ops: T[]) => ops[Math.floor(rand() * ops.length)]
  const actividades: ActividadGrilla[] = []

  let cursor = HORA_INICIO + elegir([0, 0, 0.5, 1])
  while (cursor < HORA_FIN) {
    const dur = elegir([1, 1, 1.5, 2, 2, 2.5, 3])
    const fin = Math.min(cursor + dur, HORA_FIN)
    if (fin - cursor < 1) break

    if (rand() > 0.2) {
      actividades.push({
        nombre: `Materia ${100 + Math.floor(rand() * 900)}`,
        inicio: hora(cursor),
        fin: hora(fin),
        tipo: "Asignacion",
        estado: "Activa",
      })
    }

    cursor = fin + elegir([0, 0, 0.5, 1])
  }

  return actividades
}

// Caso de expropiación fijo (siempre presente en la primera aula, sin importar
// el día) para poder ver el render de una actividad reprogramada.
function casoExpropiacion(dia: string): ActividadGrilla[] {
  return [
    ...actividadesDe("AULA-100-mañana", dia).filter((a) => a.fin <= "13:00"),
    {
      nombre: "Análisis y Diseño de Sistemas",
      inicio: "18:00",
      fin: "21:00",
      tipo: "Asignacion",
      estado: "A Reprogramar",
    },
    {
      nombre: "Seminario de Seguridad Informática",
      inicio: "18:30",
      fin: "20:30",
      tipo: "Evento",
      estado: "Confirmado",
    },
  ]
}

// Arma la respuesta completa para un (dia, fecha). El mock genera las
// asignaciones por día de la semana; la fecha solo se refleja en
// `fechaConsultada` (el backend real sí la usa para los eventos).
export function obtenerGrillaSimulada(
  dia: string,
  fecha: string,
): RespuestaGrilla {
  const grilla: AulaGrilla[] = AULAS.map((aula, i) => ({
    aula,
    actividades:
      i === 0 ? casoExpropiacion(dia) : actividadesDe(aula, dia),
  }))

  return {
    exito: true,
    fechaConsultada: fecha,
    grilla,
  }
}
