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
import {createFaculty} from "../../../../../api/schedule/faculty.ts";

const CreateFacultyValidationSchema = Yup.object().shape({
    name: Yup.string().required("Назва факультету обов'язкова"),
    code_name: Yup.string().required("Абривіатура факультету обов'язкова"),
});

const CreateFaculty = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const key = 'updatable';

    const formik = useFormik({
        initialValues: {
            name: '',
            code_name: '',
        },
        validationSchema: CreateFacultyValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            messageApi.loading({ key: key, content: 'Завантаження...' });
            try {
                const response = await createFaculty({
                    name: values.name,
                    code_name: values.code_name,
                });
                navigate("/admin/manage/faculty", { state:
                        {
                            successMessage: `Факультет створений успішно`,
                            facultyInfo: response.data,
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
            {/* Faculty Name */}
            <FormInputGroup>
                <FormLabel htmlFor="name">Назва факультету</FormLabel>
                <FormInput
                    id="name"
                    type="text"
                    {...formik.getFieldProps('name')}
                />
                {formik.touched.name && formik.errors.name && (
                    <ErrorMessage>{formik.errors.name}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* Faculty Code Name */}
            <FormInputGroup>
                <FormLabel htmlFor="code_name">Абривіатура факультету</FormLabel>
                <FormInput
                    id="code_name"
                    type="text"
                    {...formik.getFieldProps('code_name')}
                />
                {formik.touched.code_name && formik.errors.code_name && (
                    <ErrorMessage>{formik.errors.code_name}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* Submit Button */}
            <SubmitButton type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Завантаження...' : 'Створити факультет'}
            </SubmitButton>
        </FormCard>
    );
};

export default CreateFaculty;
