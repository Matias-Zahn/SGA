import { useRef, useState } from "react"
import { BookOpen, Loader2, Upload, Users, XCircle } from "lucide-react"
import {
  type FilaAsignacion,
  type ResultadoImportacion,
} from "@/datos/datosSimulados"
import {
  ENCABEZADOS_PLANILLA,
  ErrorPlanilla,
  leerPlanilla,
} from "@/utilidades/leerPlanilla"
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
// Se sube un archivo .xlsx/.csv que se lee con SheetJS y se envía al backend;
// el resultado se muestra en un diálogo con el detalle de filas correctas e
// incorrectas.
export function ImportarAsignacion() {
  const [resultados, setResultados] = useState<ResultadoImportacion[]>([])
  const [dialogAbierto, setDialogAbierto] = useState(false)
  const [cargando, setCargando] = useState(false)
  // Diálogo de error para fallos de conexión o de lectura de archivo.
  const [errorAbierto, setErrorAbierto] = useState(false)
  const [mensajeError, setMensajeError] = useState("")
  // Referencia al input file para poder resetearlo tras cada importación.
  const inputArchivoRef = useRef<HTMLInputElement>(null)

  // Envía una planilla (filas ya parseadas) al backend real
  // (/api/importar-asignacion) y muestra el reporte.
  async function importar(planilla: FilaAsignacion[]) {
    setCargando(true)
    try {
      const res = await fetch("/api/importar-asignacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planilla),
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

  // Lee el .xlsx/.csv elegido con SheetJS y lo envía al backend. Si la planilla
  // no tiene la estructura esperada, muestra el error sin llamar al backend.
  async function alElegirArchivo(evento: React.ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0]
    if (!archivo) return

    setCargando(true)
    try {
      const planilla = await leerPlanilla(archivo)
      await importar(planilla)
    } catch (error) {
      setMensajeError(
        error instanceof ErrorPlanilla
          ? error.message
          : "No se pudo leer el archivo. Asegurate de que sea un .xlsx o .csv válido.",
      )
      setErrorAbierto(true)
      setCargando(false)
    } finally {
      // Reseteamos el input para poder volver a elegir el mismo archivo.
      if (inputArchivoRef.current) inputArchivoRef.current.value = ""
    }
  }

  return (
    <div>
      <EncabezadoPagina
        titulo="Asignación"
        descripcion="Cargá las planillas del cuatrimestre. El sistema valida cada fila y reporta colisiones o datos inexistentes."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Asignación cuatrimestral</CardTitle>
            <CardDescription>
              Subí la planilla en formato .xlsx o .csv con las columnas:{" "}
              {ENCABEZADOS_PLANILLA.join(", ")}.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <input
              ref={inputArchivoRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={alElegirArchivo}
              className="hidden"
            />
            <Button
              onClick={() => inputArchivoRef.current?.click()}
              className="gap-2"
              disabled={cargando}
            >
              {cargando ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Procesando planilla...
                </>
              ) : (
                <>
                  <Upload className="size-4" />
                  Subir planilla (.xlsx / .csv)
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Importar planilla docente</CardTitle>
            <CardDescription>
              Cargá la planilla de docentes para darlos de alta en el sistema.
              Esta funcionalidad estará disponible más adelante.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="gap-2" disabled>
              <Users className="size-4" />
              Próximamente
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Importar planilla de materia</CardTitle>
            <CardDescription>
              Cargá la planilla de materias para darlas de alta en el sistema.
              Esta funcionalidad estará disponible más adelante.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="gap-2" disabled>
              <BookOpen className="size-4" />
              Próximamente
            </Button>
          </CardContent>
        </Card>
      </div>

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
