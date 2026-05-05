# Backend Server - FortiDev

API REST construida con Node.js, Express y PostgreSQL para la aplicación FortiDev.

## Instalación

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Configurar la base de datos PostgreSQL:
   - Crear la base de datos ejecutando `init.sql` en PostgreSQL.
   - Actualizar las credenciales en `src/db.js`.

3. Ejecutar el servidor:
   ```bash
   npm run dev  # Para desarrollo con nodemon
   npm start    # Para producción
   ```

## Endpoints de Usuarios

### Registro (Público)
- **POST** `/api/auth/register`
- Body: `{ "nombre": "string", "email": "string", "rol": "string", "contrasena": "string" }`

### Login (Público)
- **POST** `/api/auth/login`
- Body: `{ "email": "string", "contrasena": "string" }`
- Respuesta: `{ "token": "jwt", "user": {...} }`

### Obtener Todos los Usuarios (Público)
- **GET** `/api/auth/users`
- No requiere autenticación

### Obtener Perfil (Autenticado)
- **GET** `/api/auth/profile`
- Headers: `Authorization: Bearer <token>`

### Actualizar Perfil (Autenticado)
- **PUT** `/api/auth/profile`
- Headers: `Authorization: Bearer <token>`
- Body: `{ "nombre": "string", "email": "string", "rol": "string" }`

### Obtener Todos los Usuarios (Admin)
- **GET** `/api/auth/`
- Headers: `Authorization: Bearer <token>` (requiere rol admin)

### Obtener Usuario por ID (Admin)
- **GET** `/api/auth/:id`
- Headers: `Authorization: Bearer <token>` (requiere rol admin)

### Actualizar Usuario (Admin)
- **PUT** `/api/auth/:id`
- Headers: `Authorization: Bearer <token>` (requiere rol admin)
- Body: `{ "nombre": "string", "email": "string", "rol": "string", "contrasena": "string" }` (contraseña opcional)

### Eliminar Usuario (Admin)
- **DELETE** `/api/auth/:id`
- Headers: `Authorization: Bearer <token>` (requiere rol admin)

## Variables de Entorno

Crear un archivo `.env` en la raíz del backend:

```
JWT_SECRET=tu_secreto_jwt
PORT=3000
```

## Notas

- Asegúrate de que PostgreSQL esté corriendo en localhost:5432.
- Cambia las credenciales de la DB en `src/db.js`.
- Las rutas de administración requieren que el usuario tenga rol 'admin'.