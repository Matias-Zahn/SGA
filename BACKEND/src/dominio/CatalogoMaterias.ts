import { Materia } from "./Materia"; // Asegurate de importar la clase

export class CatalogoMaterias {
  // Ahora guardamos instancias reales de la entidad
  private materias: Materia[] = [];

  constructor() {
    // Los datos se cargan desde el seed en server.ts (ver src/datos/materias.json).
  }

  // Agrega una materia al catálogo (usado por el seed inicial).
  public agregarMateria(materia: Materia): void {
    this.materias.push(materia);
  }

  // ESTE ES EL MÉTODO NUEVO que requiere tu Diagrama de Secuencia (Paso 5)
  public getMateria(codigoMateria: string): Materia | undefined {
    return this.materias.find((m) => m.getCodigo() === codigoMateria);
  }

  // Podemos mantener este método por si alguna otra parte del sistema solo quiere
  // hacer una validación rápida sin traerse el objeto entero
  public existeMateria(codigoMateria: string): boolean {
    return this.materias.some((m) => m.getCodigo() === codigoMateria);
  }
}
