import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignDesignationDto {
  @IsNotEmpty()
  @IsUUID()
  designationId: string;
}
