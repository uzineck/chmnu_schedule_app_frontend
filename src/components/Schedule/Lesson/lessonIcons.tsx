import {Icon, IconActionButton} from "./lessonDetailStyled.ts";
import {FaEdit, FaTrashAlt} from "react-icons/fa";
import {LuDoorClosed} from "react-icons/lu";
import {LiaChalkboardTeacherSolid} from "react-icons/lia";
import {HiUserGroup} from "react-icons/hi";

export const EditIcon = ({ onClick }: { onClick?: () => void }) => (
    <IconActionButton type="button" aria-label="Редагувати заняття" onClick={onClick}>
        <FaEdit />
    </IconActionButton>
);

export const TrashIcon = ({ onClick }: { onClick?: () => void }) => (
    <IconActionButton type="button" aria-label="Видалити заняття" onClick={onClick}>
        <FaTrashAlt />
    </IconActionButton>
);
export const DoorIcon = () => <Icon as={LuDoorClosed} />;
export const TeacherIcon = () => <Icon as={LiaChalkboardTeacherSolid} />;
export const GroupIcon = () => <Icon as={HiUserGroup} />;