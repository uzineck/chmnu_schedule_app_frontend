import { useEffect, useCallback } from "react";
import { getHeadmanGroup } from "../../../api/schedule/group.ts";
import GroupSchedule from "../Group/GroupSchedule.tsx";
import { useFetchData } from "../../../api/hooks/useFetchData.tsx";
import { message } from "antd";
import { useSearchParams } from "react-router-dom";
import { useSchedule } from "../Context/hooks/useSchedule.ts";
import { useScheduleSelection } from "../hooks/useScheduleSelection.ts";
import { useTime } from "../Context/hooks/useTime.ts";
import Title from "../../Title/Title.tsx";
import { ScheduleScreen } from "../scheduleScreenStyled.ts";
import ScheduleControlPanel from "../ScheduleControlPanel.tsx";
import ViewPublicScheduleLink from "../ViewPublicScheduleLink.tsx";

const HeadmanGroupScreen = () => {
    const { setGroupUuid, groupUuid } = useSchedule();
    const [messageApi, contextHolder] = message.useMessage();
    const [searchParams] = useSearchParams();
    const { currentTime } = useTime();

    const fetchGroup = useCallback(() => getHeadmanGroup(), []);

    const { data, error, isLoading } = useFetchData(fetchGroup);

    const { subgroup, weekType, handleSubgroupChange, handleWeekTypeChange } = useScheduleSelection({
        hasSubgroups: data?.has_subgroups ?? false,
        searchParams,
    });

    useEffect(() => {
        if (data) {
            setGroupUuid(data.uuid);
        }
    }, [data, setGroupUuid]);

    useEffect(() => {
        if (isLoading) {
            messageApi.loading({ key: 'loading', content: 'Завантаження...' });
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
        <ScheduleScreen>
            {contextHolder}
            <Title text={data ? data.number : ''} />
            <ScheduleControlPanel
                topSlot={
                    data ? (
                        <ViewPublicScheduleLink
                            groupUuid={data.uuid}
                            subgroup={subgroup}
                            weekType={weekType}
                        />
                    ) : undefined
                }
                hasSubgroups={data?.has_subgroups ?? false}
                subgroup={subgroup}
                onSubgroupChange={handleSubgroupChange}
                weekType={weekType}
                currentWeekType={currentTime?.is_even}
                onWeekTypeChange={handleWeekTypeChange}
            />

            {groupUuid && (
                <GroupSchedule
                    key={`${groupUuid}-${subgroup}-${weekType}`}
                    groupUuid={groupUuid}
                    subgroup={subgroup}
                    is_even={weekType}
                    isEditable={true}
                />
            )}
        </ScheduleScreen>
    );
};

export default HeadmanGroupScreen;
