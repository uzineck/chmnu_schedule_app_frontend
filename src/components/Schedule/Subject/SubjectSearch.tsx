import EntitySearch from "../../Search/EntitySearch.tsx";
import {Subject} from "../../../models/subject/Subject.ts";
import {getAllSubjects} from "../../../api/schedule/subject.ts";

interface SubjectSearchProps {
    onSubjectSelect: (subject: Subject | null) => void;
    onSubjectListFetched: (subjects: Subject[]) => void;
    selectedSubject: Subject | null;
}

const SubjectSearch = ({ onSubjectSelect, selectedSubject, onSubjectListFetched }: SubjectSearchProps) => {
    return (
        <EntitySearch<Subject>
            fetchData={getAllSubjects}
            mapToOptions={(subject: Subject) => ({
                value: subject.uuid,
                label: `${subject.title}`,
            })}
            selectedOption={selectedSubject ?
                {
                    value: selectedSubject.uuid,
                    label: `${selectedSubject.title}`,
                } : null}
            onEntitySelect={onSubjectSelect}
            onDataFetched={onSubjectListFetched}
            placeholder="Select Subject"
            noOptionsMessage="Subject not found"
        />
    );
};

export default SubjectSearch;
