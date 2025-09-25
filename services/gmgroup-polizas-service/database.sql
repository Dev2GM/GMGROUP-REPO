CREATE DATABASE IF NOT EXISTS gm_polizas
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gm_polizas;

-- Tabla Monedas
CREATE TABLE Monedas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_iso VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    simbolo VARCHAR(10) NOT NULL,
    tasa_cambio DECIMAL(18,6) NOT NULL,
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla MetodosPago
CREATE TABLE MetodosPago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla Companias
CREATE TABLE Companias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(30),
    email VARCHAR(150),
    direccion VARCHAR(255),
    web VARCHAR(150),
    cuit VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Coberturas(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(250),
    id_compania INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_compania) REFERENCES Companias(id)
);

CREATE TABLE Polizas(
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(100) UNIQUE NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    precio FLOAT NOT NULL,
    n_cuotas INT NOT NULL,
    prima FLOAT,
    referencia VARCHAR(300),

    id_cobertura INT NOT NULL,
    id_moneda INT NOT NULL,
    id_metodo INT NOT NULL,
    id_auto INT,
    id_persona INT NOT NULL,
    id_canal INT NOT NULL,
    id_corredor INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (id_cobertura) REFERENCES Coberturas(id),
    FOREIGN KEY (id_moneda) REFERENCES Monedas(id),
    FOREIGN KEY (id_metodo) REFERENCES MetodosPago(id)

);

CREATE TABLE Cuotas(
    id INT AUTO_INCREMENT PRIMARY key,
    fecha_vencimiento DATE NOT NULL,
    valor FLOAT,
    fecha_pago DATE,

    id_poliza INT NOT NULL,
    FOREIGN KEY(id_poliza) REFERENCES Polizas(id)
);

INSERT INTO Companias (`id`,`nombre`,`telefono`,`email`,`direccion`,`web`,`cuit`) VALUES (1,'SAN CRISTOBAL SEGUROS URUGUAY','08008831','LopezDohirC@sancristobalseguros.com.uy','Ituzaingó 1377','sancristobalseguros.com.uy',216691570018);
INSERT INTO Companias (`id`,`nombre`,`telefono`,`email`,`direccion`,`web`,`cuit`) VALUES (2,'SEGURO SURA ','26030000','vanessa.sanguinetti@segurossura.com.uy','Avenida Italia 7519, Montevideo','www.segurossura.com.uy',213217030011);
INSERT INTO Companias (`id`,`nombre`,`telefono`,`email`,`direccion`,`web`,`cuit`) VALUES (3,'PORTO SEGUROS ','24878616','operador@portoseguro.com.uy',' Av. Dr. Américo Ricaldoni 2750','portoseguro.com.uy',213240630011);

INSERT INTO Monedas (`id`,`codigo_iso`,`nombre`,`simbolo`,`tasa_cambio`,`estado`) VALUES (1,'UYU','Peso uruguayo','UYU',1.0000,1);
INSERT INTO Monedas (`id`,`codigo_iso`,`nombre`,`simbolo`,`tasa_cambio`,`estado`) VALUES (2,'USD','Dolar Estadounidense','$',1.0000,1);

INSERT INTO MetodosPago (`id`,`nombre`,`descripcion`) VALUES (1,'Transferencia Bancaria','s/n');
INSERT INTO MetodosPago (`id`,`nombre`,`descripcion`) VALUES (2,'Tarjeta de crédito','s/n');
INSERT INTO MetodosPago (`id`,`nombre`,`descripcion`) VALUES (3,'Otro método de pago','s/n');

INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (1,'RC BASICA',1);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (2,'RC ESTANDAR',1);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (3,'RC PLUS',1);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (4,'ROBO E INCENDIO C1',1);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (5,'ROBO E INCENDIO CPLUS',1);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (6,'ROBO E INCENDIO CMEGA',1);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (7,'TODO  RIESGO D1',1);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (8,'TODO RIEGOS D4',1);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (9,'TODO RIESGO DPLUS',1);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (10,'INCENDIO',1);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (11,'COBINADO HOGAR',1);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (12,'COMBINADO COMERCIO',1);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (13,'TOTAL PLUS',2);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (14,'TOTAL C/GASTO MOVILIDAD',2);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (15,'TOTAL',2);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (16,'TOTAL ECONOMICA',2);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (17,'COBERTURA 4 EN 1',2);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (18,'HURTO E INCEDNIO',2);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (19,'RESPONSABILIDAD CIVIL',2);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (20,'RESPONSABILIDAD CIVIL E INCENDIO',2);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (21,'SOA',2);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (22,'PRIMER RIESGO',2);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (23,'VALOR TOTAL',2);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (24,'GARANTIA DE ALQUILER',2);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (25,'ESCRITURA',2);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (26,'FIANZA',2);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (27,'SEGURO DE VIAJE',2);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (28,'Daños Hurto Incendio y Responsabilidad Civil',3);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (29,'Daños  Hurto  Incendio y Responsabilidad Civil con Deducible Incrementado',3);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (30,'Hurto Incendio y Responsabilidad Civil',3);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (31,'Hurto',3);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (32,'Incendio y Responsabilidad Civil con Agentes Externos',3);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (33,'Responsabilidad Civil',3);
INSERT INTO Coberturas (`id`,`nombre`,`id_compania`) VALUES (34,'Responsabilidad Civil Limitada',3);
