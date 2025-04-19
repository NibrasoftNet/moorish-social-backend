import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCompanyCategoryDto {
  @ApiProperty({
    description: 'The title of the category.',
    example: 'Example Category',
  })
  @IsOptional()
  @IsString()
  title?: string;

  constructor({ title }: { title: string }) {
    this.title = title;
  }
}
