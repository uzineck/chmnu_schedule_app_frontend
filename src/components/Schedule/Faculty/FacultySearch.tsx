import AsyncEntitySearch from "../../Search/AsyncEntitySearch.tsx";
import { getListOfFaculties } from "../../../api/schedule/faculty.ts";
import { Faculty } from "../../../models/faculty/Faculty.ts";

interface FacultySearchProps {
    onFacultySelect: (faculty: Faculty | null) => void;
    selectedFaculty: Faculty | null;
}

const FacultySearch = ({ onFacultySelect, selectedFaculty }: FacultySearchProps) => {
    return (
        <AsyncEntitySearch<Faculty>
            fetchPage={getListOfFaculties}
            mapToOption={(faculty) => ({
                value: faculty.uuid,
                label: faculty.code_name,
            })}
            selected={
                selectedFaculty
                    ? { value: selectedFaculty.uuid, label: selectedFaculty.code_name }
                    : null
            }
            onSelect={onFacultySelect}
            placeholder="Виберіть факультет"
            noOptionsMessage="Жодного факультета не знайдено"
        />
    );
};

export default FacultySearch;
