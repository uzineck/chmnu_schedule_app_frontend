import { useEffect, useCallback } from "react";
import {Subgroup} from "../../../models/enums/Subgroup.ts";
import {getHeadmanGroup} from "../../../api/schedule/group.ts";
import ButtonContainer from "../../Buttons/ButtonContainer.tsx";
import GroupSchedule from "../Group/GroupSchedule.tsx";
import {useFetchData} from "../../../api/hooks/useFetchData.tsx";
import {message} from "antd";
import {useLocation} from "react-router-dom";
import {useSchedule} from "../Context/hooks/useSchedule.ts";
import {useTime} from "../Context/hooks/useTime.ts";
import Title from "../../Title/Title.tsx";
import {Group} from "../../../models/group/Group.ts";
import {ScheduleButtonContainer, ScheduleScreen, ScheduleScreenControls} from "../scheduleScreenStyled.ts";

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
        const successMessage = location.state?.successMessage;
        const errorMessage = location.state?.errorMessage;
        const warningMessage = location.state?.warningMessage;

        if (successMessage) {
            messageApi.success({ content: successMessage, duration: 2 });
        }

        if (errorMessage) {
            messageApi.error({ content: errorMessage, duration: 3 });
        }

        if (warningMessage) {
            messageApi.warning({ content: warningMessage, duration: 3 });
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
        <ScheduleScreen>
            {contextHolder}
            <ScheduleScreenControls>
                <ScheduleButtonContainer>
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
                            { label: 'Тиждень під', value: false },
                        ]}
                        selectedValue={isEvenWeek}
                        onChange={handleWeekTypeChange}
                    />
                </ScheduleButtonContainer>
            </ScheduleScreenControls>

            {groupUuid && (
                <GroupSchedule
                    key={`${groupUuid}-${subgroup}-${isEvenWeek}`}
                    groupUuid={groupUuid}
                    subgroup={subgroup}
                    is_even={isEvenWeek}
                    isEditable={true}
                />
            )}
        </ScheduleScreen>
    );
};

export default HeadmanGroupScreen;
