import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import GroupSearch from "./GroupSearch.tsx";
import GroupSchedule from "./GroupSchedule.tsx";
import { Subgroup } from "../../../models/enums/Subgroup.ts";
import { GroupWithFaculty } from "../../../models/group/GroupWithFaculty.ts";
import ButtonContainer from "../../Buttons/ButtonContainer.tsx";
import { useTime } from "../Time/Context/TimeContext.tsx";
import './module.css';

const GroupScreen = () => {
    const { groupUuid } = useParams<{ groupUuid: string }>();
    const [searchParams] = useSearchParams();
    const { currentTime } = useTime();
    const navigate = useNavigate();

    const [selectedGroup, setSelectedGroup] = useState<GroupWithFaculty | null>(null);
    const [groupList, setGroupList] = useState<GroupWithFaculty[]>([]);
    const [subgroup, setSubgroup] = useState<Subgroup>(Subgroup.A);
    const [isEvenWeek, setIsEvenWeek] = useState<boolean>(true);

    useEffect(() => {
        const storedSubgroup = localStorage.getItem("lastSubgroup");

        if (storedSubgroup && !searchParams.has('subgroup')) {
            setSubgroup(storedSubgroup === Subgroup.B ? Subgroup.B : Subgroup.A);
        }
    }, [searchParams]);

    useEffect(() => {
        if (groupUuid && groupList.length > 0) {
            const group = groupList.find(g => g.uuid === groupUuid);
            if (group) {
                setSelectedGroup(group);
            }
        } else {
            const storedGroup = localStorage.getItem("lastGroupUuid");
            if (storedGroup && groupList.length > 0) {
                const group = groupList.find(g => g.uuid === storedGroup);
                if (group) {
                    setSelectedGroup(group);
                }
            }
        }

        const isEvenFromSearchParams = searchParams.get("is_even");
        if (isEvenFromSearchParams !== null) {
            setIsEvenWeek(isEvenFromSearchParams === "true");
        } else if (currentTime) {
            const isEven = currentTime.is_even;
            setIsEvenWeek(isEven);
        }

        const selectedSubgroup = searchParams.get("subgroup");
        if (selectedSubgroup === Subgroup.B) {
            setSubgroup(Subgroup.B);
        } else if (selectedSubgroup === Subgroup.A) {
            setSubgroup(Subgroup.A);
        }
    }, [groupUuid, searchParams, groupList, currentTime]);

    useEffect(() => {
        if (selectedGroup) {
            updateURL(selectedGroup, subgroup, isEvenWeek);
        }
    }, [selectedGroup, subgroup, isEvenWeek]);

    const handleGroupSelect = (group: GroupWithFaculty | null) => {
        setSelectedGroup(group);
        updateURL(group, subgroup, isEvenWeek);

        if (group) {
            localStorage.setItem("lastGroupUuid", group.uuid);
        }
    };

    const handleSubgroupChange = (selectedSubgroup: Subgroup) => {
        setSubgroup(selectedSubgroup);
        updateURL(selectedGroup, selectedSubgroup, isEvenWeek);
        localStorage.setItem("lastSubgroup", selectedSubgroup);
    };

    const handleWeekTypeChange = (isEvenWeek: boolean) => {
        setIsEvenWeek(isEvenWeek);
        updateURL(selectedGroup, subgroup, isEvenWeek);
    };

    const handleGroupListFetched = (groups: GroupWithFaculty[]) => {
        setGroupList(groups);
    };

    const updateURL = (group: GroupWithFaculty | null, subgroup: Subgroup, isEvenWeek: boolean) => {
        if (group) {
            navigate(`/group/${group.uuid}?subgroup=${subgroup}&is_even=${isEvenWeek}`, { replace: true });
        }
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
                    <ButtonContainer
                        options={[
                            { label: 'A', value: Subgroup.A },
                            { label: 'B', value: Subgroup.B }
                        ]}
                        selectedValue={subgroup}
                        onChange={handleSubgroupChange}
                    />
                    <ButtonContainer
                        options={[
                            { label: 'Even', value: true },
                            { label: 'Odd', value: false }
                        ]}
                        selectedValue={isEvenWeek}
                        onChange={handleWeekTypeChange}
                    />
                </div>
            </div>

            {selectedGroup && (
                <GroupSchedule
                    key={`${selectedGroup.uuid}-${subgroup}-${isEvenWeek}`}
                    groupUuid={selectedGroup.uuid}
                    subgroup={subgroup}
                    is_even={isEvenWeek}
                />
            )}
        </div>
    );
};

export default GroupScreen;
