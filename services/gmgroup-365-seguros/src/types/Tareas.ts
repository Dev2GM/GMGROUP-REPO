export type  Tarea = {
    id?: number,
    titulo: string,
    descripcion?: string,
    fecha: string,
    hora_inicio: string,
    hora_fin?: string,
    prioridad?: string,
    id_categoria?: number,
    id_creador?: number,
    id_asignado?: number,
    recordatorio?: string,
    estado?: string,
    notas?: string,
}

export type TareasKanban = {
    pendientes: Tarea[];
    proceso: Tarea[];
    completadas: Tarea[];
    rechazadas: Tarea[];
}