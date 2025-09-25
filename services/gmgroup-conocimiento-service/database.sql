CREATE DATABASE IF NOT EXISTS gm_conocimiento;

USE gm_conocimiento;

CREATE TABLE IF NOT EXISTS novedades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_grupo INT NOT NULL,
    novedad TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conocimiento_bot (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pregunta TEXT NOT NULL,
    respuesta_correcta TEXT NOT NULL,
    respuesta_erronea TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de carpetas para materiales/manuales
CREATE TABLE IF NOT EXISTS materiales_folder (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    parent_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES materiales_folder(id) ON DELETE CASCADE
);

-- Tabla de archivos (enlaces) para materiales/manuales
CREATE TABLE IF NOT EXISTS materiales_file (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    folder_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (folder_id) REFERENCES materiales_folder(id) ON DELETE CASCADE
);