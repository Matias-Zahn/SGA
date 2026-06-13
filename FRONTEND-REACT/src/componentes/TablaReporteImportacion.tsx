import type { ResultadoImportacion } from "@/datos/datosSimulados"
import { BadgeEstado } from "@/componentes/BadgeEstado"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface TablaReporteImportacionProps {
  resultados: ResultadoImportacion[]
}

// Tabla que muestra fila por fila el resultado de la importación:
// qué materia/espacio se procesó, su estado y el mensaje o error asociado.
export function TablaReporteImportacion({
  resultados,
}: TablaReporteImportacionProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Materia</TableHead>
          <TableHead>Espacio</TableHead>
          <TableHead>Día / Horario</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Detalle</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {resultados.map((resultado, indice) => (
          <TableRow key={indice}>
            <TableCell className="font-medium">
              {resultado.fila.codigoMateria}
            </TableCell>
            <TableCell>{resultado.fila.idEspacio}</TableCell>
            <TableCell className="whitespace-nowrap text-muted-foreground">
              {resultado.fila.dia} · {resultado.fila.hInicio}-
              {resultado.fila.hFin}
            </TableCell>
            <TableCell>
              <BadgeEstado exito={resultado.exito} />
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {resultado.exito ? resultado.mensaje : resultado.error}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
