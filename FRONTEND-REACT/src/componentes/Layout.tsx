import { Outlet, useLocation } from "react-router-dom"
import { Navbar } from "@/componentes/Navbar"
import { cn } from "@/lib/utils"

// Rutas que muestran contenido denso (grillas, tablas) y usan un ancho mayor
// que el resto de las páginas.
const RUTAS_ANCHAS = ["/grilla"]

// Estructura común a todas las páginas: navbar arriba + contenido de la ruta.
export function Layout() {
  const { pathname } = useLocation()
  const esAncha = RUTAS_ANCHAS.includes(pathname)

  return (
    <div className="min-h-svh bg-muted/30">
      <Navbar />
      <main
        className={cn(
          "mx-auto px-6 py-8",
          esAncha ? "max-w-7xl" : "max-w-5xl",
        )}
      >
        <Outlet />
      </main>
    </div>
  )
}
