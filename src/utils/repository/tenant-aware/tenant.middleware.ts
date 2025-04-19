import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly cls: ClsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['tenant-id'] as string;
    if (!tenantId) {
      throw new HttpException(
        {
          status: HttpStatus.EXPECTATION_FAILED,
          errors: {
            tenant: 'Tenant-Id header is missing',
          },
        },
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    // Ensure context is available
    this.cls.run(() => {
      this.cls.set('tenantId', tenantId); // Store tenantId in the CLS context
      next();
    });
  }
}
