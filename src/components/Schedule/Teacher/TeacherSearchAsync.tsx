import AsyncEntitySearch from "../../Search/AsyncEntitySearch.tsx";
import { getListOfTeachers } from "../../../api/schedule/teacher.ts";
import { Teacher } from "../../../models/teacher/Teacher.ts";
import { TeacherFilter } from "../../../models/filters/TeacherFilter.ts";
import { ApiResponse } from "../../../models/ApiResponse.ts";
import { ListPaginatedResponse, PaginationIn } from "../../../models/ListPaginatedResponse.ts";

interface TeacherSearchAsyncProps {
    onTeacherSelect: (teacher: Teacher | null) => void;
    selectedTeacher: Teacher | null;
}

// Teacher's filter shape (`name`, `rank`) differs from the unified `SearchFilter`
// (`search`). Adapt the call site to translate `search` → `name`.
const fetchTeacherPage = (
    filter: { search?: string | null },
    pagination: PaginationIn,
): Promise<ApiResponse<ListPaginatedResponse<Teacher>>> => {
    const teacherFilter: TeacherFilter = { name: filter.search ?? null, rank: null };
    return getListOfTeachers(teacherFilter, pagination);
};

const teacherLabel = (t: Teacher) => `${t.last_name} ${t.first_name} ${t.middle_name}`.trim();

const TeacherSearchAsync = ({ onTeacherSelect, selectedTeacher }: TeacherSearchAsyncProps) => {
    return (
        <AsyncEntitySearch<Teacher>
            fetchPage={fetchTeacherPage}
            mapToOption={(teacher) => ({
                value: teacher.uuid,
                label: teacherLabel(teacher),
            })}
            selected={
                selectedTeacher
                    ? { value: selectedTeacher.uuid, label: teacherLabel(selectedTeacher) }
                    : null
            }
            onSelect={onTeacherSelect}
            placeholder="Виберіть викладача"
            noOptionsMessage="Жодного викладача не знайдено"
        />
    );
};

export default TeacherSearchAsync;
