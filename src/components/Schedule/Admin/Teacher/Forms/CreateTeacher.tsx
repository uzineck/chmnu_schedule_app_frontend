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
    FormLabel, SelectInput, SubmitButton
} from "../../../../Auth/Client/Forms/formikFormStyled.ts";
import {createTeacher} from "../../../../../api/schedule/teacher.ts";
import {rankOptionsUa, TeacherRanks} from "../../../../../models/enums/TeacherRanks.ts";

const CreateTeacherValidationSchema = Yup.object().shape({
    first_name: Yup.string().required("Ім'я обов'язкове"),
    last_name: Yup.string().required("Прізвище обов'язкове"),
    middle_name: Yup.string().required("Ім'я по-батькові обов'язкове"),
    rank: Yup.string()
        .oneOf(Object.values(TeacherRanks), 'Невірне звання')
        .required("Звання обов'язкове"),
});

const CreateTeacher = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const key = 'updatable';

    const formik = useFormik({
        initialValues: {
            first_name: '',
            last_name: '',
            middle_name: '',
            rank: TeacherRanks.LECTURER,
        },
        validationSchema: CreateTeacherValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            messageApi.loading({ key: key, content: 'Завантаження...' });
            try {
                const response = await createTeacher({
                    first_name: values.first_name,
                    last_name: values.last_name,
                    middle_name: values.middle_name,
                    rank: values.rank,
                });
                navigate("/admin/manage/teacher", { state:
                        {
                            successMessage: `Викладач створений успішно`,
                            teacherInfo: response.data,
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
                <FormLabel htmlFor="middle_name">По-батькові</FormLabel>
                <FormInput
                    id="middle_name"
                    type="text"
                    {...formik.getFieldProps('middle_name')}
                />
                {formik.touched.middle_name && formik.errors.middle_name && (
                    <ErrorMessage>{formik.errors.middle_name}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* Rank */}
            <FormInputGroup>
                <FormLabel htmlFor="rank">Звання</FormLabel>
                <SelectInput
                    id="rank"
                    {...formik.getFieldProps('rank')}
                >
                    {rankOptionsUa.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </SelectInput>
                {formik.touched.rank && formik.errors.rank && (
                    <ErrorMessage>{formik.errors.rank}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* Submit Button */}
            <SubmitButton type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Завантаження...' : 'Створити викладача'}
            </SubmitButton>
        </FormCard>
    );
};

export default CreateTeacher;
