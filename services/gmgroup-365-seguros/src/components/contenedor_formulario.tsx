function ContenedorFormulario({
  title,
  children,
  onSubmit,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}) {
  return (
    <section className={`max-w-4xl mx-auto ${className}`}>
      {title && (
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
        </header>
      )}
      <form onSubmit={onSubmit} className="p-8 mb-8">
        {children}
      </form>
    </section>
  );
}

export default ContenedorFormulario;
