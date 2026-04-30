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
```

---

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
