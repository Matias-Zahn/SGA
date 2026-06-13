import type { LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface TarjetaAccionProps {
  titulo: string
  descripcion: string
  ruta: string
  icono: LucideIcon
}

// Tarjeta clickeable del dashboard de inicio que lleva a una sección.
export function TarjetaAccion({
  titulo,
  descripcion,
  ruta,
  icono: Icono,
}: TarjetaAccionProps) {
  return (
    <Link to={ruta} className="block">
      <Card className="h-full transition-colors hover:border-primary hover:bg-muted/40">
        <CardHeader>
          <Icono className="size-8 text-primary" />
          <CardTitle>{titulo}</CardTitle>
          <CardDescription>{descripcion}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
