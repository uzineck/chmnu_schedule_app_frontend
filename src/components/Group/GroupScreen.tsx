import { useState } from "react";
import GroupSearch from "../Group/GroupSearch.tsx"; // Import GroupSearch to allow selection
import GroupSchedule from "../Group/GroupSchedule.tsx"; // Import GroupSchedule
import { Subgroup } from "../../models/enums/Subgroup.ts";
import { GroupWithFaculty } from "../../models/group/GroupWithFaculty.ts"; // Ensure the Subgroup enum is available
import './GroupScreen.css';  // Import the GroupScreen CSS

const GroupScreen = () => {
    const [selectedGroup, setSelectedGroup] = useState<GroupWithFaculty | null>(null);
    const [subgroup, setSubgroup] = useState<Subgroup>(Subgroup.A); // Default to Subgroup A
    const [isEvenWeek, setIsEvenWeek] = useState<boolean>(true); // Default to Even Week

    const handleGroupSelect = (group: GroupWithFaculty | null) => {
        setSelectedGroup(group);
    };

    const handleSubgroupChange = (selectedSubgroup: Subgroup) => {
        setSubgroup(selectedSubgroup); // Update subgroup
    };

    const handleWeekTypeChange = (weekType: boolean) => {
        setIsEvenWeek(weekType); // Update week type (Even or Odd)
    };

    return (
        <div className="group-screen">
            <h1>Group Schedule</h1>

            {/* Group Search */}
            <div className="group-search-container">
                <GroupSearch onGroupSelect={handleGroupSelect} />
            </div>

            {/* Subgroup Selection */}
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

            {/* Week Type Selection */}
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

            {/* Group Schedule */}
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
