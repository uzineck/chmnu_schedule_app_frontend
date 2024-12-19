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
import {TeacherRanks} from "../../../../../models/enums/TeacherRanks.ts";

const CreateTeacherValidationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    middle_name: Yup.string().required("Middle name is required"),
    rank: Yup.string()
        .oneOf(Object.values(TeacherRanks), 'Invalid rank')
        .required('Rank is required'),
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
            messageApi.loading({ key: key, content: 'Creating teacher...' });
            try {
                const response = await createTeacher({
                    first_name: values.first_name,
                    last_name: values.last_name,
                    middle_name: values.middle_name,
                    rank: values.rank,
                });
                navigate("/admin/manage/teacher", { state: { createTeacherMessage: `Teacher created successfully (${response.data.last_name} ${response.data.first_name.charAt(0)} ${response.data.middle_name.charAt(0)})` } });
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

            {/* Rank */}
            <FormInputGroup>
                <FormLabel htmlFor="rank">Rank</FormLabel>
                <SelectInput
                    id="rank"
                    {...formik.getFieldProps('rank')}
                >
                    <option value={TeacherRanks.LECTURER}>LECTURER</option>
                    <option value={TeacherRanks.SENIOR_LECTURER}>SENIOR LECTURER</option>
                    <option value={TeacherRanks.ASSOCIATE_PROFESSOR}>ASSOCIATE PROFESSOR</option>
                    <option value={TeacherRanks.PROFESSOR}>PROFESSOR</option>
                    <option value={TeacherRanks.GRADUATE_STUDENT}>GRADUATE STUDENT</option>
                </SelectInput>
                {formik.touched.rank && formik.errors.rank && (
                    <ErrorMessage>{formik.errors.rank}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* Submit Button */}
            <SubmitButton type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Creating Teacher...' : 'Create Teacher'}
            </SubmitButton>
        </FormCard>
    );
};

export default CreateTeacher;
