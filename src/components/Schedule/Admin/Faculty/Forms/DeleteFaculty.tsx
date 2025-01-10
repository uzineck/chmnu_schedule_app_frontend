import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import {ApiCallError} from "../../../../../api/errors.ts";
import {
    ErrorMessage,
    FormCard,
    FormInputGroup,
    FormLabel, SubmitButton
} from "../../../../Auth/Client/Forms/formikFormStyled.ts";
import FacultySearch from "../../../Faculty/FacultySearch.tsx";
import {Faculty} from "../../../../../models/faculty/Faculty.ts";
import {deleteFaculty} from "../../../../../api/schedule/faculty.ts";

const DeleteFacultyValidationSchema = Yup.object().shape({
    faculty_uuid: Yup.string().required("Аудиторія обов'язкова"),
});

const DeleteFaculty = () => {
    const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const key = 'updatable';

    const formik = useFormik({
        initialValues: {
            faculty_uuid: '',
        },
        validationSchema: DeleteFacultyValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            messageApi.loading({ key: key, content: 'Завантаження...' });
            try {
                await deleteFaculty(values.faculty_uuid);
                navigate("/admin/manage/faculty", { state:
                        {
                            successMessage: "Дані успішно видалено"
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
    };

    return (
        <FormCard onSubmit={formik.handleSubmit}>
            {contextHolder}

            {/* faculty Selection */}
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

            {/* Submit Button */}
            <SubmitButton type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Завантаження...' : 'Видалити факультет'}
            </SubmitButton>
        </FormCard>
    );
};

export default DeleteFaculty;
