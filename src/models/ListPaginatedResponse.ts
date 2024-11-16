interface Pagination{
    offset: number;
    limit: number;
    total: number;
}


export interface ListPaginatedResponse<T>{
    data: T[];
    pagination: Pagination;
}