import { Docente } from "./Docente";

export class CatalogoDocentes {
  private docentes: Docente[] = [];

  constructor() {
    // Los datos se cargan desde el seed en server.ts (ver src/datos/docentes.json).
  }

  // Agrega un docente al catálogo (usado por el seed inicial).
  public agregarDocente(docente: Docente): void {
    this.docentes.push(docente);
  }

  // El método que usa tu Controlador (Paso 7 del Diagrama de Secuencia)
  public getDocente(legajo: string): Docente | undefined {
    return this.docentes.find((d) => d.getLegajo() === legajo);
  }
}
