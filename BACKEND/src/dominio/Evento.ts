export class Evento {
  private nombreEvento: string;
  private diaSemana: string;
  private fecha: string;
  private hInicio: string;
  private hFin: string;

  constructor(
    nombre: string,
    dia: string,
    fecha: string,
    hInicio: string,
    hFin: string,
  ) {
    this.nombreEvento = nombre;
    this.diaSemana = dia;
    this.fecha = fecha;
    this.hInicio = hInicio;
    this.hFin = hFin;
  }

  // Getters para que el motor de colisiones pueda leer los horarios
  public getDia(): string {
    return this.diaSemana;
  }

  // El truco de 2D: la fecha de inicio y fin es la misma para un evento de 1 día
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
}
