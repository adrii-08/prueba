# 🎉 API de Gestión de Eventos

Sistema backend completo para gestionar eventos, asistentes, sedes y patrocinadores.

**Stack:** Node.js · Express · PostgreSQL · Prisma ORM

---

## 📁 Estructura del Proyecto

```
event-management-api/
├── prisma/
│   ├── schema.prisma        # Modelo de datos
│   └── seed.js              # Datos de ejemplo
├── src/
│   ├── controllers/
│   │   ├── sedeController.js
│   │   ├── eventoController.js
│   │   ├── asistenteController.js
│   │   └── patrocinadorController.js
│   ├── middlewares/
│   │   ├── errorHandler.js   # Manejo global de errores
│   │   └── validators.js     # Validaciones con express-validator
│   ├── prisma/
│   │   └── client.js         # Singleton del cliente Prisma
│   ├── routes/
│   │   ├── sedeRoutes.js
│   │   ├── eventoRoutes.js
│   │   ├── asistenteRoutes.js
│   │   └── patrocinadorRoutes.js
│   ├── services/
│   │   ├── sedeService.js
│   │   ├── eventoService.js
│   │   ├── asistenteService.js
│   │   └── patrocinadorService.js
│   └── app.js                # Punto de entrada
├── .env                      # Variables de entorno
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Instrucciones paso a paso para correr el proyecto

### Prerrequisitos

- **Node.js** v18+ instalado
- **PostgreSQL** instalado y corriendo
- Un cliente de API como **Postman**, **Insomnia**, o **curl**

### 1. Crear la base de datos en PostgreSQL

```sql
CREATE DATABASE event_management;
```

### 2. Configurar variables de entorno

Editar el archivo `.env` con tus credenciales de PostgreSQL:

```env
DATABASE_URL="postgresql://TU_USUARIO:TU_CONTRASEÑA@localhost:5432/event_management?schema=public"
PORT=3000
NODE_ENV=development
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Generar cliente Prisma y ejecutar migraciones

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. (Opcional) Cargar datos de ejemplo

```bash
node prisma/seed.js
```

### 6. Iniciar el servidor

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

---

## 📋 Endpoints de la API

Base URL: `http://localhost:3000/api`

### Health Check

| Método | Endpoint       | Descripción            |
|--------|----------------|------------------------|
| GET    | `/api/health`  | Estado del servidor    |

### Sedes (`/api/sedes`)

| Método | Endpoint         | Descripción         |
|--------|------------------|---------------------|
| GET    | `/api/sedes`     | Listar todas        |
| GET    | `/api/sedes/:id` | Obtener por ID      |
| POST   | `/api/sedes`     | Crear nueva         |
| PUT    | `/api/sedes/:id` | Actualizar          |
| DELETE | `/api/sedes/:id` | Eliminar            |

### Eventos (`/api/eventos`)

| Método | Endpoint                                        | Descripción                  |
|--------|-------------------------------------------------|------------------------------|
| GET    | `/api/eventos`                                  | Listar todos                 |
| GET    | `/api/eventos/:id`                              | Obtener por ID               |
| POST   | `/api/eventos`                                  | Crear nuevo                  |
| PUT    | `/api/eventos/:id`                              | Actualizar                   |
| DELETE | `/api/eventos/:id`                              | Eliminar                     |
| POST   | `/api/eventos/:id/asistentes`                   | Registrar asistente          |
| DELETE | `/api/eventos/:id/asistentes/:asistenteId`      | Remover asistente            |
| POST   | `/api/eventos/:id/patrocinadores`               | Asignar patrocinador         |
| PUT    | `/api/eventos/:id/patrocinadores/:patrocinadorId` | Actualizar monto           |
| DELETE | `/api/eventos/:id/patrocinadores/:patrocinadorId` | Remover patrocinador       |

### Asistentes (`/api/asistentes`)

| Método | Endpoint              | Descripción         |
|--------|-----------------------|---------------------|
| GET    | `/api/asistentes`     | Listar todos        |
| GET    | `/api/asistentes/:id` | Obtener por ID      |
| POST   | `/api/asistentes`     | Crear nuevo         |
| PUT    | `/api/asistentes/:id` | Actualizar          |
| DELETE | `/api/asistentes/:id` | Eliminar            |

### Patrocinadores (`/api/patrocinadores`)

| Método | Endpoint                   | Descripción         |
|--------|----------------------------|---------------------|
| GET    | `/api/patrocinadores`      | Listar todos        |
| GET    | `/api/patrocinadores/:id`  | Obtener por ID      |
| POST   | `/api/patrocinadores`      | Crear nuevo         |
| PUT    | `/api/patrocinadores/:id`  | Actualizar          |
| DELETE | `/api/patrocinadores/:id`  | Eliminar            |

---

## 📝 Ejemplos de Requests JSON

### Crear Sede

```http
POST /api/sedes
Content-Type: application/json

{
  "nombre": "Centro de Convenciones ABC",
  "direccion": "Av. Libertador 5000, Buenos Aires",
  "capacidad": 300
}
```

### Crear Evento

```http
POST /api/eventos
Content-Type: application/json

{
  "nombre": "Conferencia de IA 2026",
  "descripcion": "Conferencia sobre inteligencia artificial y machine learning",
  "fecha_inicio": "2026-09-15T09:00:00",
  "fecha_fin": "2026-09-17T18:00:00",
  "id_sede": 1
}
```

### Crear Asistente

```http
POST /api/asistentes
Content-Type: application/json

{
  "nombre": "Laura",
  "apellido": "Martínez",
  "email": "laura.martinez@email.com",
  "telefono": "+54 11 5555-9999"
}
```

### Crear Patrocinador

```http
POST /api/patrocinadores
Content-Type: application/json

{
  "nombre": "CloudTech Solutions",
  "email": "partners@cloudtech.com",
  "telefono": "+54 11 4444-8888"
}
```

### Registrar Asistente en Evento

```http
POST /api/eventos/1/asistentes
Content-Type: application/json

{
  "asistente_id": 1
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Asistente registrado en el evento exitosamente",
  "data": {
    "eventoId": 1,
    "asistenteId": 1,
    "fechaRegistro": "2026-04-30T04:50:00.000Z",
    "asistente": {
      "id": 1,
      "nombre": "Carlos",
      "apellido": "Ramírez",
      "email": "carlos.ramirez@email.com"
    },
    "evento": {
      "id": 1,
      "nombre": "Conferencia de Tecnología 2026"
    }
  }
}
```

**Error: Capacidad de sede excedida (409):**
```json
{
  "success": false,
  "error": {
    "message": "El evento \"Conferencia de Tecnología 2026\" ha alcanzado la capacidad máxima de la sede \"Centro de Convenciones Metropolitano\" (500 asistentes)"
  }
}
```

### Asignar Patrocinador a Evento con Monto

```http
POST /api/eventos/1/patrocinadores
Content-Type: application/json

{
  "patrocinador_id": 1,
  "monto_patrocinio": 25000.00
}
```

### Actualizar Monto de Patrocinio

```http
PUT /api/eventos/1/patrocinadores/1
Content-Type: application/json

{
  "monto_patrocinio": 35000.00
}
```

---

## ⚠️ Manejo de Errores

Todas las respuestas de error siguen este formato:

```json
{
  "success": false,
  "error": {
    "message": "Descripción del error"
  }
}
```

### Códigos HTTP utilizados

| Código | Significado                      |
|--------|----------------------------------|
| 200    | Operación exitosa                |
| 201    | Recurso creado exitosamente      |
| 400    | Error de validación / Bad Request |
| 404    | Recurso no encontrado            |
| 409    | Conflicto (duplicado, capacidad) |
| 500    | Error interno del servidor       |

### Error de validación ejemplo:

```json
{
  "success": false,
  "error": {
    "message": "Error de validación",
    "details": [
      {
        "campo": "email",
        "mensaje": "El email no tiene un formato válido",
        "valor": "correo-invalido"
      }
    ]
  }
}
```

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo con auto-reload
npm run dev

# Producción
npm start

# Abrir Prisma Studio (GUI para ver la BD)
npx prisma studio

# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Resetear la BD completa
npx prisma migrate reset

# Ejecutar seed
node prisma/seed.js
```

---

## 📊 Modelo de Datos (Relaciones)

```
┌─────────────┐     N:1      ┌─────────────┐
│   Evento    │──────────────▶│    Sede      │
└──────┬──────┘              └─────────────┘
       │
       │ M:N                  M:N
       │                      (con monto_patrocinio)
       ▼                      ▼
┌─────────────┐         ┌──────────────┐
│  Asistente  │         │ Patrocinador │
└─────────────┘         └──────────────┘
```