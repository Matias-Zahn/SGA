import { Asignacion } from "./Asignacion";
import { Evento } from "./Evento";

export class Espacio {
  private asignacionesVinculadas: Asignacion[] = [];
  private eventosVinculados: Evento[] = [];

  constructor(
    private idEspacio: string,
    private capacidadMaxima: number,
    private tipoEspacio: string,
    private edificio: string,
    private estado: string,
    private observaciones: string,
  ) {}

  public getId() {
    return this.idEspacio;
  }

  // Este método es necesario en OOP para mantener la relación bidireccional en memoria
  public agregarAsignacion(a: Asignacion): void {
    this.asignacionesVinculadas.push(a);
  }

  public agregarEvento(ev: Evento): void {
    this.eventosVinculados.push(ev);
  }

  // EL MOTOR 2D ACTUALIZADO leyendo Asignaciones y Eventos reales
  public validarDisponibilidad(
    dia: string,
    fInicio: string,
    fFin: string,
    hInicio: string,
    hFin: string,
  ): boolean {
    // 1. VERIFICAR CONTRA ASIGNACIONES CUATRIMESTRALES
    const asignacionesDelDia = this.asignacionesVinculadas.filter(
      (a) => a.getDia() === dia,
    );

    for (const asignacion of asignacionesDelDia) {
      const chocanFechas =
        fInicio <= asignacion.getFFin() && fFin >= asignacion.getFInicio();
      const chocanHoras =
        hInicio < asignacion.getHFin() && hFin > asignacion.getHInicio();

      if (chocanFechas && chocanHoras) {
        console.log(`❌ Colisión detectada con una Asignación regular.`);
        return false;
      }
    }

    // 2. VERIFICAR CONTRA EVENTOS SUELTOS
    const eventosDelDia = this.eventosVinculados.filter(
      (e) => e.getDia() === dia,
    );

    for (const evento of eventosDelDia) {
      const chocanFechas =
        fInicio <= evento.getFFin() && fFin >= evento.getFInicio();
      const chocanHoras =
        hInicio < evento.getHFin() && hFin > evento.getHInicio();

      if (chocanFechas && chocanHoras) {
        console.log(`❌ Colisión detectada con un Evento.`);
        return false;
      }
    }

    // Si pasó los dos filtros, el aula está verdaderamente libre
    return true;
  }
}
