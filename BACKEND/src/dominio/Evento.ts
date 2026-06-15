import { RegistroActividad } from "./RegistroActividad";

export class Evento extends RegistroActividad {
  // SOLO dejamos los atributos que son EXCLUSIVOS de un Evento
  private nombreEvento: string;
  private nombreSolicitante: string;
  private contactoSolicitante: string;

  constructor(
    nombre: string,
    fecha: string,
    hInicio: string,
    hFin: string,
    prioridad: number,
    nombreSolicitante: string,
    contactoSolicitante: string,
  ) {
    super(fecha, hInicio, hFin, prioridad);
    this.nombreEvento = nombre;
    this.nombreSolicitante = nombreSolicitante;
    this.contactoSolicitante = contactoSolicitante;
  }

  // --- IMPLEMENTACIÓN DEL CONTRATO ABSTRACTO ---

  public getNombre(): string {
    return this.nombreEvento;
  }
  public getNombreSolicitante(): string {
    return this.nombreSolicitante;
  }
  public getContactoSolicitante(): string {
    return this.contactoSolicitante;
  }

  // [NUEVO - Notificar a Responsable] Acceso uniforme al responsable de la
  // actividad (por convención, mismo contrato que Asignacion). En un Evento el
  // responsable es su solicitante.
  public getResponsableNombre(): string {
    return this.nombreSolicitante;
  }
  public getResponsableContacto(): string {
    return this.contactoSolicitante;
  }
}
