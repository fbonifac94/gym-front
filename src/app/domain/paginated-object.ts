export interface PaginatedObject<T>{
    list: T[];
    page: number;
	size: number;
	totalPages: number;
	totalElements: number;
}