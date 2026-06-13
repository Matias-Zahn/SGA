import { RegistroActividad } from "./RegistroActividad";
import { Asignacion } from "./Asignacion";

export class SesionClase extends RegistroActividad {
  private nro_clase: number;
  private tipo_clase: string;
  private asignacionPadre: Asignacion; // Conoce a quien la generó

  constructor(
    fecha: string,
    hInicio: string,
    hFin: string,
    nro_clase: number,
    tipo_clase: string,
    asignacionPadre: Asignacion,
  ) {
    // Hereda la prioridad 1 por defecto (clase regular)
    super(fecha, hInicio, hFin, 1);
    this.nro_clase = nro_clase;
    this.tipo_clase = tipo_clase;
    this.asignacionPadre = asignacionPadre;
  }

  public getNombre(): string {
    // Busca el nombre pidiéndoselo a su clase padre
    return this.asignacionPadre.getNombre();
  }
}
