import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyCategoryDto {
  @ApiProperty({
    description: 'The title of the category.',
    example: 'Example Category',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  constructor({ title }: { title: string }) {
    this.title = title;
  }
}
