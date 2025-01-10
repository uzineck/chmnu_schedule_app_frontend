import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { message } from "antd";
import {ClientRole} from "../../../../../models/enums/ClientRole.ts";
import {signUp} from "../../../../../api/client/auth.ts";
import {ApiCallError} from "../../../../../api/errors.ts";
import {
    ErrorMessage, FormCard,
    FormInput,
    FormInputGroup,
    FormLabel,
    SelectInput,
    SubmitButton
} from "../../../../Auth/Client/Forms/formikFormStyled.ts";

const SignUpSchema = Yup.object().shape({
    first_name: Yup.string().required('Ім\'я обов\'зкове'),
    last_name: Yup.string().required('Прізвище обов\'язкове'),
    middle_name: Yup.string().required('Ім\'я по-батькові обов\'язкове'),
    role: Yup.string()
        .oneOf(Object.values(ClientRole), 'Невірно вибрана роль')
        .required('Роль обов\'язкова'),
    email: Yup.string()
        .email('Невірний формат email')
        .matches(/^[a-zA-Z0-9_.+-]+@gmail\.com$/g, 'Невірний домен email, використовуйте @gmail.com')
        .required('Email обов\'язковий'),
    password: Yup.string()
        .min(8, 'Пароль має містити не меньше 8 символів')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!#%^:;.,`~'"*?&+=\-_()]{8,}$/g,
            "Пароль повинен містити як великі, так і малі літери, принаймні одну цифру, і може містити тільки такі" +
            "символи !@#$%^:;.,&*?`~\\'\"+=-_")
        .required('Пароль обов\'язковий'),
    verify_password: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Підтвердження паролю має співпадати з паролем')
        .required('Підтвердження паролю обов\'язкове'),
});

const SignUp = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const key = 'updatable';

    const formik = useFormik({
        initialValues: {
            first_name: '',
            last_name: '',
            middle_name: '',
            email: '',
            password: '',
            verify_password: '',
            role: ClientRole.HEADMAN, // Default role
        },
        validationSchema: SignUpSchema,
        onSubmit: async (values, { setSubmitting }) => {
            messageApi.loading({ key: key, content: 'Завантаження...' });
            try {
                const response = await signUp({
                    first_name: values.first_name,
                    last_name: values.last_name,
                    middle_name: values.middle_name,
                    role: values.role,
                    email: values.email,
                    password: values.password,
                    verify_password: values.verify_password,
                });
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
                    {/* First Name */}
                    <FormInputGroup>
                        <FormLabel htmlFor="first_name">Ім'я</FormLabel>
                        <FormInput
                            id="first_name"
                            type="text"
                            {...formik.getFieldProps('first_name')}
                        />
                        {formik.touched.first_name && formik.errors.first_name && (
                            <ErrorMessage>{formik.errors.first_name}</ErrorMessage>
                        )}
                    </FormInputGroup>

                    {/* Last Name */}
                    <FormInputGroup>
                        <FormLabel htmlFor="last_name">Прізвище</FormLabel>
                        <FormInput
                            id="last_name"
                            type="text"
                            {...formik.getFieldProps('last_name')}
                        />
                        {formik.touched.last_name && formik.errors.last_name && (
                            <ErrorMessage>{formik.errors.last_name}</ErrorMessage>
                        )}
                    </FormInputGroup>

                    {/* Middle Name */}
                    <FormInputGroup>
                        <FormLabel htmlFor="middle_name">Ім'я по-батькові</FormLabel>
                        <FormInput
                            id="middle_name"
                            type="text"
                            {...formik.getFieldProps('middle_name')}
                        />
                        {formik.touched.middle_name && formik.errors.middle_name && (
                            <ErrorMessage>{formik.errors.middle_name}</ErrorMessage>
                        )}
                    </FormInputGroup>

                    {/* Role */}
                    <FormInputGroup>
                        <FormLabel htmlFor="role">Роль</FormLabel>
                        <SelectInput
                            id="role"
                            {...formik.getFieldProps('role')}
                        >
                            <option value={ClientRole.ADMIN}>Адмін</option>
                            <option value={ClientRole.MANAGER}>Менеджер</option>
                            <option value={ClientRole.HEADMAN}>Староста</option>
                        </SelectInput>
                        {formik.touched.role && formik.errors.role && (
                            <ErrorMessage>{formik.errors.role}</ErrorMessage>
                        )}
                    </FormInputGroup>

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

                    {/* Password */}
                    <FormInputGroup>
                        <FormLabel htmlFor="password">Пароль</FormLabel>
                        <FormInput
                            id="password"
                            type="password"
                            {...formik.getFieldProps('password')}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <ErrorMessage>{formik.errors.password}</ErrorMessage>
                        )}
                    </FormInputGroup>

                    {/* Confirm Password */}
                    <FormInputGroup>
                        <FormLabel htmlFor="verify_password">Підтвердження паролю</FormLabel>
                        <FormInput
                            id="verify_password"
                            type="password"
                            {...formik.getFieldProps('verify_password')}
                        />
                        {formik.touched.verify_password && formik.errors.verify_password && (
                            <ErrorMessage>{formik.errors.verify_password}</ErrorMessage>
                        )}
                    </FormInputGroup>

                    {/* Submit Button */}
                    <SubmitButton type="submit" disabled={formik.isSubmitting}>
                        {formik.isSubmitting ? 'Завантаження...' : 'Зареєструвати'}
                    </SubmitButton>
        </FormCard>
    );
};

export default SignUp;
