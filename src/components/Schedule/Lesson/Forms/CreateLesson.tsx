import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import {Subject} from "../../../../models/subject/Subject.ts";
import {Teacher} from "../../../../models/teacher/Teacher.ts";
import {Room} from "../../../../models/room/Room.ts";
import {LessonType} from "../../../../models/enums/LessonType.ts";
import {LessonSchema} from "../../../../models/lesson/request/LessonSchema.ts";
import {createLesson} from "../../../../api/schedule/lesson.ts";
import {ApiCallError} from "../../../../api/errors.ts";
import SubjectSearch from "../../Subject/SubjectSearch.tsx";
import TeacherSearch from "../../Teacher/TeacherSearch.tsx";
import RoomSearch from "../../Room/RoomSearch.tsx";
import "./module.css";
import {useSchedule} from "../../Context/hooks/useSchedule.ts";

const CreateLesson = () => {
    const { day, ordinaryNumber, isEvenWeek, setLessonUuid } = useSchedule();

    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [selectedLessonType, setSelectedLessonType] = useState<LessonType>(LessonType.LECTURE);

    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const key = "create";

    const handleCreateLesson = async () => {
        if (!selectedSubject || !selectedTeacher || !selectedRoom) {
            messageApi.error("Please fill in all fields.");
            return;
        }

        const lessonData: LessonSchema = {
            schema: {
                subject_uuid: selectedSubject.uuid,
                teacher_uuid: selectedTeacher.uuid,
                room_uuid: selectedRoom.uuid,
            },
            lesson_schema: {
                type: selectedLessonType,
                timeslot: {
                    day,
                    ord_number: ordinaryNumber,
                    is_even: isEvenWeek,
                },
            },
        };

        try {
            messageApi.loading({ content: "Creating lesson...", key: key });
            const response = await createLesson(lessonData);

            const lessonUuid = response.data.uuid;
            setLessonUuid(lessonUuid);
            messageApi.success({ content: "Lesson created successfully!", key: key });

            navigate(`/group/manage/lesson/${lessonUuid}/add`);
        } catch (error) {
            if (error instanceof ApiCallError) {
                messageApi.error({ key: key, content: error.message, duration: 2 });
            } else {
                messageApi.error({ key: key, content: "Unknown error occurred.", duration: 2 });
            }
        }
    };

    const handleTeacherSelect = (teacher: Teacher | null) => {
        setSelectedTeacher(teacher);
    };

    const handleSubjectSelect = (subject: Subject | null) => {
        setSelectedSubject(subject);
    };

    const handleRoomSelect = (room: Room | null) => {
        setSelectedRoom(room);
    };

    const handleGoBack = () => {
        navigate("/group/manage");
    };


    return (
        <div className="create-lesson">
            {contextHolder}
            <div className="lesson-card">
                <h2 className="lesson-title-form">Create Lesson</h2>
                <div className="lesson-form">
                    <div className="search-container">
                        <div className="lesson-type-container">Lesson Type:
                            <select value={selectedLessonType}
                                    onChange={(e) => setSelectedLessonType(e.target.value as LessonType)}>
                                <option value={LessonType.LECTURE}>Lecture</option>
                                <option value={LessonType.PRACTICE}>Practice</option>
                            </select>
                        </div>
                        <SubjectSearch
                            onSubjectSelect={handleSubjectSelect}
                            onSubjectListFetched={() => {
                            }}
                            selectedSubject={selectedSubject}
                        />
                        <TeacherSearch
                            onTeacherSelect={handleTeacherSelect}
                            onTeacherListFetched={() => {
                            }}
                            selectedTeacher={selectedTeacher}
                        />
                        <RoomSearch
                            onRoomSelect={handleRoomSelect}
                            onRoomListFetched={() => {
                            }}
                            selectedRoom={selectedRoom}
                        />
                    </div>
                    <div className="buttons-container">
                        <button className="go-back-button" onClick={handleGoBack}>
                            Go Back
                        </button>
                        <button onClick={handleCreateLesson}>Create Lesson</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateLesson;
