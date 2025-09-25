interface FormSectionProps {
  title?: string;
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function FormSection({
  title,
  children,
  columns = 2,
  className = "",
}: FormSectionProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-4",
  };

  return (
    <div className={`mt-8 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      )}
      <div className={`grid ${gridCols[columns]} gap-6`}>{children}</div>
    </div>
  );
}
