// src/services/errorHandler.ts

/**
 * Interface para información de error
 * @interface ErrorInfo
 * @property {string} message - Mensaje de error
 * @property {string} [code] - Código de error
 * @property {Date} timestamp - Fecha y hora del error
 * @property {string} [stack] - Pila de llamadas
 */
export interface ErrorInfo {
  message: string;
  code?: string;
  timestamp: Date;
  stack?: string;
}

/**
 * Clase base para errores de la aplicación
 * @class AppError
 * @extends Error
 * @property {string} code - Código de error
 * @property {Date} timestamp - Fecha y hora del error
 * @property {Error} [originalError] - Error original si existe
 */
export class AppError extends Error {
  public code: string;
  public timestamp: Date;
  public originalError?: Error;

  /**
   * Crea una instancia de AppError
   * @param {string} message - Mensaje de error
   * @param {string} [code='APP_ERROR'] - Código de error
   * @param {Error} [originalError] - Error original si existe
   */
  constructor(message: string, code: string = 'APP_ERROR', originalError?: Error) {
    super(message);
    this.code = code;
    this.timestamp = new Date();
    this.originalError = originalError;

    // Mantener la pila de llamadas correcta
    if (originalError) {
      this.stack = originalError.stack;
    } else {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Clase para errores de red
 * @class NetworkError
 * @extends AppError
 * @property {Response} [response] - Respuesta HTTP si existe
 */
export class NetworkError extends AppError {
  /**
   * Crea una instancia de NetworkError
   * @param {string} message - Mensaje de error
   * @param {Response} [response] - Respuesta HTTP si existe
   */
  constructor(message: string, public response?: Response) {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

/**
 * Clase para errores de validación
 * @class ValidationError
 * @extends AppError
 */
export class ValidationError extends AppError {
  /**
   * Crea una instancia de ValidationError
   * @param {string} message - Mensaje de error
   */
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

/**
 * Clase para errores de WebSocket
 * @class WebSocketError
 * @extends AppError
 * @property {Event} [event] - Evento WebSocket si existe
 */
export class WebSocketError extends AppError {
  /**
   * Crea una instancia de WebSocketError
   * @param {string} message - Mensaje de error
   * @param {Event} [event] - Evento WebSocket si existe
   */
  constructor(message: string, public event?: Event) {
    super(message, 'WEBSOCKET_ERROR');
    this.name = 'WebSocketError';
  }
}

/**
 * Maneja errores de API y los convierte en instancias de AppError
 * @param {any} error - Error a manejar
 * @returns {AppError} - Error convertido
 */
export const handleApiError = (error: any): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new NetworkError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
  }

  if (error.response) {
    // Error con respuesta del servidor
    const { status, statusText, data } = error.response;
    let message = `Error ${status}: ${statusText}`;

    if (data?.message) {
      message = data.message;
    } else if (status === 401) {
      message = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
    } else if (status === 403) {
      message = 'No tienes permiso para acceder a este recurso.';
    } else if (status === 404) {
      message = 'Recurso no encontrado.';
    } else if (status >= 500) {
      message = 'Error del servidor. Por favor, inténtalo más tarde.';
    }

    return new NetworkError(message, error.response);
  }

  if (error.request) {
    // Error de red sin respuesta
    return new NetworkError('No se recibió respuesta del servidor.');
  }

  return new AppError(error.message || 'Ocurrió un error desconocido');
};

/**
 * Maneja eventos de error de WebSocket
 * @param {Event} event - Evento de error de WebSocket
 * @returns {WebSocketError} - Error convertido
 */
export const handleWebSocketError = (event: Event): WebSocketError => {
  if (event instanceof CloseEvent) {
    const reason = event.reason || getCloseReason(event.code);
    return new WebSocketError(`Conexión cerrada: ${reason}`, event);
  }
  return new WebSocketError('Error en la conexión WebSocket', event);
};

/**
 * Obtiene la razón de cierre de WebSocket basado en el código
 * @param {number} code - Código de cierre de WebSocket
 * @returns {string} - Razón de cierre
 */
const getCloseReason = (code: number): string => {
  switch (code) {
    case 1000: return 'Normal closure';
    case 1001: return 'Going away';
    case 1002: return 'Protocol error';
    case 1003: return 'Unsupported data';
    case 1006: return 'Abnormal closure (connection lost)';
    case 1007: return 'Invalid frame payload data';
    case 1008: return 'Policy violation';
    case 1009: return 'Message too big';
    case 1011: return 'Internal server error';
    case 1012: return 'Service restart';
    case 1013: return 'Try again later';
    default: return `Unknown close code: ${code}`;
  }
};

/**
 * Registra un error en la consola
 * @param {AppError} error - Error a registrar
 */
export const logError = (error: AppError): void => {
  console.error('App Error:', {
    message: error.message,
    code: error.code,
    timestamp: error.timestamp,
    stack: error.stack,
    originalError: error.originalError
  });

  // Aquí podrías enviar el error a un servicio de monitoreo como Sentry
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error);
  // }
};

/**
 * Reporta un error y lo registra
 * @param {AppError} error - Error a reportar
 * @param {string} [context] - Contexto adicional del error
 */
export const reportError = (error: AppError, context?: string): void => {
  logError(error);

  // Opcional: enviar el error a un servicio de reporte
  // sendErrorToService(error, context);
};