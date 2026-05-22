import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import GroupSearch from "./GroupSearch.tsx";
import GroupSchedule from "./GroupSchedule.tsx";
import { Subgroup } from "../../../models/enums/Subgroup.ts";
import { Group } from "../../../models/group/Group.ts";
import { useScheduleSelection } from "../hooks/useScheduleSelection.ts";
import { useTime } from "../Context/hooks/useTime.ts";
import { ScheduleScreen } from "../scheduleScreenStyled.ts";
import ScheduleControlPanel from "../ScheduleControlPanel.tsx";
import ScheduleNavSwitcher from "../ScheduleNavSwitcher.tsx";

const GroupScreen = () => {
    const { groupUuid } = useParams<{ groupUuid: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { currentTime } = useTime();

    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [groupList, setGroupList] = useState<Group[]>([]);

    const updateURL = useCallback(
        (group: Group | null, subgroup: Subgroup | null, weekType: boolean) => {
            if (!group) return;

            const basePath = `/group/${group.uuid}`;
            const queryParams = new URLSearchParams({
                weekType: weekType.toString(),
                ...(group.has_subgroups && { subgroup: subgroup || "" }),
            });

            navigate(`${basePath}/lessons?${queryParams.toString()}`, { replace: true });
        },
        [navigate]
    );

    const { subgroup, weekType, handleSubgroupChange, handleWeekTypeChange } = useScheduleSelection({
        hasSubgroups: selectedGroup?.has_subgroups ?? false,
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

        setSelectedGroup(initialGroup);
    }, [groupUuid, groupList]);

    useEffect(() => {
        if (!selectedGroup) return;
        localStorage.setItem("lastGroupUuid", selectedGroup.uuid);
        updateURL(selectedGroup, subgroup, weekType);
    }, [selectedGroup, subgroup, weekType, updateURL]);

    const handleGroupSelect = (group: Group | null) => {
        setSelectedGroup(group);
    };

    const handleGroupListFetched = (groups: Group[]) => {
        setGroupList(groups);
    };

    return (
        <ScheduleScreen>
            <ScheduleControlPanel
                topSlot={<ScheduleNavSwitcher />}
                searchSlot={
                    <GroupSearch
                        onGroupSelect={handleGroupSelect}
                        onGroupListFetched={handleGroupListFetched}
                        selectedGroup={selectedGroup}
                    />
                }
                showFilters={!!selectedGroup}
                hasSubgroups={selectedGroup?.has_subgroups ?? false}
                subgroup={subgroup}
                onSubgroupChange={handleSubgroupChange}
                weekType={weekType}
                currentWeekType={currentTime?.is_even}
                onWeekTypeChange={handleWeekTypeChange}
            />
            {selectedGroup && (
                <GroupSchedule
                    key={`${selectedGroup.uuid}-${subgroup}-${weekType}`}
                    groupUuid={selectedGroup.uuid}
                    subgroup={subgroup}
                    is_even={weekType}
                />
            )}
        </ScheduleScreen>
    );
};

export default GroupScreen;
