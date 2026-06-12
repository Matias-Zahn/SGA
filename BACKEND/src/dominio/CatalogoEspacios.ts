import { Espacio } from "./Espacio";

export class CatalogoEspacios {
  private espacios: Espacio[] = [];

  constructor() {}

  public getEspacio(idEspacio: string): Espacio | undefined {
    return this.espacios.find((e) => e.getId() === idEspacio);
  }

  public agregarEspacio(espacio: Espacio) {
    this.espacios.push(espacio);
  }
}
