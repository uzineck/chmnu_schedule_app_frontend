/**
 * Shared filter shape for endpoints with a unified `?search=` query
 * (Faculty, Room, Subject). Teacher uses a different filter ({name, rank})
 * — see `TeacherFilter`.
 */
export interface SearchFilter {
    search?: string | null;
}
