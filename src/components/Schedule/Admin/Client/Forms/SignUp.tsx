import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { message } from "antd";
import {ClientRole} from "../../../../../models/enums/ClientRole.ts";
import {signUp} from "../../../../../api/client/auth.ts";
import {ApiCallError} from "../../../../../api/errors.ts";
import {FormTitle} from "../../../Lesson/Forms/formStyled.ts";
import {
    ErrorMessage, FormCard,
    FormInput,
    FormInputGroup,
    FormLabel,
    SelectInput,
    SubmitButton
} from "../../../../Auth/Client/Forms/formikFormStyled.ts";

const SignUpSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    middle_name: Yup.string().required("Middle name is required"),
    role: Yup.string()
        .oneOf(Object.values(ClientRole), 'Invalid role')
        .required('Role is required'),
    email: Yup.string()
        .email('Invalid email format')
        .matches(/^.*@gmail\.com$/g, 'Invalid email domain, use @gmail.com')
        .required('Email is required'),
    password: Yup.string()
        .min(8, "Password is too short - should be 8 chars minimum")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!#%^:;.,`~'"*?&+=\-_()]{8,}$/g,
            "Password must contain both uppercase and lowercase letters, at least one digit, and can contain only these symbols !@#$%^:;.,&*?`~\\'\"+=-_")
        .required('Password is required'),
    verify_password: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Verify password must match password')
        .required('Please confirm password'),
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
            messageApi.loading({ key: key, content: 'Loading...' });
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
                    state: { signUpMessage: response.data.status },
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

    return (
        <FormCard onSubmit={formik.handleSubmit}>
            {contextHolder}
                <FormTitle>Create a new account</FormTitle>
                    {/* First Name */}
                    <FormInputGroup>
                        <FormLabel htmlFor="first_name">First Name</FormLabel>
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
                        <FormLabel htmlFor="last_name">Last Name</FormLabel>
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
                        <FormLabel htmlFor="middle_name">Middle Name</FormLabel>
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
                        <FormLabel htmlFor="role">Role</FormLabel>
                        <SelectInput
                            id="role"
                            {...formik.getFieldProps('role')}
                        >
                            <option value={ClientRole.ADMIN}>Admin</option>
                            <option value={ClientRole.MANAGER}>Manager</option>
                            <option value={ClientRole.HEADMAN}>Headman</option>
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
                        <FormLabel htmlFor="password">Password</FormLabel>
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
                        <FormLabel htmlFor="verify_password">Confirm Password</FormLabel>
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
                        {formik.isSubmitting ? 'Signing up...' : 'Sign Up'}
                    </SubmitButton>
        </FormCard>
    );
};

export default SignUp;
