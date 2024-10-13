import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum PaginationDefault {
  PAGE_DEFAULT = 1,
  TAKE_DEFAULT = 10,
  SKIP_DEFAULT = 0,
}

export class PaginationRequest {
  @IsOptional() // 필수값아님
  @Type(() => Number) // 쿼리 파라미터를 숫자로 변환
  @IsInt()
  @Min(1) // 1 이상의 페이지 번호만 허용
  page: number = PaginationDefault.PAGE_DEFAULT;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1) // 1 이상의 take 값만 허용
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
