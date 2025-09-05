import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
