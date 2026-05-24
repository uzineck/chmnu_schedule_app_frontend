import AsyncEntitySearch from "../../Search/AsyncEntitySearch.tsx";
import { getListOfSubjects } from "../../../api/schedule/subject.ts";
import { Subject } from "../../../models/subject/Subject.ts";

interface SubjectSearchProps {
    onSubjectSelect: (subject: Subject | null) => void;
    selectedSubject: Subject | null;
}

const SubjectSearch = ({ onSubjectSelect, selectedSubject }: SubjectSearchProps) => {
    return (
        <AsyncEntitySearch<Subject>
            fetchPage={getListOfSubjects}
            mapToOption={(subject) => ({ value: subject.uuid, label: subject.title })}
            selected={
                selectedSubject
                    ? { value: selectedSubject.uuid, label: selectedSubject.title }
                    : null
            }
            onSelect={onSubjectSelect}
            placeholder="Виберіть дисципліну"
            noOptionsMessage="Жодної дисципліни не знайдено"
        />
    );
};

export default SubjectSearch;
