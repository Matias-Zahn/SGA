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

  public agregarAsignacion(a: Asignacion): void {
    this.asignacionesVinculadas.push(a);
  }

  public agregarEvento(ev: Evento): void {
    this.eventosVinculados.push(ev);
  }

  // EL MOTOR 2D MODIFICADO: Ahora devuelve quién causó la colisión
  public validarDisponibilidad(
    dia: string,
    fInicio: string,
    fFin: string,
    hInicio: string,
    hFin: string,
  ): {
    libre: boolean;
    actividadConflictiva?: Asignacion | Evento;
    tipo?: string;
  } {
    console.log(
      `\n[Motor 2D] Evaluando disponibilidad en ${this.idEspacio}...`,
    );
    console.log(
      `[Motor 2D] El evento pide: Día '${dia}', Fecha '${fInicio}', Horario ${hInicio} a ${hFin}`,
    );

    const diaPeticion = dia ? dia.trim().toLowerCase() : "";

    // 1. VERIFICAR CONTRA ASIGNACIONES CUATRIMESTRALES
    const asignacionesDelDia = this.asignacionesVinculadas.filter(
      (a) =>
        a.getDia().trim().toLowerCase() === diaPeticion &&
        a.getEstado() !== "A Reprogramar",
    );

    console.log(
      `[Motor 2D] Materias guardadas para este día exacto: ${asignacionesDelDia.length}`,
    );

    for (const asignacion of asignacionesDelDia) {
      console.log(
        `[Motor 2D] Cruzando contra materia: ${asignacion.getNombre()}`,
      );
      console.log(
        `  -> Fechas: Evento (${fInicio}) vs Materia (${asignacion.getFInicio()} al ${asignacion.getFFin()})`,
      );
      console.log(
        `  -> Horas: Evento (${hInicio} - ${hFin}) vs Materia (${asignacion.getHInicio()} - ${asignacion.getHFin()})`,
      );
      const chocanFechas =
        fInicio <= asignacion.getFFin() && fFin >= asignacion.getFInicio();
      const chocanHoras =
        hInicio < asignacion.getHFin() && hFin > asignacion.getHInicio();

      console.log(
        `  -> Resultado del choque matemático: Fechas=${chocanFechas} | Horas=${chocanHoras}`,
      );
      if (chocanFechas && chocanHoras) {
        console.log(
          `[Motor 2D] ❌ Colisión confirmada con la materia: ${asignacion.getNombre()}`,
        );
        // Aprovechamos el getNombre() que creaste antes
        console.log(
          `[Motor 2D] ❌ Colisión detectada con la materia: ${asignacion.getNombre()}`,
        );

        return {
          libre: false,
          actividadConflictiva: asignacion,
          tipo: "Asignacion",
        };
      }
    }

    // 2. VERIFICAR CONTRA EVENTOS SUELTOS
    const eventosDelDia = this.eventosVinculados.filter(
      (e) => e.getFecha() === fInicio && e.getEstado() !== "A Reprogramar",
    );
    for (const evento of eventosDelDia) {
      // Como un evento ocurre en un solo día, su getFInicio y getFFin devuelven la misma fecha.
      // Por ende, la validación de horas es suficiente.
      const chocanHoras =
        hInicio < evento.getHFin() && hFin > evento.getHInicio();

      if (chocanHoras) {
        console.log(
          `[Motor 2D] ❌ Colisión detectada con el evento: ${evento.getNombre()}`,
        );

        return {
          libre: false,
          actividadConflictiva: evento,
          tipo: "Evento",
        };
      }
    }

    // Si pasó los dos filtros, el aula está verdaderamente libre
    console.log(`[Motor 2D] ✅ El espacio ${this.idEspacio} está libre.`);
    return { libre: true };
  }
}
