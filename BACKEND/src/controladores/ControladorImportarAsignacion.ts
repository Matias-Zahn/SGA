import { CatalogoEspacios } from "../dominio/CatalogoEspacios";
import { CatalogoMaterias } from "../dominio/CatalogoMaterias";
import { CatalogoDocentes } from "../dominio/CatalogoDocentes";

export class ControladorImportarAsignacion {
  // Referencias a los 3 catálogos que definimos en el DCD
  private catalogoEspacios: CatalogoEspacios;
  private catalogoMaterias: CatalogoMaterias;
  private catalogoDocentes: CatalogoDocentes;

  // Es mejor inyectar los 3 por el constructor para compartir memoria en el server
  constructor(
    catEspacios: CatalogoEspacios,
    catMaterias: CatalogoMaterias,
    catDocentes: CatalogoDocentes,
  ) {
    this.catalogoEspacios = catEspacios;
    this.catalogoMaterias = catMaterias;
    this.catalogoDocentes = catDocentes;
  }

  public importarAsignacionMasiva(filasExcel: any[]) {
    const resultados = [];

    for (const fila of filasExcel) {
      // 1. VALIDACIÓN Y OBTENCIÓN DE MATERIA
      // (En vez de solo preguntar si existe, nos traemos el objeto entero porque lo vamos a usar)
      const m = this.catalogoMaterias.getMateria(fila.codigoMateria);
      if (!m) {
        resultados.push({
          fila,
          exito: false,
          error: `La materia '${fila.codigoMateria}' no existe en el sistema.`,
        });
        continue; // Cortamos y pasamos a la siguiente fila
      }

      // 2. VALIDACIÓN Y OBTENCIÓN DE ESPACIO
      const e = this.catalogoEspacios.getEspacio(fila.idEspacio);
      if (!e) {
        resultados.push({
          fila,
          exito: false,
          error: `El espacio '${fila.idEspacio}' no existe.`,
        });
        continue;
      }

      // 3. VALIDACIÓN Y OBTENCIÓN DE DOCENTE (Paso 7 de tu Diagrama de Secuencia)
      const d = this.catalogoDocentes.getDocente(fila.legajo);
      if (!d) {
        resultados.push({
          fila,
          exito: false,
          error: `El docente con legajo '${fila.legajo}' no existe.`,
        });
        continue;
      }

      // 4. VALIDACIÓN DE COLISIÓN (El motor 2D)
      const estadoEspacio = e.validarDisponibilidad(
        fila.dia,
        fila.fInicio,
        fila.fFin,
        fila.hInicio,
        fila.hFin,
      );

      if (estadoEspacio.libre) {
        // 5. CREACIÓN REAL DE LA ASIGNACIÓN
        m.crearAsignacion(
          e,
          d,
          fila.dia,
          fila.fInicio,
          fila.fFin,
          fila.hInicio,
          fila.hFin,
        );

        resultados.push({
          fila,
          exito: true,
          mensaje: "Asignación y sesiones creadas correctamente",
        });
      } else {
        // 6. RECHAZO POR COLISIÓN (Aprovechando el polimorfismo)

        // Extraemos el nombre de la actividad que nos devolvió el motor 2D
        // Usamos el signo de pregunta (?) por seguridad, por si llega undefined
        const nombreConflicto = estadoEspacio.actividadConflictiva
          ? estadoEspacio.actividadConflictiva.getNombre()
          : "otra actividad";

        resultados.push({
          fila,
          exito: false,
          error: `Colisión en ${fila.idEspacio}. El aula ya está ocupada por: ${nombreConflicto}`,
        });
      }
    }

    // 7. Retornamos el reporte completo al Lector/Interfaz
    return resultados;
  }
}
