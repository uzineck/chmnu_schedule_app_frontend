import { GroupWithFaculty } from "../../models/group/GroupWithFaculty.ts";
import { getAllGroups } from "../../api/schedule/group.ts";
import EntitySearch from "../Search/EntitySearch.tsx";

interface GroupSearchProps {
    onGroupSelect: (group: GroupWithFaculty | null) => void;
}

const GroupSearch = ({ onGroupSelect }: GroupSearchProps) => {
    return (
        <EntitySearch<GroupWithFaculty>
            fetchData={getAllGroups}
            mapToOptions={(group: GroupWithFaculty) => ({
                value: group.uuid,
                label: `${group.number} (${group.faculty.code_name})`,
            })}
            onEntitySelect={onGroupSelect}
            placeholder="Select Group"
            noOptionsMessage="Group not found"
        />
    );
};

export default GroupSearch;
