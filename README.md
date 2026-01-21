# Analytics Dashboard

Un dashboard analítico moderno construido con React 18, TypeScript y Vite. Incorpora visualizaciones de datos en tiempo real, soporte multilingüe y una arquitectura escalable basada en el patrón de diseño atómico.

## Características

- **UI Moderna**: React 18 con TypeScript y Vite para desarrollo rápido
- **Patrón Atómico**: Componentes organizados en átomos, moléculas, organismos, plantillas y páginas
- **Diseño Responsivo**: Compatible con desktop, tablet y móvil mediante CSS Grid y Flexbox
- **Temas Claros/Oscuros**: Soporte para modo claro y oscuro con variables CSS
- **Datos en Tiempo Real**: Conexión WebSocket para actualizaciones en vivo
- **API REST**: Carga inicial de datos mediante API REST
- **Caché y Consultas**: React Query para manejo de estado de servidor
- **Validación de Datos**: Zod para validación de esquemas en tiempo de ejecución
- **Visualizaciones**: Recharts para gráficos de series temporales, barras apiladas y mapas de calor
- **Gestión de Estado**: React Context + useReducer para UI y Redux Toolkit para datos pesados
- **Accesibilidad**: Cumple con estándares WCAG AA
- **Internacionalización**: Soporte para español e inglés con react-i18next
- **Pruebas**: Jest + React Testing Library para pruebas unitarias y Cypress para pruebas end-to-end
- **Manejo de Errores Robusto**: Error Boundaries, manejo de errores de red y WebSocket, y reporte de errores

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/MauricioBarrientos/dashboard_analitico.git
cd Dashboard_Analítico
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Crea una versión optimizada para producción
- `npm run preview` - Previsualiza la versión de producción localmente
- `npm run lint` - Ejecuta el linter
- `npm run test` - Ejecuta las pruebas unitarias
- `npm run test:watch` - Ejecuta las pruebas en modo observación
- `npm run test:coverage` - Ejecuta pruebas y genera reporte de cobertura
- `npm run docs` - Genera la documentación de la API

### Estrategia de Pruebas

El proyecto incluye una estrategia completa de pruebas que abarca:

- **Pruebas Unitarias**: Componentes individuales, hooks y servicios con Jest y React Testing Library
- **Pruebas de Integración**: Componentes compuestos y flujos de trabajo para asegurar que las partes trabajen juntas
- **Pruebas de Estado**: Validación del manejo de estado global y local con Redux Toolkit y React Context
- **Pruebas de Servicios**: Verificación del correcto funcionamiento de servicios de API y WebSocket
- **Pruebas de Error**: Validación del manejo de errores y fallbacks

### Estructura de Pruebas

Las pruebas se organizan siguiendo la misma estructura del código fuente:

```
src/tests/
├── components/          # Pruebas para componentes UI
│   ├── atoms/          # Pruebas para componentes atómicos
│   ├── molecules/      # Pruebas para moléculas
│   ├── organisms/      # Pruebas para organismos
│   └── templates/      # Pruebas para plantillas
├── hooks/              # Pruebas para hooks personalizados
├── services/           # Pruebas para servicios
└── utils/              # Pruebas para utilidades
```

## Estructura del Proyecto

```
src/
├── components/           # Componentes UI organizados por patrón atómico
│   ├── atoms/           # Componentes atómicos (botones, inputs, etc.)
│   ├── molecules/       # Componentes compuestos por átomos
│   ├── organisms/       # Componentes compuestos por moléculas
│   ├── templates/       # Plantillas de página
│   └── pages/           # Componentes de página (enrutamiento)
├── hooks/               # Hooks personalizados
├── services/            # Servicios API y WebSocket
├── store/               # Gestión de estado con Redux Toolkit
├── i18n/                # Archivos de internacionalización
├── styles/              # Estilos CSS y temas
├── utils/               # Utilidades generales
├── contexts/            # Contextos de React
└── tests/               # Archivos de pruebas
```

## Arquitectura

### Patrón Atómico
El proyecto sigue el patrón de diseño atómico que organiza los componentes de interfaz de usuario en cinco niveles:

- **Átomos**: Elementos básicos como botones, inputs y etiquetas
- **Moléculas**: Combinaciones de átomos que forman componentes funcionales
- **Organismos**: Combinaciones de moléculas que forman secciones complejas
- **Plantillas**: Estructuras de página que contienen organismos
- **Páginas**: Plantillas completas con contenido real

### Gestión de Estado
- **UI State**: React Context + useReducer para estado de interfaz (filtros, métricas seleccionadas)
- **Server State**: React Query para manejo de estado de servidor (caché, refetch, etc.)
- **Global State**: Redux Toolkit + RTK Query para datos pesados y lógica asíncrona compleja

### Internacionalización
El proyecto utiliza react-i18next para soporte multilingüe con archivos de traducción separados para español e inglés.

### Manejo de Errores
El sistema implementa un manejo de errores robusto que incluye:

- **Error Boundaries**: Componentes que capturan errores de renderizado en la jerarquía de componentes hijos
- **Manejo de Errores de API**: Validación y manejo de errores de red con reintento automático
- **Manejo de Errores de WebSocket**: Reconexión automática con límite de intentos y manejo de errores
- **Validación de Datos**: Validación de esquemas con Zod para prevenir errores por datos inválidos
- **Notificaciones de Estado**: Indicadores visuales de estado de conexión y errores
- **Reporte de Errores**: Mecanismo para reportar y registrar errores para diagnóstico

## Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript, Vite
- **Estilos**: CSS puro con variables y Tailwind CSS
- **Gráficos**: Recharts para visualizaciones de datos
- **Gestión de Estado**: React Query, Redux Toolkit
- **Comunicación**: Fetch API, WebSocket
- **Internacionalización**: react-i18next
- **Pruebas**: Jest, React Testing Library, Cypress
- **Documentación**: Typedoc

## Variables de Entorno

No se requieren variables de entorno para el funcionamiento básico, pero puedes configurar:

```
VITE_API_URL= # URL base para la API
VITE_WS_URL= # URL para WebSocket
```

## Contribución

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## API Endpoints

- `GET /api/data` - Obtiene datos iniciales del dashboard
- WebSocket: `wss://api.ejemplo.com/stream` - Recibe actualizaciones en tiempo real

## Licencia

Distribuido bajo la licencia MIT. Consulta el archivo `LICENSE` para más información.

## Contacto

Tu Nombre - email@ejemplo.com

Proyecto link: [https://github.com/usuario/repo](https://github.com/usuario/repo)
