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
import {updateRoomDescription} from "../../../../../api/schedule/room.ts";

const UpdateRoomDescriptionValidationSchema = Yup.object().shape({
    room_uuid: Yup.string().required("Room is required"),
    description: Yup.string().required("New room description is required"),
});

const UpdateRoomDescription = () => {
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const key = 'updatable';

    const formik = useFormik({
        initialValues: {
            room_uuid: '',
            description: selectedRoom?.description || '',
        },
        validationSchema: UpdateRoomDescriptionValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            messageApi.loading({ key: key, content: 'Updating room description...' });
            try {
                const response = await updateRoomDescription(
                    values.room_uuid,
                    {description: values.description},
                );
                navigate("/admin/manage/room", { state: { updateRoomDescriptionMessage: `Room description updated successfully (${response.data.number})` } });
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
        formik.setFieldValue('description', room ? room.description : '');

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

            {/* Room Description */}
            <FormInputGroup>
                <FormLabel htmlFor="description">New Room Description</FormLabel>
                <FormInput
                    id="description"
                    type="text"
                    {...formik.getFieldProps('description')}
                />
                {formik.touched.description && formik.errors.description && (
                    <ErrorMessage>{formik.errors.description}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* Submit Button */}
            <SubmitButton type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Updating Room Description...' : 'Update Room Description'}
            </SubmitButton>
        </FormCard>
    );
};

export default UpdateRoomDescription;
