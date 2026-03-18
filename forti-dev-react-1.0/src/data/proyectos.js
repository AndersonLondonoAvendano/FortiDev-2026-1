/**
 * proyectos.js
 * Datos mock de proyectos.
 * Reemplazar con fetch() a /api/proyectos cuando el backend esté listo.
 */

export const PROYECTOS = [
  {
    id: "alpha",
    siglas: "PA",
    nombre: "Proyecto Alpha",
    desc: "Aplicación web de gestión interna — Stack: React + Spring Boot + PostgreSQL",
    estado: "Activo",
    estadoMod: "abierto",
    metricas: { critico: 5, alto: 12, medio: 23, bajo: 34 },
    progreso: 45,
    progresoColor: "var(--color-medio)",
    miembros: ["AL", "ED"],
    extrasAnalistas: 1,
    gradient: "linear-gradient(135deg, #1f6feb, #58a6ff)",
  },
  {
    id: "beta",
    siglas: "PB",
    nombre: "Proyecto Beta",
    desc: "API REST de pagos — Stack: Node.js + Express + MySQL + Redis",
    estado: "En revisión",
    estadoMod: "en-progreso",
    metricas: { critico: 4, alto: 8, medio: 17, bajo: 28 },
    progreso: 72,
    progresoColor: "var(--color-bajo)",
    miembros: ["AL"],
    extrasAnalistas: 2,
    gradient: "linear-gradient(135deg, #1f6feb, #388bfd)",
  },
  {
    id: "gamma",
    siglas: "PG",
    nombre: "Proyecto Gamma",
    desc: "Portal de clientes — Stack: Vue.js + Django + PostgreSQL",
    estado: "Activo",
    estadoMod: "abierto",
    metricas: { critico: 3, alto: 14, medio: 27, bajo: 29 },
    progreso: 18,
    progresoColor: "var(--color-critico)",
    miembros: ["ED"],
    extrasAnalistas: 1,
    gradient: "linear-gradient(135deg, #388bfd, #58a6ff)",
  },
];
