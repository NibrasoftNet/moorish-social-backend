import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaginatedMetaDto {
  @ApiProperty({ example: 10 })
  itemsPerPage: number;

  @ApiPropertyOptional({ example: 120, required: false })
  totalItems?: number;

  @ApiPropertyOptional({ example: 1, required: false })
  currentPage?: number;

  @ApiPropertyOptional({ example: 12, required: false })
  totalPages?: number;

  @ApiPropertyOptional({
    description: 'Sorting order as [column, direction]',
    example: [['createdAt', 'DESC']],
    isArray: true,
  })
  sortBy: Record<string, 'ASC' | 'DESC'>[];

  @ApiPropertyOptional({
    description: 'List of searchable columns',
    example: ['name', 'email'],
    isArray: true,
  })
  searchBy: Record<string, any>[];

  @ApiPropertyOptional({ example: 'Acme', required: false })
  search: string;

  @ApiPropertyOptional({
    description: 'Selected fields',
    example: ['id', 'name', 'email'],
    isArray: true,
  })
  select: string[];

  @ApiPropertyOptional({
    description: 'Filters applied on columns',
    example: { status: ['active', 'pending'] },
    required: false,
  })
  filter?: {
    [column: string]: string | string[];
  };

  @ApiPropertyOptional({
    description: 'Cursor for cursor-based pagination',
    example: 'eyJpZCI6MTIzfQ==',
    required: false,
  })
  cursor?: string;
}

export class PaginatedLinksDto {
  @ApiPropertyOptional({ example: '/api/items?page=1', required: false })
  first?: string;

  @ApiPropertyOptional({ example: '/api/items?page=2', required: false })
  previous?: string;

  @ApiProperty({ example: '/api/items?page=3' })
  current: string;

  @ApiPropertyOptional({ example: '/api/items?page=4', required: false })
  next?: string;

  @ApiPropertyOptional({ example: '/api/items?page=12', required: false })
  last?: string;
}

export class PaginationDto {
  @ApiProperty({ type: () => PaginatedMetaDto })
  meta: PaginatedMetaDto;

  @ApiProperty({ type: () => PaginatedLinksDto })
  links: PaginatedLinksDto;
}
