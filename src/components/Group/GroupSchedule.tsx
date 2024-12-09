// GroupSchedule.tsx
import { useEffect, useState } from "react";
import { getGroupLessons } from "../../api/schedule/group.ts";
import { Lesson } from "../../models/lesson/Lesson.ts";
import { Subgroup } from "../../models/enums/Subgroup.ts";
import GroupScheduleMatrix from "./GroupScheduleMatrix.tsx";  // Import the matrix component

interface GroupScheduleProps {
    groupUuid: string;
    subgroup: Subgroup;
    is_even: boolean;
}

const GroupSchedule = ({ groupUuid, subgroup, is_even }: GroupScheduleProps) => {
    const [lessons, setLessons] = useState<Lesson[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (groupUuid) {
            console.log("Fetching lessons for group:", groupUuid);
            setIsLoading(true);
            getGroupLessons(groupUuid, subgroup, is_even)
                .then((response) => {
                    console.log("Lessons fetched:", response.data.lessons);
                    setLessons(response.data.lessons);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching lessons:", error);
                    setIsLoading(false);
                });
        }
    }, [groupUuid, subgroup, is_even]);

    if (isLoading) {
        return <p>Loading group schedule...</p>;
    }

    if (!lessons || lessons.length === 0) {
        return <p>No lessons available for this group.</p>;
    }

    return (
        <div>
            <h2>Group Schedule</h2>
            <GroupScheduleMatrix lessons={lessons} />
        </div>
    );
};

export default GroupSchedule;
