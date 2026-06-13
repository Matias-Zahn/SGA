import { CheckCircle2, XCircle } from "lucide-react"
import type { ResultadoEvento } from "@/datos/datosSimulados"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DialogResultadoEventoProps {
  abierto: boolean
  alCambiarAbierto: (abierto: boolean) => void
  resultado: ResultadoEvento | null
}

// Diálogo de confirmación que informa si el evento se registró con éxito
// o si fue rechazado (por ejemplo, por colisión de horarios).
export function DialogResultadoEvento({
  abierto,
  alCambiarAbierto,
  resultado,
}: DialogResultadoEventoProps) {
  if (!resultado) return null

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
      </DialogContent>
    </Dialog>
  )
}
