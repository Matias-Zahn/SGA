import { Docente } from "./Docente";
import { Espacio } from "./Espacio";

export class Asignacion {
  private diaSemana: string;
  private fInicio: string;
  private fFin: string;
  private hInicio: string;
  private hFin: string;
  private estado: string;
  private espacio: Espacio; // Referencia al aula asignada
  private docente: Docente; // Referencia al aula asignada

  // El constructor de tu DCD (Mensaje 5 del Diagrama de Secuencia)
  constructor(
    espacio: Espacio,
    docente: Docente,
    diaSemana: string,
    fInicio: string,
    fFin: string,
    hInicio: string,
    hFin: string,
  ) {
    this.espacio = espacio;
    this.docente = docente;
    this.diaSemana = diaSemana;
    this.fInicio = fInicio;
    this.fFin = fFin;
    this.hInicio = hInicio;
    this.hFin = hFin;
    this.estado = "Activa";
  }

  // Mensaje 6 del Diagrama de Secuencia
  public generarSesiones(): void {
    // Acá iría la lógica de calcular los días exactos entre fInicio y fFin.
    // Para la demo, podemos dejar un console.log que demuestre que el método se ejecuta.
    console.log(
      `[Dominio] Generando sesiones individuales para los días ${this.diaSemana}...`,
    );
  }

  // Getters necesarios para que el Espacio pueda leer estos datos
  public getDia(): string {
    return this.diaSemana;
  }
  public getFInicio(): string {
    return this.fInicio;
  }
  public getFFin(): string {
    return this.fFin;
  }
  public getHInicio(): string {
    return this.hInicio;
  }
  public getHFin(): string {
    return this.hFin;
  }
}
