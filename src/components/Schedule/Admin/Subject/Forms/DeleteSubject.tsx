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
import {Subject} from "../../../../../models/subject/Subject.ts";
import {deleteSubject} from "../../../../../api/schedule/subject.ts";
import SubjectSearch from "../../../Subject/SubjectSearch.tsx";

const DeleteSubjectValidationSchema = Yup.object().shape({
    subject_uuid: Yup.string().required("Subject is required"),
});

const DeleteSubject = () => {
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const key = 'updatable';

    const formik = useFormik({
        initialValues: {
            subject_uuid: '',
        },
        validationSchema: DeleteSubjectValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            messageApi.loading({ key: key, content: 'Deleting subject...' });
            try {
                const response = await deleteSubject(values.subject_uuid);
                navigate("/admin/manage/subject", { state: { deleteSubjectMessage: response.data.status } });
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

    const handleSubjectSelect = (subject: Subject | null) => {
        setSelectedSubject(subject);
        formik.setFieldValue('subject_uuid', subject ? subject.uuid : '');
    };

    return (
        <FormCard onSubmit={formik.handleSubmit}>
            {contextHolder}

            {/* Subject Selection */}
            <FormInputGroup>
                <FormLabel htmlFor="subject_uuid">Subject</FormLabel>
                <SubjectSearch
                    onSubjectSelect={handleSubjectSelect}
                    onSubjectListFetched={()=>{}}
                    selectedSubject={selectedSubject}
                />
                {formik.touched.subject_uuid && formik.errors.subject_uuid && (
                    <ErrorMessage>{formik.errors.subject_uuid}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* Submit Button */}
            <SubmitButton type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Deleting Subject...' : 'Delete Subject'}
            </SubmitButton>
        </FormCard>
    );
};

export default DeleteSubject;
