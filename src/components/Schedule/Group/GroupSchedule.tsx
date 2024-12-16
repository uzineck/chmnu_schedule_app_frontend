import {useCallback, useEffect} from "react";
import { useFetchData } from "../../../api/hooks/useFetchData.tsx";  // Import the custom hook
import { getGroupLessons } from "../../../api/schedule/group.ts";
import { Subgroup } from "../../../models/enums/Subgroup.ts";
import {message} from "antd";
import BaseScheduleMatrix from "../BaseScheduleMatrix.tsx";

interface GroupScheduleProps {
    groupUuid: string;
    subgroup: Subgroup | null;
    is_even: boolean;
    isEditable?: boolean;

}

const GroupSchedule = ({ groupUuid, subgroup, is_even, isEditable }: GroupScheduleProps) => {
    const [messageApi, contextHolder] = message.useMessage();

    const fetchLessons = useCallback(
        () => getGroupLessons(groupUuid, subgroup, is_even),
        [groupUuid, subgroup, is_even]
    );

    const { data, error, isLoading } = useFetchData(fetchLessons);


    useEffect(() => {
        if (isLoading) {
            messageApi.loading({ key: 'loading', content: 'Loading...' });
        }
        else {
            messageApi.destroy('loading')
        }
    }, [isLoading, messageApi]);

    useEffect(() => {
        if (error) {
            messageApi.error({ content: error, duration: 3 });
        }
    }, [error, messageApi]);

    return (
        <>
            {contextHolder}
            <BaseScheduleMatrix lessons={data ? data.lessons : null} isEditable={isEditable}/>
        </>
    );
};

export default GroupSchedule;
