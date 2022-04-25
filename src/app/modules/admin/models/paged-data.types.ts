export interface PagedData<T>
{
    currentPage : number,
    hasNextPage: boolean,
    hasPreoviousPage:boolean,
    pageSize:number,
    rows:T[],
    totalCount: number,
    totalPages:number
}
