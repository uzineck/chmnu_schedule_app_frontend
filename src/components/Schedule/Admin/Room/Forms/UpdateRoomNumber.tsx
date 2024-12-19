import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import {ApiCallError} from "../../../../../api/errors.ts";
import {
    ErrorMessage,
    FormCard, FormInput,
    FormInputGroup,
    FormLabel, SubmitButton
} from "../../../../Auth/Client/Forms/formikFormStyled.ts";
import RoomSearch from "../../../Room/RoomSearch.tsx";
import {Room} from "../../../../../models/room/Room.ts";
import {updateRoomNumber} from "../../../../../api/schedule/room.ts";

const UpdateRoomNumberValidationSchema = Yup.object().shape({
    room_uuid: Yup.string().required("Room is required"),
    number: Yup.string().required("New room number is required"),
});

const UpdateRoomNumber = () => {
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const key = 'updatable';

    const formik = useFormik({
        initialValues: {
            room_uuid: '',
            number: selectedRoom?.number || '',
        },
        validationSchema: UpdateRoomNumberValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            messageApi.loading({ key: key, content: 'Updating room number...' });
            try {
                const response = await updateRoomNumber(
                    values.room_uuid,
                    {number: values.number},
                );
                navigate("/admin/manage/room", { state:
                        {
                            successMessage: `Room number updated successfully`,
                            roomInfo: response.data,
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
        formik.setFieldValue('number', room ? room.number : '');
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

            {/* Room Number */}
            <FormInputGroup>
                <FormLabel htmlFor="number">New Room Number</FormLabel>
                <FormInput
                    id="number"
                    type="text"
                    {...formik.getFieldProps('number')}
                />
                {formik.touched.number && formik.errors.number && (
                    <ErrorMessage>{formik.errors.number}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* Submit Button */}
            <SubmitButton type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Updating Room Number...' : 'Update Room Number'}
            </SubmitButton>
        </FormCard>
    );
};

export default UpdateRoomNumber;
