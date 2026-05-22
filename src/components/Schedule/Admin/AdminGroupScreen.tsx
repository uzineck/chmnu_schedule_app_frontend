import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Group } from "../../../models/group/Group.ts";
import GroupSearch from "../Group/GroupSearch.tsx";
import GroupSchedule from "../Group/GroupSchedule.tsx";
import { useSchedule } from "../Context/hooks/useSchedule.ts";
import { useScheduleSelection } from "../hooks/useScheduleSelection.ts";
import { useTime } from "../Context/hooks/useTime.ts";
import { ScheduleScreen } from "../scheduleScreenStyled.ts";
import ScheduleControlPanel from "../ScheduleControlPanel.tsx";
import ViewPublicScheduleLink from "../ViewPublicScheduleLink.tsx";

const AdminGroupScreen = () => {
    const { groupUuid } = useParams<{ groupUuid: string }>();
    const [searchParams] = useSearchParams();
    const { group, setGroupUuid, setGroup, groupUuid: contextGroupUuid } = useSchedule();
    const [groupList, setGroupList] = useState<Group[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    const navigate = useNavigate();
    const { currentTime } = useTime();

    const updateURL = useCallback(
        (group: Group | null) => {
            if (!group) return;
            navigate(`/admin/manage/schedule/group/${group.uuid}/lessons`, { replace: true });
        },
        [navigate]
    );

    const { subgroup, weekType, handleSubgroupChange, handleWeekTypeChange } = useScheduleSelection({
        hasSubgroups: group?.has_subgroups ?? false,
        searchParams,
    });

    useEffect(() => {
        if (groupList.length === 0) return;

        const storedGroupUuid = localStorage.getItem("lastGroupUuid");
        let initialGroup: Group | null = null;

        if (groupUuid) {
            initialGroup = groupList.find((g) => g.uuid === groupUuid) ?? null;
        } else if (storedGroupUuid) {
            initialGroup = groupList.find((g) => g.uuid === storedGroupUuid) ?? null;
        }

        if (initialGroup) {
            setGroup(initialGroup);
            setGroupUuid(initialGroup.uuid);
            setIsInitialized(true);
        }
    }, [groupUuid, groupList, setGroup, setGroupUuid]);

    useEffect(() => {
        if (!isInitialized) return;
        updateURL(group);
    }, [isInitialized, group, updateURL]);

    const handleGroupSelect = (group: Group | null) => {
        if (group) {
            setGroup(group);
            setGroupUuid(group.uuid);
            localStorage.setItem("lastGroupUuid", group.uuid);
            setIsInitialized(true);
        }
    };

    const handleGroupListFetched = (groups: Group[]) => {
        setGroupList(groups);
    };

    return (
        <ScheduleScreen>
            <ScheduleControlPanel
                topSlot={
                    group ? (
                        <ViewPublicScheduleLink
                            groupUuid={group.uuid}
                            subgroup={subgroup}
                            weekType={weekType}
                        />
                    ) : undefined
                }
                searchSlot={
                    <GroupSearch
                        onGroupSelect={handleGroupSelect}
                        onGroupListFetched={handleGroupListFetched}
                        selectedGroup={group}
                    />
                }
                hasSubgroups={group?.has_subgroups ?? false}
                subgroup={subgroup}
                onSubgroupChange={handleSubgroupChange}
                weekType={weekType}
                currentWeekType={currentTime?.is_even}
                onWeekTypeChange={handleWeekTypeChange}
            />
            {contextGroupUuid && isInitialized && (
                <GroupSchedule
                    key={`${contextGroupUuid}-${subgroup}-${weekType}`}
                    groupUuid={contextGroupUuid}
                    subgroup={subgroup}
                    is_even={weekType}
                    isEditable={true}
                />
            )}
        </ScheduleScreen>
    );
};

export default AdminGroupScreen;
