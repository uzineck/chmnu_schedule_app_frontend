import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import GroupSearch from "../Group/GroupSearch.tsx";
import GroupSchedule from "../Group/GroupSchedule.tsx";
import { Subgroup } from "../../models/enums/Subgroup.ts";
import { GroupWithFaculty } from "../../models/group/GroupWithFaculty.ts";
import './GroupScreen.css';

const GroupScreen = () => {
    const { groupUuid } = useParams<{ groupUuid: string }>();  // Get groupUuid from the URL
    const [searchParams] = useSearchParams(); // For query parameters (subgroup, week type)
    const navigate = useNavigate();

    const [selectedGroup, setSelectedGroup] = useState<GroupWithFaculty | null>(null);
    const [subgroup, setSubgroup] = useState<Subgroup>(Subgroup.A);
    const [isEvenWeek, setIsEvenWeek] = useState<boolean>(true);
    const [groupList, setGroupList] = useState<GroupWithFaculty[]>([]);  // List of all groups

    useEffect(() => {
        if (groupUuid && groupList.length > 0) {
            const group = groupList.find(g => g.uuid === groupUuid);
            if (group) {
                setSelectedGroup(group);
            }
        }

        const isEven = searchParams.get("is_even") === "true";
        setIsEvenWeek(isEven);

        const selectedSubgroup = searchParams.get("subgroup");
        if (selectedSubgroup === Subgroup.B) {
            setSubgroup(Subgroup.B);
        } else {
            setSubgroup(Subgroup.A);
        }
    }, [groupUuid, searchParams, groupList]);

    const handleGroupSelect = (group: GroupWithFaculty | null) => {
        setSelectedGroup(group);
        updateURL(group, subgroup, isEvenWeek);
    };

    const handleSubgroupChange = (selectedSubgroup: Subgroup) => {
        setSubgroup(selectedSubgroup);
        updateURL(selectedGroup, selectedSubgroup, isEvenWeek);
    };

    const handleWeekTypeChange = (weekType: boolean) => {
        setIsEvenWeek(weekType);
        updateURL(selectedGroup, subgroup, weekType);
    };

    const updateURL = (group: GroupWithFaculty | null, subgroup: Subgroup, weekType: boolean) => {
        if (group) {
            navigate(`/group/${group.uuid}?subgroup=${subgroup}&is_even=${weekType}`, { replace: true });
        }
    };

    const handleGroupListFetched = (groups: GroupWithFaculty[]) => {
        setGroupList(groups);
    };

    const selectedGroupOption = selectedGroup ? selectedGroup : null;


    return (
        <div className="group-screen">
            <h1>Group Schedule</h1>

            <div className="group-search-container">
                <GroupSearch
                    onGroupSelect={handleGroupSelect}
                    onGroupListFetched={handleGroupListFetched}
                    selectedGroup={selectedGroupOption}
                />
            </div>

            <div className="button-container">
                <button
                    className={subgroup === Subgroup.A ? "selected" : ""}
                    onClick={() => handleSubgroupChange(Subgroup.A)}
                >
                    Subgroup A
                </button>
                <button
                    className={subgroup === Subgroup.B ? "selected" : ""}
                    onClick={() => handleSubgroupChange(Subgroup.B)}
                >
                    Subgroup B
                </button>
            </div>

            <div className="button-container">
                <button
                    className={isEvenWeek ? "selected" : ""}
                    onClick={() => handleWeekTypeChange(true)}
                >
                    Even Week
                </button>
                <button
                    className={!isEvenWeek ? "selected" : ""}
                    onClick={() => handleWeekTypeChange(false)}
                >
                    Odd Week
                </button>
            </div>

            <div className="group-schedule-section">
                {selectedGroup && (
                    <GroupSchedule
                        key={`${selectedGroup.uuid}-${subgroup}-${isEvenWeek}`}
                        groupUuid={selectedGroup.uuid}
                        subgroup={subgroup}
                        is_even={isEvenWeek}
                    />
                )}
            </div>
        </div>
    );
};

export default GroupScreen;
