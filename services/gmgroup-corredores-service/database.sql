CREATE DATABASE IF NOT EXISTS gm_corredores;

USE gm_corredores;

CREATE TABLE IF NOT EXISTS empresas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  documento VARCHAR(100) NOT NULL UNIQUE,
  telefono VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  direccion VARCHAR(255) NOT NULL,
  web VARCHAR(255) NOT NULL,
  id_pais INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS corredores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  direccion VARCHAR(255) NOT NULL,
  direccion2 VARCHAR(255),
  horario TEXT NOT NULL,
  id_empresa INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Canales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255) NOT NULL,
  id_corredor INT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (id_corredor) REFERENCES corredores(id)
);

CREATE TABLE Ramos(
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(250) NOT NULL,
  descripcion VARCHAR(250),
  id_corredor INT NOT NULL,

  FOREIGN KEY (id_corredor) REFERENCES Corredores(id)
);


INSERT INTO empresas (nombre, documento, telefono, email, direccion, id_pais)
VALUES
('GM GROUP', '218116590012', '098398738', 'seguros@gmgroup.red', 'Uruguay 1082', 1);

INSERT INTO corredores (nombre, telefono, email, direccion, direccion2, horario)
VALUES
('GM GROUP', '098398738', 'seguros@gmgroup.red', 'Uruguay 1082', 'Florida 864', 'Lunes a viernes de 9 a 18'),
('CREDILAR 44', '091451401', 'nmcarballollama@gmail.com', 'CERVANTES 794', NULL, 'Lunes a viernes de 9 a 18'),
('REGERE', '092558499', 'shoppingusadossalto@gmail.com', 'Av Gobernador de Viana 1498', NULL, 'Lunes a viernes de 9 a 18'),
('PAMELA - MARCELO DE FLORES 524', '095193028', 'pamelalorena15@gmail.com', 'COLONIA 18 DE JULIO', NULL, 'Lunes a viernes de 9 a 18'),
('GERMAN RODRIGUEZ CASTRO LTDA 867', '59898919207', 'Eugeniaambrosoni@gmail.com', 'Rincón 350 Salto', NULL, 'Lunes a viernes de 9 a 18');

INSERT INTO canales (`id`,`nombre`,`descripcion`,`id_corredor`) VALUES (1,'Maldonado Ofi','Seguros comercializado en la oficina de maldonado',1);
INSERT INTO canales (`id`,`nombre`,`descripcion`,`id_corredor`) VALUES (2,'Salto Oficina','Seguros comercializados en la oficina de salto',1);
INSERT INTO canales (`id`,`nombre`,`descripcion`,`id_corredor`) VALUES (3,'Whatsapp','Seguros vendido por whatsapp',1);
INSERT INTO canales (`id`,`nombre`,`descripcion`,`id_corredor`) VALUES (6,'Sin datos','El corredor pasa la docuemntacion por whatsapp',5);
INSERT INTO canales (`id`,`nombre`,`descripcion`,`id_corredor`) VALUES (7,'Whatsapp1','Colonia 18',4);
INSERT INTO canales (`id`,`nombre`,`descripcion`,`id_corredor`) VALUES (8,'Whatsapp2','Regere',3);

INSERT INTO Ramos (`id`,`id_corredor`,`nombre`,`descripcion`) VALUES (1,1,'AUTOMOTOR',NULL);
INSERT INTO Ramos (`id`,`id_corredor`,`nombre`,`descripcion`) VALUES (4,1,'GARANTIA DE ALQUILER',NULL);
INSERT INTO Ramos (`id`,`id_corredor`,`nombre`,`descripcion`) VALUES (5,1,'COMERCIO',NULL);
INSERT INTO Ramos (`id`,`id_corredor`,`nombre`,`descripcion`) VALUES (6,1,'HOGAR',NULL);
INSERT INTO Ramos (`id`,`id_corredor`,`nombre`,`descripcion`) VALUES (7,5,'Automotor',NULL);
INSERT INTO Ramos (`id`,`id_corredor`,`nombre`,`descripcion`) VALUES (8,4,'Automotor',NULL);
INSERT INTO Ramos (`id`,`id_corredor`,`nombre`,`descripcion`) VALUES (9,3,'Automotor',NULL);
