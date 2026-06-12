import { CatalogoEspacios } from "../dominio/CatalogoEspacios";
import { Evento } from "../dominio/Evento"; // Importamos la entidad

export class ControladorRegistrarEvento {
  private catalogoEspacios: CatalogoEspacios;

  constructor(catalogo: CatalogoEspacios) {
    this.catalogoEspacios = catalogo;
  }

  public registrarEvento(
    nombreEvento: string,
    idEspacio: string,
    dia: string,
    fecha: string,
    hInicio: string,
    hFin: string,
  ) {
    // 1. Buscamos el espacio
    const e = this.catalogoEspacios.getEspacio(idEspacio);

    if (!e) {
      return {
        exito: false,
        error: `El espacio ${idEspacio} no existe en el sistema.`,
      };
    }

    // 2. Reutilizamos la misma validación de la Entidad Experta
    const disponible = e.validarDisponibilidad(
      dia,
      fecha,
      fecha,
      hInicio,
      hFin,
    );

    if (disponible) {
      // 3. CREACIÓN REAL DEL OBJETO (Reemplaza a e.ocupar)
      const nuevoEvento = new Evento(nombreEvento, dia, fecha, hInicio, hFin);

      // Vinculamos el evento al espacio
      e.agregarEvento(nuevoEvento);

      return {
        exito: true,
        mensaje: `El evento '${nombreEvento}' fue reservado con éxito en el espacio ${idEspacio} (Día: ${dia}, de ${hInicio} a ${hFin}).`,
      };
    } else {
      // 4. Rechazamos si hay choque de horarios
      return {
        exito: false,
        error: `Colisión: El evento '${nombreEvento}' choca con otra actividad en el ${idEspacio} en el rango de ${hInicio} a ${hFin}.`,
      };
    }
  }
}
