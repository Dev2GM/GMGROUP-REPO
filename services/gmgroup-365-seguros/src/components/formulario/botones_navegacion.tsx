import { Button } from "../ui/Button";

function BotonesNavegacion({
  pasoActual,
  totalPasos,
  onAnterior,
  onSiguiente,
  onFinalizar,
}: {
  pasoActual: number;
  totalPasos: number;
  onAnterior: () => void;
  onSiguiente: () => void;
  onFinalizar: () => void;
}) {
  const esInicio = pasoActual === 1;
  const esFinal = pasoActual === totalPasos;
  return (
    <div className={`flex justify-center gap-72 `}>
      <Button onClick={onAnterior} className={esInicio ? "hidden" : ""}>
        Anterior
      </Button>
      <Button
        onClick={esFinal ? onFinalizar : onSiguiente}
        variant={esFinal ? "secondary" : "default"}
      >
        {esFinal ? "Finalizar" : "Siguiente"}
      </Button>
    </div>
  );
}

export default BotonesNavegacion;
