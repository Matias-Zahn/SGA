import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Layout } from "@/componentes/Layout"
import { Inicio } from "@/paginas/Inicio"
import { ImportarAsignacion } from "@/paginas/ImportarAsignacion"
import { RegistrarEvento } from "@/paginas/RegistrarEvento"

// Configuración de rutas de la app. Todas las páginas comparten el Layout
// (navbar + contenedor) y se renderizan en su <Outlet>.
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/importar" element={<ImportarAsignacion />} />
          <Route path="/eventos" element={<RegistrarEvento />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
