import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
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
      console.log("token", token);
      if (!token) {
        throw new Error("Token missing");
      }
      httpContext.set("token", token);
      
      tokenPayload = jwt.decode(token);

      if (!tokenPayload) {
        throw new Error("Payload missing");
      }

      // Set the mobile value from token payload
      if (tokenPayload.hasOwnProperty("mobile")) { 
        httpContext.set("mobile", tokenPayload.mobile);
      } 

      console.log("token payload", tokenPayload);
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
