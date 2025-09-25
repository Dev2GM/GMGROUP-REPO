const db = require("../config/db");

const createTarea = async (tarea) => {
  const {
    titulo,
    descripcion,
    fecha,
    hora_inicio,
    hora_fin,
    prioridad,
    id_categoria,
    id_asignado,
    recordatorio,
    notas,
    id_creador,
  } = tarea;

  const [result] = await db.query(
    `INSERT INTO Tareas (
      titulo, descripcion, fecha, hora_inicio, hora_fin, prioridad,
      id_categoria, id_creador, id_asignado, recordatorio, notas, estado
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      titulo,
      descripcion,
      fecha,
      hora_inicio,
      hora_fin,
      prioridad,
      id_categoria || null,
      id_creador,
      id_asignado || null,
      recordatorio,
      notas,
      "Pendiente"
    ]
  );

  return { id: result.insertId, ...tarea };
};

const getAllTareas = async () => {
  const [rows] = await db.query(
    `SELECT 
        t.id, 
        t.titulo, 
        t.descripcion, 
        t.fecha, 
        t.hora_inicio, 
        t.hora_fin, 
        t.prioridad,
        t.recordatorio,
        t.notas,
        t.id_creador,
        t.estado,
        t.id_asignado,
        t.id_categoria,
        c.nombre AS categoria
     FROM Tareas t
     LEFT JOIN Categorias c ON t.id_categoria = c.id
     ORDER BY t.fecha DESC, t.hora_inicio ASC`
  );
  return rows;
};

const updateTarea = async (tarea) => {
  const {
    id,
    titulo,
    descripcion,
    fecha,
    hora_inicio,
    hora_fin,
    prioridad,
    id_categoria,
    id_asignado,
    recordatorio,
    notas,
    id_creador,
    estado, // opcional, por si quieres actualizarlo también
  } = tarea;

  const [result] = await db.query(
    `UPDATE Tareas SET 
      titulo = ?, 
      descripcion = ?, 
      fecha = ?, 
      hora_inicio = ?, 
      hora_fin = ?, 
      prioridad = ?, 
      id_categoria = ?, 
      id_creador = ?, 
      id_asignado = ?, 
      recordatorio = ?, 
      notas = ?, 
      estado = ?
    WHERE id = ?`,
    [
      titulo,
      descripcion,
      fecha,
      hora_inicio,
      hora_fin,
      prioridad,
      id_categoria || null,
      id_creador,
      id_asignado || null,
      recordatorio,
      notas,
      estado || "Pendiente", // si no mandas estado, lo deja en "Pendiente"
      id,
    ]
  );

  return { affectedRows: result.affectedRows, ...tarea };
};


module.exports = { createTarea, getAllTareas, updateTarea };