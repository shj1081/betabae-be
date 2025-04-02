import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const requestDetails = `[${method}] ${originalUrl} - ${ip} - ${userAgent}`;

    // Capture response
    const start = Date.now();
    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const responseTime = Date.now() - start;

      // Log response based on status code
      if (statusCode >= 500) {
        this.logger.error(
          `${requestDetails} ${statusCode} ${contentLength}B - ${responseTime}ms`,
        );
      } else if (statusCode >= 400) {
        this.logger.warn(
          `${requestDetails} ${statusCode} ${contentLength}B - ${responseTime}ms`,
        );
      } else {
        this.logger.log(
          `${requestDetails} ${statusCode} ${contentLength}B - ${responseTime}ms`,
        );
      }
    });

    // Capture errors
    res.on('error', (error) => {
      this.logger.error(
        `${requestDetails} - Error: ${error.message}`,
        error.stack,
      );
    });

    next();
  }
}
