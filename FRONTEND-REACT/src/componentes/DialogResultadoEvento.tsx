import { Bell, CheckCircle2, XCircle } from "lucide-react"
import type { ResultadoEvento } from "@/datos/datosSimulados"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DialogResultadoEventoProps {
  abierto: boolean
  alCambiarAbierto: (abierto: boolean) => void
  resultado: ResultadoEvento | null
  // [NUEVO - Notificar a Responsable] Callback para abrir el flujo de
  // notificación; solo se ofrece cuando hubo una expropiación.
  alNotificar?: () => void
}

// Diálogo de confirmación que informa si el evento se registró con éxito
// o si fue rechazado (por ejemplo, por colisión de horarios).
export function DialogResultadoEvento({
  abierto,
  alCambiarAbierto,
  resultado,
  alNotificar,
}: DialogResultadoEventoProps) {
  if (!resultado) return null

  // [NUEVO - Notificar a Responsable] Solo ofrecemos notificar cuando el
  // registro implicó expropiar (hay una actividad desplazada con responsable).
  const huboExpropiacion =
    resultado.exito &&
    resultado.estado === "EXPROPIACION_REALIZADA" &&
    !!resultado.actividadAfectada &&
    !!alNotificar

  return (
    <Dialog open={abierto} onOpenChange={alCambiarAbierto}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {resultado.exito ? (
              <CheckCircle2 className="size-5 text-green-600" />
            ) : (
              <XCircle className="size-5 text-destructive" />
            )}
            {resultado.exito ? "Evento registrado" : "No se pudo registrar"}
          </DialogTitle>
          <DialogDescription>
            {resultado.exito ? resultado.mensaje : resultado.error}
          </DialogDescription>
        </DialogHeader>

        {/* [NUEVO - Notificar a Responsable] Botón para iniciar la notificación
            al responsable de la actividad que se desplazó. */}
        {huboExpropiacion && (
          <DialogFooter>
            <Button className="gap-2" onClick={alNotificar}>
              <Bell className="size-4" />
              Notificar al responsable
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
