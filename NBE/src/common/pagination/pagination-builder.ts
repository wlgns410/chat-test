export class PaginationResponse<T> {
  data: T[];
  meta: {
    page: number;
    take: number;
    totalCount: number;
    totalPage: number;
    hasNextPage: boolean;
  };

  constructor(paginationBuilder: PaginationBuilder<T>) {
    this.data = paginationBuilder._data;
    this.meta = {
      page: paginationBuilder._page,
      take: paginationBuilder._take,
      totalCount: paginationBuilder._totalCount,
      totalPage: this.getTotalPage(paginationBuilder._totalCount, paginationBuilder._take),
      hasNextPage: this.getHasNextPage(paginationBuilder._page, this.getTotalPage(paginationBuilder._totalCount, paginationBuilder._take)),
    };
  }

  private getTotalPage(totalCount: number, take: number): number {
    return Math.ceil(totalCount / take);
  }

  private getHasNextPage(page: number, totalPage: number): boolean {
    return page < totalPage;
  }
}

export class PaginationBuilder<T> {
  _data: T[];
  _page: number;
  _take: number;
  _totalCount: number;

  setData(data: T[]): this {
    this._data = data;
    return this;
  }

  setPage(page: number): this {
    this._page = page;
    return this;
  }

  setTake(take: number): this {
    this._take = take;
    return this;
  }

  setTotalCount(totalCount: number): this {
    this._totalCount = totalCount;
    return this;
  }

  build(): PaginationResponse<T> {
    return new PaginationResponse<T>(this);
  }
}
