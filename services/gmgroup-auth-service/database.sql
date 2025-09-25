-- Crear Base de Datos
CREATE DATABASE IF NOT EXISTS gm_auth
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gm_auth;

-- ============================================
-- TABLA: usuarios
-- ============================================
CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_empresa BIGINT NOT NULL DEFAULT 1,
    nombres VARCHAR(150) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    username VARCHAR(150) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    telefono VARCHAR(100),
    estado ENUM('activo','suspendido','inactivo') NOT NULL DEFAULT 'activo',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- ============================================
-- TABLA: roles
-- ============================================
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- ============================================
-- TABLA: permisos
-- ============================================
CREATE TABLE permisos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- ============================================
-- TABLA: usuarios_roles (N:M)
-- ============================================
CREATE TABLE usuarios_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL,
    id_rol BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_rol_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    CONSTRAINT fk_usuario_rol_rol FOREIGN KEY (id_rol) REFERENCES roles(id),
    UNIQUE (id_usuario, id_rol)
);

-- ============================================
-- TABLA: roles_permisos (N:M)
-- ============================================
CREATE TABLE roles_permisos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_rol BIGINT NOT NULL,
    id_permiso BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rol_permiso_rol FOREIGN KEY (id_rol) REFERENCES roles(id),
    CONSTRAINT fk_rol_permiso_permiso FOREIGN KEY (id_permiso) REFERENCES permisos(id),
    UNIQUE (id_rol, id_permiso)
);

-- ============================================
-- TABLA: usuarios_permisos (N:M)
-- ============================================
CREATE TABLE usuarios_permisos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL,
    id_permiso BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_permiso_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    CONSTRAINT fk_usuario_permiso_permiso FOREIGN KEY (id_permiso) REFERENCES permisos(id),
    UNIQUE (id_usuario, id_permiso)
);

-- ============================================
-- TABLA: grupos
-- ============================================
CREATE TABLE grupos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
ALTER TABLE grupos
ADD COLUMN id_empresa INT AFTER nombre;

-- ============================================
-- TABLA: usuarios_grupos (N:M)
-- ============================================
CREATE TABLE usuarios_grupos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL,
    id_grupo BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_grupo_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    CONSTRAINT fk_usuario_grupo_grupo FOREIGN KEY (id_grupo) REFERENCES grupos(id),
    UNIQUE (id_usuario, id_grupo)
);

-- ============================================
-- TABLA: grupos_roles (N:M)
-- ============================================
CREATE TABLE grupos_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_grupo BIGINT NOT NULL,
    id_rol BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_grupo_rol_grupo FOREIGN KEY (id_grupo) REFERENCES grupos(id),
    CONSTRAINT fk_grupo_rol_rol FOREIGN KEY (id_rol) REFERENCES roles(id),
    UNIQUE (id_grupo, id_rol)
);

-- ============================================
-- TABLA: grupos_permisos (N:M)
-- ============================================
CREATE TABLE grupos_permisos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_grupo BIGINT NOT NULL,
    id_permiso BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_grupo_permiso_grupo FOREIGN KEY (id_grupo) REFERENCES grupos(id),
    CONSTRAINT fk_grupo_permiso_permiso FOREIGN KEY (id_permiso) REFERENCES permisos(id),
    UNIQUE (id_grupo, id_permiso)
);

-- ============================================
-- TABLA: sesiones
-- ============================================
CREATE TABLE sesiones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL,
    token_jwt TEXT NOT NULL UNIQUE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_inicio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_sesion_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);