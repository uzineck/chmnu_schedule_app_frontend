import { useCallback } from "react";
import { useFetchData } from "../../../api/hooks/useFetchData.tsx";  // Import the custom hook
import { getGroupLessons } from "../../../api/schedule/group.ts";
import { Subgroup } from "../../../models/enums/Subgroup.ts";
import GroupScheduleMatrix from "./GroupScheduleMatrix.tsx";

interface GroupScheduleProps {
    groupUuid: string;
    subgroup: Subgroup;
    is_even: boolean;
}

const GroupSchedule = ({ groupUuid, subgroup, is_even }: GroupScheduleProps) => {
    const fetchLessons = useCallback(
        () => getGroupLessons(groupUuid, subgroup, is_even),
        [groupUuid, subgroup, is_even]
    );

    const { data, error, isLoading } = useFetchData(fetchLessons);

    if (isLoading) {
        return <p>Loading group schedule...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <>
            <GroupScheduleMatrix lessons={data ? data.lessons : null} />
        </>
    );
};

export default GroupSchedule;
