export class Evento {
  private nombreEvento: string;
  private diaSemana: string;
  private fecha: string;
  private hInicio: string;
  private hFin: string;
  private prioridad: number; // NUEVO
  private estado: string; // NUEVO

  constructor(
    nombre: string,
    dia: string,
    fecha: string,
    hInicio: string,
    hFin: string,
    prioridad: number, // NUEVO: Se recibe desde el Controlador/Front
  ) {
    this.nombreEvento = nombre;
    this.diaSemana = dia;
    this.fecha = fecha;
    this.hInicio = hInicio;
    this.hFin = hFin;
    this.prioridad = prioridad;
    this.estado = "Confirmado"; // Estado inicial por defecto
  }

  // Getters existentes...
  public getDia(): string {
    return this.diaSemana;
  }
  public getFInicio(): string {
    return this.fecha;
  }
  public getFFin(): string {
    return this.fecha;
  }
  public getHInicio(): string {
    return this.hInicio;
  }
  public getHFin(): string {
    return this.hFin;
  }

  // NUEVOS MÉTODOS PARA EL DIAGRAMA DE SECUENCIA
  public getPrioridad(): number {
    return this.prioridad;
  }

  public cambiarEstado(nuevoEstado: string): void {
    this.estado = nuevoEstado;
    console.log(
      `[Dominio] El evento '${this.nombreEvento}' cambió su estado a: ${this.estado}`,
    );
  }
}
