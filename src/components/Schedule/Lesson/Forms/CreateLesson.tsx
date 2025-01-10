import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import {Subject} from "../../../../models/subject/Subject.ts";
import {Teacher} from "../../../../models/teacher/Teacher.ts";
import {Room} from "../../../../models/room/Room.ts";
import {LessonType, lessonTypeOptionsUa} from "../../../../models/enums/LessonType.ts";
import {LessonSchema} from "../../../../models/lesson/request/LessonSchema.ts";
import {createLesson} from "../../../../api/schedule/lesson.ts";
import {ApiCallError} from "../../../../api/errors.ts";
import SubjectSearch from "../../Subject/SubjectSearch.tsx";
import TeacherSearch from "../../Teacher/TeacherSearch.tsx";
import RoomSearch from "../../Room/RoomSearch.tsx";
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

const CreateLesson = () => {
    const { client } = useAuth()
    const { day, ordinaryNumber, isEvenWeek, setLessonUuid } = useSchedule();

    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [selectedLessonType, setSelectedLessonType] = useState<LessonType>(LessonType.LECTURE);
    const [isCreating, setIsCreating] = useState(false);

    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const key = "create";

    const handleCreateLesson = async () => {
        if (!selectedSubject || !selectedTeacher || !selectedRoom) {
            messageApi.warning({key: key, content:"Заповніть усі поля", duration: 3});
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
                    day,
                    ord_number: ordinaryNumber,
                    is_even: isEvenWeek,
                },
            },
        };

        try {
            setIsCreating(true)
            messageApi.loading({ content: "Завантаження...", key: key });

            const response = await createLesson(lessonData);

            const lessonUuid = response.data.uuid;
            setLessonUuid(lessonUuid);

            messageApi.success({ content: "Пару успішно створено", key: key });

            navigate(`/lesson/${lessonUuid}/add`);
        } catch (error) {
            if (error instanceof ApiCallError) {
                messageApi.error({ key: key, content: error.message, duration: 2 });
            } else {
                messageApi.error({ key: key, content: "Виникла невідома помилка", duration: 2 });
            }
        } finally {
            setIsCreating(false);
        }
    };

    const handleGoBack = () => {
        navigate(client?.roles.includes(ClientRole.HEADMAN) ? "/group/manage" : "/admin/manage/schedule/group");
    };


    return (
        <FormPage>
            {contextHolder}
            <MediumFormDiv>
                <FormTitle>Створити пару</FormTitle>
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
                            onSubjectListFetched={() => {}}
                            selectedSubject={selectedSubject}
                        />
                        <TeacherSearch
                            onTeacherSelect={(teacher: Teacher | null) => setSelectedTeacher(teacher)}
                            onTeacherListFetched={() => {}}
                            selectedTeacher={selectedTeacher}
                        />
                        <RoomSearch
                            onRoomSelect={(room: Room | null) => setSelectedRoom(room)}
                            onRoomListFetched={() => {}}
                            selectedRoom={selectedRoom}
                        />
                    </FormSearchContainer>
                    <ButtonsContainer>
                        <GoBackButton onClick={handleGoBack}>Повернутися</GoBackButton>
                        <FormButton onClick={handleCreateLesson} disabled={isCreating}>
                            {isCreating ? "Завантаження..." : "Створити"}
                        </FormButton>
                    </ButtonsContainer>
                </FormContainer>
            </MediumFormDiv>
        </FormPage>
    );
};

export default CreateLesson;
