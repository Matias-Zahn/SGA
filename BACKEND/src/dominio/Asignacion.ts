import { Docente } from "./Docente";
import { Espacio } from "./Espacio";

export class Asignacion {
  private nombre: string;
  private diaSemana: string;
  private fInicio: string;
  private fFin: string;
  private hInicio: string;
  private hFin: string;
  private estado: string;
  private espacio: Espacio;
  private docente: Docente;
  private prioridad: number; // NUEVO

  constructor(
    nombre: string,
    espacio: Espacio,
    docente: Docente,
    diaSemana: string,
    fInicio: string,
    fFin: string,
    hInicio: string,
    hFin: string,
  ) {
    this.nombre = nombre;
    this.espacio = espacio;
    this.docente = docente;
    this.diaSemana = diaSemana;
    this.fInicio = fInicio;
    this.fFin = fFin;
    this.hInicio = hInicio;
    this.hFin = hFin;
    this.estado = "Activa";
    this.prioridad = 1; // NUEVO: Prioridad base para clases regulares
  }

  public generarSesiones(): void {
    console.log(
      `[Dominio] Generando sesiones individuales para los días ${this.diaSemana}...`,
    );
  }

  // Getters existentes...
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

  // NUEVOS MÉTODOS PARA EL DIAGRAMA DE SECUENCIA
  public getPrioridad(): number {
    return this.prioridad;
  }

  public getEstado(): string {
    return this.estado;
  }

  // NUEVO: Método para cumplir con el polimorfismo sin romper el importador actual
  public getNombre(): string {
    return this.nombre;
  }

  // [NUEVO - Notificar a Responsable] Acceso uniforme al responsable de la
  // actividad (por convención, mismo contrato que Evento). En una Asignacion el
  // responsable es el Docente a cargo.
  public getResponsableNombre(): string {
    return this.docente.getNombreCompleto();
  }
  public getResponsableContacto(): string {
    return this.docente.getContacto();
  }

  public cambiarEstado(nuevoEstado: string): void {
    this.estado = nuevoEstado;
    console.log(
      `[Dominio] La asignación de los ${this.diaSemana} cambió su estado a: ${this.estado}`,
    );
  }
}
