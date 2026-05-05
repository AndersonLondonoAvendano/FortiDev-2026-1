-- Script para inicializar la base de datos PostgreSQL para FortiDev

CREATE DATABASE fortidev_db;

\c fortidev_db;

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  rol VARCHAR(50) NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREAE TABLE proyectos (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  stack VARCHAR(255),
  hallazgos TEXT,
  colaboradores TEXT,
  escaneos TEXT,
  estado VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  constraint chk_estado CHECK (estado IN ('activo', 'inactivo', 'finalizado')),
  constraint foreign key (colaboradores) references usuarios(id) ON DELETE SET NULL,
  constraint foreign key (hallazgos) references hallazgos(id) ON DELETE SET NULL,
  constraint foreign key (escaneos) references escaneos(id) ON DELETE SET NULL
);

CREATE TABLE hallazgos (
  id SERIAL PRIMARY KEY,
  proyecto_id INT REFERENCES proyectos(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  severidad VARCHAR(50) NOT NULL,
  estado VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vulnerabilidades (
  id SERIAL PRIMARY KEY,
  proyecto_id INT REFERENCES proyectos(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  severidad VARCHAR(50) NOT NULL,
  estado VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar 10 usuarios de ejemplo
-- Nota: Las contraseñas están hasheadas con bcrypt (costo 10) para 'password123'
INSERT INTO usuarios (nombre, email, rol, contrasena) VALUES
('Admin User', 'admin@fortidev.com', 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('John Doe', 'john.doe@fortidev.com', 'developer', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Jane Smith', 'jane.smith@fortidev.com', 'tester', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Bob Johnson', 'bob.johnson@fortidev.com', 'manager', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Alice Brown', 'alice.brown@fortidev.com', 'developer', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Charlie Wilson', 'charlie.wilson@fortidev.com', 'tester', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Diana Davis', 'diana.davis@fortidev.com', 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Edward Miller', 'edward.miller@fortidev.com', 'developer', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Fiona Garcia', 'fiona.garcia@fortidev.com', 'manager', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('George Lee', 'george.lee@fortidev.com', 'tester', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insertar proyectos de ejemplo
INSERT INTO proyectos (name, description, stack, estado) VALUES
('FortiDev Security Audit', 'Comprehensive security assessment of the FortiDev platform', 'React, Node.js, PostgreSQL', 'activo'),
('Mobile App Vulnerability Testing', 'Security testing for mobile application', 'React Native, Firebase', 'activo'),
('API Security Review', 'Review of REST API security practices', 'Express.js, PostgreSQL', 'finalizado'),
('Cloud Infrastructure Assessment', 'Security evaluation of cloud setup', 'AWS, Docker, Kubernetes', 'activo'),
('Database Security Hardening', 'PostgreSQL security configuration review', 'PostgreSQL', 'inactivo');

-- Insertar hallazgos de ejemplo
INSERT INTO hallazgos (proyecto_id, titulo, descripcion, severidad, estado) VALUES
(1, 'SQL Injection Vulnerability', 'Found potential SQL injection in user input', 'alta', 'abierto'),
(1, 'Cross-Site Scripting', 'XSS vulnerability in comments section', 'media', 'en progreso'),
(2, 'Insecure API Endpoints', 'Some endpoints lack authentication', 'alta', 'abierto'),
(3, 'Weak Password Policy', 'Password requirements are insufficient', 'media', 'resuelto'),
(4, 'Missing HTTPS Configuration', 'Some endpoints not using HTTPS', 'alta', 'en progreso');

-- Insertar vulnerabilidades de ejemplo
INSERT INTO vulnerabilidades (proyecto_id, titulo, descripcion, severidad, estado) VALUES
(1, 'Outdated Dependencies', 'Several npm packages have known vulnerabilities', 'media', 'abierto'),
(1, 'Hardcoded Secrets', 'API keys found in source code', 'critica', 'en progreso'),
(2, 'Insufficient Logging', 'Security events are not properly logged', 'baja', 'abierto'),
(3, 'Weak Encryption', 'Data encrypted with outdated algorithms', 'alta', 'resuelto'),
(4, 'Missing Rate Limiting', 'API endpoints lack rate limiting protection', 'media', 'abierto');