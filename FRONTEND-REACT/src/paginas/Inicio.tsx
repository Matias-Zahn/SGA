import { CalendarPlus, FileSpreadsheet } from "lucide-react"
import { EncabezadoPagina } from "@/componentes/EncabezadoPagina"
import { TarjetaAccion } from "@/componentes/TarjetaAccion"

// Página de inicio: presenta el sistema y da accesos a cada funcionalidad.
export function Inicio() {
  return (
    <div>
      <EncabezadoPagina
        titulo="Sistema Gestor de Aulas"
        descripcion="Gestioná las asignaciones cuatrimestrales y los eventos únicos de los espacios."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TarjetaAccion
          titulo="Importar Asignación"
          descripcion="Cargá una planilla cuatrimestral y revisá qué filas se asignaron y cuáles fallaron."
          ruta="/importar"
          icono={FileSpreadsheet}
        />
        <TarjetaAccion
          titulo="Registrar Evento"
          descripcion="Reservá un espacio para un evento puntual y verificá que no haya colisiones."
          ruta="/eventos"
          icono={CalendarPlus}
        />
      </div>
    </div>
  )
}
