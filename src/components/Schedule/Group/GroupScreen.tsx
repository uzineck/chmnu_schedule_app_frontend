import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import GroupSearch from "./GroupSearch.tsx";
import GroupSchedule from "./GroupSchedule.tsx";
import { Subgroup } from "../../../models/enums/Subgroup.ts";
import { Group } from "../../../models/group/Group.ts";
import ButtonContainer from "../../Buttons/ButtonContainer.tsx";
import "./module.css";
import {useTime} from "../Context/hooks/useTime.ts";

const GroupScreen = () => {
    const { groupUuid } = useParams<{ groupUuid: string }>();
    const [searchParams] = useSearchParams();
    const { currentTime } = useTime();
    const navigate = useNavigate();

    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [groupList, setGroupList] = useState<Group[]>([]);
    const [selectedSubgroup, setSelectedSubgroup] = useState<Subgroup | null>(null);
    const [selectedWeekType, setSelectedWeekType] = useState<boolean>(true);

    const isUpdatingURL = useRef(false);

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

    const checkSubgroupAndSet = useCallback((group: Group | null) => {
        const storedSubgroup = localStorage.getItem("lastSubgroup");
        if (group?.has_subgroups) {
            const subgroup = searchParams.get("subgroup") || storedSubgroup;
            const validSubgroup = subgroup === Subgroup.B ? Subgroup.B : Subgroup.A;
            setSelectedSubgroup(validSubgroup);
            localStorage.setItem("lastSubgroup", validSubgroup);
        } else {
            setSelectedSubgroup(null);
        }
    }, [searchParams])

    useEffect(() => {
        const storedGroupUuid = localStorage.getItem("lastGroupUuid");

        let initialGroup = null;

        if (groupUuid && groupList.length > 0) {
            initialGroup = groupList.find((g) => g.uuid === groupUuid);
        } else if (storedGroupUuid && groupList.length > 0) {
            initialGroup = groupList.find((g) => g.uuid === storedGroupUuid);
        }

        setSelectedGroup(initialGroup || null);

        checkSubgroupAndSet(initialGroup || null);

        const weekTypeFromSearchParams = searchParams.get("weekType");
        if (weekTypeFromSearchParams !== null) {
            setSelectedWeekType(weekTypeFromSearchParams === "true");
        } else if (currentTime) {
            setSelectedWeekType(currentTime.is_even);
        }
    }, [groupUuid, groupList, searchParams, currentTime, checkSubgroupAndSet]);

    useEffect(() => {
        if (isUpdatingURL.current) {
            isUpdatingURL.current = false;
            return;
        }

        if (selectedGroup) {
            isUpdatingURL.current = true;
            localStorage.setItem("lastGroupUuid", selectedGroup.uuid);
            updateURL(selectedGroup, selectedSubgroup, selectedWeekType);
        }
    }, [selectedGroup, selectedSubgroup, selectedWeekType, updateURL]);

    const handleGroupSelect = (group: Group | null) => {
        setSelectedGroup(group);
        checkSubgroupAndSet(group);
        updateURL(group, selectedSubgroup, selectedWeekType);

        if (group) {
            localStorage.setItem("lastGroupUuid", group.uuid);
        }
    };

    const handleSubgroupChange = (subgroup: Subgroup) => {
        setSelectedSubgroup(subgroup);
        updateURL(selectedGroup, subgroup, selectedWeekType);
    };

    const handleWeekTypeChange = (weekType: boolean) => {
        setSelectedWeekType(weekType);
        updateURL(selectedGroup, selectedSubgroup, weekType);
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
                    selectedGroup={selectedGroup}
                />
                <div className="button-container-column">
                    {selectedGroup?.has_subgroups ? (
                        <ButtonContainer
                            options={[
                                { label: "Підгрупа A", value: Subgroup.A },
                                { label: "Підгрупа B", value: Subgroup.B },
                            ]}
                            selectedValue={selectedSubgroup}
                            onChange={handleSubgroupChange}
                        />
                    ) : null}
                    <ButtonContainer
                        options={[
                            { label: "Тиждень над", value: true },
                            { label: "Тиждень під", value: false },
                        ]}
                        selectedValue={selectedWeekType}
                        onChange={handleWeekTypeChange}
                    />
                </div>
            </div>

            {selectedGroup && (
                <GroupSchedule
                    key={`${selectedGroup.uuid}-${selectedSubgroup}-${selectedWeekType}`}
                    groupUuid={selectedGroup.uuid}
                    subgroup={selectedSubgroup}
                    is_even={selectedWeekType}
                />
            )}
        </div>
    );
};

export default GroupScreen;
