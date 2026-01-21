# Documentación Técnica del Dashboard Analítico

## Índice
1. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Gestión de Estado](#gestión-de-estado)
5. [Flujo de Datos](#flujo-de-datos)
6. [Comunicación con Servicios](#comunicación-con-servicios)
7. [Manejo de Errores](#manejo-de-errores)
8. [Pruebas](#pruebas)
9. [Internacionalización](#internacionalización)
10. [Temas y Estilos](#temas-y-estilos)

## Arquitectura del Proyecto

El proyecto sigue el patrón de diseño atómico para componentes de UI, combinado con una arquitectura limpia que separa claramente las responsabilidades:

- **Presentación**: Componentes de React que se encargan exclusivamente de la UI
- **Lógica de Negocio**: Hooks y utilidades que contienen la lógica específica del dominio
- **Acceso a Datos**: Servicios y slices de Redux que manejan la comunicación con APIs
- **Estado Global**: Redux Toolkit y React Context para manejar el estado de la aplicación

## Tecnologías Utilizadas

- **Frontend**: React 18 con TypeScript para un desarrollo seguro y escalable
- **Compilación**: Vite para un entorno de desarrollo rápido y eficiente
- **Estilos**: Tailwind CSS para estilos utilitarios y CSS Modules para componentes específicos
- **Gráficos**: Recharts para visualizaciones de datos
- **Gestión de Estado**: 
  - Redux Toolkit + RTK Query para estado global y cacheo de datos
  - React Query para estado en el servidor
  - React Context + useReducer para estado local de UI
- **Comunicación**:
  - Fetch API para peticiones HTTP
  - WebSocket para actualizaciones en tiempo real
- **Validación**: Zod para validación de esquemas en tiempo de ejecución
- **Internacionalización**: react-i18next para soporte multilingüe
- **Pruebas**: Jest, React Testing Library y Cypress

## Estructura de Carpetas

```
src/
├── components/           # Componentes UI organizados por patrón atómico
│   ├── atoms/           # Componentes atómicos (botones, inputs, etc.)
│   ├── molecules/       # Componentes compuestos por átomos
│   ├── organisms/       # Componentes compuestos por moléculas
│   ├── templates/       # Plantillas de página
│   └── pages/           # Componentes de página (enrutamiento)
├── contexts/            # Contextos de React para manejo de estado
├── hooks/               # Hooks personalizados
├── i18n/                # Configuración de internacionalización
├── services/            # Servicios de comunicación con backend
├── store/               # Configuración de Redux y RTK Query
├── styles/              # Estilos globales y temas
├── tests/               # Archivos de pruebas
├── utils/               # Utilidades generales
└── App.tsx              # Componente raíz de la aplicación
```

## Gestión de Estado

El proyecto utiliza múltiples estrategias de gestión de estado según la necesidad:

### Redux Toolkit + RTK Query
- **Cuándo usar**: Para datos globales que se comparten entre múltiples componentes
- **Ejemplos**: Datos del dashboard, configuraciones de usuario
- **Características**: 
  - Caching automático
  - Refetch automático
  - Gestión de carga y errores
  - Persistencia opcional

### React Query
- **Cuándo usar**: Para datos del servidor que requieren cacheo y manejo de estado
- **Ejemplos**: Datos de reportes, información de usuario
- **Características**:
  - Cacheo inteligente
  - Optimistic updates
  - Background data fetching

### React Context + useReducer
- **Cuándo usar**: Para estado de UI local a una parte de la aplicación
- **Ejemplos**: Filtros del dashboard, estado de temas, notificaciones
- **Características**:
  - Fácil de usar para estado local
  - Buen rendimiento para estado que cambia frecuentemente

## Flujo de Datos

### Carga Inicial
1. El componente `DashboardTemplate` se monta
2. Se llama a `useData` hook para cargar datos iniciales
3. RTK Query verifica si los datos están en cache
4. Si no están en cache, se realiza la llamada API
5. Los datos se validan con Zod
6. Los datos se muestran en los componentes de gráficos

### Actualizaciones en Tiempo Real
1. El `WebSocketDataHandler` se conecta al servidor WebSocket
2. El servidor envía datos periódicamente
3. Los datos se reciben y se actualiza el estado local
4. Los componentes de gráficos se actualizan automáticamente
5. Si hay error de conexión, se intenta reconectar automáticamente

## Comunicación con Servicios

### API REST
- **Configuración**: Usando RTK Query con `apiSlice`
- **Validación**: Todos los datos se validan con Zod antes de ser almacenados
- **Manejo de Errores**: Se implementa reintento automático y manejo de errores de red

### WebSocket
- **Configuración**: Servicio personalizado con reconexión automática
- **Manejo de Errores**: Reconexión con retroceso exponencial
- **Validación**: Los mensajes recibidos se validan antes de ser procesados

## Manejo de Errores

El sistema implementa un manejo de errores robusto en múltiples niveles:

### Error Boundaries
- `ErrorBoundary`: Captura errores de renderizado en componentes hijos
- `ChartErrorBoundary`: Manejo específico para errores en componentes de gráficos

### Errores de API
- Clases de error específicas (`NetworkError`, `ValidationError`)
- Funciones de manejo de errores centralizadas
- Reintento automático con límites configurables

### Errores de WebSocket
- Reconexión automática con retroceso exponencial
- Límite de intentos de reconexión
- Indicadores visuales de estado de conexión

### Validación de Datos
- Validación con Zod en todos los puntos de entrada de datos
- Validación tanto en cliente como potencialmente en servidor

## Pruebas

El proyecto implementa una estrategia de pruebas completa:

### Pruebas Unitarias
- Componentes individuales con React Testing Library
- Hooks personalizados con `renderHook`
- Servicios y utilidades con Jest

### Pruebas de Integración
- Componentes compuestos para verificar interacciones
- Flujos de trabajo completos
- Integración entre múltiples hooks y servicios

### Pruebas de Extremo a Extremo
- Flujos de usuario completos con Cypress
- Pruebas de rendimiento
- Pruebas de accesibilidad

## Internacionalización

### Implementación
- react-i18next para internacionalización
- Archivos JSON separados para cada idioma
- Detección automática de idioma del navegador
- Persistencia de preferencia de idioma

### Estructura
```
src/i18n/
├── locales/
│   ├── en/
│   │   └── translation.json
│   └── es/
│       └── translation.json
└── i18n.ts
```

## Temas y Estilos

### Implementación
- Variables CSS para temas claro/oscuro
- React Context para manejo de temas
- Persistencia en localStorage
- Transiciones suaves entre temas

### Clases de Estilo
- Tailwind CSS para estilos utilitarios
- CSS Modules para estilos específicos de componentes
- Convenciones BEM para estilos personalizados