import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Group } from "../../../models/group/Group.ts";
import { GroupWithSubgroup } from "../../../models/group/GroupWithSubgroup.ts";
import GroupSearchAsync from "../Group/GroupSearchAsync.tsx";
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
    const { setGroupUuid, setGroup, groupUuid: contextGroupUuid, setScheduleEditMode, scheduleRefreshKey } = useSchedule();

    useEffect(() => {
        setScheduleEditMode('admin');
    }, [setScheduleEditMode]);

    const initialUuid =
        groupUuid ?? (typeof window !== "undefined" ? localStorage.getItem("lastGroupUuid") : null);
    const [activeUuid, setActiveUuid] = useState<string | null>(initialUuid);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [scheduleUpdatedAt, setScheduleUpdatedAt] = useState<string | null>(null);

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
        hasSubgroups: selectedGroup?.has_subgroups ?? false,
        searchParams,
    });

    // Push the active uuid into the lesson-context bridge so lesson actions
    // (delete, modal submits) know which group they're acting on.
    useEffect(() => {
        if (activeUuid) {
            setGroupUuid(activeUuid);
        }
    }, [activeUuid, setGroupUuid]);

    useEffect(() => {
        if (!selectedGroup) return;
        setGroup(selectedGroup);
        localStorage.setItem("lastGroupUuid", selectedGroup.uuid);
        updateURL(selectedGroup);
    }, [selectedGroup, setGroup, updateURL]);

    const handleGroupSelect = (group: Group | null) => {
        setSelectedGroup(group);
        setActiveUuid(group?.uuid ?? null);
    };

    const handleGroupBubbled = (group: GroupWithSubgroup | null) => {
        if (!group) return;
        if (!selectedGroup || selectedGroup.uuid !== group.uuid) {
            setSelectedGroup(group);
        }
    };

    return (
        <ScheduleScreen>
            <ScheduleControlPanel
                topSlot={
                    selectedGroup ? (
                        <ViewPublicScheduleLink
                            groupUuid={selectedGroup.uuid}
                            subgroup={subgroup}
                            weekType={weekType}
                        />
                    ) : undefined
                }
                searchSlot={
                    <GroupSearchAsync
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
            {contextGroupUuid && activeUuid && (
                <GroupSchedule
                    key={`${activeUuid}-${subgroup}-${weekType}-${scheduleRefreshKey}`}
                    groupUuid={activeUuid}
                    subgroup={subgroup}
                    is_even={weekType}
                    isEditable={true}
                    onScheduleUpdatedChange={setScheduleUpdatedAt}
                    onGroupChange={handleGroupBubbled}
                />
            )}
            <Outlet />
        </ScheduleScreen>
    );
};

export default AdminGroupScreen;
