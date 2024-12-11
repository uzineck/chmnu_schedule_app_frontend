import EntitySearch from "../../Search/EntitySearch.tsx";
import {Subject} from "../../../models/subject/Subject.ts";
import {getAllSubjects} from "../../../api/schedule/subject.ts";

interface SubjectSearchProps {
    onSubjectSelect: (subject: Subject | null) => void;
}

const SubjectSearch = ({ onSubjectSelect }: SubjectSearchProps) => {
    return (
        <EntitySearch<Subject>
            fetchData={getAllSubjects}
            mapToOptions={(subject: Subject) => ({
                value: subject.uuid,
                label: `${subject.title}`,
            })}
            onEntitySelect={onSubjectSelect}
            placeholder="Select Subject"
            noOptionsMessage="Subject not found"
        />
    );
};

export default SubjectSearch;
