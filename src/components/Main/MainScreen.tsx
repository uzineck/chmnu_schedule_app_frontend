import {useState} from "react";
import {GroupWithFaculty} from "../../models/group/GroupWithFaculty.ts";
import {Teacher} from "../../models/teacher/Teacher.ts";
import GroupSearch from "../Group/GroupSearch.tsx";
import TeacherSearch from "../Teacher/TeacherSearch.tsx";
import GroupSchedule from "../Schedule/GroupSchedule.tsx";
import {Subgroup} from "../../models/enums/Subgroup.ts";
import TeacherSchedule from "../Schedule/TeacherSchedule.tsx";


const MainScreen = () => {
    const [selectedGroup, setSelectedGroup] = useState<GroupWithFaculty | null>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

    const handleGroupSelect = (group: GroupWithFaculty | null) => {
        setSelectedGroup(group);
    };

    const handleTeacherSelect = (teacher: Teacher | null) => {
        setSelectedTeacher(teacher);
    }

    return (
        <>
            <GroupSearch onGroupSelect={handleGroupSelect} />
            <TeacherSearch onTeacherSelect={handleTeacherSelect} />
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
        </>
    );
};

export default MainScreen;