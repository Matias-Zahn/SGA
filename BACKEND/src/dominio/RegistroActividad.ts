export abstract class RegistroActividad {
  protected fecha: string;
  protected hInicio: string;
  protected hFin: string;
  protected prioridad: number;
  protected estado: string;

  constructor(fecha: string, hInicio: string, hFin: string, prioridad: number) {
    this.fecha = fecha;
    this.hInicio = hInicio;
    this.hFin = hFin;
    this.prioridad = prioridad;
    this.estado = "Confirmado";
  }

  public getFecha(): string {
    return this.fecha;
  }
  public getHInicio(): string {
    return this.hInicio;
  }
  public getHFin(): string {
    return this.hFin;
  }
  public getPrioridad(): number {
    return this.prioridad;
  }

  public getEstado(): string {
    return this.estado;
  }

  public cambiarEstado(nuevoEstado: string): void {
    this.estado = nuevoEstado;
  }

  // Contrato abstracto: cada hijo dice cómo se llama
  public abstract getNombre(): string;
}
