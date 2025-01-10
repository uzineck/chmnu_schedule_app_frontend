import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import {Subject} from "../../../../models/subject/Subject.ts";
import {Teacher} from "../../../../models/teacher/Teacher.ts";
import {Room} from "../../../../models/room/Room.ts";
import {LessonType, lessonTypeOptionsUa} from "../../../../models/enums/LessonType.ts";
import {LessonSchema} from "../../../../models/lesson/request/LessonSchema.ts";
import {ApiCallError} from "../../../../api/errors.ts";
import SubjectSearch from "../../Subject/SubjectSearch.tsx";
import TeacherSearch from "../../Teacher/TeacherSearch.tsx";
import RoomSearch from "../../Room/RoomSearch.tsx";
import {updateLesson} from "../../../../api/schedule/lesson.ts";
import {useSchedule} from "../../Context/hooks/useSchedule.ts";
import {ClientRole} from "../../../../models/enums/ClientRole.ts";
import {useAuth} from "../../../Auth/Context/hooks/useAuth.ts";
import {
    ButtonsContainer,
    FormButton,
    MediumFormDiv,
    FormContainer,
    FormTitle,
    FormPage,
    GoBackButton,
    FormSelect,
    FormLessonTypeContainer,
    FormSearchContainer
} from "./formStyled.ts";

const EditLesson = () => {
    const { client } = useAuth()
    const { day, ordinaryNumber, isEvenWeek, setLessonUuid, lesson, setLesson } = useSchedule();

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
            messageApi.warning({key: key, content:"Заповніть усі поля", duration: 3});
            return;
        }
        if (!lesson || !lesson.uuid) {
            messageApi.error({key: key, content:"Дані про пару відсутні", duration: 3});
            return;
        }
        if (!day || !ordinaryNumber){
            messageApi.error({key: key, content:"Дані про дату та час проведення відсутні", duration: 3});
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
                    day: day,
                    ord_number: ordinaryNumber,
                    is_even: isEvenWeek,
                },
            },
        };

        try {
            setIsUpdating(true);
            messageApi.loading({ content: "Завантаження...", key: key });
            const response = await updateLesson(lesson.uuid, lessonData);

            const oldLesson = response.data.old_lesson;
            const newLessonUuid = response.data.updated_lesson.uuid;

            setLesson(oldLesson)
            setLessonUuid(newLessonUuid);

            messageApi.success({ content: "Пара успішно оновлена", key: key });

            navigate(`/lesson/${oldLesson.uuid}/update/${newLessonUuid}`);
        } catch (error) {
            if (error instanceof ApiCallError) {
                messageApi.error({ key: key, content: error.message, duration: 3 });
            } else {
                messageApi.error({ key: key, content: "Виникла невідома помилка", duration: 3 });
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const handleGoBack = () => {
        navigate(client?.roles.includes(ClientRole.HEADMAN) ? "/group/manage" : "/admin/manage/schedule/group");
    };

    return (
        <FormPage>
            {contextHolder}
            <MediumFormDiv>
                <FormTitle>Оновити пару</FormTitle>
                <FormContainer>
                    <FormSearchContainer>
                        <FormLessonTypeContainer>
                            Тип заняття:
                            <FormSelect
                                value={selectedLessonType}
                                onChange={(e) => setSelectedLessonType(e.target.value as LessonType)}
                            >
                                {lessonTypeOptionsUa.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </FormSelect>
                        </FormLessonTypeContainer>
                        <SubjectSearch
                            onSubjectSelect={(subject: Subject | null) => setSelectedSubject(subject)}
                            selectedSubject={selectedSubject}
                            onSubjectListFetched={() => {}}
                        />
                        <TeacherSearch
                            onTeacherSelect={(teacher: Teacher | null) => setSelectedTeacher(teacher)}
                            selectedTeacher={selectedTeacher}
                            onTeacherListFetched={() => {}}
                        />
                        <RoomSearch
                            onRoomSelect={(room: Room | null) => setSelectedRoom(room)}
                            selectedRoom={selectedRoom}
                            onRoomListFetched={() => {}}
                        />
                    </FormSearchContainer>
                    <ButtonsContainer>
                        <GoBackButton onClick={handleGoBack}>Повернутися</GoBackButton>
                        <FormButton onClick={handleUpdateLesson} disabled={isUpdating}>
                            {isUpdating ? "Завантаження..." : "Оновити"}
                        </FormButton>
                    </ButtonsContainer>
                </FormContainer>
            </MediumFormDiv>
        </FormPage>
    );
};

export default EditLesson;
