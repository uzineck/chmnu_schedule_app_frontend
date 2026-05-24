import AsyncEntitySearch from "../../Search/AsyncEntitySearch.tsx";
import { getListOfGroups } from "../../../api/schedule/group.ts";
import { Group } from "../../../models/group/Group.ts";
import { GroupWithHeadman } from "../../../models/group/GroupWithHeadman.ts";

interface GroupSearchAsyncProps {
    onGroupSelect: (group: Group | null) => void;
    selectedGroup: Group | null;
}

const groupLabel = (g: Group) => `${g.number} (${g.faculty.code_name})`;

const GroupSearchAsync = ({ onGroupSelect, selectedGroup }: GroupSearchAsyncProps) => {
    return (
        <AsyncEntitySearch<GroupWithHeadman>
            fetchPage={getListOfGroups}
            mapToOption={(group) => ({ value: group.uuid, label: groupLabel(group) })}
            selected={
                selectedGroup
                    ? { value: selectedGroup.uuid, label: groupLabel(selectedGroup) }
                    : null
            }
            onSelect={onGroupSelect}
            placeholder="Виберіть групу"
            noOptionsMessage="Жодної групи не знайдено"
        />
    );
};

export default GroupSearchAsync;
