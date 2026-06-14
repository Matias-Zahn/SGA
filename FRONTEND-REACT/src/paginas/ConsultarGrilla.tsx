import { useEffect, useMemo, useState } from "react"
import { CalendarDays, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { EncabezadoPagina } from "@/componentes/EncabezadoPagina"
import { GrillaLineaTiempo } from "@/componentes/GrillaLineaTiempo"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { consultarGrilla } from "@/servicios/grilla"
import { type AulaGrilla } from "@/datos/grillaSimulada"
import {
  ajustarDomingo,
  diasDeLaSemana,
  formatoISO,
  mismaFecha,
  nombreDiaSemana,
  sumarSemanas,
} from "@/lib/fechas"
import { cn } from "@/lib/utils"

// Abreviatura capitalizada del día ("lunes" -> "Lun").
function abrevDia(nombre: string): string {
  return nombre.slice(0, 3).replace(/^./, (c) => c.toUpperCase())
}

// Página de consulta de la grilla de aulas (vista Línea de Tiempo).
// Navega por semana (default: actual), con calendario para saltar a una fecha
// y buscador por aula. Los datos vienen de servicios/grilla (hoy mock).
export function ConsultarGrilla() {
  const [fechaActiva, setFechaActiva] = useState<Date>(() =>
    ajustarDomingo(new Date()),
  )
  const [grilla, setGrilla] = useState<AulaGrilla[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState("")
  const [calendarioAbierto, setCalendarioAbierto] = useState(false)

  const dias = useMemo(() => diasDeLaSemana(fechaActiva), [fechaActiva])

  // Carga la grilla cada vez que cambia la fecha activa.
  useEffect(() => {
    let activo = true
    // Estado de carga al iniciar la consulta (patrón fetch-en-efecto).
    /* eslint-disable react-hooks/set-state-in-effect */
    setCargando(true)
    setError(null)
    /* eslint-enable react-hooks/set-state-in-effect */

    consultarGrilla(nombreDiaSemana(fechaActiva), formatoISO(fechaActiva))
      .then((resp) => {
        if (activo) setGrilla(resp.grilla)
      })
      .catch(() => {
        if (activo) setError("No se pudo cargar la grilla.")
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [fechaActiva])

  // Filtra las aulas por la búsqueda (por nombre o número).
  const aulasFiltradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return grilla
    const soloNumero = q.replace(/\D/g, "")
    return grilla.filter(({ aula }) => {
      const nombre = aula.toLowerCase()
      const numero = nombre.replace(/\D/g, "")
      return (
        nombre.includes(q) || (soloNumero !== "" && numero.includes(soloNumero))
      )
    })
  }, [grilla, busqueda])

  return (
    <div>
      <EncabezadoPagina
        titulo="Consultar Grilla"
        descripcion="Visualizá la ocupación de las aulas a lo largo del día. Navegá por semana o saltá a una fecha puntual."
      />

      {/* Barra de controles */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        {/* Navegación de semana + días */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Semana anterior"
            onClick={() => setFechaActiva(sumarSemanas(fechaActiva, -1))}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <div className="inline-flex flex-wrap gap-1 rounded-lg border bg-card p-1">
            {dias.map((dia) => {
              const activo = mismaFecha(dia.fecha, fechaActiva)
              return (
                <button
                  key={dia.fecha.toISOString()}
                  onClick={() => setFechaActiva(dia.fecha)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium tabular-nums transition-colors",
                    activo
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {abrevDia(dia.nombre)} {dia.fecha.getDate()}
                </button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            aria-label="Semana siguiente"
            onClick={() => setFechaActiva(sumarSemanas(fechaActiva, 1))}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        {/* Calendario + buscador */}
        <div className="flex flex-wrap items-center gap-2">
          <Popover open={calendarioAbierto} onOpenChange={setCalendarioAbierto}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 font-normal">
                <CalendarDays className="size-4" />
                {fechaActiva.toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={fechaActiva}
                onSelect={(fecha) => {
                  if (fecha) {
                    setFechaActiva(ajustarDomingo(fecha))
                    setCalendarioAbierto(false)
                  }
                }}
                autoFocus
              />
            </PopoverContent>
          </Popover>

          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar aula (ej. 101)..."
              className="pl-8"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardContent>
          {cargando && grilla.length === 0 ? (
            <div className="space-y-2 py-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 animate-pulse rounded-md bg-muted"
                />
              ))}
            </div>
          ) : error ? (
            <div className="py-16 text-center text-sm text-destructive">
              {error}
            </div>
          ) : (
            // Mantenemos la grilla montada al cambiar de día (evita que la barra
            // de scroll se desmonte y reaparezca); atenuamos mientras recarga.
            <div className={cn("transition-opacity", cargando && "opacity-60")}>
              <GrillaLineaTiempo aulas={aulasFiltradas} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
