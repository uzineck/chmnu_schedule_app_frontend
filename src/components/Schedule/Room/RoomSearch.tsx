import EntitySearch from "../../Search/EntitySearch.tsx";
import {Room} from "../../../models/room/Room.ts";
import {getAllRooms} from "../../../api/schedule/room.ts";

interface RoomSearchProps {
    onRoomSelect: (room: Room | null) => void;
    onRoomListFetched: (rooms: Room[]) => void;
    selectedRoom: Room | null;
}

const RoomSearch = ({ onRoomSelect, selectedRoom, onRoomListFetched }: RoomSearchProps) => {
    return (
        <EntitySearch<Room>
            fetchData={getAllRooms}
            mapToOptions={(room: Room) => ({
                value: room.uuid,
                label: `${room.number}`,
            })}
            selectedOption={selectedRoom ?
                {
                    value: selectedRoom.uuid,
                    label: `${selectedRoom.number}`,
                } : null}
            onEntitySelect={onRoomSelect}
            onDataFetched={onRoomListFetched}
            placeholder="Select Room"
            noOptionsMessage="Room not found"
        />
    );
};

export default RoomSearch;
