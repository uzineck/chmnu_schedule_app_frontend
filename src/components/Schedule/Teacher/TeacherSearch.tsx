import { Teacher } from "../../../models/teacher/Teacher.ts";
import { getAllTeachers } from "../../../api/schedule/teacher.ts";
import EntitySearch from "../../Search/EntitySearch.tsx";


interface TeacherSearchProps {
    onTeacherSelect: (teacher: Teacher | null) => void;
    onTeacherListFetched: (teachers: Teacher[]) => void;
    selectedTeacher: Teacher | null;
}

const TeacherSearch = ({ onTeacherSelect, onTeacherListFetched,  selectedTeacher }: TeacherSearchProps) => {
    return (
        <EntitySearch<Teacher>
            fetchData={getAllTeachers}
            mapToOptions={(teacher: Teacher) => ({
                value: teacher.uuid,
                label: `${teacher.last_name} ${teacher.first_name} ${teacher.middle_name}`,
            })}
            onEntitySelect={onTeacherSelect}
            selectedOption={selectedTeacher ?
                {
                    value: selectedTeacher.uuid,
                    label: `${selectedTeacher.last_name} ${selectedTeacher.first_name} ${selectedTeacher.middle_name}`
                } : null}
            onDataFetched={onTeacherListFetched}
            placeholder="Select Teacher"
            noOptionsMessage="No teachers found"

        />
    );
};

export default TeacherSearch;
