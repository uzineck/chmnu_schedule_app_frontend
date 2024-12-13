import { useEffect, useCallback } from "react";
import './module.css';
import {useTime} from "../../Time/Context/TimeContext.tsx";
import {Subgroup} from "../../../../models/enums/Subgroup.ts";
import {getHeadmanGroup} from "../../../../api/schedule/group.ts";
import ButtonContainer from "../../../Buttons/ButtonContainer.tsx";
import GroupSchedule from "../GroupSchedule.tsx";
import {useFetchData} from "../../../../api/hooks/useFetchData.tsx";
import {message} from "antd";
import {useScheduleContext} from "../../Context/ScheduleContext.tsx";
import {Outlet, useLocation} from "react-router-dom";

const HeadmanGroupScreen = () => {
    const { subgroup, isEvenWeek, setSubgroup, setIsEvenWeek, setGroupUuid } = useScheduleContext();
    const { currentTime } = useTime();
    const [messageApi, contextHolder] = message.useMessage();
    const location = useLocation();

    const fetchGroup = useCallback(
        () => getHeadmanGroup(),
        []
    );

    const { data, error, isLoading } = useFetchData(fetchGroup);

    useEffect(() => {
        if (data) {
            setGroupUuid(data.uuid)
        }
    }, [setGroupUuid, data]);

    useEffect(() => {
        if (currentTime) {
            const isEven = currentTime.is_even;
            setIsEvenWeek(isEven);
        }
    }, [currentTime, setIsEvenWeek]);

    useEffect(() => {
        const deleteLesson = location.state?.deleteLesson;
        const deleteLessonError = location.state?.deleteLessonError;
        const addLesson = location.state?.addLesson;
        const addLessonError = location.state?.addLessonError;
        const editLesson = location.state?.editLesson;
        const editLessonError = location.state?.editLessonError;

        const successMessage = deleteLesson || addLesson || editLesson;
        const errorMessage = deleteLessonError || addLessonError || editLessonError;

        if (successMessage) {
            messageApi.success({ content: successMessage, duration: 2 });
        }

        if (errorMessage) {
            messageApi.error({ content: errorMessage, duration: 2 });
        }
    }, [location.state, messageApi]);

    useEffect(() => {
        if (isLoading) {
            messageApi.loading({ key: 'updatable', content: 'Loading...' });
        }
        else {
            messageApi.destroy()
        }
    }, [isLoading, messageApi]);

    useEffect(() => {
        if (error) {
            messageApi.error({ key: 'updatable', content: error, duration: 2 });
        }
    }, [error, messageApi]);


    const handleSubgroupChange = (selectedSubgroup: Subgroup) => {
        setSubgroup(selectedSubgroup);
    };

    const handleWeekTypeChange = (isEvenWeek: boolean) => {
        setIsEvenWeek(isEvenWeek);
    };
    const isChildRouteActive = location.pathname.includes("/group/manage/lesson");

    if (isChildRouteActive) {
        return <Outlet />;
    }
    return (
        <div className="group-screen">
            {contextHolder}
            <div className="group-screen-controls">
                <div className="button-container-column">
                    <ButtonContainer
                        options={[
                            { label: 'A', value: Subgroup.A },
                            { label: 'B', value: Subgroup.B }
                        ]}
                        selectedValue={subgroup}
                        onChange={handleSubgroupChange}
                    />
                    <ButtonContainer
                        options={[
                            { label: 'Even', value: true },
                            { label: 'Odd', value: false }
                        ]}
                        selectedValue={isEvenWeek}
                        onChange={handleWeekTypeChange}
                    />
                </div>
            </div>

            {data && (
                <GroupSchedule
                    key={`${data.uuid}-${subgroup}-${isEvenWeek}`}
                    groupUuid={data.uuid}
                    subgroup={subgroup}
                    is_even={isEvenWeek}
                    isEditable={true}
                />
            )}
        </div>
    );
};

export default HeadmanGroupScreen;
