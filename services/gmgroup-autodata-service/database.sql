CREATE DATABASE IF NOT EXISTS gm_autodata
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gm_autodata;

CREATE TABLE Marcas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    logo VARCHAR(255)
);

CREATE TABLE Modelos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_marca INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_marca) REFERENCES Marcas(id)
);

CREATE TABLE TiposAuto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE Autos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_modelo INT NOT NULL,
    id_tipo INT NOT NULL,
    anio INT NOT NULL,
    FOREIGN KEY (id_modelo) REFERENCES Modelos(id),
    FOREIGN KEY (id_tipo) REFERENCES TiposAuto(id)
);

