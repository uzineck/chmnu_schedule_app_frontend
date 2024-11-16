export interface ApiResponse<T>{
    data: T;
    meta: object;
    errors: object[];
}