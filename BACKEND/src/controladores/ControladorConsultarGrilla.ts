import { CatalogoEspacios } from "../dominio/CatalogoEspacios";

export class ControladorConsultarGrilla {
  private catalogoEspacios: CatalogoEspacios;

  constructor(catalogo: CatalogoEspacios) {
    this.catalogoEspacios = catalogo;
  }

  // Este es el método que vas a llamar cuando el Front te haga el GET
  public consultarLineaDeTiempo(dia: string, fecha: string) {
    // Asumiendo que tenés un método que te devuelva el array de todos los espacios
    const todosLosEspacios = this.catalogoEspacios.getTodosLosEspacios();

    const grillaVisual = [];

    for (const e of todosLosEspacios) {
      grillaVisual.push({
        aula: e.getId(),
        actividades: e.obtenerOcupacionDelDia(dia, fecha),
      });
    }

    // Esto te devuelve un JSON perfecto para que tu compañero lo itere en React
    return {
      exito: true,
      fechaConsultada: fecha,
      grilla: grillaVisual,
    };
  }
}
