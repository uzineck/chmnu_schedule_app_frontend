import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import {useScheduleContext} from "../../Context/ScheduleContext.tsx";
import {Subject} from "../../../../models/subject/Subject.ts";
import {Teacher} from "../../../../models/teacher/Teacher.ts";
import {Room} from "../../../../models/room/Room.ts";
import {LessonType} from "../../../../models/enums/LessonType.ts";
import {LessonSchema} from "../../../../models/lesson/request/LessonSchema.ts";
import {ApiCallError} from "../../../../api/errors.ts";
import SubjectSearch from "../../Subject/SubjectSearch.tsx";
import TeacherSearch from "../../Teacher/TeacherSearch.tsx";
import RoomSearch from "../../Room/RoomSearch.tsx";
import {updateLesson} from "../../../../api/schedule/lesson.ts";
import "./module.css";

const UpdateLesson = () => {
    const { day, ordinaryNumber, isEvenWeek, setLessonUuid, lesson } = useScheduleContext();

    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [selectedLessonType, setSelectedLessonType] = useState<LessonType>(LessonType.LECTURE);
    const [isUpdating, setIsUpdating] = useState(false);

    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const key = "update";

    useEffect(() => {
        if (lesson) {
            setSelectedSubject(lesson.subject);
            setSelectedTeacher('teacher' in lesson ? lesson.teacher : null);
            setSelectedRoom(lesson.room);
            setSelectedLessonType(lesson.type);
        }
    }, [lesson]);

    const handleUpdateLesson = async () => {
        if (!selectedSubject || !selectedTeacher || !selectedRoom) {
            messageApi.error("Please fill in all fields.");
            return;
        }

        if (!lesson || !lesson.uuid) {
            messageApi.error("Lesson data is not available.");
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
            setIsUpdating(true);
            messageApi.loading({ content: "Updating lesson...", key: key });
            await updateLesson(lesson.uuid, lessonData);
            setLessonUuid(lesson.uuid);
            messageApi.success({ content: "Lesson updated successfully!", key: key });

            navigate(`/group/manage/`);
        } catch (error) {
            if (error instanceof ApiCallError) {
                messageApi.error({ key: key, content: error.message, duration: 2 });
            } else {
                messageApi.error({ key: key, content: "Unknown error occurred.", duration: 2 });
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const handleGoBack = () => {
        navigate("/group/manage");
    };

    return (
        <div className="update-lesson">
            {contextHolder}
            <div className="lesson-card">
                <h2 className="lesson-title">Update Lesson</h2>
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
                            onSubjectSelect={(subject: Subject | null) => setSelectedSubject(subject)}
                            onSubjectListFetched={() => {
                            }}
                            selectedSubject={selectedSubject}
                        />
                        <TeacherSearch
                            onTeacherSelect={(teacher: Teacher | null) => setSelectedTeacher(teacher)}
                            onTeacherListFetched={() => {
                            }}
                            selectedTeacher={selectedTeacher}
                        />
                        <RoomSearch
                            onRoomSelect={(room: Room | null) => setSelectedRoom(room)}
                            onRoomListFetched={() => {
                            }}
                            selectedRoom={selectedRoom}
                        />
                    </div>
                    <div className="buttons-container">
                        <button className="go-back-button" onClick={handleGoBack}>
                            Go Back
                        </button>
                        <button onClick={handleUpdateLesson} disabled={isUpdating}>
                            {isUpdating ? "Updating..." : "Update Lesson"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateLesson;
