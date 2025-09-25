import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function addYear(fechaStr: string): string {
  const fecha = new Date(fechaStr);

  if (isNaN(fecha.getTime())) {
    throw new Error("Formato de fecha no válido");
  }

  fecha.setFullYear(fecha.getFullYear() + 1);

  return fecha.toISOString().split("T")[0];
}
export function addMonth(fechaStr: string): string {
  const fecha = new Date(fechaStr);

  if (isNaN(fecha.getTime())) {
    throw new Error("Formato de fecha no válido");
  }

  fecha.setMonth(fecha.getMonth() + 1);

  return fecha.toISOString().split("T")[0];
}

export function today() {
  const hoy = new Date()
  return hoy.toISOString().split("T")[0];

}


export const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, 
  setFormData: React.Dispatch<React.SetStateAction<any>>
) => {
    const { name, value } = e.target;
    setFormData((prev:any) => ({ ...prev, [name]: value }));
};