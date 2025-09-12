import { PartialType } from '@nestjs/mapped-types';
import { CreateGlobalLeaveConfigDto } from './create-global-leave-config.dto';

export class UpdateGlobalLeaveConfigDto extends PartialType(CreateGlobalLeaveConfigDto) {}
