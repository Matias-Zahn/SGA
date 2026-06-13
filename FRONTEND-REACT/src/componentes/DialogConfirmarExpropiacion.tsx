import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DialogConfirmarExpropiacionProps {
  abierto: boolean
  alCambiarAbierto: (abierto: boolean) => void
  mensaje: string
  alConfirmar: () => void
}

// Diálogo de confirmación que aparece cuando el aula está ocupada por una
// actividad de MENOR prioridad. El backend pide permiso al usuario antes de
// expropiar el espacio y reprogramar la actividad desplazada.
export function DialogConfirmarExpropiacion({
  abierto,
  alCambiarAbierto,
  mensaje,
  alConfirmar,
}: DialogConfirmarExpropiacionProps) {
  return (
    <Dialog open={abierto} onOpenChange={alCambiarAbierto}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-amber-500" />
            Confirmar expropiación del aula
          </DialogTitle>
          <DialogDescription>{mensaje}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => alCambiarAbierto(false)}
          >
            Cancelar
          </Button>
          <Button onClick={alConfirmar}>
            Expropiar y reprogramar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
