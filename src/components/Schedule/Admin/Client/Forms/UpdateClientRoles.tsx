import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { message } from "antd";
import {ClientRole, clientRoleOptionsUa} from "../../../../../models/enums/ClientRole.ts";
import {ApiCallError} from "../../../../../api/errors.ts";
import {
    ErrorMessage, FormCard,
    FormInput,
    FormInputGroup,
    FormLabel,
    SelectInput,
    SubmitButton
} from "../../../../Auth/Client/Forms/formikFormStyled.ts";
import {updateClietRoles} from "../../../../../api/client/admin.ts";

const SignUpSchema = Yup.object().shape({
    email: Yup.string()
        .email('Невірний формат email')
        .matches(/^[a-zA-Z0-9_.+-]+@gmail\.com$/g, 'Невірний домен email, використовуйте @gmail.com')
        .required('Email обов\'язковий'),
    roles: Yup.array()
        .of(Yup.string().oneOf(Object.values(ClientRole), 'Невірно вибрана роль'))
        .min(1, 'Має бути обрана принаймні одна роль')
        .required('Роль обов\'язкова'),
});

const SignUp = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const key = 'updatable';

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            roles: [],
        },
        validationSchema: SignUpSchema,
        onSubmit: async (values, { setSubmitting }) => {
            messageApi.loading({ key: key, content: 'Завантаження...' });
            try {
                const response = await updateClietRoles(
                    values.email,
                    {roles: values.roles,}
            );
                navigate("/admin/manage/client", {
                    state: {
                        successMessage: `Дані успішно опрацьовано`,
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
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormInput
                    id="email"
                    type="email"
                    {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email && (
                    <ErrorMessage>{formik.errors.email}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* Roles */}
            <FormInputGroup>
                <FormLabel htmlFor="roles">Ролі</FormLabel>
                <SelectInput
                    id="roles"
                    multiple
                    value={formik.values.roles}
                    onChange={(e) =>
                        formik.setFieldValue(
                            "roles",
                            Array.from(e.target.selectedOptions, (option) => option.value)
                        )
                    }
                >
                    {clientRoleOptionsUa.map(({ value, label }) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </SelectInput>
                {formik.touched.roles && formik.errors.roles && (
                    <ErrorMessage>{formik.errors.roles}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* Submit Button */}
            <SubmitButton type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Завантаження...' : 'Оновити ролі'}
            </SubmitButton>
        </FormCard>
    );
};

export default SignUp;
