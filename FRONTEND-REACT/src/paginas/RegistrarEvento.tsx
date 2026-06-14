import { useState } from "react"
import {
  type DatosEvento,
  type ResultadoEvento,
} from "@/datos/datosSimulados"
import { EncabezadoPagina } from "@/componentes/EncabezadoPagina"
import { FormularioEvento } from "@/componentes/FormularioEvento"
import { ResumenEvento } from "@/componentes/ResumenEvento"
import { diaSemanaCapitalizado, formatoISO } from "@/lib/fechas"
import { DialogResultadoEvento } from "@/componentes/DialogResultadoEvento"
import { DialogConfirmarExpropiacion } from "@/componentes/DialogConfirmarExpropiacion"
// [NUEVO - Notificar a Responsable]
import { DialogNotificarResponsable } from "@/componentes/DialogNotificarResponsable"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Página para registrar un evento único en un espacio.
// El resultado (éxito o colisión) se confirma en un diálogo.
// Cuerpo que se envía al endpoint de registro de evento.
interface BodyEvento {
  nombreEvento: string
  nombreSolicitante: string
  contactoSolicitante: string
  idEspacio: string
  dia: string
  fecha: string
  hInicio: string
  hFin: string
  prioridadNueva: number
  frontConfirmaExpropiacion: boolean | null
}

export function RegistrarEvento() {
  // Datos del formulario (acá viven para alimentar el resumen en vivo).
  // Por defecto: el día de hoy.
  const [datos, setDatos] = useState<DatosEvento>(() => ({
    nombreEvento: "Congreso de Informática",
    nombreSolicitante: "",
    contactoSolicitante: "",
    idEspacio: "AULA-101",
    dia: diaSemanaCapitalizado(new Date()),
    fecha: formatoISO(new Date()),
    hInicio: "10:00",
    hFin: "13:00",
    prioridad: "2",
  }))

  const [resultado, setResultado] = useState<ResultadoEvento | null>(null)
  const [dialogAbierto, setDialogAbierto] = useState(false)

  // [NUEVO - Notificar a Responsable] Estado del diálogo de notificación.
  const [notificarAbierto, setNotificarAbierto] = useState(false)

  // Estado del diálogo de confirmación de expropiación (conflicto "blando").
  const [confirmacionAbierta, setConfirmacionAbierta] = useState(false)
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState("")
  // Guardamos el body del intento que quedó pendiente de confirmación para
  // reenviarlo con la bandera en true si el usuario acepta expropiar.
  const [bodyPendiente, setBodyPendiente] = useState<BodyEvento | null>(null)

  function registrar() {
    const body: BodyEvento = {
      nombreEvento: datos.nombreEvento,
      nombreSolicitante: datos.nombreSolicitante,
      contactoSolicitante: datos.contactoSolicitante,
      idEspacio: datos.idEspacio,
      dia: datos.dia,
      fecha: datos.fecha,
      hInicio: datos.hInicio,
      hFin: datos.hFin,
      prioridadNueva: Number(datos.prioridad),
      frontConfirmaExpropiacion: null,
    }
    enviarEvento(body)
  }

  // Dispara el POST y reparte la respuesta en las tres salidas posibles.
  async function enviarEvento(body: BodyEvento) {
    const res = await fetch("/api/registrar-evento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (res.status === 200) {
      // Éxito: registro directo o tras una expropiación confirmada.
      setResultado(data)
      setDialogAbierto(true)
    } else if (res.status === 409 && data.accion === "solicitarConfirmacion") {
      // CONFLICTO BLANDO: choca con algo de menor prioridad. El back nos pide
      // permiso, así que levantamos el diálogo de confirmación.
      setBodyPendiente(body)
      setMensajeConfirmacion(data.mensaje)
      setConfirmacionAbierta(true)
    } else {
      // CONFLICTO DURO: choca con algo de igual o mayor prioridad (rechazo).
      setResultado(data)
      setDialogAbierto(true)
    }
  }

  // El usuario aceptó expropiar: reenviamos el intento con la bandera en true.
  function confirmarExpropiacion() {
    if (!bodyPendiente) return
    setConfirmacionAbierta(false)
    enviarEvento({ ...bodyPendiente, frontConfirmaExpropiacion: true })
    setBodyPendiente(null)
  }

  return (
    <div>
      <EncabezadoPagina
        titulo="Registrar Evento Único"
        descripcion="Reservá un espacio para un evento puntual. El sistema verifica que no choque con otras actividades."
      />

      <div className="grid items-start gap-6 lg:grid-cols-[20rem_1fr]">
        <ResumenEvento datos={datos} />

        <Card>
          <CardHeader>
            <CardTitle>Datos del evento</CardTitle>
            <CardDescription>
              Completá el formulario. Probá con la hora de inicio 18:00 para ver
              una colisión simulada.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormularioEvento
              datos={datos}
              onCambiar={setDatos}
              alEnviar={registrar}
            />
          </CardContent>
        </Card>
      </div>

      <DialogResultadoEvento
        abierto={dialogAbierto}
        alCambiarAbierto={setDialogAbierto}
        resultado={resultado}
        // [NUEVO - Notificar a Responsable] Cerramos el resultado y abrimos la
        // notificación con los datos de la actividad desplazada.
        alNotificar={() => {
          setDialogAbierto(false)
          setNotificarAbierto(true)
        }}
      />

      {/* [NUEVO - Notificar a Responsable] */}
      <DialogNotificarResponsable
        abierto={notificarAbierto}
        alCambiarAbierto={setNotificarAbierto}
        actividad={resultado?.actividadAfectada ?? null}
      />

      <DialogConfirmarExpropiacion
        abierto={confirmacionAbierta}
        alCambiarAbierto={setConfirmacionAbierta}
        mensaje={mensajeConfirmacion}
        alConfirmar={confirmarExpropiacion}
      />
    </div>
  )
}
