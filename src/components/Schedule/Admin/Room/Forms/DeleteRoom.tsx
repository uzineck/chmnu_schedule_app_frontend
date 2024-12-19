import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import {ApiCallError} from "../../../../../api/errors.ts";
import {
    ErrorMessage,
    FormCard,
    FormInputGroup,
    FormLabel, SubmitButton
} from "../../../../Auth/Client/Forms/formikFormStyled.ts";
import RoomSearch from "../../../Room/RoomSearch.tsx";
import {Room} from "../../../../../models/room/Room.ts";
import {deleteRoom} from "../../../../../api/schedule/room.ts";

const DeleteRoomValidationSchema = Yup.object().shape({
    room_uuid: Yup.string().required("Room is required"),
});

const DeleteRoom = () => {
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const key = 'updatable';

    const formik = useFormik({
        initialValues: {
            room_uuid: '',
        },
        validationSchema: DeleteRoomValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            messageApi.loading({ key: key, content: 'Deleting room...' });
            try {
                const response = await deleteRoom(values.room_uuid);
                navigate("/admin/manage/room", { state:
                        {
                            successMessage: response.data.status
                        }
                });
            } catch (error) {
                if (error instanceof ApiCallError) {
                    messageApi.error({ key: key, content: error.message, duration: 3 });
                } else {
                    messageApi.error({ key: key, content: "Unknown error occurred.", duration: 3 });
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleRoomSelect = (room: Room | null) => {
        setSelectedRoom(room);
        formik.setFieldValue('room_uuid', room ? room.uuid : '');
    };

    return (
        <FormCard onSubmit={formik.handleSubmit}>
            {contextHolder}

            {/* Room Selection */}
            <FormInputGroup>
                <FormLabel htmlFor="room_uuid">Room</FormLabel>
                <RoomSearch
                    onRoomSelect={handleRoomSelect}
                    onRoomListFetched={()=>{}}
                    selectedRoom={selectedRoom}
                />
                {formik.touched.room_uuid && formik.errors.room_uuid && (
                    <ErrorMessage>{formik.errors.room_uuid}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* Submit Button */}
            <SubmitButton type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Deleting Room...' : 'Delete Room'}
            </SubmitButton>
        </FormCard>
    );
};

export default DeleteRoom;
