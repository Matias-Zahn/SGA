export class Docente {
  private nombre: string;
  private apellido: string;
  private contacto: string;
  private legajo: string;

  constructor(
    nombre: string,
    apellido: string,
    contacto: string,
    legajo: string,
  ) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.contacto = contacto;
    this.legajo = legajo;
  }

  // Getter principal para las búsquedas en el Catálogo
  public getLegajo(): string {
    return this.legajo;
  }

  // Getters auxiliares por si los necesitas para mostrar en la interfaz o reportes
  public getNombreCompleto(): string {
    return `${this.nombre} ${this.apellido}`;
  }

  public getContacto(): string {
    return this.contacto;
  }
}
