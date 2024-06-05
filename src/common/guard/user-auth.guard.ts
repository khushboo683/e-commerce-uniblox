import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import httpContext = require('express-http-context');
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor() {}

  validateAuthToken(req: any): boolean {
    let isValid = true;
    let tokenPayload: any;
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token)
           throw new ForbiddenException('Forbidden')
      httpContext.set("token", token);
      
      tokenPayload = jwt.decode(token);

      if (!tokenPayload) 
        throw new ForbiddenException('Forbidden')

      if (tokenPayload.hasOwnProperty("mobile")) { 
        httpContext.set("mobile", tokenPayload.mobile);
      } 

      return isValid;
    } catch (e) {
      isValid = false;
      console.error(e);
      return isValid;
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return this.validateAuthToken(request);
  }
}
