import { Espacio } from "./Espacio";
import { Asignacion } from "./Asignacion";
import { Docente } from "./Docente"; // 1. Importamos la clase Docente

export class Materia {
  private codigoMateria: string;
  private nombre: string;
  private asignaciones: Asignacion[] = []; // Relación Materia 1 --> * Asignacion

  constructor(codigo: string, nombre: string) {
    this.codigoMateria = codigo;
    this.nombre = nombre;
  }

  public getCodigo(): string {
    return this.codigoMateria;
  }

  // 2. Agregamos el Docente 'd' a la firma del método
  public crearAsignacion(
    e: Espacio,
    d: Docente,
    diaSemana: string,
    fInicio: string,
    fFin: string,
    hInicio: string,
    hFin: string,
  ): void {
    // 3. Le pasamos el Docente al constructor de la Asignación
    const nuevaAsignacion = new Asignacion(
      this.nombre,
      e,
      d,
      diaSemana,
      fInicio,
      fFin,
      hInicio,
      hFin,
    );

    // Le pide que genere las sesiones de clase
    nuevaAsignacion.generarSesiones();

    // Guardamos la relación en memoria
    this.asignaciones.push(nuevaAsignacion);

    // VINCULACIÓN: Le avisamos al Espacio que tiene una nueva asignación
    e.agregarAsignacion(nuevaAsignacion);
  }
}
