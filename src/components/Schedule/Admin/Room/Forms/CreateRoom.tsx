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
    number: Yup.string().required("Номер аудиторії обов'язковий"),
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
            messageApi.loading({ key: key, content: 'Завантаження...' });
            try {
                const response = await createRoom({
                    number: values.number,
                });
                navigate("/admin/manage/room", { state:
                        {
                            successMessage: `Аудиторія створена успішно`,
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

    return (
        <FormCard onSubmit={formik.handleSubmit}>
            {contextHolder}
            {/* Room Number */}
            <FormInputGroup>
                <FormLabel htmlFor="number">Номер аудиторії</FormLabel>
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
                {formik.isSubmitting ? 'Завантаження...' : 'Створити аудиторію'}
            </SubmitButton>
        </FormCard>
    );
};

export default CreateRoom;
