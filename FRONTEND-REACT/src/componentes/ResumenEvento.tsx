import { Building2, CalendarDays, Clock } from "lucide-react"
import type { DatosEvento, Prioridad } from "@/datos/datosSimulados"
import { Card, CardContent } from "@/components/ui/card"
import { parsearISO } from "@/lib/fechas"
import { cn } from "@/lib/utils"

// Metadata de cada prioridad: etiqueta, color del punto y qué implica.
const PRIORIDADES: Record<
  Prioridad,
  { etiqueta: string; color: string; descripcion: string }
> = {
  "3": {
    etiqueta: "Alta",
    color: "bg-red-500",
    descripcion: "Desplaza actividades de menor prioridad.",
  },
  "2": {
    etiqueta: "Media",
    color: "bg-amber-500",
    descripcion: "Prioridad intermedia.",
  },
  "1": {
    etiqueta: "Baja",
    color: "bg-slate-400",
    descripcion: "Se reprograma si llega algo de mayor prioridad.",
  },
}

interface ResumenEventoProps {
  datos: DatosEvento
}

// Panel lateral que arma un resumen del evento en tiempo real mientras se
// completa el formulario, más una leyenda de prioridades.
export function ResumenEvento({ datos }: ResumenEventoProps) {
  const prioridad = PRIORIDADES[datos.prioridad]
  const fechaLegible = parsearISO(datos.fecha).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  })

  return (
    <Card className="bg-muted/30 lg:sticky lg:top-8">
      <CardContent className="space-y-5 pt-6">
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Resumen
          </p>
          <h3 className="text-xl leading-tight font-semibold break-words">
            {datos.nombreEvento.trim() || "Evento sin nombre"}
          </h3>
        </div>

        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-2.5">
            <Building2 className="size-4 shrink-0 text-muted-foreground" />
            <span>{datos.idEspacio || "—"}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
            <span>
              {datos.dia}
              <span className="text-muted-foreground"> · {fechaLegible}</span>
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="size-4 shrink-0 text-muted-foreground" />
            <span className="tabular-nums">
              {datos.hInicio} – {datos.hFin}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                "ml-0.5 size-3 shrink-0 rounded-full",
                prioridad.color,
              )}
            />
            <span>
              Prioridad{" "}
              <span className="font-medium">{prioridad.etiqueta}</span>
            </span>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="mb-2.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Prioridades
          </p>
          <ul className="space-y-2 text-sm">
            {(["3", "2", "1"] as Prioridad[]).map((clave) => (
              <li key={clave} className="flex gap-2.5">
                <span
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full",
                    PRIORIDADES[clave].color,
                  )}
                />
                <span>
                  <span className="font-medium">
                    {PRIORIDADES[clave].etiqueta}.
                  </span>{" "}
                  <span className="text-muted-foreground">
                    {PRIORIDADES[clave].descripcion}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
