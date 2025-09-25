import React from "react";

const estadoPaso = (numeroPaso: number, pasoActual: number) => {
  if (numeroPaso < pasoActual) return "completado";
  if (numeroPaso === pasoActual) return "actual";
  return "pendiente";
};

const colorCiculo = (estado: string) => {
  if (estado === "completado") return "bg-verde border-verde  text-white";
  if (estado === "actual") return "bg-principal border-principal text-white";
  return "bg-secundario border border-principal";
};

function Stepper({
  pasoActual,
  pasos,
}: {
  pasoActual: number;
  pasos: { numero: number; titulo: string }[];
}) {
  const elementoStepper = pasos.map((paso) => {
    const estado = estadoPaso(paso.numero, pasoActual);
    const color = colorCiculo(estado);

    return (
      <React.Fragment key={paso.numero}>
        <section className="flex items-center flex-col gap-2 ">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center  ${color}`}
          >
            <span className="font-medium">{paso.numero}</span>
          </div>
          <span className="mt-2 font-medium text-center">{paso.titulo}</span>
        </section>

        {paso.numero < pasos.length && (
          <div className="w-full h-0.5 bg-gris mt-6"></div>
        )}
      </React.Fragment>
    );
  });

  return <section className="flex ">{elementoStepper}</section>;
}

export default Stepper;
