import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLeaveSchemeDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
