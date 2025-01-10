import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { message } from "antd";
import {ApiCallError} from "../../../../../api/errors.ts";
import {
    ErrorMessage, FormCard,
    FormInput,
    FormInputGroup,
    FormLabel,
    SubmitButton
} from "../../../../Auth/Client/Forms/formikFormStyled.ts";
import {getClientInfoAdmin} from "../../../../../api/client/client.ts";

const GetClientInfoValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Невірний формат email')
        .matches(/^[a-zA-Z0-9_.+-]+@gmail\.com$/g, 'Невірний домен email, використовуйте @gmail.com')
        .required('Email обов\'язковий'),
});

const GetClientInfo = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const key = 'updatable';

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: GetClientInfoValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            messageApi.loading({ key: key, content: 'Завантаження...' });
            try {
                const response = await getClientInfoAdmin(values.email);
                navigate("/admin/manage/client", {
                    state: {
                        successMessage: `Дані успішно отримано`,
                        clientInfo: response.data
                    },
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

            {/* Email */}
            <FormInputGroup>
                <FormLabel htmlFor="email">Email клієнта</FormLabel>
                <FormInput
                    id="email"
                    type="email"
                    {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email && (
                    <ErrorMessage>{formik.errors.email}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* Submit Button */}
            <SubmitButton type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Завантаження...' : 'Отримати дані про клієнта'}
            </SubmitButton>
        </FormCard>
    );
};

export default GetClientInfo;
