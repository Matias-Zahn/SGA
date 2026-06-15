// [NUEVO - Notificar a Responsable] Diálogo del caso de uso "Notificar a
// Responsable". Es SOLO visual/demostrativo: no envía nada real. Recopila y
// muestra los datos de la actividad afectada, pide un motivo y observaciones,
// y al confirmar simula el envío al contacto registrado.
import { useEffect, useRef, useState } from "react"
import {
  Bell,
  Building2,
  CalendarClock,
  CheckCircle2,
  Loader2,
  Send,
  User,
} from "lucide-react"
import type { ActividadAfectada } from "@/datos/datosSimulados"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { parsearISO } from "@/lib/fechas"

interface DialogNotificarResponsableProps {
  abierto: boolean
  alCambiarAbierto: (abierto: boolean) => void
  actividad: ActividadAfectada | null
}

// Motivos predefinidos para la notificación (último valor habilita texto libre).
const MOTIVOS = [
  "Expropiación de espacio",
  "Reprogramación de actividad",
  "Cancelación de actividad",
  "Otro",
]

export function DialogNotificarResponsable({
  abierto,
  alCambiarAbierto,
  actividad,
}: DialogNotificarResponsableProps) {
  const [motivo, setMotivo] = useState(MOTIVOS[0])
  const [motivoOtro, setMotivoOtro] = useState("")
  const [observaciones, setObservaciones] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  // Guardamos el timer del envío simulado para poder limpiarlo.
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reseteamos el formulario cada vez que se abre el diálogo.
  useEffect(() => {
    if (abierto) {
      setMotivo(MOTIVOS[0])
      setMotivoOtro("")
      setObservaciones("")
      setEnviando(false)
      setEnviado(false)
    }
  }, [abierto])

  // Limpiamos el timer del envío simulado al desmontar.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  if (!actividad) return null

  const fechaLegible = parsearISO(actividad.fecha).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  // Simula el envío: muestra un loader y, tras una breve espera, marca el envío
  // como exitoso. "Genera el mensaje formal y lo envía al contacto registrado" y
  // "actualiza el registro de la actividad" son solo visuales.
  function confirmarEnvio() {
    setEnviando(true)
    timerRef.current = setTimeout(() => {
      setEnviando(false)
      setEnviado(true)
    }, 1400)
  }

  return (
    <Dialog open={abierto} onOpenChange={alCambiarAbierto}>
      <DialogContent className="sm:max-w-lg">
        {enviado ? (
          // Paso final: confirmación del "envío" (demostrativo).
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-green-600" />
                Notificación enviada
              </DialogTitle>
              <DialogDescription>
                Se generó el mensaje formal y se envió a{" "}
                <span className="font-medium text-foreground">
                  {actividad.responsable.nombre}
                </span>{" "}
                ({actividad.responsable.contacto}). El registro de la actividad
                fue actualizado.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => alCambiarAbierto(false)}>Cerrar</Button>
            </DialogFooter>
          </>
        ) : enviando ? (
          // Paso intermedio: loader que simula el envío de la notificación.
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Send className="size-5 text-primary" />
                Enviando notificación
              </DialogTitle>
              <DialogDescription>
                Generando el mensaje formal y enviándolo al contacto
                registrado…
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Enviando a {actividad.responsable.contacto}…
              </p>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bell className="size-5 text-primary" />
                Notificar al responsable
              </DialogTitle>
              <DialogDescription>
                Revisá los datos de la actividad afectada, indicá el motivo y
                confirmá el envío al contacto registrado.
              </DialogDescription>
            </DialogHeader>

            {/* Información recopilada de la actividad afectada */}
            <div className="space-y-2.5 rounded-lg border bg-muted/30 p-3 text-sm">
              <div className="flex items-center gap-2.5">
                <CalendarClock className="size-4 shrink-0 text-muted-foreground" />
                <span>
                  <span className="font-medium">{actividad.nombre}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {actividad.tipo === "Evento" ? "Evento" : "Clase"}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <User className="size-4 shrink-0 text-muted-foreground" />
                <span>
                  {actividad.responsable.nombre}
                  <span className="text-muted-foreground">
                    {" "}
                    · {actividad.responsable.contacto}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Building2 className="size-4 shrink-0 text-muted-foreground" />
                <span>{actividad.idEspacio}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CalendarClock className="size-4 shrink-0 text-muted-foreground" />
                <span className="tabular-nums">
                  {fechaLegible} · {actividad.hInicio}–{actividad.hFin}
                </span>
              </div>
            </div>

            {/* Motivo */}
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo de la notificación</Label>
              <Select value={motivo} onValueChange={setMotivo}>
                <SelectTrigger id="motivo" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  {MOTIVOS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {motivo === "Otro" && (
                <input
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                  placeholder="Especificá el motivo"
                  value={motivoOtro}
                  onChange={(e) => setMotivoOtro(e.target.value)}
                />
              )}
            </div>

            {/* Observaciones (texto libre) */}
            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones (opcional)</Label>
              {/* textarea nativa estilada como el Input de shadcn (no hay
                  componente Textarea en el proyecto). */}
              <textarea
                id="observaciones"
                rows={3}
                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                placeholder="Agregá detalles para el responsable…"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => alCambiarAbierto(false)}>
                Cancelar
              </Button>
              <Button
                className="gap-2"
                onClick={confirmarEnvio}
                disabled={motivo === "Otro" && !motivoOtro.trim()}
              >
                <Send className="size-4" />
                Confirmar envío
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
