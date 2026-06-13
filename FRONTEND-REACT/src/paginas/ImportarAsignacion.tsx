import { useState } from "react"
import { FileSpreadsheet, Loader2, XCircle } from "lucide-react"
import {
  planillaSimulada,
  type ResultadoImportacion,
} from "@/datos/datosSimulados"
import { EncabezadoPagina } from "@/componentes/EncabezadoPagina"
import { DialogReporteImportacion } from "@/componentes/DialogReporteImportacion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Página para importar la asignación cuatrimestral.
// Por ahora usa una planilla simulada; el resultado se muestra en un diálogo
// con el detalle de filas correctas e incorrectas.
export function ImportarAsignacion() {
  const [resultados, setResultados] = useState<ResultadoImportacion[]>([])
  const [dialogAbierto, setDialogAbierto] = useState(false)
  const [cargando, setCargando] = useState(false)
  // Diálogo de error para fallos de conexión con el backend.
  const [errorAbierto, setErrorAbierto] = useState(false)
  const [mensajeError, setMensajeError] = useState("")

  // Envía la planilla al backend real (/api/importar-asignacion). Mantenemos un
  // retardo simulado para que se vea el indicador de carga antes del reporte.
  async function importar() {
    setCargando(true)
    try {
      await new Promise((resolver) => setTimeout(resolver, 1500))

      const res = await fetch("/api/importar-asignacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planillaSimulada),
      })

      if (!res.ok) {
        throw new Error(`El servidor respondió con estado ${res.status}.`)
      }

      const data = await res.json()
      setResultados(data.reporte)
      setDialogAbierto(true)
    } catch {
      setMensajeError(
        "No se pudo conectar con el servidor. Verificá que el backend esté corriendo en http://localhost:3000 e intentá de nuevo.",
      )
      setErrorAbierto(true)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div>
      <EncabezadoPagina
        titulo="Importar Asignación Cuatrimestral"
        descripcion="Cargá la planilla de asignaciones. El sistema valida cada fila y reporta colisiones o datos inexistentes."
      />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Planilla de asignaciones</CardTitle>
          <CardDescription>
            La lectura del archivo .xlsx se implementará más adelante. Por ahora
            se procesa una planilla de ejemplo con {planillaSimulada.length}{" "}
            filas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={importar} className="gap-2" disabled={cargando}>
            {cargando ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Procesando planilla...
              </>
            ) : (
              <>
                <FileSpreadsheet className="size-4" />
                Simular importación de planilla
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <DialogReporteImportacion
        abierto={dialogAbierto}
        alCambiarAbierto={setDialogAbierto}
        resultados={resultados}
      />

      <Dialog open={errorAbierto} onOpenChange={setErrorAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="size-5 text-destructive" />
              Error de conexión
            </DialogTitle>
            <DialogDescription>{mensajeError}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
