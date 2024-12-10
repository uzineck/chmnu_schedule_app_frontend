import { GroupWithFaculty } from "../../models/group/GroupWithFaculty.ts";
import { getAllGroups } from "../../api/schedule/group.ts";
import EntitySearch from "../Search/EntitySearch.tsx";

interface GroupSearchProps {
    onGroupSelect: (group: GroupWithFaculty | null) => void;
    onGroupListFetched: (groups: GroupWithFaculty[]) => void;
    selectedGroup: GroupWithFaculty | null;
}

const GroupSearch = ({ onGroupSelect, selectedGroup, onGroupListFetched }: GroupSearchProps) => {
    return (
        <EntitySearch<GroupWithFaculty>
            fetchData={getAllGroups}
            mapToOptions={(group: GroupWithFaculty) => ({
                value: group.uuid,
                label: `${group.number} (${group.faculty.code_name})`,
            })}
            selectedOption={selectedGroup ?
                {
                    value: selectedGroup.uuid,
                    label: `${selectedGroup.number} (${selectedGroup.faculty.code_name})`,
                } : null}
            onDataFetched={onGroupListFetched}
            onEntitySelect={onGroupSelect}
            placeholder="Select Group"
            noOptionsMessage="Group not found"
        />
    );
};

export default GroupSearch;
