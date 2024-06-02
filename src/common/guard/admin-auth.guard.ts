import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import httpContext = require('express-http-context')
import * as jwt from 'jsonwebtoken';
import _ = require("lodash");
import { Roles } from '../constants/roles';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor() {}

  validateAuthToken(req: Request): boolean {
    let isValid = true;
    let tokenPayload: any;
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      console.log("token", token)
      if (_.isEmpty(token)) {
      throw {
        error:"token missing"
      }
      }
      httpContext.set("token", token);
      
      tokenPayload = jwt.decode(token);

      if (!tokenPayload) {
      throw {
        error:"Payload missing"
      }
      }
      httpContext.set("tokenPayload", tokenPayload);

      if (tokenPayload.hasOwnProperty("mobile")) { 
        httpContext.set("mobile", tokenPayload.mobile);
      } 
      if (!tokenPayload.hasOwnProperty('role') || tokenPayload.role !== Roles.ADMIN) {
        throw {
          error: 'Invalid role',
        };
      }
      httpContext.set('role', tokenPayload.role);
      console.log("token payload", tokenPayload)
      return isValid;
    } catch (e) {
      isValid = false;
      return isValid;
    }

  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
  return this.validateAuthToken(request);

  }
}
