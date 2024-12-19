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
import {Subject} from "../../../../../models/subject/Subject.ts";
import {updateSubject} from "../../../../../api/schedule/subject.ts";
import SubjectSearch from "../../../Subject/SubjectSearch.tsx";

const UpdateSubjectTitleValidationSchema = Yup.object().shape({
    subject_uuid: Yup.string().required("Subject is required"),
    title: Yup.string().required("New subject title is required"),
});

const UpdateSubjectTitle = () => {
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const key = 'updatable';

    const formik = useFormik({
        initialValues: {
            subject_uuid: '',
            title: selectedSubject?.title || '',
        },
        validationSchema: UpdateSubjectTitleValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            messageApi.loading({ key: key, content: 'Updating subject title...' });
            try {
                const response = await updateSubject(
                    values.subject_uuid,
                    {title: values.title},
                );
                navigate("/admin/manage/subject", { state:
                        {
                            successMessage: `Subject number updated successfully`,
                            subjectInfo: response.data,
                        }
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

    const handleSubjectSelect = (subject: Subject | null) => {
        setSelectedSubject(subject);
        formik.setFieldValue('subject_uuid', subject ? subject.uuid : '');
        formik.setFieldValue('title', subject ? subject.title : '');
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

            {/* Subject Title */}
            <FormInputGroup>
                <FormLabel htmlFor="title">Subject Title</FormLabel>
                <FormInput
                    id="title"
                    type="text"
                    {...formik.getFieldProps('title')}
                />
                {formik.touched.title && formik.errors.title && (
                    <ErrorMessage>{formik.errors.title}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* Submit Button */}
            <SubmitButton type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Updating Subject Title...' : 'Update Subject Number'}
            </SubmitButton>
        </FormCard>
    );
};

export default UpdateSubjectTitle;
