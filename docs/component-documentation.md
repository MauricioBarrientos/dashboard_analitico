# Documentación de Componentes

## Índice
1. [Componentes Atómicos](#componentes-atómicos)
2. [Moléculas](#moléculas)
3. [Organismos](#organismos)
4. [Plantillas](#plantillas)

## Componentes Atómicos

### Button
Componente de botón reutilizable con diferentes variantes y tamaños.

**Props:**
```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  className?: string;
  children: ReactNode;
}
```

**Variantes:**
- `primary`: Botón con color de fondo principal (azul por defecto)
- `secondary`: Botón con color de fondo secundario (gris por defecto)
- `outline`: Botón con borde y fondo transparente
- `ghost`: Botón con texto y hover con fondo suave

**Estados:**
- `isLoading`: Muestra un spinner y el texto "Cargando..." mientras está activo
- `disabled`: Deshabilita el botón visual y funcionalmente

**Uso:**
```jsx
<Button variant="primary" size="md" onClick={handleClick}>
  Enviar
</Button>

<Button isLoading={true}>
  Procesando...
</Button>
```

### Input
Componente de entrada de texto con label y manejo de errores.

**Props:**
```typescript
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
```

**Características:**
- Soporta todos los atributos HTML estándar de `<input>`
- Label opcional que se muestra encima del campo
- Mensaje de error que se muestra debajo del campo
- Estilos especiales cuando hay error

**Uso:**
```jsx
<Input 
  label="Nombre" 
  placeholder="Introduce tu nombre" 
  error={error ? "Campo requerido" : undefined} 
/>
```

### ErrorBoundary
Componente que captura errores de renderizado en sus hijos y muestra una UI de fallback.

**Props:**
```typescript
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error?: Error }>;
}
```

**Comportamiento:**
- Si un componente hijo lanza un error durante el renderizado, se captura
- Se renderiza el componente fallback (por defecto muestra mensaje de error)
- Ofrece la opción de recargar la página

**Uso:**
```jsx
<ErrorBoundary>
  <ComplexComponent />
</ErrorBoundary>
```

### ChartErrorBoundary
ErrorBoundary especializado para componentes de gráficos.

Similar a ErrorBoundary pero con UI específica para errores en gráficos.

## Moléculas

### FilterPanel
Panel de filtros para el dashboard que permite filtrar datos por fecha, métricas y categorías.

**Props:**
```typescript
interface FilterPanelProps {
  filters: {
    dateRange: [Date | null, Date | null];
    metrics: string[];
    categories: string[];
  };
  onFilterChange: (filters: any) => void;
}
```

**Características:**
- Selector de rango de fechas
- Listas desplegables para seleccionar múltiples métricas y categorías
- Botón para limpiar todos los filtros
- Estilos responsivos para diferentes tamaños de pantalla

**Uso:**
```jsx
<FilterPanel 
  filters={filters} 
  onFilterChange={setFilters} 
/>
```

### TimeSeriesChart
Gráfico de series temporales para mostrar datos a lo largo del tiempo.

**Props:**
```typescript
interface TimeSeriesChartProps {
  data: Array<{
    date: string;
    revenue: number;
    users: number;
    conversion: number;
  }>;
}
```

**Características:**
- Gráfico de líneas para múltiples métricas
- Eje X con fechas
- Eje Y con valores numéricos
- Tooltip interactivos
- Responsive design

**Uso:**
```jsx
<TimeSeriesChart data={timeSeriesData} />
```

### WebSocketDataHandler
Componente que maneja la conexión WebSocket y actualizaciones de datos en tiempo real.

**Props:**
```typescript
interface WebSocketDataHandlerProps {
  onDataUpdate: (data: any) => void;
  onError?: (error: AppError) => void;
}
```

**Características:**
- Gestiona la conexión WebSocket
- Muestra el estado de conexión
- Maneja errores de conexión
- Reintenta conexión automáticamente
- Notifica cuando hay actualizaciones de datos

**Uso:**
```jsx
<WebSocketDataHandler 
  onDataUpdate={handleDataUpdate}
  onError={handleError}
/>
```

## Organismos

### DashboardGrid
Grilla principal del dashboard que contiene múltiples componentes de visualización de datos.

**Props:**
```typescript
interface DashboardGridProps {
  filters: {
    dateRange: [Date | null, Date | null];
    metrics: string[];
    categories: string[];
  };
}
```

**Características:**
- Distribución de componentes en una grilla responsive
- Integración con servicios de datos
- Actualización automática de datos
- Soporte para arrastrar y redimensionar widgets (react-grid-layout)

**Uso:**
```jsx
<DashboardGrid filters={filters} />
```

### Header
Encabezado de la aplicación con título, usuario y acciones.

**Props:**
```typescript
interface HeaderProps {
  title: string;
  userName: string;
}
```

**Características:**
- Título de la página actual
- Nombre de usuario o avatar
- Acciones de usuario (notificaciones, ajustes, etc.)
- Toggle para modo oscuro/claro

**Uso:**
```jsx
<Header title="Dashboard Analítico" userName="Juan Pérez" />
```

## Plantillas

### DashboardTemplate
Plantilla principal del dashboard que organiza todos los componentes en una estructura coherente.

**Características:**
- Estructura de sidebar y contenido principal
- Integración de Header
- Panel de filtros
- Grid de visualización de datos
- Footer con información de actualización

**Uso:**
```jsx
<DashboardTemplate />
```

### ReportsTemplate
Plantilla para vistas de reportes detallados.

**Características:**
- Estructura de sidebar y contenido principal
- Filtros específicos para reportes
- Gráficos detallados
- Tablas de datos
- Opciones de exportación

**Uso:**
```jsx
<ReportsTemplate />
```

## Hooks de UI

### useWebSocket
Hook personalizado para manejar la lógica de WebSocket.

**Uso:**
```typescript
const { data, isConnected, error, send } = useWebSocket('ws://localhost:8080');
```

**Retorna:**
- `data`: Últimos datos recibidos
- `isConnected`: Estado de conexión
- `error`: Mensaje de error si ocurre
- `send`: Función para enviar mensajes

### useReportExport
Hook para manejar la lógica de exportación de reportes.

**Uso:**
```typescript
const { exportToPDF, exportToExcel, exportToCSV } = useReportExport();
```

**Funcionalidades:**
- Exportar a diferentes formatos (PDF, Excel, CSV)
- Opciones de personalización
- Manejo de errores de exportación

### useTheme
Hook para manejar el estado y lógica del tema (oscuro/claro).

**Uso:**
```typescript
const { theme, toggleTheme } = useTheme();
```

**Funcionalidades:**
- Obtener tema actual
- Alternar entre temas
- Persistencia en localStorage
- Aplicación de clases CSS apropiadas

## Convenciones de Componentes

### Patrón Atómico
Los componentes siguen el patrón de diseño atómico:
- **Átomos**: Componentes básicos (botones, inputs, etc.)
- **Moléculas**: Combinaciones de átomos que forman componentes funcionales
- **Organismos**: Combinaciones de moléculas que forman secciones complejas
- **Plantillas**: Estructuras de página que contienen organismos
- **Páginas**: Plantillas completas con contenido real

### Estilos
- Se utiliza Tailwind CSS para estilos utilitarios
- Componentes con estilos personalizados usan CSS Modules o estilos en línea con Tailwind
- Temas claro/oscuro manejados con variables CSS
- Estilos responsivos para diferentes tamaños de pantalla

### Accesibilidad
- Todos los componentes siguen las pautas WCAG AA
- Etiquetas apropiadas para elementos de formulario
- Soporte para teclado
- Contraste adecuado de colores
- ARIA labels donde sea necesario