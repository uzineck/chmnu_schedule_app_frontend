import { Group } from "../../../models/group/Group.ts";
import { getAllGroups } from "../../../api/schedule/group.ts";
import EntitySearch from "../../Search/EntitySearch.tsx";

interface GroupSearchProps {
    onGroupSelect: (group: Group | null) => void;
    selectedGroup: Group | null;
}

const groupLabel = (g: Group) => `${g.number} (${g.faculty.code_name})`;

const GroupSearch = ({ onGroupSelect, selectedGroup }: GroupSearchProps) => {
    return (
        <EntitySearch<Group>
            fetchData={getAllGroups}
            mapToOption={(group) => ({ value: group.uuid, label: groupLabel(group) })}
            selectedOption={
                selectedGroup
                    ? { value: selectedGroup.uuid, label: groupLabel(selectedGroup) }
                    : null
            }
            onEntitySelect={onGroupSelect}
            placeholder="Виберіть групу"
            noOptionsMessage="Жодної групи не знайдено"
        />
    );
};

export default GroupSearch;
