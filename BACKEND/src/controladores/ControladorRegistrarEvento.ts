import { CatalogoEspacios } from "../dominio/CatalogoEspacios";
import { Evento } from "../dominio/Evento";

// [NUEVO - Notificar a Responsable] Datos de la actividad desplazada por una
// expropiación. Se devuelven al front (en la respuesta de éxito) para que el
// operador de Bedelía pueda luego "Notificar al responsable". Es solo
// informativo/demostrativo: no dispara ningún envío real.
interface ActividadAfectada {
  nombre: string;
  tipo: string; // "Asignacion" | "Evento"
  idEspacio: string;
  dia: string;
  fecha: string;
  hInicio: string;
  hFin: string;
  responsable: { nombre: string; contacto: string };
}

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
    // [NUEVO - Notificar a Responsable] Queda en null salvo que haya expropiación.
    let actividadAfectada: ActividadAfectada | null = null;

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

        // [NUEVO - Notificar a Responsable] Recopilamos los datos de la
        // actividad desplazada y su responsable para devolverlos al front.
        actividadAfectada = {
          nombre: actConflictiva.getNombre(),
          tipo: estadoEspacio.tipo ?? "",
          idEspacio,
          dia,
          fecha,
          hInicio: actConflictiva.getHInicio(),
          hFin: actConflictiva.getHFin(),
          responsable: {
            nombre: actConflictiva.getResponsableNombre(),
            contacto: actConflictiva.getResponsableContacto(),
          },
        };

        this.notificarResponsable(actividadAfectada);

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
      // [NUEVO - Notificar a Responsable] null en registro normal; con datos
      // cuando hubo expropiación (para habilitar la notificación en el front).
      actividadAfectada,
    };
  }

  private confirmarExpropiacion(): void {
    console.log("[Controlador] Acción confirmada por el usuario.");
  }

  // [NUEVO - Notificar a Responsable] Recibe los datos de la actividad afectada
  // para dejar registro (demostrativo). El envío real se simula en el front.
  private notificarResponsable(afectada?: ActividadAfectada): void {
    console.log(
      "[Controlador] Notificación pendiente para el responsable de la actividad desplazada:",
      afectada
        ? `${afectada.responsable.nombre} <${afectada.responsable.contacto}> — ${afectada.nombre}`
        : "(sin datos)",
    );
  }
}
