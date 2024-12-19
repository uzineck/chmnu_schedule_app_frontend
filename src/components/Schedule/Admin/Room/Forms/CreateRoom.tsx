import { useFormik } from 'formik';
import * as Yup from 'yup';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import {ApiCallError} from "../../../../../api/errors.ts";
import {
    ErrorMessage,
    FormCard,
    FormInput,
    FormInputGroup,
    FormLabel, SubmitButton
} from "../../../../Auth/Client/Forms/formikFormStyled.ts";
import {createRoom} from "../../../../../api/schedule/room.ts";

const CreateRoomValidationSchema = Yup.object().shape({
    number: Yup.string().required("Room number is required"),
});

const CreateRoom = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const key = 'updatable';

    const formik = useFormik({
        initialValues: {
            number: '',
        },
        validationSchema: CreateRoomValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            messageApi.loading({ key: key, content: 'Creating room...' });
            try {
                const response = await createRoom({
                    number: values.number,
                });
                navigate("/admin/manage/room", { state: { createRoomMessage: `Room created successfully!(${response.data.number})` } });
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

    return (
        <FormCard onSubmit={formik.handleSubmit}>
            {contextHolder}
            {/* Room Number */}
            <FormInputGroup>
                <FormLabel htmlFor="number">Room Number</FormLabel>
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
                {formik.isSubmitting ? 'Creating Room...' : 'Create Room'}
            </SubmitButton>
        </FormCard>
    );
};

export default CreateRoom;
