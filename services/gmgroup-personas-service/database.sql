CREATE DATABASE IF NOT EXISTS gm_personas
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gm_personas;

-- ======================
-- TABLA PAIS
-- ======================
CREATE TABLE IF NOT EXISTS Paises (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======================
-- TABLA DEPARTAMENTOS
-- ======================
CREATE TABLE IF NOT EXISTS Departamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  id_pais INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_pais) REFERENCES Paises(id) ON DELETE CASCADE
);

-- ======================
-- TABLA CIUDADES
-- ======================
CREATE TABLE IF NOT EXISTS Ciudades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  id_departamento INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_departamento) REFERENCES Departamentos(id) ON DELETE CASCADE
);

-- ======================
-- TABLA PERSONAS
-- ======================
CREATE TABLE IF NOT EXISTS Personas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('Fisica','Juridica') NOT NULL,
  nombres VARCHAR(150) NOT NULL,
  apellidos VARCHAR(150),
  genero ENUM('Masculino','Femenino','Otro') NULL,
  documento VARCHAR(50) NOT NULL UNIQUE,
  telefono VARCHAR(50),
  direccion VARCHAR(255),
  email VARCHAR(255) NOT NULL UNIQUE,
  fecha_nacimiento DATE,
  foto VARCHAR(255) NULL,
  id_corredor INT NULL,
  id_ciudad INT NULL,
  es_cliente BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_ciudad) REFERENCES Ciudades(id) ON DELETE SET NULL
  -- id_corredor si ya existe tabla corredores, harías:
  -- FOREIGN KEY (id_corredor) REFERENCES corredores(id) ON DELETE SET NULL
);

ALTER TABLE Personas
ADD COLUMN id_usuario INT NULL AFTER id_ciudad;



INSERT INTO Paises (`id`,`nombre`) VALUES (2,'Argentina');
INSERT INTO Paises (`id`,`nombre`) VALUES (3,'Brasil');
INSERT INTO Paises (`id`,`nombre`) VALUES (5,'Chile');
INSERT INTO Paises (`id`,`nombre`) VALUES (4,'Paraguay');
INSERT INTO Paises (`id`,`nombre`) VALUES (1,'Uruguay');


INSERT INTO Departamentos (`id`,`nombre`,`id_pais`) VALUES (1,'Artigas',1);
INSERT INTO Departamentos (`id`,`nombre`,`id_pais`) VALUES (2,'Canelones',1);
INSERT INTO Departamentos (`id`,`nombre`,`id_pais`) VALUES (3,'Cerro Largo',1);
INSERT INTO Departamentos (`id`,`nombre`,`id_pais`) VALUES (4,'Colonia',1);
INSERT INTO Departamentos (`id`,`nombre`,`id_pais`) VALUES (5,'Durazno',1);
INSERT INTO Departamentos (`id`,`nombre`,`id_pais`) VALUES (6,'Flores',1);
INSERT INTO Departamentos (`id`,`nombre`,`id_pais`) VALUES (7,'Florida',1);
INSERT INTO Departamentos (`id`,`nombre`,`id_pais`) VALUES (8,'Lavalleja',1);
INSERT INTO Departamentos (`id`,`nombre`,`id_pais`) VALUES (9,'Maldonado',1);
INSERT INTO Departamentos (`id`,`nombre`,`id_pais`) VALUES (10,'Montevideo',1);
INSERT INTO Departamentos (`id`,`nombre`,`id_pais`) VALUES (11,'Paysandú',1);
INSERT INTO Departamentos (`id`,`nombre`,`id_pais`) VALUES (12,'Río Negro',1);
INSERT INTO Departamentos (`id`,`nombre`,`id_pais`) VALUES (13,'Rivera',1);
INSERT INTO Departamentos (`id`,`nombre`,`id_pais`) VALUES (14,'Rocha',1);
INSERT INTO Departamentos (`id`,`nombre`,`id_pais`) VALUES (15,'Salto',1);
INSERT INTO Departamentos (`id`,`nombre`,`id_pais`) VALUES (16,'San José',1);
INSERT INTO Departamentos (`id`,`nombre`,`id_pais`) VALUES (17,'Soriano',1);
INSERT INTO Departamentos (`id`,`nombre`,`id_pais`) VALUES (18,'Tacuarembó',1);
INSERT INTO Departamentos (`id`,`nombre`,`id_pais`) VALUES (19,'Treinta y Tres',1);


INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (1,'Artigas',1);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (2,'Bella Unión',1);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (3,'Tomás Gomensoro',1);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (4,'Canelones',2);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (5,'Las Piedras',2);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (6,'Pando',2);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (7,'Melo',3);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (8,'Rio Branco',3);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (9,'Tupambaé',3);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (10,'Colonia del Sacramento',4);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (11,'Nueva Palmira',4);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (12,'Carmelo',4);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (13,'Durazno',5);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (14,'Sarandí del Yí',5);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (15,'La Paloma',5);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (16,'Trinidad',6);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (17,'Florida',7);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (18,'Sarandí Grande',7);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (19,'Minas',8);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (20,'Solís de Mataojo',8);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (21,'Maldonado',9);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (22,'Punta del Este',9);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (23,'San Carlos',9);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (24,'Montevideo',10);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (25,'Paysandú',11);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (26,'Guichón',11);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (27,'Fray Bentos',12);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (28,'Young',12);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (29,'Rivera',13);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (30,'Tranqueras',13);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (31,'Rocha',14);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (32,'Chuy',14);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (33,'La Paloma',14);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (34,'Salto',15);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (35,'Belén',15);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (36,'San Antonio',15);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (37,'San José de Mayo',16);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (38,'Libertad',16);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (39,'Mercedes',17);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (40,'Dolores',17);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (41,'Tacuarembó',18);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (42,'Paso de los Toros',18);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (43,'Treinta y Tres',19);
INSERT INTO Ciudades (`id`,`nombre`,`id_departamento`) VALUES (44,'Vergara',19);


INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (1,'Elena Carina','Sosa Muniz','40999655','098890612','carinasosa76@gmail.com','manzana 66 solar 19 barrio cerro pelado','1976-10-04',1,'2025-02-20 16:41:09',21,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (2,'MARCELO ELEAZAR','ASENCIO MONTERO','41601645','092124171','marcelo@gmgroup.red','AV ROOSEVELT AP 703','1987-11-23',1,'2025-02-20 17:00:20',22,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (3,'Marcelo Gabriel','Morales Yacque,','54599728','59891638977','marceloyaque616@gmail.com','Diagonal 13 1019 Bis Bº Atilio, 50000 Salto, Salto','1996-08-07',1,'2025-02-21 15:15:49',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (4,'Isabel Maria','Pereira Houska,','37506061','59898293700','isabelpereira927@gmail.com','Artigas 611 Depto/Of 602, 50000 Salto, Salto','1976-07-05',1,'2025-02-21 15:25:27',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (5,'Alberto Martin','Llobet Corbetta,','42892011','59898273406','seguros1@gmgroup.red','Maciel 3150, 50000 Salto, Salto','1990-05-30',1,'2025-02-24 15:45:29',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (6,'Marianella','Duran Bustamante','49953131','59898267340','marianelladuran107@gmail.com','Bulevar Artigas 549, 60000 Paysandú, Paysandú','1993-09-15',1,'2025-02-25 15:38:46',25,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (7,'Luciano Benjamin','Gularte Rompani','53699359','59898028099','Gularteluciano@gmail.com','Balneario Buenos Aires Calle 32 Y 56 S/N, 20000 Maldonado, Maldonado','2002-04-25',1,'2025-02-25 15:50:54',21,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (8,'Esteves Estevez','Florencia','42820636','59899895669','floresteves89@gmail.com','Artigas 1555, 50000 Salto, Salto','1989-07-22',1,'2025-02-25 15:55:09',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (9,'Castro Fassana','Nrique Daniel','30348816','59892142793','nogueirahungari@gmail.com','Vilardebo 1269, 50000 Salto, Salto','1957-03-17',1,'2025-02-25 16:52:33',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (10,'Gabriel','Salazar Diaz','45193337','59897431057','gabrielsalazardiaz@gmail.com','Lavagna Casi Ricon, 20400 San Carlos, Maldonado','1988-06-15',1,'2025-02-26 13:33:22',23,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (11,'Tulio Gabriel','Rodriguez Bastida,','43499733','59898714062','gr8613675@gmail.com','Enrique Amorin Y San Martin','1990-04-06',1,'2025-02-27 12:50:48',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (12,'Rodrigo Ezequiel','Roascio Dmitruk,','45266780','59898419629','rodrigoerd2015@gmail.com','Batlle Berres 500 Casi Trillo','1993-09-08',1,'2025-02-27 13:00:19',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (13,'Ana Patricia','Rodriguez Leites,','37937313','59898541218','anapatriciarodriguez477@gmail.com','Colonia Y Canelonee, Villa Constitucion','1974-08-17',1,'2025-02-27 13:07:21',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (14,'Diego Roberto','Martinez Leivas,','55949904','59892577643','dm6993169@gmail.com','Calle Lavalleja Sin N°, Barrio Sur,V.Constitución','1988-02-12',1,'2025-02-27 13:14:16',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (15,'Elias Gustavo','Urristi Furtado,','55692109','59899324379','eliasurristifurtado@gmail.com','Ferreira Artigas 1595','2005-02-16',1,'2025-02-27 13:30:21',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (16,'Romina Gabriella','Morencio Arreseigor,','46285181','59891070229','rc@rc.com.uy','Defensa Viv.7 Covi.Co.Nuf','1995-02-10',1,'2025-02-27 13:34:28',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (17,'Facundo Wenceslao','Vega Silveira,','58162125','59898362871','vegafacundo80@gmail.com','Peru B° Williams 156','1999-10-30',1,'2025-02-27 13:39:37',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (18,'Narda Fabiana','Dalmao Urrutis,','39035585','59891329380','francismachiavello@gmail.com','25 De Mayo 1149','1977-03-28',1,'2025-02-27 13:44:38',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (19,'Sebastian','Lentinelly,','53966495','59891653768','sebastianlentinelly@gmail.com','Chile 248','1997-08-07',1,'2025-02-27 14:55:45',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (20,'Gonzalo Nicolas','Zimerman Fernandez,','50555390','59891921959','gonzazimerman@gmail.com','Cerro Pelado Calle Cerros Azules Entre 27 Y 28','1997-12-18',1,'2025-02-27 15:09:53',21,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (21,'Carolina Esther','Britos Silva,','54706159','59892037313','carobritossilva@gmail.com','Dr. Matilde Albisu 2160, 50000 Salto,','1995-07-27',1,'2025-03-06 10:27:22',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (22,'Maria Elena','Terra De Mello,','52150338','98198459','terramariaelena1@gmail.com','Ellauri B° Uruguay 171 Depto/Of Bis,','1997-03-05',1,'2025-03-06 10:54:32',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (23,'Esteban Gabriel','Leal Montero,','53167534','92233006','esteban.leal99@hotmail.com','Charrua 2910','1999-11-08',1,'2025-03-06 11:09:15',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (24,'Mary Andrea','Cardozo Godoy,','43409009','91069658','maryandreacardozogodoy@gmail.com','Calle 11 Esq. Calle 8 Viv. 5  Proyecto Volcan 5486','1979-03-02',1,'2025-03-06 14:33:42',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (25,'Monica','Campos Dalto,','26268620','099974729','mcampodalto13@gmail.com','M. Olearreaga Gallino 1168','1976-09-13',1,'2025-03-07 14:51:04',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (26,'JORGE FERNANDO','MACHADO PERDOMO,','39452076','096124723','fernandomachadofenix@gmail.com','Vilardebo 711','1969-06-19',1,'2025-03-07 16:26:00',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (27,'Juan Antonio','Baraybar','40900812','098827907','fredyalvez52@hotmail.com','Calle 1 Y 10  Chapicuy','1952-01-26',1,'2025-03-11 13:34:58',25,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (28,'Angela Gabriela','Sosa Gomez,','43122512','098220399','angelagabrielasosagomez@gmail.com','Cerro Colorado, Viv 48, Manzana 28. Cerro Pelado','1979-10-11',1,'2025-03-11 14:40:25',21,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (29,'Cesar Sebastian','Pereira Pereira Das Neves,','56198455','091782954','ppereira3937@gmail.com','18 De Mayo 525 B° Artigas','2006-09-16',1,'2025-03-11 14:46:40',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (30,'Shirley Roxana','Lopez Rocha,','32969428','091321475','roxana.lopez2707@gmail.com','Luciano Bourdin Ribau 137,','1971-07-27',1,'2025-03-11 14:52:41',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (31,'Wilson Javier','Piriz Paz,','37760188','91952823','chorrowj14@gmail.com','Lucas Piriz S/N Entre Varela Y Cervantes,','1974-09-13',1,'2025-03-17 14:05:48',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (32,'Mirta Etel','Bica Rodriguez,','48935790','091263733','salto.serviciosempresariales@gmail.com','Charrua 2152, 50000 Salto,','1992-12-21',1,'2025-03-17 14:58:21',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (33,'Daniel Alejandro','Da Silva Caceres,','44807505','092795452','dasilvadaniel8222@gmail.com','Miguel Barreiro Y Rondeau  B° Artigas S/N,','1985-03-24',1,'2025-03-20 11:09:38',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (34,'Mario Enrique','Camargo Da Rosa,','34695449','091843532','mariocamargo693@gmail.com','Calle 10 Viv.21 B° Horacio Quiroga,','1971-03-22',1,'2025-03-20 11:15:26',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (35,'Ivo Emanuel','Aplanalp Sosa,','57102712','098548545','ivoaplanalp23@gmail.com','Progreso 1334','2001-11-23',1,'2025-03-20 11:21:45',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (36,'Sergio Daniel','Gomez De Los Santos,','44000965','091865455','yasmingomezjaime2019caro@gmail.com','J. Cataneo Morales 2099 Bº. Quiroga Ex Clle3','1986-04-10',1,'2025-03-20 11:38:31',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (37,'Luis Francisco','Rossi Merica,','49345968','098308017','luisrossi926@gmail.com','Piedras 1305','1993-09-28',1,'2025-03-20 11:57:59',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (38,'Maria Cristina','Laureiro Perlas,','28345808','098034673','laureirocristina@gmail.com','Patule 2200 Vivi. 19','1967-12-30',1,'2025-03-20 13:29:57',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (39,'Melina Beatriz','Cencha,','65835042','096880607','melinacencha@gmail.com','Gorlero -Edificio Barlovento 630 Piso 1 Depto/Of 107','1985-05-03',1,'2025-03-20 13:43:38',22,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (40,'Walter Celio','Albernaz Abreu,','25163495','099262726','walterabreu2345@gmail.com','8 De Octubre 650','1968-02-15',1,'2025-03-20 14:51:39',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (41,'Vicente Sebastian','Foucault Machado,','54884094','093859946','vicentefucol@gmail.com','Bolivia 196','2005-01-28',1,'2025-03-20 15:04:06',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (42,'Augusto','Caffera Constante,','39523409','094854449','augustocaffera@gmail.com','R. Perez Del Puerto 740','1965-10-14',1,'2025-03-20 15:09:10',21,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (43,'Paola Yanina','Simone Sosa,','27784154','095608436','paolasimone39@gmail.com','19 De Abril 916','1977-11-21',1,'2025-03-20 15:45:25',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (44,'Carolina','Dos Santos Nuñez,','56145072','091628175','caro002276@gmail.com','Wimpy 247','2002-12-27',1,'2025-03-20 16:04:32',34,'Física',5);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (45,'DAIANA XIMENA','FRAGA FERNANDEZ','42026333','092976017','XIME.FRAGA2019@GMAIL.COM','CATALÁN 2058 ()','1988-03-13',1,'2025-03-20 16:59:51',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (46,'FRANCO VALENTINO','TAVARES GONZÁLEZ','55846132','098190721','TAVARESMARCOS589@GMAIL.COM','ARTIGAS 2725','2004-07-13',1,'2025-03-26 10:55:09',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (47,'Ramona Graciela','Maciel Rodriguez,','36972574','098752303','segurosdelnorte.org@gmail.com','Mevir 2 (Colonia Garibaldi) 26294','1958-09-20',1,'2025-03-26 11:28:07',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (48,'Leticia','Martinez Diaz,','45238024','098247161','leticia.martinez.dz@gmail.com','Uruguay 1028','1993-03-19',1,'2025-03-26 14:55:28',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (49,'Francisco','Da Costa Fernandez,','44981999','091736771','seguros2@gmgroup.red','Calle 1  1812 Saladero','1992-12-17',1,'2025-03-27 09:48:11',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (50,'Juan Andres','Cincunegui Curbelo,','30775071','099736067','juanchocincu@hotmail.com','Uruguay 1387 Apartamento 101','1979-08-29',1,'2025-03-27 09:54:27',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (51,'Carlos Maria','Nievez Gomez,','25395822','097966181','ubaenfermeria@gmail.com','25 De Mayo 95','1965-05-25',1,'2025-03-27 10:17:05',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (52,'Jose Luis','Gomez Acosta,','31944017','098100161','luisacosta2193@gmail.com','33 Orientales 2193','1958-04-07',1,'2025-03-27 10:41:44',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (53,'Maria Eugenia','De Los Santos Maciel,','50312251','098752303','eugee412@gmail.com','Mevir 2  26294 Colonia Garibaldi','1994-12-04',1,'2025-03-27 10:56:26',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (54,'Ramon Edgardo','Macedo Sosa,','35813602','091346878','electronicasalto@hotmail.com','Cuareim 1609','1969-09-13',1,'2025-03-27 11:04:07',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (55,'NORA BETTINA','LARROSA MORALES','40987143','097228039','danielsofialuciabettina@gmail.com','Altos de la laguna Maldonado  Calle principal 1 esquina calle 13','1977-12-05',1,'2025-03-31 16:10:42',21,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (56,'Luis Andres','Rodriguez Galleto,','38080636','098676194','rodriguezluisandres2018@gmail.com','Varela 2301','1975-03-11',1,'2025-03-31 16:19:32',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (57,'Liliana Beatriz','Tabarez Cardozo,','49238125','092732358','tabarezliliana0@gmail.com','Barrio Volcán Calle 10 Vivienda 04 Covimis 04','1986-06-02',1,'2025-03-31 16:31:34',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (58,'TINQUER JOEL','DOS SANTOS AUSTRIA,','42857912','091895798','tinquerdosantos@gmail.com','DR. ALVAREZ SANCHEZ MEVIR 28251','1983-12-08',1,'2025-04-01 12:36:19',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (59,'Matias Agustin','Vandelli Banchero,','52816124','099860786','delossantosantonela354@gmail.com','Colonia Itapebi Km 56 De Ruta 31','2002-09-01',1,'2025-04-02 10:23:37',34,'Física',3);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (60,'CARLOS ANDRES','NUNEZ TRINDADE,','54630221','091522046','andrescarlos800@gmail.com','PATULE 1059','2001-11-10',1,'2025-04-02 11:31:20',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (61,'LOURDES SECUNDINO','ALVAREZ,','29989310','099386279','cliente78375@gmail.com','19 de junio y Blas basualdo Barrio Artigas','1971-01-24',1,'2025-04-02 11:44:21',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (62,'LUIS ENRIQUE','ARGAIN VARGAS,','49833456','091508525','luisargain114@gmail.com','Imbernette 1340','1996-06-01',1,'2025-04-02 11:59:53',34,'Física',4);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (63,'MARIA DE LOURDES','FIGUERA RIOS,','47477313','097410534','seguros3@gmgroup.red','19 De Abril 2688','1982-02-12',1,'2025-04-02 12:09:47',34,'Física',5);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (64,'CARLOS RAMON','MUSSETTI TEXO,','32489377','092162605','gatubela182016@gmail.com','6 De Abril 1049','1981-11-23',1,'2025-04-02 13:02:13',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (65,'LUIS FRANCISCO','ACOSTA CARBONE,','30331122','097308033','acostayuliana477@gmail.com','COLONIA 18 DE JULIO','1968-10-20',1,'2025-04-02 15:05:51',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (66,'LOURDES ROCIO','PADILLA SILVA,','50834324','091678990','rocio.padillasilvaa@gmail.com','Luis Menoni 37','1998-02-17',1,'2025-04-02 15:15:54',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (67,'MÓNICA FABIANA','NEEVES ROMEO','33611307','096570217','monicanievess04@gmail.com','CHARRUA 361','1967-10-04',1,'2025-04-02 15:28:38',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (68,'ALFONSO MARTIN','LEDESMA ALANIS,','46701567','099939454','alfonsoledesma006@gmail.com','Rodriguez Esq. A. Gallinal S/N','1989-12-21',1,'2025-04-02 15:57:05',17,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (69,'FERNANDO JOAQUIN','VILLALBA PEREYRA,','20179704','098990631','fvillalbapereyra@gmail.com','Doctor Elvio Rivero 742','1967-02-06',1,'2025-04-02 16:04:18',21,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (70,'RAUL LEONARDO','GODOY RODRIGUEZ,','33878385','099733467','sanitariogodoy@gmail.com','CALLE 2 VIV 65 BARRIO CALAFI 1','1970-12-06',1,'2025-04-02 16:14:56',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (71,'FRANCISCO','PINTO REYES,','34749210','091791196','franciscopintoreyes@gmail.com','Nicanor Amaro 2839','1952-10-31',1,'2025-04-02 16:22:59',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (72,'ROBERTO SIMON','OLIVERA ACOSTA,','49248742','099542369','seguros4@gmgroup.red','Michellini 2373','1992-05-07',1,'2025-04-02 16:30:00',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (73,'Marcelo Fabian','Ferreira Lechini,','30549444','59899921928','marcelo.ferreira.22175@gmail.com','Chiazzaro 1423,','1975-01-22',1,'2025-04-03 14:36:52',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (74,'ROXANA ISABEL','SICILIANO FLORES,','25717749','098542548','siciroxa1475@gmail.com','6 De Abril 1475','1967-09-29',1,'2025-04-08 15:32:36',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (75,'FABIAN ENRIQUE','DE LOS SANTOS RODRIGUEZ,','45331636','098626454','delossantosfabian100@gmail.com','Sarandí','1981-03-10',1,'2025-04-08 15:54:01',21,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (76,'WALTER','LOPEZ,','41202237','099147633','seguros5@gmgroup.red','Paloma S/N','1962-10-24',1,'2025-04-08 16:03:39',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (77,'KIMBERLY TATIANA','IZAGUIRRE PROENZA,','55363142','098714102','kimbeiza41@gmail.com','Pasaje Santarosa 35 Bis 35','2003-10-23',1,'2025-04-08 16:30:56',34,'Física',5);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (78,'NERY JESUS','LOPEZ IFRAN,','47581518','091358947','antonavarrolopez@gmail.com','PUEBLO PALOMAS','1975-05-12',1,'2025-04-10 10:03:26',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (79,'ANDRELINA NOELA','SORIA VARGAS,','41678177','094830090','andreinasoria79@gmail.com','AGUSTIN PEDROZA 1019Bº CABALLERO','1979-06-07',1,'2025-04-10 11:31:05',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (80,'JUAN GABRIEL','RODRIGUEZ CORTEZ,','54240856','091522406','RODRIGUEZCORTEZ99@GMAIL.COM','Viera 1889','1999-04-05',1,'2025-04-10 12:05:44',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (81,'FEDERICO STEPHANI','GOMEZ,','49119397','091965382','fg650493@gmail.com','25 DE MAYO 1675','1986-01-16',1,'2025-04-10 12:14:17',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (82,'CARLOS ENRIQUE','PECHI SILVA,','26726749','098440547','1972rou@gmail.com','Santiago Artigas 2274','1971-01-26',1,'2025-04-10 13:22:55',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (83,'PANCHO LEONEL','NUÑEZ FAGUNDEZ,','35213321','098791748','alvaromartinez18387@gmail.com','TROPIEZO','1956-07-17',1,'2025-04-10 14:38:41',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (84,'CLAUDIA YANET','MORAES,','40368280','097356581','claudiamoraes103@gmail.com.uy','Vilardebo 739','1980-03-12',1,'2025-04-10 15:33:07',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (85,'SILVIA LUJAN','LEAL MONTERO,','39403542','091384959','silvialeal@gmail.com','pasaje santa rosa N° 21','1978-09-26',1,'2025-04-10 16:04:01',34,'Física',1);
INSERT INTO Personas (`id`,`nombres`,`apellidos`,`documento`,`telefono`,`email`,`direccion`,`fecha_nacimiento`,`es_cliente`,`created_at`,`id_ciudad`,`tipo`,`id_corredor`) VALUES (86,'HECTOR DANIEL','HERNANDEZ ODIZZIO,','27675272','094149998','hectordaniellhernandez@gmail.com','Cisnes Cooperativa Las Maravillas viv11','1959-05-07',1,'2025-04-10 16:18:10',34,'Física',1);
