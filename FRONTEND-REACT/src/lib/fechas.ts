// Helpers puros de fecha para la navegación de la grilla.
// El backend espera el día de la semana en español/minúscula y la fecha en
// formato YYYY-MM-DD.

const NOMBRES_DIAS = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
]

// Día de la semana en español y minúscula (para el query param `dia`).
export function nombreDiaSemana(fecha: Date): string {
  return NOMBRES_DIAS[fecha.getDay()]
}

// Día de la semana capitalizado ("Lunes"), para mostrar y para el formulario.
export function diaSemanaCapitalizado(fecha: Date): string {
  const n = nombreDiaSemana(fecha)
  return n.charAt(0).toUpperCase() + n.slice(1)
}

// Fecha en formato YYYY-MM-DD usando la hora local (para el query param `fecha`).
export function formatoISO(fecha: Date): string {
  const y = fecha.getFullYear()
  const m = String(fecha.getMonth() + 1).padStart(2, "0")
  const d = String(fecha.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

// "2026-08-10" -> Date local (evita el corrimiento por zona horaria de new Date(iso)).
export function parsearISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}

// Lunes (00:00) de la semana que contiene la fecha dada. El domingo se asocia a
// la semana que empieza el lunes anterior.
function lunesDeLaSemana(fecha: Date): Date {
  const d = new Date(fecha)
  d.setHours(0, 0, 0, 0)
  const dow = d.getDay() // 0 = domingo ... 6 = sábado
  const diff = dow === 0 ? -6 : 1 - dow
  d.setDate(d.getDate() + diff)
  return d
}

export interface DiaSemana {
  fecha: Date
  nombre: string
}

// Los días Lunes a Sábado de la semana que contiene la fecha dada.
export function diasDeLaSemana(fecha: Date): DiaSemana[] {
  const lunes = lunesDeLaSemana(fecha)
  const dias: DiaSemana[] = []
  for (let i = 0; i < 6; i++) {
    const d = new Date(lunes)
    d.setDate(lunes.getDate() + i)
    dias.push({ fecha: d, nombre: NOMBRES_DIAS[d.getDay()] })
  }
  return dias
}

// Devuelve una nueva fecha desplazada n semanas (n puede ser negativo).
export function sumarSemanas(fecha: Date, n: number): Date {
  const d = new Date(fecha)
  d.setDate(d.getDate() + n * 7)
  return d
}

// Si la fecha cae domingo, la corre al lunes siguiente (la grilla es Lun–Sáb,
// así que un domingo se interpreta como el inicio de la semana siguiente).
export function ajustarDomingo(fecha: Date): Date {
  if (fecha.getDay() !== 0) return fecha
  const d = new Date(fecha)
  d.setDate(d.getDate() + 1)
  return d
}

// True si ambas fechas caen en el mismo día calendario.
export function mismaFecha(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}
