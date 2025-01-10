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
import FacultySearch from "../../../Faculty/FacultySearch.tsx";
import {Faculty} from "../../../../../models/faculty/Faculty.ts";
import {updateFacultyCodeName} from "../../../../../api/schedule/faculty.ts";

const UpdateFacultyCodeNameValidationSchema = Yup.object().shape({
    faculty_uuid: Yup.string().required("Факультет обов'язковий"),
    code_name: Yup.string().required("Абривіатура факультету обов'язкова"),
});

const UpdateFacultyName = () => {
    const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const key = 'updatable';

    const formik = useFormik({
        initialValues: {
            faculty_uuid: '',
            code_name: selectedFaculty?.code_name || '',
        },
        validationSchema: UpdateFacultyCodeNameValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            messageApi.loading({ key: key, content: 'Завантаження...' });
            try {
                const response = await updateFacultyCodeName(
                    values.faculty_uuid,
                    {code_name: values.code_name},
                );
                navigate("/admin/manage/faculty", { state:
                        {
                            successMessage: `Арбривіатура факультету змінено успішно`,
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

    const handleFacultySelect = (faculty: Faculty | null) => {
        setSelectedFaculty(faculty);
        formik.setFieldValue('faculty_uuid', faculty ? faculty.uuid : '');
        formik.setFieldValue('code_name', faculty ? faculty.code_name : '');

    };

    return (
        <FormCard onSubmit={formik.handleSubmit}>
            {contextHolder}

            {/* Faculty Selection */}
            <FormInputGroup>
                <FormLabel htmlFor="faculty_uuid">Факультет</FormLabel>
                <FacultySearch
                    onFacultySelect={handleFacultySelect}
                    onFacultyListFetched={()=>{}}
                    selectedFaculty={selectedFaculty}
                />
                {formik.touched.faculty_uuid && formik.errors.faculty_uuid && (
                    <ErrorMessage>{formik.errors.faculty_uuid}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* Faculty Code Name */}
            <FormInputGroup>
                <FormLabel htmlFor="code_name">Нова абривіатура факультету</FormLabel>
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
                {formik.isSubmitting ? 'Завантаження...' : 'Змінити абривіатуру факультету'}
            </SubmitButton>
        </FormCard>
    );
};

export default UpdateFacultyName;
