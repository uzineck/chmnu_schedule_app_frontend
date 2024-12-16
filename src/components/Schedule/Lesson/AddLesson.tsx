import {message} from "antd";
import {useNavigate} from "react-router-dom";
import {useCallback, useEffect} from "react";
import {ClientRole} from "../../../models/enums/ClientRole.ts";
import {useFetchData} from "../../../api/hooks/useFetchData.tsx";
import {addLessonToGroupAdmin, addLessonToGroupHeadman} from "../../../api/schedule/group.ts";
import {useAuth} from "../../Auth/Context/hooks/useAuth.ts";
import {useSchedule} from "../Context/hooks/useSchedule.ts";

const AddLesson = () => {
    const { client } = useAuth()
    const { groupUuid, subgroup, lessonUuid} = useSchedule();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const addLessonToGroup = useCallback(() => {
        if (client?.role === ClientRole.HEADMAN) {
            return addLessonToGroupHeadman(lessonUuid, subgroup)
        }
        else {
            return addLessonToGroupAdmin(groupUuid, lessonUuid, subgroup)
        }
    }, [lessonUuid, client, groupUuid, subgroup]);

    const { data, error, isLoading } = useFetchData(addLessonToGroup);

    useEffect(() => {
        messageApi.loading({ content: 'Loading...' });
        if (!isLoading) {
            if (data) {
                messageApi.destroy();
                navigate(client?.role === ClientRole.HEADMAN? "/group/manage" : "/admin/schedule/manage/group", {
                    state: { addLesson: data.status },
                });
            } else if (error) {
                messageApi.destroy();
                navigate(client?.role === ClientRole.HEADMAN? "/group/manage" : "/admin/schedule/manage/group", {
                    state: { addLessonError: error },
                });
            }
        }
    }, [client, data, error, isLoading, navigate, messageApi]);

    return (<>{contextHolder}</>);
};


export default AddLesson;