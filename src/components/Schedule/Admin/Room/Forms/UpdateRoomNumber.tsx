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
    room_uuid: Yup.string().required("Аудиторія обов'язкова"),
    number: Yup.string().required("Новий номер аудиторії обов'зковий"),
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
            messageApi.loading({ key: key, content: 'Завантаження...' });
            try {
                const response = await updateRoomNumber(
                    values.room_uuid,
                    {number: values.number},
                );
                navigate("/admin/manage/room", { state:
                        {
                            successMessage: `Номер аудиторії змінено успішно`,
                            roomInfo: response.data,
                        }
                });
            } catch (error) {
                if (error instanceof ApiCallError) {
                    messageApi.error({ key: key, content: error.message, duration: 3 });
                } else {
                    messageApi.error({ key: key, content: "Виникла невідома помилка", duration: 3 });
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
                <FormLabel htmlFor="room_uuid">Аудиторія</FormLabel>
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
                <FormLabel htmlFor="number">Новий номер аудиторії</FormLabel>
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
                {formik.isSubmitting ? 'Завантаження...' : 'Змінити номер аудиторії'}
            </SubmitButton>
        </FormCard>
    );
};

export default UpdateRoomNumber;
