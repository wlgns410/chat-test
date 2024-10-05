import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export enum PaginationDefault {
  PAGE_DEFAULT = 1,
  TAKE_DEFAULT = 10,
  SKIP_DEFAULT = 0,
}

export class PaginationRequest {
  @IsOptional()
  @Type(() => Number)
  page: number = PaginationDefault.PAGE_DEFAULT;

  @IsOptional()
  @Type(() => Number)
  take: number = PaginationDefault.TAKE_DEFAULT;

  getSkip(): number {
    return (this.page - 1) * this.take || PaginationDefault.SKIP_DEFAULT;
  }

  getTake(): number {
    return this.take || PaginationDefault.TAKE_DEFAULT;
  }

  getPage(): number {
    return this.page || PaginationDefault.PAGE_DEFAULT;
  }
}
