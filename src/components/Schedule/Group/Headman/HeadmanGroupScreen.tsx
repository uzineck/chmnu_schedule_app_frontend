import { useEffect, useCallback } from "react";
import './module.css';
import {Subgroup} from "../../../../models/enums/Subgroup.ts";
import {getHeadmanGroup} from "../../../../api/schedule/group.ts";
import ButtonContainer from "../../../Buttons/ButtonContainer.tsx";
import GroupSchedule from "../GroupSchedule.tsx";
import {useFetchData} from "../../../../api/hooks/useFetchData.tsx";
import {message} from "antd";
import {useLocation} from "react-router-dom";
import {useSchedule} from "../../Context/hooks/useSchedule.ts";
import {useTime} from "../../Context/hooks/useTime.ts";
import Title from "../../../Title/Title.tsx";
import {Group} from "../../../../models/group/Group.ts";

const HeadmanGroupScreen = () => {
    const { currentTime } = useTime();
    const { subgroup, isEvenWeek, setSubgroup, setIsEvenWeek, setGroupUuid, groupUuid } = useSchedule();
    const [messageApi, contextHolder] = message.useMessage();
    const location = useLocation();

    const fetchGroup = useCallback(() => getHeadmanGroup(), []);

    const { data, error, isLoading } = useFetchData(fetchGroup);

    const resolveSubgroup = useCallback(
        (group: Group | null) => {
            const storedSubgroup = localStorage.getItem("lastSubgroup");
            if (group?.has_subgroups) {
                setSubgroup(storedSubgroup === Subgroup.B ? Subgroup.B : Subgroup.A);
            } else {
                setSubgroup(null);
            }
        },
        [setSubgroup]
    );
    const resolveWeekType = useCallback(() => {
        const storedWeekType = localStorage.getItem("lastWeekType");
        if (storedWeekType) {
            setIsEvenWeek(storedWeekType === "true");
        } else if (currentTime) {
            const currentTimeWeekType =  currentTime.is_even;
            setIsEvenWeek(currentTimeWeekType);
            localStorage.setItem("lastWeekType", currentTimeWeekType.toString());
        }
    }, [setIsEvenWeek, currentTime]);

    useEffect(() => {
        if (data) {
            setGroupUuid(data.uuid);
            resolveSubgroup(data || null);
            resolveWeekType();
        }
    }, [data, setGroupUuid, resolveSubgroup, resolveWeekType]);


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
            messageApi.error({ content: errorMessage, duration: 3 });
        }
    }, [location.state, messageApi]);

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


    const handleSubgroupChange = (selectedSubgroup: Subgroup) => {
        setSubgroup(selectedSubgroup);
        localStorage.setItem("lastSubgroup", selectedSubgroup);
    };

    const handleWeekTypeChange = (weekType: boolean) => {
        setIsEvenWeek(weekType);
        localStorage.setItem("lastWeekType", weekType.toString());
    };

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

            {groupUuid && (
                <GroupSchedule
                    key={`${groupUuid}-${subgroup}-${isEvenWeek}`}
                    groupUuid={groupUuid}
                    subgroup={subgroup}
                    is_even={isEvenWeek}
                    isEditable={true}
                />
            )}
        </div>
    );
};

export default HeadmanGroupScreen;
