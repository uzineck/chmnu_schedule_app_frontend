import {useCallback, useEffect} from "react";
import {removeLessonFromGroupAdmin, removeLessonToGroupHeadman} from "../../../api/schedule/group.ts";
import {useFetchData} from "../../../api/hooks/useFetchData.tsx";
import {useNavigate} from "react-router-dom";
import {message} from "antd";
import {ClientRole} from "../../../models/enums/ClientRole.ts";
import {useAuth} from "../../Auth/Context/hooks/useAuth.ts";
import {useSchedule} from "../Context/hooks/useSchedule.ts";


const DeleteLesson = () => {
    const { client } = useAuth()
    const { groupUuid, lessonUuid, subgroup } = useSchedule();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const deleteLessonFromGroup = useCallback(() => {
        if (client?.role === ClientRole.HEADMAN) {
            return removeLessonToGroupHeadman(lessonUuid, subgroup);
        }
        else {
            return removeLessonFromGroupAdmin(groupUuid, lessonUuid, subgroup);
        }
    }, [client, groupUuid, lessonUuid, subgroup]);

    const { data, error, isLoading } = useFetchData(deleteLessonFromGroup);

    useEffect(() => {
        messageApi.loading({ content: 'Loading...' });
        if (!isLoading) {
            if (data) {
                messageApi.destroy();
                navigate(client?.role === ClientRole.HEADMAN? "/group/manage" : "/admin/schedule/manage/group", {
                    state: { deleteLesson: data.status },
                });
            } else if (error) {
                messageApi.destroy();
                navigate(client?.role === ClientRole.HEADMAN? "/group/manage" : "/admin/schedule/manage/group", {
                    state: { deleteLessonError: error },
                });
            }
        }
    }, [client, data, error, isLoading, navigate, messageApi]);

    return <>{contextHolder}</>;
};


export default DeleteLesson;