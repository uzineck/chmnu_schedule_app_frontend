import { useEffect, useCallback } from "react";
import './module.css';
import {Subgroup} from "../../../../models/enums/Subgroup.ts";
import {getHeadmanGroup} from "../../../../api/schedule/group.ts";
import ButtonContainer from "../../../Buttons/ButtonContainer.tsx";
import GroupSchedule from "../GroupSchedule.tsx";
import {useFetchData} from "../../../../api/hooks/useFetchData.tsx";
import {message} from "antd";
import {Outlet, useLocation} from "react-router-dom";
import {useSchedule} from "../../Context/hooks/useSchedule.ts";
import {useTime} from "../../Context/hooks/useTime.ts";
import Title from "../../../Title/Title.tsx";

const HeadmanGroupScreen = () => {
    const { currentTime } = useTime();
    const { subgroup, isEvenWeek, setSubgroup, setIsEvenWeek, setGroupUuid } = useSchedule();
    const [messageApi, contextHolder] = message.useMessage();
    const location = useLocation();

    const fetchGroup = useCallback(() => getHeadmanGroup(), []);

    const { data, error, isLoading } = useFetchData(fetchGroup);

    useEffect(() => {
        if (currentTime) {
            const isEven = currentTime.is_even;
            setIsEvenWeek(isEven);
        }
    }, [currentTime, setIsEvenWeek]);

    useEffect(() => {
        if (data) {
            setGroupUuid(data.uuid)
            if (data.has_subgroups){
                setSubgroup(Subgroup.A)
            }
            else{
                setSubgroup(null)
            }
        }
    }, [setSubgroup, setGroupUuid, data]);

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


    const handleSubgroupChange = (selectedSubgroup: Subgroup | null) => {
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
                    <Title text={data ? data.number : ''} />
                    {data?.has_subgroups ? (
                        <ButtonContainer
                            options={[
                                { label: "Підгрупа A", value: Subgroup.A },
                                { label: "Підгрупа B", value: Subgroup.B },
                            ]}
                            selectedValue={subgroup}
                            onChange={handleSubgroupChange}
                        />
                    ) : null}
                    <ButtonContainer
                        options={[
                            { label: 'Тиждень над', value: true },
                            { label: 'Тиждень під', value: false }
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
