<<<<<<< HEAD
# Atelier · Sistema de gestión de eventos

Aplicación web completa para gestionar eventos, asistentes, sedes y patrocinadores. Construida con **React 18 + Vite + Tailwind CSS** y diseño editorial moderno.

---

## ✨ Características

- **6 pantallas** completas: Dashboard, Eventos, Crear/Editar evento, Asistentes, Sedes, Patrocinadores.
- **Formularios** con validación visual en tiempo real (campos requeridos, email, números positivos…).
- **Selección de sede** desde un dropdown poblado por la API.
- **Agregar asistentes y patrocinadores** desde modales dentro del formulario de evento.
- **Patrocinadores con monto** y tier (Platino, Oro, Plata, Bronce).
- **Diseño editorial** con paleta verde oliva + crema + acentos terracota, tipografía Fraunces + Inter.
- **Cards** y **tablas limpias** con estados hover, badges y micro-interacciones.
- **Loading states** (spinners, skeletons), **empty states** y **error states** con retry.
- **Hooks personalizados**: `useApi`, `useForm`, `useDebounce`, `useToast`.
- **Componentes reutilizables**: Button, Input, Select, Card, Badge, Modal, Table, Toaster…
- **Consumo de API REST** con axios + fallback automático a datos mock si el backend no responde.

---

## 🚀 Cómo ejecutarlo

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar la URL del backend (opcional)
# Crea un archivo .env en la raíz con:
echo "VITE_API_URL=http://localhost:3000/api" > .env

# 3. Levantar el dev server
npm run dev

# 4. Build de producción
npm run build
```

> Si no tienes backend conectado, la app funciona con **datos mock** automáticamente. El hook `useApi` intenta primero la API real y, si falla, usa los datos de `src/services/mockData.js`.

---

## 📂 Estructura del proyecto

```
event-manager/
├─ index.html
├─ package.json
├─ vite.config.js
├─ tailwind.config.js
├─ postcss.config.js
└─ src/
   ├─ main.jsx                    # Entry point
   ├─ App.jsx                     # Rutas
   ├─ index.css                   # Estilos globales + Tailwind
   │
   ├─ components/
   │  ├─ ui/                      # Componentes reutilizables
   │  │  ├─ Button.jsx
   │  │  ├─ Input.jsx
   │  │  ├─ Select.jsx
   │  │  ├─ Card.jsx
   │  │  ├─ Badge.jsx
   │  │  ├─ Modal.jsx
   │  │  ├─ Table.jsx
   │  │  ├─ States.jsx            # Loading, Empty, Error
   │  │  └─ Toaster.jsx
   │  └─ layout/
   │     ├─ Layout.jsx
   │     ├─ Sidebar.jsx
   │     ├─ Topbar.jsx
   │     └─ PageHeader.jsx
   │
   ├─ pages/                      # Pantallas principales
   │  ├─ Dashboard.jsx
   │  ├─ EventsList.jsx
   │  ├─ EventForm.jsx            # Crear / editar
   │  ├─ AttendeesList.jsx
   │  ├─ VenuesList.jsx
   │  └─ SponsorsList.jsx
   │
   ├─ hooks/                      # Hooks personalizados
   │  ├─ useApi.js
   │  ├─ useForm.js
   │  ├─ useDebounce.js
   │  └─ useToast.js
   │
   ├─ services/                   # Capa de datos
   │  ├─ api.js                   # Cliente axios
   │  ├─ endpoints.js             # CRUD de cada entidad
   │  └─ mockData.js              # Datos de prueba
   │
   └─ utils/
      └─ helpers.js               # Validadores, formatters, cn()
=======
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
>>>>>>> 608cf5728e263bbdac3063d13d212a661dd6399d
```

---

<<<<<<< HEAD
## 🔌 Endpoints esperados del backend

La capa `services/endpoints.js` consume estas rutas REST estándar. Si tu backend usa otras, solo edita ese archivo.

| Recurso        | Endpoints                                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------- |
| Eventos        | `GET/POST /events` · `GET/PUT/DELETE /events/:id`                                              |
| Sedes          | `GET/POST /venues` · `GET/PUT/DELETE /venues/:id`                                              |
| Asistentes    | `GET/POST /attendees` · `GET/PUT/DELETE /attendees/:id` · `GET /events/:id/attendees`         |
| Patrocinadores | `GET/POST /sponsors` · `GET/PUT/DELETE /sponsors/:id` · `GET /events/:id/sponsors`             |

---

## 🎨 Paleta y tipografía

- **Verde oliva (moss)**: color principal, evoca calma profesional
- **Crema (cream)**: fondos cálidos en lugar de blanco puro
- **Terracota (clay)**: acentos, badges, decorativos
- **Fraunces** (display): titulares con personalidad editorial
- **Inter** (body): legibilidad limpia
- **JetBrains Mono**: números y etiquetas técnicas

---

## 📜 Licencia

Proyecto académico — libre uso educativo.
=======
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
>>>>>>> 608cf5728e263bbdac3063d13d212a661dd6399d
