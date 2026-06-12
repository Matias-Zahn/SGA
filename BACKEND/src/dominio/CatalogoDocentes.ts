import { Docente } from "./Docente";

export class CatalogoDocentes {
  private docentes: Docente[] = [];

  constructor() {
    // Simulamos un par de profes para que puedas probar tu importación
    this.docentes.push(
      new Docente("Fabiana", "Sánchez", "fabiana@unp.edu.ar", "DOC-001"),
    );
    this.docentes.push(
      new Docente("Francisco", "Viviers", "francisco@unp.edu.ar", "DOC-002"),
    );
  }

  // El método que usa tu Controlador (Paso 7 del Diagrama de Secuencia)
  public getDocente(legajo: string): Docente | undefined {
    return this.docentes.find((d) => d.getLegajo() === legajo);
  }
}
