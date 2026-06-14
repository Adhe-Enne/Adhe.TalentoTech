export interface PaginatedResult<T> {
  hasMore: boolean;
  items: T[];
  lastKey: string | null;
}
