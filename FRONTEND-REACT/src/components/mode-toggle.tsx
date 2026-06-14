import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

// Toggle simple: alterna directamente entre claro y oscuro con cada click.
// Si el tema activo es "system", resuelve la preferencia real del SO para
// decidir hacia dónde alternar.
export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const esOscuro =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => setTheme(esOscuro ? "light" : "dark")}
    >
      <Sun className="size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Cambiar tema</span>
    </Button>
  )
}
