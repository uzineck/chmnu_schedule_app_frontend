import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import GroupSearch from "./GroupSearch.tsx";
import GroupSchedule from "./GroupSchedule.tsx";
import { Subgroup } from "../../../models/enums/Subgroup.ts";
import { Group } from "../../../models/group/Group.ts";
import { GroupWithSubgroup } from "../../../models/group/GroupWithSubgroup.ts";
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

    // Seed active uuid from URL or localStorage so the schedule loads
    // immediately — no full-list preload.
    const initialUuid =
        groupUuid ?? (typeof window !== "undefined" ? localStorage.getItem("lastGroupUuid") : null);
    const [activeUuid, setActiveUuid] = useState<string | null>(initialUuid);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [scheduleUpdatedAt, setScheduleUpdatedAt] = useState<string | null>(null);

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
        if (!selectedGroup) return;
        localStorage.setItem("lastGroupUuid", selectedGroup.uuid);
        updateURL(selectedGroup, subgroup, weekType);
    }, [selectedGroup, subgroup, weekType, updateURL]);

    const handleGroupSelect = (group: Group | null) => {
        setSelectedGroup(group);
        setActiveUuid(group?.uuid ?? null);
    };

    // GroupSchedule fetches `/group/{uuid}/lessons` which returns the group
    // inline — adopt it as the selected entity so the dropdown label is
    // correct on a cold URL load.
    const handleGroupBubbled = (group: GroupWithSubgroup | null) => {
        if (!group) return;
        if (!selectedGroup || selectedGroup.uuid !== group.uuid) {
            setSelectedGroup(group);
        }
    };

    return (
        <ScheduleScreen>
            <ScheduleControlPanel
                topSlot={<ScheduleNavSwitcher />}
                searchSlot={
                    <GroupSearch
                        onGroupSelect={handleGroupSelect}
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
                lastUpdatedIso={scheduleUpdatedAt}
            />
            {activeUuid && (
                <GroupSchedule
                    key={`${activeUuid}-${subgroup}-${weekType}`}
                    groupUuid={activeUuid}
                    subgroup={subgroup}
                    is_even={weekType}
                    onScheduleUpdatedChange={setScheduleUpdatedAt}
                    onGroupChange={handleGroupBubbled}
                />
            )}
        </ScheduleScreen>
    );
};

export default GroupScreen;
