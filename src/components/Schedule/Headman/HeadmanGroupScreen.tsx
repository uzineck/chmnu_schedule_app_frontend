import { useEffect, useCallback, useState } from "react";
import styled from "styled-components";
import { getHeadmanGroup } from "../../../api/schedule/group.ts";
import GroupSchedule from "../Group/GroupSchedule.tsx";
import { useFetchData } from "../../../api/hooks/useFetchData.tsx";
import { message } from "antd";
import { Outlet, useSearchParams } from "react-router-dom";
import { useSchedule } from "../Context/hooks/useSchedule.ts";
import { useScheduleSelection } from "../hooks/useScheduleSelection.ts";
import { useTime } from "../Context/hooks/useTime.ts";
import Title from "../../Title/Title.tsx";
import { media } from "../../../styles/media.ts";
import { ScheduleScreen } from "../scheduleScreenStyled.ts";
import ScheduleControlPanel from "../ScheduleControlPanel.tsx";
import ViewPublicScheduleLink from "../ViewPublicScheduleLink.tsx";

const GroupSubtitle = styled.div`
    text-align: center;
    font-size: 0.95rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textSubtle};
    letter-spacing: 1px;
    margin-top: -4px;
    margin-bottom: 8px;

    ${media.up('phone')} { font-size: 1.05rem; }
    ${media.up('tablet')} { font-size: 1.2rem; }
`;

const HeadmanGroupScreen = () => {
    const { setGroupUuid, groupUuid, setScheduleEditMode, scheduleRefreshKey } = useSchedule();

    useEffect(() => {
        setScheduleEditMode('headman');
    }, [setScheduleEditMode]);
    const [messageApi, contextHolder] = message.useMessage();
    const [searchParams] = useSearchParams();
    const { currentTime } = useTime();
    const [scheduleUpdatedAt, setScheduleUpdatedAt] = useState<string | null>(null);

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
            <Title text="Розклад моєї групи" />
            {data && <GroupSubtitle>{data.number}</GroupSubtitle>}
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
                lastUpdatedIso={scheduleUpdatedAt}
            />

            {groupUuid && (
                <GroupSchedule
                    key={`${groupUuid}-${subgroup}-${weekType}-${scheduleRefreshKey}`}
                    groupUuid={groupUuid}
                    subgroup={subgroup}
                    is_even={weekType}
                    isEditable={true}
                    onScheduleUpdatedChange={setScheduleUpdatedAt}
                />
            )}
            <Outlet />
        </ScheduleScreen>
    );
};

export default HeadmanGroupScreen;
