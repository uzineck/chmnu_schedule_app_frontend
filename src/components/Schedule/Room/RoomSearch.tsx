import AsyncEntitySearch from "../../Search/AsyncEntitySearch.tsx";
import { getListOfRooms } from "../../../api/schedule/room.ts";
import { Room } from "../../../models/room/Room.ts";

interface RoomSearchProps {
    onRoomSelect: (room: Room | null) => void;
    selectedRoom: Room | null;
}

const RoomSearch = ({ onRoomSelect, selectedRoom }: RoomSearchProps) => {
    return (
        <AsyncEntitySearch<Room>
            fetchPage={getListOfRooms}
            mapToOption={(room) => ({ value: room.uuid, label: room.number })}
            selected={
                selectedRoom ? { value: selectedRoom.uuid, label: selectedRoom.number } : null
            }
            onSelect={onRoomSelect}
            placeholder="Виберіть аудиторію"
            noOptionsMessage="Жодної аудиторії не знайдено"
        />
    );
};

export default RoomSearch;
