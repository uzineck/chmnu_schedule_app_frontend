import {message} from "antd";
import {useNavigate} from "react-router-dom";
import {useCallback, useEffect} from "react";
import {ClientRole} from "../../../../models/enums/ClientRole.ts";
import {useFetchData} from "../../../../api/hooks/useFetchData.tsx";
import {addLessonToGroupAdmin, addLessonToGroupHeadman} from "../../../../api/schedule/group.ts";
import {useAuth} from "../../../Auth/Context/hooks/useAuth.ts";
import {useSchedule} from "../../Context/hooks/useSchedule.ts";

const AddLesson = () => {
    const { client } = useAuth()
    const { groupUuid, subgroup, lessonUuid} = useSchedule();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const addLessonToGroup = useCallback(() => {
        if (groupUuid==='' || lessonUuid===''){
            navigate(client?.role === ClientRole.HEADMAN? "/group/manage" : "/admin/manage/schedule/group", {
                state: { warningMessage: "Створюйте пару тільки з панелі розкладу" },
            });
            return Promise.reject({message: "Створюйте пару тільки з панелі розкладу"});
        }

        if (client?.role === ClientRole.HEADMAN) {
            return addLessonToGroupHeadman(lessonUuid, subgroup)
        }
        else {
            return addLessonToGroupAdmin(groupUuid, lessonUuid, subgroup)
        }
    }, [navigate, lessonUuid, client, groupUuid, subgroup]);

    const { data, error, isLoading } = useFetchData(addLessonToGroup);

    useEffect(() => {
        messageApi.loading({ content: 'Завантаження...' });
        if (!isLoading) {
            if (data) {
                messageApi.destroy();
                navigate(client?.role === ClientRole.HEADMAN? "/group/manage" : "/admin/manage/schedule/group", {
                    state: { successMessage: "Пара успішно додана" },
                });
            } else if (error) {
                messageApi.destroy();
                navigate(client?.role === ClientRole.HEADMAN? "/group/manage" : "/admin/manage/schedule/group", {
                    state: { errorMessage: error },
                });
            }
        }
    }, [client, data, error, isLoading, navigate, messageApi]);

    return (<>{contextHolder}</>);
};


export default AddLesson;