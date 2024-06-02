import { Controller } from '@nestjs/common';
import { Roles } from 'src/common/constants/roles';
import { Role } from 'src/common/guard/roles.decorator';
@Role(Roles.ADMIN)
@Controller('admin')

export class AdminController {}
