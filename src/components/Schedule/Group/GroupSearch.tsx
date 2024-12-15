import { GroupAll } from "../../../models/group/GroupAll.ts";
import { getAllGroups } from "../../../api/schedule/group.ts";
import EntitySearch from "../../Search/EntitySearch.tsx";

interface GroupSearchProps {
    onGroupSelect: (group: GroupAll | null) => void;
    onGroupListFetched: (groups: GroupAll[]) => void;
    selectedGroup: GroupAll | null;
}

const GroupSearch = ({ onGroupSelect, selectedGroup, onGroupListFetched }: GroupSearchProps) => {
    return (
        <EntitySearch<GroupAll>
            fetchData={getAllGroups}
            mapToOptions={(group: GroupAll) => ({
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
