import { CatalogoEspacios } from "../dominio/CatalogoEspacios";
import { Evento } from "../dominio/Evento";

export class ControladorRegistrarEvento {
  private catalogoEspacios: CatalogoEspacios;

  constructor(catalogo: CatalogoEspacios) {
    this.catalogoEspacios = catalogo;
  }

  public registrarEvento(
    nombreEvento: string,
    nombreSolicitante: string,
    contactoSolicitante: string,
    idEspacio: string,
    dia: string,
    fecha: string,
    hInicio: string,
    hFin: string,
    prioridadNueva: number,
    frontConfirmaExpropiacion: boolean = false,
  ) {
    const e = this.catalogoEspacios.getEspacio(idEspacio);
    if (!e)
      return { exito: false, error: "El espacio no existe en el sistema." };

    const estadoEspacio = e.validarDisponibilidad(
      dia,
      fecha,
      fecha,
      hInicio,
      hFin,
    );

    let mensajeFinal = "Evento registrado con éxito en el espacio asignado.";
    let estadoFinal = "REGISTRO_NORMAL";

    if (!estadoEspacio.libre && estadoEspacio.actividadConflictiva) {
      const actConflictiva = estadoEspacio.actividadConflictiva;

      // --- INICIO DEL BLINDAJE ---
      // Forzamos a que sean números reales para evitar que JS compare textos
      const pesoEvento = Number(prioridadNueva);
      const pesoMateria = Number(actConflictiva.getPrioridad());

      console.log(
        `[DEBUG] ⚔️ Conflicto detectado: Evento (Prioridad ${pesoEvento}) vs ${actConflictiva.getNombre()} (Prioridad ${pesoMateria})`,
      );

      const sePuedeExpropiar = pesoEvento > pesoMateria;
      // --- FIN DEL BLINDAJE ---

      if (sePuedeExpropiar) {
        console.log(
          `[DEBUG] 🟢 El evento gana por prioridad. Solicitando expropiación...`,
        );
        if (!frontConfirmaExpropiacion) {
          return {
            exito: false,
            accion: "solicitarConfirmacion",
            mensaje: `El aula está ocupada por ${actConflictiva.getNombre()} (prioridad menor). ¿Desea expropiar el espacio y reprogramar la actividad actual?`,
          };
        }

        this.confirmarExpropiacion();

        actConflictiva.cambiarEstado("A Reprogramar");

        this.notificarResponsable();

        mensajeFinal = `Evento registrado por Alta Prioridad. Se desplazó: ${actConflictiva.getNombre()}`;
        estadoFinal = "EXPROPIACION_REALIZADA";
      } else {
        console.log(
          `[DEBUG] 🔴 El evento pierde. La materia tiene prioridad igual o mayor.`,
        );
        return {
          exito: false,
          error: `Colisión: El aula está ocupada por ${actConflictiva.getNombre()} que tiene prioridad ${pesoMateria}.`,
        };
      }
    }

    const nuevoEvento = new Evento(
      nombreEvento,
      fecha,
      hInicio,
      hFin,
      prioridadNueva,
      nombreSolicitante,
      contactoSolicitante,
    );
    e.agregarEvento(nuevoEvento);

    return {
      exito: true,
      mensaje: mensajeFinal,
      estado: estadoFinal,
    };
  }

  private confirmarExpropiacion(): void {
    console.log("[Controlador] Acción confirmada por el usuario.");
  }

  private notificarResponsable(): void {
    console.log(
      "[Controlador] Enviando notificación al responsable de la actividad desplazada...",
    );
  }
}
