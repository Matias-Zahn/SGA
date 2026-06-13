import { CheckCircle2, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface BadgeEstadoProps {
  exito: boolean
}

// Badge que indica visualmente si una operación fue exitosa o falló.
export function BadgeEstado({ exito }: BadgeEstadoProps) {
  if (exito) {
    return (
      <Badge className="gap-1 bg-green-600 hover:bg-green-600">
        <CheckCircle2 className="size-3.5" />
        Éxito
      </Badge>
    )
  }
  return (
    <Badge variant="destructive" className="gap-1">
      <XCircle className="size-3.5" />
      Error
    </Badge>
  )
}
