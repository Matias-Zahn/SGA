import { useState, type FormEvent } from "react"
import { CalendarDays } from "lucide-react"
import type { DatosEvento, Prioridad } from "@/datos/datosSimulados"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { diaSemanaCapitalizado, formatoISO, parsearISO } from "@/lib/fechas"

// Opciones de prioridad mostradas en el desplegable.
const opcionesPrioridad: { valor: Prioridad; etiqueta: string }[] = [
  { valor: "1", etiqueta: "1 - Baja" },
  { valor: "2", etiqueta: "2 - Media" },
  { valor: "3", etiqueta: "3 - Alta" },
]

// Opciones de hora (07:00 a 23:00 en pasos de 30 minutos).
const opcionesHora: string[] = []
for (let h = 7; h <= 23; h++) {
  for (const m of ["00", "30"]) {
    opcionesHora.push(`${String(h).padStart(2, "0")}:${m}`)
  }
}

interface FormularioEventoProps {
  datos: DatosEvento
  onCambiar: (datos: DatosEvento) => void
  alEnviar: () => void
}

// Formulario controlado para registrar un evento único.
// El estado vive en el componente padre (para el resumen en vivo).
export function FormularioEvento({
  datos,
  onCambiar,
  alEnviar,
}: FormularioEventoProps) {
  const [calendarioAbierto, setCalendarioAbierto] = useState(false)

  function actualizarCampo(campo: keyof DatosEvento, valor: string) {
    onCambiar({ ...datos, [campo]: valor })
  }

  // Al elegir una fecha en el calendario, también derivamos el día de la semana.
  function elegirFecha(fecha: Date) {
    onCambiar({
      ...datos,
      fecha: formatoISO(fecha),
      dia: diaSemanaCapitalizado(fecha),
    })
    setCalendarioAbierto(false)
  }

  function manejarEnvio(evento: FormEvent) {
    evento.preventDefault()
    alEnviar()
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
          <Label>Fecha</Label>
          <Popover open={calendarioAbierto} onOpenChange={setCalendarioAbierto}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start gap-2 font-normal"
              >
                <CalendarDays className="size-4" />
                {parsearISO(datos.fecha).toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={parsearISO(datos.fecha)}
                onSelect={(fecha) => fecha && elegirFecha(fecha)}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dia">Día</Label>
          <Input id="dia" value={datos.dia} disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hInicio">Hora de inicio</Label>
          <Select
            value={datos.hInicio}
            onValueChange={(valor) => actualizarCampo("hInicio", valor)}
          >
            <SelectTrigger id="hInicio" className="w-full">
              <SelectValue placeholder="Inicio" />
            </SelectTrigger>
            <SelectContent position="popper" className="max-h-60">
              {opcionesHora.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="hFin">Hora de fin</Label>
          <Select
            value={datos.hFin}
            onValueChange={(valor) => actualizarCampo("hFin", valor)}
          >
            <SelectTrigger id="hFin" className="w-full">
              <SelectValue placeholder="Fin" />
            </SelectTrigger>
            <SelectContent position="popper" className="max-h-60">
              {opcionesHora.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
