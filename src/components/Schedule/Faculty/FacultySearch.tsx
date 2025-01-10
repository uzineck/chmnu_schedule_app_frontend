import EntitySearch from "../../Search/EntitySearch.tsx";
import {getAllFaculties} from "../../../api/schedule/faculty.ts";
import {Faculty} from "../../../models/faculty/Faculty.ts";

interface FacultySearchProps {
    onFacultySelect: (Faculty: Faculty | null) => void;
    onFacultyListFetched: (Faculties: Faculty[]) => void;
    selectedFaculty: Faculty | null;
}

const FacultySearch = ({ onFacultySelect, selectedFaculty, onFacultyListFetched }: FacultySearchProps) => {
    return (
        <EntitySearch<Faculty>
            fetchData={getAllFaculties}
            mapToOptions={(faculty: Faculty) => ({
                value: faculty.uuid,
                label: `${faculty.code_name}`,
            })}
            selectedOption={selectedFaculty ?
                {
                    value: selectedFaculty.uuid,
                    label: `${selectedFaculty.code_name}`,
                } : null}
            onEntitySelect={onFacultySelect}
            onDataFetched={onFacultyListFetched}
            placeholder="Виберіть факультет"
            noOptionsMessage="Жодного факультета не знайдено"
        />
    );
};

export default FacultySearch;
