import { Teacher } from "../../models/teacher/Teacher.ts";
import { getAllTeachers } from "../../api/schedule/teacher.ts";
import EntitySearch from "../Search/EntitySearch.tsx";


interface TeacherSearchProps {
    onTeacherSelect: (teacher: Teacher | null) => void;
}

const TeacherSearch = ({ onTeacherSelect }: TeacherSearchProps) => {
    return (
        <EntitySearch<Teacher>
            fetchData={getAllTeachers}
            mapToOptions={(teacher: Teacher) => ({
                value: teacher.uuid,
                label: `${teacher.last_name} ${teacher.first_name} ${teacher.middle_name}`,
            })}
            onEntitySelect={onTeacherSelect}
            placeholder="Select Teacher"
            noOptionsMessage="Teacher not found"
        />
    );
};

export default TeacherSearch;
