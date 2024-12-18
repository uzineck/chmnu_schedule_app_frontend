import {Icon} from "./lessonDetailStyled.ts";
import {FaEdit, FaTrashAlt} from "react-icons/fa";
import {LuDoorClosed} from "react-icons/lu";
import {LiaChalkboardTeacherSolid} from "react-icons/lia";
import {HiUserGroup} from "react-icons/hi";

export const EditIcon = ({ onClick }: { onClick?: () => void }) => (
    <Icon as={FaEdit} onClick={onClick} />
);

export const TrashIcon = ({ onClick }: { onClick?: () => void }) => (
    <Icon as={FaTrashAlt} onClick={onClick} />
);
export const DoorIcon = () => <Icon as={LuDoorClosed} />;
export const TeacherIcon = () => <Icon as={LiaChalkboardTeacherSolid} />;
export const GroupIcon = () => <Icon as={HiUserGroup} />;