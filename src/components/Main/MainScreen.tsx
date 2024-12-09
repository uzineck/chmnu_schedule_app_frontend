import {useState} from "react";
import {GroupWithFaculty} from "../../models/group/GroupWithFaculty.ts";
import {Teacher} from "../../models/teacher/Teacher.ts";
import GroupSearch from "../Group/GroupSearch.tsx";
import TeacherSearch from "../Teacher/TeacherSearch.tsx";
import GroupSchedule from "../Group/GroupSchedule.tsx";
import {Subgroup} from "../../models/enums/Subgroup.ts";
import TeacherSchedule from "../Teacher/TeacherSchedule.tsx";
import {Subject} from "../../models/subject/Subject.ts";
import SubjectSearch from "../Subject/SubjectSearch.tsx";
import {useLocation} from "react-router-dom";


const MainScreen = () => {
    const [selectedGroup, setSelectedGroup] = useState<GroupWithFaculty | null>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

    const location = useLocation();
    const message = location.state?.logout_message;

    const handleGroupSelect = (group: GroupWithFaculty | null) => {
        setSelectedGroup(group);
    };

    const handleTeacherSelect = (teacher: Teacher | null) => {
        setSelectedTeacher(teacher);
    }

    const handleSubjectSelect = (subject: Subject | null) => {
        setSelectedSubject(subject);
    }

    return (
        <>
            <GroupSearch onGroupSelect={handleGroupSelect} />
            <TeacherSearch onTeacherSelect={handleTeacherSelect} />
            <SubjectSearch onSubjectSelect={handleSubjectSelect} />

            {selectedTeacher &&
                <TeacherSchedule
                    teacherUuid={selectedTeacher.uuid}
                />
            }
            {selectedGroup &&
                <GroupSchedule
                    groupUuid={selectedGroup.uuid}
                    subgroup={Subgroup.A}
                    is_even={true}
                />
            }
            {selectedSubject && <p>Subject: {selectedSubject.title}</p>}
            {message && <p>{message}</p>}
        </>
    );
};

export default MainScreen;