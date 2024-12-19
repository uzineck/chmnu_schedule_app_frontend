import {message} from "antd";
import {useNavigate} from "react-router-dom";
import {useCallback, useEffect} from "react";
import {ClientRole} from "../../../../models/enums/ClientRole.ts";
import {useFetchData} from "../../../../api/hooks/useFetchData.tsx";
import {
    updateLessonInGroupAdmin,
    updateLessonInGroupHeadman
} from "../../../../api/schedule/group.ts";
import {useAuth} from "../../../Auth/Context/hooks/useAuth.ts";
import {useSchedule} from "../../Context/hooks/useSchedule.ts";

const UpdateLesson = () => {
    const { client } = useAuth()
    const { groupUuid, subgroup, lessonUuid, lesson} = useSchedule();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const updateLessonInGroup = useCallback(() => {
        if (groupUuid==='' || lessonUuid===''){
            navigate(client?.role === ClientRole.HEADMAN? "/group/manage" : "/admin/manage/schedule/group", {
                state: { warningMessage: "Please update lesson only from management panel" },
            });
            return Promise.reject({message: "Please update lesson only from management panel"});
        }
        if (client?.role === ClientRole.HEADMAN) {
            return updateLessonInGroupHeadman(lessonUuid, lesson ? lesson.uuid : lessonUuid, subgroup)
        } else {
            return updateLessonInGroupAdmin(groupUuid, lessonUuid, lesson ? lesson.uuid : lessonUuid, subgroup)
        }
    }, [navigate, lesson, lessonUuid, client, groupUuid, subgroup]);

    const { data, error, isLoading } = useFetchData(updateLessonInGroup);

    useEffect(() => {
        messageApi.loading({ content: 'Loading...' });
        if (!isLoading) {
            if (data) {
                messageApi.destroy();
                navigate(client?.role === ClientRole.HEADMAN ? "/group/manage" : "/admin/manage/schedule/group", {
                    state: { successMessage: data.status },
                });
            } else if (error) {
                messageApi.destroy();
                navigate(client?.role === ClientRole.HEADMAN ? "/group/manage" : "/admin/manage/schedule/group", {
                    state: { errorMessage: error },
                });
            }
        }
    }, [client, data, error, isLoading, navigate, messageApi]);

    return (<>{contextHolder}</>);
};


export default UpdateLesson;