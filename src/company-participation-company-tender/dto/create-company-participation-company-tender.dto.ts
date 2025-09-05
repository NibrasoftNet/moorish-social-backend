import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyParticipationCompanyTenderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  constructor({ title, description }: { title: string; description: string }) {
    this.title = title;
    this.description = description;
  }
}
