import { NavLink } from "react-router-dom"
import { CalendarPlus, FileSpreadsheet, Home } from "lucide-react"
import { cn } from "@/lib/utils"

// Enlaces de navegación principales de la app.
const enlaces = [
  { ruta: "/", etiqueta: "Inicio", icono: Home },
  { ruta: "/importar", etiqueta: "Importar Asignación", icono: FileSpreadsheet },
  { ruta: "/eventos", etiqueta: "Registrar Evento", icono: CalendarPlus },
]

// Barra de navegación superior. Resalta la ruta activa.
export function Navbar() {
  return (
    <header className="border-b bg-background">
      <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-3">
        <span className="text-lg font-semibold">🎓 SGA</span>
        <ul className="flex items-center gap-1">
          {enlaces.map(({ ruta, etiqueta, icono: Icono }) => (
            <li key={ruta}>
              <NavLink
                to={ruta}
                end={ruta === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )
                }
              >
                <Icono className="size-4" />
                {etiqueta}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
