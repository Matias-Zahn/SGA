import { Materia } from "./Materia"; // Asegurate de importar la clase

export class CatalogoMaterias {
  // Ahora guardamos instancias reales de la entidad
  private materias: Materia[] = [];

  constructor() {
    // Simulamos la base de datos "precargada" instanciando las materias
    this.materias.push(new Materia("AYD", "Análisis y Diseño de Sistemas"));
    this.materias.push(new Materia("ANALISIS-MAT", "Análisis Matemático"));
    this.materias.push(
      new Materia("ESTADISTICA", "Estadística y Probabilidad"),
    );
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
