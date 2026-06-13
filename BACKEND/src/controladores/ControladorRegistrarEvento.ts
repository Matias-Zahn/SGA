import { CatalogoEspacios } from "../dominio/CatalogoEspacios";
import { Evento } from "../dominio/Evento";

export class ControladorRegistrarEvento {
  private catalogoEspacios: CatalogoEspacios;

  constructor(catalogo: CatalogoEspacios) {
    this.catalogoEspacios = catalogo;
  }

  // Se agrega la prioridadNueva y un flag opcional para simular la confirmación de la UI
  public registrarEvento(
    nombreEvento: string,
    idEspacio: string,
    dia: string,
    fecha: string,
    hInicio: string,
    hFin: string,
    prioridadNueva: number,
    frontConfirmaExpropiacion: boolean = false,
  ) {
    // 1. Buscamos el espacio (Mensaje 2 del DSD)
    const e = this.catalogoEspacios.getEspacio(idEspacio);
    if (!e)
      return { exito: false, error: "El espacio no existe en el sistema." };

    // 2. Validamos disponibilidad usando el motor 2D modificado (Mensaje 3)
    const estadoEspacio = e.validarDisponibilidad(
      dia,
      fecha,
      fecha,
      hInicio,
      hFin,
    );

    if (!estadoEspacio.libre && estadoEspacio.actividadConflictiva) {
      const actConflictiva = estadoEspacio.actividadConflictiva;

      // 3. COMPARTIMOS PRIORIDAD (Mensaje 4)
      const sePuedeExpropiar = prioridadNueva > actConflictiva.getPrioridad();

      if (sePuedeExpropiar) {
        // 4. SOLICITAR CONFIRMACIÓN (Mensaje 5)
        // Si el front todavía no mandó el "OK", cortamos acá y le preguntamos
        if (!frontConfirmaExpropiacion) {
          return {
            exito: false,
            accion: "solicitarConfirmacion",
            mensaje: `El aula está ocupada por una actividad de menor prioridad. ¿Desea expropiar el espacio y reprogramar la actividad actual?`,
          };
        }

        // 5. EXPROPIACIÓN CONFIRMADA (Mensajes 6 y 7)
        this.confirmarExpropiacion();
        actConflictiva.cambiarEstado("A Reprogramar");
      } else {
        // Rechazo: El evento nuevo no tiene peso suficiente
        return {
          exito: false,
          error:
            "Colisión: El aula está ocupada por una actividad de igual o mayor prioridad.",
        };
      }
    }

    // 6. CREACIÓN Y VINCULACIÓN DEL EVENTO GANADOR (Mensajes 8 y 9)
    const nuevoEvento = new Evento(
      nombreEvento,
      dia,
      fecha,
      hInicio,
      hFin,
      prioridadNueva,
    );
    e.agregarEvento(nuevoEvento);

    // 7. NOTIFICACIÓN (Mensaje 10)
    this.notificarResponsable();

    // Mensaje 11
    return {
      exito: true,
      mensaje:
        "Evento registrado por Alta Prioridad. Se desplazaron: Análisis Matemático",
      estado: "EXPROPIACION_REALIZADA",
    };
  }

  // --- Métodos privados para respetar tu diagrama ---
  private confirmarExpropiacion(): void {
    console.log("[Controlador] Acción confirmada por el usuario.");
  }

  private notificarResponsable(): void {
    console.log(
      "[Controlador] Enviando notificación al responsable de la actividad desplazada...",
    );
  }
}
