import { Group } from "../../../models/group/Group.ts";
import { getAllGroups } from "../../../api/schedule/group.ts";
import EntitySearch from "../../Search/EntitySearch.tsx";

interface GroupSearchProps {
    onGroupSelect: (group: Group | null) => void;
    onGroupListFetched: (groups: Group[]) => void;
    selectedGroup: Group | null;
}

const GroupSearch = ({ onGroupSelect, selectedGroup, onGroupListFetched }: GroupSearchProps) => {
    return (
        <EntitySearch<Group>
            fetchData={getAllGroups}
            mapToOptions={(group: Group) => ({
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
