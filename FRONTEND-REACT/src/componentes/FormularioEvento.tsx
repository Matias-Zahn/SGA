import { useState, type FormEvent } from "react"
import type { DatosEvento, Prioridad } from "@/datos/datosSimulados"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Opciones de prioridad mostradas en el desplegable.
const opcionesPrioridad: { valor: Prioridad; etiqueta: string }[] = [
  { valor: "1", etiqueta: "1 - Baja" },
  { valor: "2", etiqueta: "2 - Media" },
  { valor: "3", etiqueta: "3 - Alta" },
]

interface FormularioEventoProps {
  alEnviar: (datos: DatosEvento) => void
}

// Valores iniciales del formulario (mismos del prototipo legado).
const valoresIniciales: DatosEvento = {
  nombreEvento: "Congreso de Informática",
  idEspacio: "AULA-101",
  dia: "Lunes",
  fecha: "2026-08-10",
  hInicio: "10:00",
  hFin: "13:00",
  prioridad: "2",
}

// Formulario controlado para registrar un evento único.
// No conoce el backend: delega los datos cargados al componente padre.
export function FormularioEvento({ alEnviar }: FormularioEventoProps) {
  const [datos, setDatos] = useState<DatosEvento>(valoresIniciales)

  function actualizarCampo(campo: keyof DatosEvento, valor: string) {
    setDatos((previo) => ({ ...previo, [campo]: valor }))
  }

  function manejarEnvio(evento: FormEvent) {
    evento.preventDefault()
    alEnviar(datos)
  }

  return (
    <form onSubmit={manejarEnvio} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nombreEvento">Nombre del evento</Label>
          <Input
            id="nombreEvento"
            value={datos.nombreEvento}
            onChange={(e) => actualizarCampo("nombreEvento", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="idEspacio">ID del espacio</Label>
          <Input
            id="idEspacio"
            value={datos.idEspacio}
            onChange={(e) => actualizarCampo("idEspacio", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dia">Día</Label>
          <Input
            id="dia"
            value={datos.dia}
            onChange={(e) => actualizarCampo("dia", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fecha">Fecha</Label>
          <Input
            id="fecha"
            type="date"
            value={datos.fecha}
            onChange={(e) => actualizarCampo("fecha", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hInicio">Hora de inicio</Label>
          <Input
            id="hInicio"
            type="time"
            value={datos.hInicio}
            onChange={(e) => actualizarCampo("hInicio", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hFin">Hora de fin</Label>
          <Input
            id="hFin"
            type="time"
            value={datos.hFin}
            onChange={(e) => actualizarCampo("hFin", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prioridad">Prioridad</Label>
          <Select
            value={datos.prioridad}
            onValueChange={(valor) => actualizarCampo("prioridad", valor)}
          >
            <SelectTrigger id="prioridad" className="w-full">
              <SelectValue placeholder="Seleccioná una prioridad" />
            </SelectTrigger>
            <SelectContent>
              {opcionesPrioridad.map((opcion) => (
                <SelectItem key={opcion.valor} value={opcion.valor}>
                  {opcion.etiqueta}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit">Registrar evento</Button>
    </form>
  )
}
