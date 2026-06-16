import { useEffect, useRef } from "react"
import { SearchX } from "lucide-react"
import {
  HORA_INICIO,
  HORA_FIN,
  type ActividadGrilla,
  type AulaGrilla,
} from "@/datos/grillaSimulada"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface GrillaLineaTiempoProps {
  aulas: AulaGrilla[]
}

// Ancho en píxeles de cada hora en el eje X.
const ANCHO_HORA = 84
const TOTAL_HORAS = HORA_FIN - HORA_INICIO
const ANCHO_TIMELINE = TOTAL_HORAS * ANCHO_HORA
const HORAS = Array.from({ length: TOTAL_HORAS + 1 }, (_, i) => HORA_INICIO + i)

// Paleta de colores vivos para las actividades vigentes.
const PALETA = [
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
  "#10b981",
  "#8b5cf6",
  "#3b82f6",
]

// "18:30" -> 18.5
function aDecimal(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number)
  return h + m / 60
}

// Posición porcentual de una hora dentro del timeline.
function porcentaje(hora: number) {
  return ((hora - HORA_INICIO) / TOTAL_HORAS) * 100
}

// Color estable según el nombre (misma actividad => mismo color).
function colorPara(nombre: string): string {
  let h = 0
  for (const c of nombre) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return PALETA[h % PALETA.length]
}

function estaReprogramada(act: ActividadGrilla): boolean {
  return act.estado === "A Reprogramar"
}

// True si dos actividades se pisan en el tiempo.
function solapan(a: ActividadGrilla, b: ActividadGrilla): boolean {
  return aDecimal(a.inicio) < aDecimal(b.fin) && aDecimal(a.fin) > aDecimal(b.inicio)
}

// Línea descriptiva de una actividad para el tooltip.
function LineaActividad({
  act,
  tachada = false,
}: {
  act: ActividadGrilla
  tachada?: boolean
}) {
  return (
    <div>
      <span className={cn("font-medium", tachada && "line-through")}>
        {act.nombre}
      </span>
      <div className="text-muted-foreground">
        {act.inicio}–{act.fin} · {act.tipo} · {act.estado}
      </div>
    </div>
  )
}

// Vista de Línea de Tiempo. Cada aula es una fila; sus actividades se ubican
// según su rango horario. Las reprogramadas se dibujan de fondo (capa inferior)
// y las vigentes encima (opción B: capas superpuestas).
export function GrillaLineaTiempo({ aulas }: GrillaLineaTiempoProps) {
  const contenedorRef = useRef<HTMLDivElement>(null)

  // Sobre la grilla: el scroll vertical del mouse se traduce en desplazamiento
  // horizontal del timeline. Fuera de la grilla el scroll vertical sigue normal
  // (la página baja para ver las aulas inferiores), porque el listener vive solo
  // en el viewport de la grilla.
  useEffect(() => {
    const viewport = contenedorRef.current?.querySelector<HTMLElement>(
      '[data-slot="scroll-area-viewport"]',
    )
    if (!viewport) return

    function alScrollear(evento: WheelEvent) {
      // Si no hay overflow horizontal, dejamos pasar el scroll vertical normal.
      if (viewport!.scrollWidth <= viewport!.clientWidth) return
      if (evento.deltaY === 0) return
      viewport!.scrollLeft += evento.deltaY
      evento.preventDefault()
    }

    // passive:false es necesario para poder hacer preventDefault y así frenar el
    // scroll vertical de la página mientras el mouse está sobre la grilla.
    viewport.addEventListener("wheel", alScrollear, { passive: false })
    return () => viewport.removeEventListener("wheel", alScrollear)
  }, [aulas])

  if (aulas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <SearchX className="size-8 text-muted-foreground" />
        <p className="text-sm font-medium">No se encontró ningún aula</p>
        <p className="text-sm text-muted-foreground">
          Probá con otro número de aula.
        </p>
      </div>
    )
  }

  return (
    <ScrollArea
      ref={contenedorRef}
      className="w-full"
      orientation="horizontal"
    >
      <div className="w-max">
        {/* Eje X: rótulos de horas */}
        <div className="flex border-b">
          <div className="sticky left-0 z-30 w-24 shrink-0 bg-card" />
          <div className="relative h-8" style={{ width: ANCHO_TIMELINE }}>
            {HORAS.map((h, i) => (
              <span
                key={h}
                className={cn(
                  "absolute text-xs text-muted-foreground tabular-nums",
                  i === 0
                    ? "translate-x-0"
                    : i === HORAS.length - 1
                      ? "-translate-x-full"
                      : "-translate-x-1/2",
                )}
                style={{ left: `${porcentaje(h)}%` }}
              >
                {h}:00
              </span>
            ))}
          </div>
        </div>

        {/* Filas: una por aula */}
        {aulas.map(({ aula, actividades }, indice) => {
          const reprogramadas = actividades.filter(estaReprogramada)
          const vigentes = actividades.filter((a) => !estaReprogramada(a))
          return (
            <div
              key={aula}
              className="flex animate-in fade-in slide-in-from-bottom-1 fill-mode-backwards"
              style={{ animationDelay: `${indice * 30}ms` }}
            >
              {/* Etiqueta de aula (columna fija) */}
              <div className="sticky left-0 z-30 flex w-24 shrink-0 items-center justify-end border-r bg-card pr-3 text-sm font-medium text-muted-foreground">
                {aula}
              </div>

              {/* Pista del aula con sus actividades */}
              <div
                className="relative h-14 border-b"
                style={{
                  width: ANCHO_TIMELINE,
                  backgroundImage: `repeating-linear-gradient(to right, var(--border) 0, var(--border) 1px, transparent 1px, transparent ${ANCHO_HORA}px)`,
                }}
              >
                {/* Capa inferior: actividades reprogramadas (fantasma) */}
                {reprogramadas.map((act, i) => {
                  const izq = porcentaje(aDecimal(act.inicio))
                  const ancho = porcentaje(aDecimal(act.fin)) - izq
                  const reemplazante = vigentes.find((v) => solapan(v, act))
                  return (
                    <Tooltip key={`r-${i}`}>
                      <TooltipTrigger asChild>
                        <div
                          className="absolute inset-y-1 flex items-center overflow-hidden rounded-md border border-dashed border-muted-foreground/50 px-2 text-muted-foreground"
                          style={{
                            left: `${izq}%`,
                            width: `${ancho}%`,
                            backgroundImage:
                              "repeating-linear-gradient(45deg, var(--muted) 0, var(--muted) 6px, transparent 6px, transparent 12px)",
                          }}
                        >
                          <span className="truncate text-xs font-medium line-through">
                            {act.nombre}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs space-y-1">
                        <LineaActividad act={act} tachada />
                        {reemplazante && (
                          <div className="border-t border-border pt-1">
                            <div className="text-muted-foreground">
                              Reemplazada por:
                            </div>
                            <LineaActividad act={reemplazante} />
                          </div>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  )
                })}

                {/* Capa superior: actividades vigentes */}
                {vigentes.map((act, i) => {
                  const izq = porcentaje(aDecimal(act.inicio))
                  const ancho = porcentaje(aDecimal(act.fin)) - izq
                  const solapadas = reprogramadas.filter((r) => solapan(act, r))
                  return (
                    <Tooltip key={`v-${i}`}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "absolute inset-y-2.5 z-10 flex items-center overflow-hidden rounded-md px-2 shadow-md",
                            "transition-all hover:z-20 hover:brightness-105",
                          )}
                          style={{
                            left: `${izq}%`,
                            width: `${ancho}%`,
                            backgroundColor: colorPara(act.nombre),
                          }}
                        >
                          <span className="truncate text-xs font-medium text-white">
                            {act.nombre}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs space-y-1">
                        <LineaActividad act={act} />
                        {solapadas.length > 0 && (
                          <div className="space-y-1 border-t border-border pt-1">
                            <div className="text-muted-foreground">
                              Desplazó a:
                            </div>
                            {solapadas.map((r, j) => (
                              <LineaActividad key={j} act={r} tachada />
                            ))}
                          </div>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
