import type { ResultadoImportacion } from "@/datos/datosSimulados"
import { TablaReporteImportacion } from "@/componentes/TablaReporteImportacion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DialogReporteImportacionProps {
  abierto: boolean
  alCambiarAbierto: (abierto: boolean) => void
  resultados: ResultadoImportacion[]
}

// Diálogo que presenta el reporte completo de la importación: un resumen
// con la cantidad de filas correctas/incorrectas y el detalle en tabla.
export function DialogReporteImportacion({
  abierto,
  alCambiarAbierto,
  resultados,
}: DialogReporteImportacionProps) {
  const correctas = resultados.filter((r) => r.exito).length
  const incorrectas = resultados.length - correctas

  return (
    <Dialog open={abierto} onOpenChange={alCambiarAbierto}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Reporte de importación</DialogTitle>
          <DialogDescription>
            Se procesaron {resultados.length} filas:{" "}
            <span className="font-medium text-green-600">
              {correctas} correctas
            </span>{" "}
            y{" "}
            <span className="font-medium text-destructive">
              {incorrectas} con errores
            </span>
            .
          </DialogDescription>
        </DialogHeader>
        <TablaReporteImportacion resultados={resultados} />
      </DialogContent>
    </Dialog>
  )
}
