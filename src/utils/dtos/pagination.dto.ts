import { ApiProperty } from '@nestjs/swagger';

export class PaginatedMetaDto {
  @ApiProperty({ example: 10 })
  itemsPerPage: number;

  @ApiProperty({ example: 120, required: false })
  totalItems?: number;

  @ApiProperty({ example: 1, required: false })
  currentPage?: number;

  @ApiProperty({ example: 12, required: false })
  totalPages?: number;

  @ApiProperty({
    description: 'Sorting order as [column, direction]',
    example: [['createdAt', 'DESC']],
    isArray: true,
  })
  sortBy: Record<string, 'ASC' | 'DESC'>[];

  @ApiProperty({
    description: 'List of searchable columns',
    example: ['name', 'email'],
    isArray: true,
  })
  searchBy: Record<string, any>[];

  @ApiProperty({ example: 'Acme', required: false })
  search: string;

  @ApiProperty({
    description: 'Selected fields',
    example: ['id', 'name', 'email'],
    isArray: true,
  })
  select: string[];

  @ApiProperty({
    description: 'Filters applied on columns',
    example: { status: ['active', 'pending'] },
    required: false,
  })
  filter?: {
    [column: string]: string | string[];
  };

  @ApiProperty({
    description: 'Cursor for cursor-based pagination',
    example: 'eyJpZCI6MTIzfQ==',
    required: false,
  })
  cursor?: string;
}

export class PaginatedLinksDto {
  @ApiProperty({ example: '/api/items?page=1', required: false })
  first?: string;

  @ApiProperty({ example: '/api/items?page=2', required: false })
  previous?: string;

  @ApiProperty({ example: '/api/items?page=3' })
  current: string;

  @ApiProperty({ example: '/api/items?page=4', required: false })
  next?: string;

  @ApiProperty({ example: '/api/items?page=12', required: false })
  last?: string;
}

export class PaginationDto {
  @ApiProperty({ type: () => PaginatedMetaDto })
  meta: PaginatedMetaDto;

  @ApiProperty({ type: () => PaginatedLinksDto })
  links: PaginatedLinksDto;
}
