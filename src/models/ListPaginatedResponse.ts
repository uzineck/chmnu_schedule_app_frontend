export interface PaginationIn {
    offset: number;
    limit: number;
}

interface PaginationOut {
    offset: number;
    limit: number;
    total: number;
}

export interface ListPaginatedResponse<T> {
    items: T[];
    pagination: PaginationOut;
}
