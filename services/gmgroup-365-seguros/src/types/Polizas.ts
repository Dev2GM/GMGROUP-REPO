export type FormPoliza = {
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