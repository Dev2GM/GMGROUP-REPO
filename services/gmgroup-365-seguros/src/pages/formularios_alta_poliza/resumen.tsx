import React from "react";

interface ResumenProps {
  formData: {
  datosBasicos: {
    corredorSeguros: string;
    canalComercial: string;
    numeroPoliza: string;
    referencia?: string;
    fechaInicio: string;
    fechaFin: string;
  };
  datosCliente: {
    id_persona?: string;
    cedula: string;
    nombre: string;
    apellido?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    fecha_nacimiento?: string;
    id_pais?: string;
    id_departamento?: string;
    id_ciudad?: string;
    tipo_persona?: string;
  };
  datosMonetarios: {
    compania: string;
    cobertura: string;
    moneda: string;
    prima: string;
    cuotas: string;
    precio: string;
    vencimiento: string;
    medioPago: string;
  };
  datosRamo: {
    ramo: string;
    camposRamo: Record<string, string>;
    tieneSeguroAutomotor: boolean;
    marca: string;
    modelo: string;
    año: string;
  };
}
}

function Resumen({ formData }: ResumenProps) {
  const formatCurrency = (amount: string, currency = "MXN") => {
    const numAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: currency,
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No especificado";
    return new Date(dateString).toLocaleDateString("es-MX");
  };

  const ResumenSection = ({
    title,
    children,
    icon,
  }: {
    title: string;
    children: React.ReactNode;
    icon: string;
  }) => (
    <div className="mb-6 border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
        <span className="mr-2 text-xl">{icon}</span>
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );

  const DataRow = ({
    label,
    value,
    highlight = false,
  }: {
    label: string;
    value: string | number;
    highlight?: boolean;
  }) => (
    <div
      className={`flex justify-between py-2 border-b border-gray-100 last:border-b-0 ${
        highlight ? "bg-blue-50 px-2 rounded" : ""
      }`}
    >
      <span className="text-gray-600 font-medium">{label}:</span>
      <span
        className={`text-right ${
          highlight ? "text-blue-700 font-semibold" : "text-gray-900"
        }`}
      >
        {value || "No especificado"}
      </span>
    </div>
  );

  const calcularCuotaIndividual = () => {
    const precio = parseFloat(formData.datosMonetarios.precio) || 0;
    const cuotas = parseInt(formData.datosMonetarios.cuotas) || 1;
    return precio / cuotas;
  };

  const validarCompletitud = () => {
    const validaciones = [
      {
        campo: "Número de póliza",
        valido: !!formData.datosBasicos.numeroPoliza,
      },
      {
        campo: "Corredor seleccionado",
        valido: !!formData.datosBasicos.corredorSeguros,
      },
      {
        campo: "Canal comercial",
        valido: !!formData.datosBasicos.canalComercial,
      },
      {
        campo: "Fechas establecidas",
        valido: !!(
          formData.datosBasicos.fechaInicio && formData.datosBasicos.fechaFin
        ),
      },
      {
        campo: "Cliente identificado",
        valido: !!(
          formData.datosCliente.cedula && formData.datosCliente.nombre
        ),
      },
      {
        campo: "Compañía seleccionada",
        valido: !!formData.datosMonetarios.compania,
      },
      {
        campo: "Cobertura definida",
        valido: !!formData.datosMonetarios.cobertura,
      },
      {
        campo: "Información monetaria",
        valido: !!(
          formData.datosMonetarios.precio && formData.datosMonetarios.prima
        ),
      },
      { campo: "Ramo asignado", valido: !!formData.datosRamo.ramo },
    ];

    return validaciones;
  };

  const validaciones = validarCompletitud();
  const validacionesCompletas = validaciones.filter((v) => v.valido).length;
  const porcentajeCompletado = Math.round(
    (validacionesCompletas / validaciones.length) * 100
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Resumen de la Póliza
      </h2>

      <div className="space-y-6">
        {/* Resumen de Datos Básicos */}
        <ResumenSection title="Datos Básicos" icon="📋">
          <DataRow
            label="Número de Póliza"
            value={formData.datosBasicos.numeroPoliza}
            highlight={true}
          />
          <DataRow
            label="Corredor de Seguros"
            value={`ID: ${formData.datosBasicos.corredorSeguros}`}
          />
          <DataRow
            label="Canal Comercial"
            value={`ID: ${formData.datosBasicos.canalComercial}`}
          />
          <DataRow
            label="Referencia"
            value={formData.datosBasicos.referencia || "No especificada"}
          />
          <DataRow
            label="Fecha de Inicio"
            value={formatDate(formData.datosBasicos.fechaInicio)}
          />
          <DataRow
            label="Fecha de Fin"
            value={formatDate(formData.datosBasicos.fechaFin)}
          />
        </ResumenSection>

        {/* Resumen de Datos del Cliente */}
        <ResumenSection title="Datos del Cliente" icon="👤">
          <DataRow
            label="Cédula"
            value={formData.datosCliente.cedula}
            highlight={true}
          />
          <DataRow
            label="Nombre Completo"
            value={`${formData.datosCliente.nombre || ""} ${
              formData.datosCliente.apellido || ""
            }`.trim()}
          />
          <DataRow
            label="Tipo de Persona"
            value={formData.datosCliente.tipo_persona || "Física"}
          />
          <DataRow
            label="Teléfono"
            value={formData.datosCliente.telefono || "No especificado"}
          />
          <DataRow
            label="Email"
            value={formData.datosCliente.email || "No especificado"}
          />
          <DataRow
            label="Fecha de Nacimiento"
            value={formatDate(formData.datosCliente.fecha_nacimiento || "")}
          />
          <DataRow
            label="Dirección"
            value={formData.datosCliente.direccion || "No especificada"}
          />
          {formData.datosCliente.id_persona && (
            <DataRow
              label="ID Cliente (Existente)"
              value={formData.datosCliente.id_persona}
              highlight={true}
            />
          )}
        </ResumenSection>

        {/* Resumen de Datos Monetarios */}
        <ResumenSection title="Datos Monetarios" icon="💰">
          <DataRow
            label="Compañía"
            value={`ID: ${formData.datosMonetarios.compania}`}
          />
          <DataRow
            label="Cobertura"
            value={`ID: ${formData.datosMonetarios.cobertura}`}
          />
          <DataRow
            label="Precio Total"
            value={formatCurrency(
              formData.datosMonetarios.precio,
              formData.datosMonetarios.moneda
            )}
            highlight={true}
          />
          <DataRow
            label="Prima"
            value={formatCurrency(
              formData.datosMonetarios.prima,
              formData.datosMonetarios.moneda
            )}
            highlight={true}
          />
          <DataRow label="Moneda" value={formData.datosMonetarios.moneda} />
          <DataRow
            label="Número de Cuotas"
            value={formData.datosMonetarios.cuotas}
          />
          <DataRow
            label="Valor por Cuota"
            value={formatCurrency(
              calcularCuotaIndividual().toString(),
              formData.datosMonetarios.moneda
            )}
            highlight={true}
          />
          <DataRow
            label="Vencimiento 1° Cuota"
            value={formatDate(formData.datosMonetarios.vencimiento)}
          />
          <DataRow
            label="Medio de Pago"
            value={`ID: ${formData.datosMonetarios.medioPago}`}
          />
        </ResumenSection>

        {/* Resumen de Datos del Ramo */}
        <ResumenSection title="Datos del Ramo" icon="🏷️">
          <DataRow label="Ramo" value={`ID: ${formData.datosRamo.ramo}`} />

          {/* Campos dinámicos del ramo */}
          {Object.keys(formData.datosRamo.camposRamo).length > 0 && (
            <>
              <div className="pt-2 border-t border-gray-200">
                <h4 className="font-medium text-gray-700 mb-2">
                  Campos del Ramo:
                </h4>
                <div className="bg-gray-50 p-3 rounded space-y-1">
                  {Object.entries(formData.datosRamo.camposRamo).map(
                    ([idCampo, valor]) => (
                      <DataRow
                        key={idCampo}
                        label={`Campo ${idCampo}`}
                        value={valor || "Sin valor"}
                      />
                    )
                  )}
                </div>
              </div>
            </>
          )}

          <DataRow
            label="¿Tiene Seguro Automotor?"
            value={formData.datosRamo.tieneSeguroAutomotor ? "Sí" : "No"}
          />

          {/* Datos del seguro automotor si aplica */}
          {formData.datosRamo.tieneSeguroAutomotor && (
            <div className="pt-2 border-t border-gray-200">
              <h4 className="font-medium text-gray-700 mb-2">
                Datos del Vehículo:
              </h4>
              <div className="bg-blue-50 p-3 rounded space-y-1">
                <DataRow
                  label="Marca"
                  value={`ID: ${formData.datosRamo.marca}`}
                />
                <DataRow
                  label="Modelo"
                  value={`ID: ${formData.datosRamo.modelo}`}
                />
                <DataRow label="Año" value={formData.datosRamo.año} />
              </div>
            </div>
          )}
        </ResumenSection>

        {/* Resumen Final */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
            Resumen Final
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(
                  formData.datosMonetarios.precio,
                  formData.datosMonetarios.moneda
                )}
              </div>
              <div className="text-sm text-gray-600 mt-1">Precio Total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {formData.datosMonetarios.cuotas || 1}
              </div>
              <div className="text-sm text-gray-600 mt-1">Cuotas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {formatCurrency(
                  calcularCuotaIndividual().toString(),
                  formData.datosMonetarios.moneda
                )}
              </div>
              <div className="text-sm text-gray-600 mt-1">Por Cuota</div>
            </div>
          </div>
        </div>

        {/* Progreso de validación */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-800 flex items-center">
              Verificación de Datos
            </h4>
            <div className="flex items-center">
              <div className="text-sm font-medium text-gray-600 mr-2">
                {validacionesCompletas}/{validaciones.length}
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  porcentajeCompletado === 100
                    ? "bg-green-100 text-green-800"
                    : porcentajeCompletado >= 80
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {porcentajeCompletado}%
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {validaciones.map((validacion, index) => (
              <div key={index} className="flex items-center text-sm">
                <span className="mr-3">{validacion.valido ? "✅" : "❌"}</span>
                <span
                  className={
                    validacion.valido ? "text-green-700" : "text-red-600"
                  }
                >
                  {validacion.campo}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Nota importante */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-amber-400 text-xl"> ⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                <strong>Importante:</strong> Revise cuidadosamente toda la
                información antes de crear la póliza. Una vez creada, algunos
                datos no podrán ser modificados sin realizar un endoso.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resumen;
