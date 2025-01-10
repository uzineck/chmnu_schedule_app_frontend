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
import {updateFacultyName} from "../../../../../api/schedule/faculty.ts";

const UpdateFacultyNameValidationSchema = Yup.object().shape({
    faculty_uuid: Yup.string().required("Факультет обов'язковий"),
    name: Yup.string().required("Назва факультету обов'язкова"),
});

const UpdateFacultyName = () => {
    const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const key = 'updatable';

    const formik = useFormik({
        initialValues: {
            faculty_uuid: '',
            name: selectedFaculty?.name || '',
        },
        validationSchema: UpdateFacultyNameValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            messageApi.loading({ key: key, content: 'Завантаження...' });
            try {
                const response = await updateFacultyName(
                    values.faculty_uuid,
                    {name: values.name},
                );
                navigate("/admin/manage/faculty", { state:
                        {
                            successMessage: `Назва факультету змінено успішно`,
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
        formik.setFieldValue('name', faculty ? faculty.name : '');

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

            {/* Faculty Name */}
            <FormInputGroup>
                <FormLabel htmlFor="name">Нова назва факультету</FormLabel>
                <FormInput
                    id="name"
                    type="text"
                    {...formik.getFieldProps('name')}
                />
                {formik.touched.name && formik.errors.name && (
                    <ErrorMessage>{formik.errors.name}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* Submit Button */}
            <SubmitButton type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Завантаження...' : 'Змінити назву факультету'}
            </SubmitButton>
        </FormCard>
    );
};

export default UpdateFacultyName;
