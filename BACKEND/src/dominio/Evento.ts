import { RegistroActividad } from "./RegistroActividad";

export class Evento extends RegistroActividad {
  // SOLO dejamos los atributos que son EXCLUSIVOS de un Evento
  private nombreEvento: string;

  constructor(
    nombre: string,
    fecha: string,
    hInicio: string,
    hFin: string,
    prioridad: number,
  ) {
    super(fecha, hInicio, hFin, prioridad);
    this.nombreEvento = nombre;
  }

  // --- IMPLEMENTACIÓN DEL CONTRATO ABSTRACTO ---

  public getNombre(): string {
    return this.nombreEvento;
  }
}
