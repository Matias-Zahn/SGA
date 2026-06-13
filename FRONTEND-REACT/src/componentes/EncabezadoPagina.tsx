interface EncabezadoPaginaProps {
  titulo: string
  descripcion?: string
}

// Encabezado reutilizable para el tope de cada página.
export function EncabezadoPagina({ titulo, descripcion }: EncabezadoPaginaProps) {
  return (
    <div className="mb-6 space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">{titulo}</h1>
      {descripcion && (
        <p className="text-sm text-muted-foreground">{descripcion}</p>
      )}
    </div>
  )
}
