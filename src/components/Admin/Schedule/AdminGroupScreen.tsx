import {useCallback, useEffect, useRef, useState} from "react";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import { Subgroup } from "../../../models/enums/Subgroup.ts";
import { Group } from "../../../models/group/Group.ts";
import ButtonContainer from "../../Buttons/ButtonContainer.tsx";
import "./module.css";
import { useTime } from "../../Schedule/Context/hooks/useTime.ts";
import GroupSearch from "../../Schedule/Group/GroupSearch.tsx";
import GroupSchedule from "../../Schedule/Group/GroupSchedule.tsx";
import { useSchedule } from "../../Schedule/Context/hooks/useSchedule.ts";  // Importing useSchedule

const AdminGroupScreen = () => {
    const { groupUuid } = useParams<{ groupUuid: string }>();
    const [searchParams] = useSearchParams();
    const { currentTime } = useTime();
    const navigate = useNavigate();
    const { group, subgroup, isEvenWeek, setSubgroup, setIsEvenWeek, setGroupUuid, setGroup } = useSchedule();

    const [groupList, setGroupList] = useState<Group[]>([]);
    const isUpdatingURL = useRef(false);

    const updateURL = useCallback(
        (group: Group | null, subgroup: Subgroup | null, weekType: boolean) => {
            if (!group) return;

            const basePath = `/admin/schedule/manage/group/${group.uuid}`;
            const queryParams = new URLSearchParams({
                weekType: weekType.toString(),
                ...(group.has_subgroups && { subgroup: subgroup || "" }),
            });

            navigate(`${basePath}/lessons?${queryParams.toString()}`, { replace: true });
        },
        [navigate]
    );

    const checkSubgroupAndSet = useCallback((group: Group | null) => {
        const storedSubgroup = localStorage.getItem("lastSubgroup");
        if (group?.has_subgroups) {
            const subgroup = searchParams.get("subgroup") || storedSubgroup;
            setSubgroup(subgroup === Subgroup.B ? Subgroup.B : Subgroup.A);
        } else {
            setSubgroup(null);
        }
    }, [setSubgroup, searchParams])

    useEffect(() => {
        const storedGroupUuid = localStorage.getItem("lastGroupUuid");

        let initialGroup = null;

        if (groupUuid && groupList.length > 0) {
            initialGroup = groupList.find((g) => g.uuid === groupUuid);
        } else if (storedGroupUuid && groupList.length > 0) {
            initialGroup = groupList.find((g) => g.uuid === storedGroupUuid);
        }

        if (initialGroup) {
            setGroup(initialGroup);
            setGroupUuid(initialGroup.uuid);
        }
        checkSubgroupAndSet(initialGroup || null);

        const weekTypeFromSearchParams = searchParams.get("weekType");
        if (weekTypeFromSearchParams !== null) {
            setIsEvenWeek(weekTypeFromSearchParams === "true");
        } else if (currentTime) {
            setIsEvenWeek(currentTime.is_even);
        }
    }, [checkSubgroupAndSet, setGroup, groupUuid, groupList, searchParams, currentTime, setGroupUuid, setSubgroup, setIsEvenWeek]);

    useEffect(() => {
        if (isUpdatingURL.current) {
            isUpdatingURL.current = false;
            return;
        }

        if (group) {
            isUpdatingURL.current = true;
            updateURL(group, subgroup, isEvenWeek);
        }
    }, [group, subgroup, isEvenWeek, updateURL]);

    const handleGroupSelect = (group: Group | null) => {
        if (group) {
            setGroup(group);
            setGroupUuid(group.uuid);
        }
        checkSubgroupAndSet(group || null);
        updateURL(group, subgroup, isEvenWeek);

        if (group) {
            localStorage.setItem("lastGroupUuid", group.uuid);
        }
    };

    const handleSubgroupChange = (selectedSubgroup: Subgroup) => {
        setSubgroup(selectedSubgroup);
        updateURL(group, selectedSubgroup, isEvenWeek);
        localStorage.setItem("lastSubgroup", selectedSubgroup);
    };

    const handleWeekTypeChange = (weekType: boolean) => {
        setIsEvenWeek(weekType);
        updateURL(group, subgroup, weekType);
    };

    const handleGroupListFetched = (groups: Group[]) => {
        setGroupList(groups);
    };

    return (
        <div className="group-screen">
            <div className="group-screen-controls">
                <GroupSearch
                    onGroupSelect={handleGroupSelect}
                    onGroupListFetched={handleGroupListFetched}
                    selectedGroup={group}
                />
                <div className="button-container-column">
                    {group?.has_subgroups ? (
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
                            { label: "Тиждень над", value: true },
                            { label: "Тиждень під", value: false },
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

export default AdminGroupScreen;
