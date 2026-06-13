import { Outlet } from "react-router-dom"
import { Navbar } from "@/componentes/Navbar"

// Estructura común a todas las páginas: navbar arriba + contenido de la ruta.
export function Layout() {
  return (
    <div className="min-h-svh bg-muted/30">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
