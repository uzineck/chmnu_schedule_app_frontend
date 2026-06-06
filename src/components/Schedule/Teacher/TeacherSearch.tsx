import { Teacher } from "../../../models/teacher/Teacher.ts";
import { getAllTeachers } from "../../../api/schedule/teacher.ts";
import EntitySearch from "../../Search/EntitySearch.tsx";

interface TeacherSearchProps {
    onTeacherSelect: (teacher: Teacher | null) => void;
    selectedTeacher: Teacher | null;
}

const teacherLabel = (t: Teacher) => `${t.last_name} ${t.first_name} ${t.middle_name}`.trim();

const TeacherSearch = ({ onTeacherSelect, selectedTeacher }: TeacherSearchProps) => {
    return (
        <EntitySearch<Teacher>
            fetchData={getAllTeachers}
            mapToOption={(teacher) => ({ value: teacher.uuid, label: teacherLabel(teacher) })}
            selectedOption={
                selectedTeacher
                    ? { value: selectedTeacher.uuid, label: teacherLabel(selectedTeacher) }
                    : null
            }
            onEntitySelect={onTeacherSelect}
            placeholder="Виберіть викладача"
            noOptionsMessage="Жодного викладача не знайдено"
        />
    );
};

export default TeacherSearch;
