function Tabla({ results }: { results: any[] }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">Resultados de búsqueda:</h3>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-sm">
          <thead className="bg-gray-100 ">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gris ">
                Apellido
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gris">
                Nombre
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gris">
                Documento
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gris">
                Teléfono
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gris">
                Clasificación
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((person, index) => (
              <tr
                key={index}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-6 py-4 text-sm text-gris capitalize">
                  {person.apellidos}
                </td>
                <td className="px-6 py-4 text-sm text-gris capitalize">{person.nombres}</td>
                <td className="px-6 py-4 text-sm text-gris">
                  {person.documento}
                </td>
                <td className="px-6 py-4 text-sm text-gris">
                  {person.telefono}
                </td>
                <td className="px-6 py-4 text-sm text-gris">
                  {person.es_cliente ? 'Cliente' : 'No es cliente'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Tabla;
