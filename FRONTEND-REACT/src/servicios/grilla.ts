import {
  obtenerGrillaSimulada,
  type RespuestaGrilla,
} from "@/datos/grillaSimulada"

// Única puerta de acceso a los datos de la grilla.
// Hoy devuelve datos simulados. Para conectar el backend real, descomentá el
// bloque de fetch y eliminá el bloque del mock.
export async function consultarGrilla(
  dia: string,
  fecha: string,
): Promise<RespuestaGrilla> {
  // --- Backend real (descomentar para conectar) ---
  const res = await fetch(
    `/api/grilla?dia=${encodeURIComponent(dia)}&fecha=${encodeURIComponent(fecha)}`,
  )
  if (!res.ok) throw new Error("No se pudo cargar la grilla.")
  return res.json()

  //mock de los datos 
  await new Promise((resolve) => setTimeout(resolve, 250)) // delay simulado
  return obtenerGrillaSimulada(dia, fecha)
}
