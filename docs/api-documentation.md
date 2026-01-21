# Documentación de APIs

## Índice
1. [API REST](#api-rest)
2. [WebSocket API](#websocket-api)
3. [API de Servicios](#api-de-servicios)
4. [Validación de Datos](#validación-de-datos)

## API REST

### Endpoints

#### GET `/api/data`
Obtiene datos analíticos para el dashboard.

**Parámetros de consulta:**
- `start` (string, opcional): Fecha de inicio en formato ISO 8601
- `end` (string, opcional): Fecha de final en formato ISO 8601

**Respuesta exitosa (200 OK):**
```json
{
  "timeSeries": [
    {
      "date": "2023-01-01",
      "revenue": 4000,
      "users": 2400,
      "conversion": 24
    }
  ],
  "barData": [
    {
      "name": "Ene",
      "revenue": 4000,
      "users": 2400,
      "conversion": 24
    }
  ],
  "heatmapData": [
    {
      "x": "A",
      "y": "X",
      "value": 10
    }
  ]
}
```

**Esquema de validación:**
```typescript
interface ApiResponse {
  timeSeries: Array<{
    date: string;      // Formato YYYY-MM-DD
    revenue: number;   // Ingresos
    users: number;     // Número de usuarios
    conversion: number; // Porcentaje de conversión
  }>;
  barData: Array<{
    name: string;      // Nombre del período (por ejemplo, nombre del mes)
    revenue: number;   // Ingresos
    users: number;     // Número de usuarios
    conversion: number; // Porcentaje de conversión
  }>;
  heatmapData: Array<{
    x: string;         // Coordenada X (por ejemplo, hora del día)
    y: string;         // Coordenada Y (por ejemplo, categoría)
    value: number;     // Valor numérico
  }>;
}
```

**Errores comunes:**
- 400 Bad Request: Parámetros de consulta inválidos
- 401 Unauthorized: Token de autenticación inválido o expirado
- 500 Internal Server Error: Error interno del servidor

#### PUT `/api/data`
Actualiza datos analíticos en el servidor.

**Headers requeridos:**
- `Content-Type: application/json`
- `Authorization: Bearer {token}`

**Cuerpo de la solicitud:**
```json
{
  "timeSeries": [...],
  "barData": [...],
  "heatmapData": [...]
}
```

**Respuesta exitosa (200 OK):**
- Retorna el objeto de datos actualizado.

## WebSocket API

### Conexión
- URL: `ws://localhost:8080` (desarrollo) o `wss://tu-dominio.com/ws` (producción)
- Protocolo: WebSocket estándar

### Tipos de Mensajes

#### Mensaje Inicial (`type: "initial"`)
Se envía inmediatamente después de la conexión.

```json
{
  "type": "initial",
  "data": {
    "timeSeries": [...],
    "barData": [...],
    "heatmapData": [...]
  }
}
```

#### Mensaje de Actualización (`type: "update"`)
Se envía periódicamente con nuevos datos.

```json
{
  "type": "update",
  "data": {
    "timeSeries": [
      {
        "date": "2023-01-15",
        "revenue": 5200,
        "users": 1800,
        "conversion": 18.5
      }
    ]
  }
}
```

### Reconexión
- El cliente implementa reconexión automática con retroceso exponencial
- Intervalo inicial: 1 segundo
- Límite máximo de intervalo: 30 segundos
- Límite máximo de intentos: configurable (por defecto 10)

### Códigos de Cierre
- 1000: Cierre normal por cliente
- 1001: Cliente desconectado porque servidor se está apagando
- 1006: Conexión perdida (sin posibilidad de reconexión automática)

## API de Servicios

### Servicio de Datos (`src/services/api.ts`)

#### `fetchData(params?: FetchDataParams): Promise<DashboardData>`
Realiza una petición para obtener datos del dashboard.

**Parámetros:**
```typescript
interface FetchDataParams {
  startDate?: Date | null;
  endDate?: Date | null;
}
```

**Retorno:**
```typescript
Promise<DashboardData>
```

**Uso:**
```typescript
const data = await fetchData({ 
  startDate: new Date('2023-01-01'), 
  endDate: new Date('2023-01-31') 
});
```

#### `useData(params?: FetchDataParams, options?: UseQueryOptions<DashboardData>)`
Hook de React Query para obtener datos con cacheo y manejo de estado.

**Uso:**
```typescript
const { data, isLoading, error } = useData({
  startDate: new Date('2023-01-01'),
  endDate: new Date('2023-01-31')
});
```

#### `updateData(data: Partial<DashboardData>): Promise<DashboardData>`
Actualiza datos en el servidor.

**Retorno:**
```typescript
Promise<DashboardData>
```

### Servicio WebSocket (`src/services/websocketService.ts`)

#### `WebSocketService`
Clase que encapsula la lógica de conexión WebSocket.

**Constructor:**
```typescript
interface WebSocketConfig {
  url: string;
  onMessage: (data: any) => void;
  onError?: (error: WebSocketError) => void;
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

const wsService = new WebSocketService(config);
```

**Métodos:**
- `connect(): void` - Establece la conexión WebSocket
- `send(data: any): void` - Envía un mensaje al servidor
- `disconnect(): void` - Cierra la conexión WebSocket
- `isConnected(): boolean` - Verifica si está conectado
- `isConnecting(): boolean` - Verifica si está intentando conectarse

### Manejo de Errores (`src/services/errorHandler.ts`)

#### Clases de Error
- `AppError`: Error base para la aplicación
- `NetworkError`: Error de red o API
- `ValidationError`: Error de validación de datos
- `WebSocketError`: Error específico de WebSocket

#### Funciones de Manejo
- `handleApiError(error: any): AppError` - Convierte errores de API en AppError
- `handleWebSocketError(event: Event): WebSocketError` - Convierte eventos de error WebSocket
- `logError(error: AppError): void` - Registra errores en la consola
- `reportError(error: AppError, context?: string): void` - Reporta errores para su seguimiento

## Validación de Datos

### Esquemas de Validación (`src/utils/validation.ts`)

#### `dashboardDataSchema`
Valida la estructura completa de los datos del dashboard.

```typescript
const dashboardDataSchema = z.object({
  timeSeries: z.array(timeSeriesSchema),
  barData: z.array(barDataSchema),
  heatmapData: z.array(heatmapSchema),
});
```

#### `timeSeriesSchema`
Valida datos de series temporales.

```typescript
const timeSeriesSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // Formato YYYY-MM-DD
  revenue: z.number().min(0),
  users: z.number().min(0),
  conversion: z.number().min(0).max(100),
});
```

#### `barDataSchema`
Valida datos para gráficos de barras.

```typescript
const barDataSchema = z.object({
  name: z.string(),
  revenue: z.number().min(0),
  users: z.number().min(0),
  conversion: z.number().min(0).max(100),
});
```

#### `heatmapSchema`
Valida datos para mapas de calor.

```typescript
const heatmapSchema = z.object({
  x: z.string(),
  y: z.string(),
  value: z.number().min(0),
});
```

### Validación en Tiempo de Ejecución
Todos los datos recibidos de APIs, WebSockets o entradas de usuario se validan con Zod antes de ser utilizados en la aplicación. Si la validación falla, se lanza un `ValidationError` que es manejado por el sistema de manejo de errores.