/**
 * Simple development logging utility
 * Only logs in development environment
 */

export enum LogCategory {
  API_REQUESTS = 'API_REQUESTS',
  ERROR = 'ERROR',
  GENERAL = 'GENERAL'
}

class DevLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private log(level: 'info' | 'warn' | 'error', category: LogCategory, message: string, data?: unknown): void {
    if (!this.isDevelopment) return;

    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${category}] ${message}`;
    
    switch (level) {
      case 'error':
        console.error(formattedMessage, data || '');
        break;
      case 'warn':
        console.warn(formattedMessage, data || '');
        break;
      default:
        console.log(formattedMessage, data || '');
    }
  }

  info(category: LogCategory, message: string, data?: unknown): void {
    this.log('info', category, message, data);
  }

  warn(category: LogCategory, message: string, data?: unknown): void {
    this.log('warn', category, message, data);
  }

  error(category: LogCategory, message: string, data?: unknown): void {
    this.log('error', category, message, data);
  }

  api(message: string, data?: unknown): void {
    this.info(LogCategory.API_REQUESTS, message, data);
  }
}

export const devLog = new DevLogger();