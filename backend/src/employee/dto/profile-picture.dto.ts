import { IsString, IsNotEmpty } from 'class-validator';

export class ProfilePictureDto {
  @IsString()
  @IsNotEmpty({ message: 'Profile picture URL is required' })
  profilePictureUrl: string;
}
