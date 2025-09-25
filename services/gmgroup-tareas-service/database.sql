-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS gm_tareas;
USE gm_tareas;

-- Tabla Categorías
CREATE TABLE Categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla Tareas
CREATE TABLE Tareas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT,
  fecha DATE NOT NULL,
  hora_inicio TIME,
  hora_fin TIME,
  prioridad ENUM('baja', 'media', 'alta') NOT NULL DEFAULT 'media',
  id_categoria INT,
  id_creador INT NOT NULL,
  id_asignado INT,
  recordatorio VARCHAR(255),
  estado ENUM('Pendiente', 'En Proceso', 'Completada', 'Rechazada') NOT NULL DEFAULT 'En Proceso',
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (id_categoria) REFERENCES Categorias(id)
);


INSERT INTO Categorias (nombre, descripcion) VALUES
('Reunión', 'Reuniones con clientes, equipos o socios'),
('Llamada', 'Llamadas telefónicas de seguimiento o coordinación'),
('Seguimiento', 'Actividades de seguimiento de proyectos o clientes'),
('Presentación', 'Presentaciones internas o externas'),
('Revisión', 'Revisión de documentos, procesos o proyectos'),
('Otro', 'Categorías generales o sin clasificar');
