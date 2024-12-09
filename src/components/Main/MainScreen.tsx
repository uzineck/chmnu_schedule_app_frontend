import {useState} from "react";
import {Subject} from "../../models/subject/Subject.ts";
import SubjectSearch from "../Subject/SubjectSearch.tsx";
import {useLocation} from "react-router-dom";


const MainScreen = () => {
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

    const location = useLocation();
    const message = location.state?.logout_message;


    const handleSubjectSelect = (subject: Subject | null) => {
        setSelectedSubject(subject);
    }

    return (
        <>
            <SubjectSearch onSubjectSelect={handleSubjectSelect} />

            {selectedSubject && <p>Subject: {selectedSubject.title}</p>}
            {message && <p>{message}</p>}
        </>
    );
};

export default MainScreen;