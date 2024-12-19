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
import {createSubject} from "../../../../../api/schedule/subject.ts";

const CreateSubjectValidationSchema = Yup.object().shape({
    title: Yup.string().required("Subject title is required"),
});

const CreateSubject = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const key = 'updatable';

    const formik = useFormik({
        initialValues: {
            title: '',
        },
        validationSchema: CreateSubjectValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            messageApi.loading({ key: key, content: 'Creating subject...' });
            try {
                const response = await createSubject({
                    title: values.title,
                });
                navigate("/admin/manage/subject", { state: { createSubjectMessage: `Subject created successfully!(${response.data.title})` } });
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
                {formik.isSubmitting ? 'Creating Subject...' : 'Create Subject'}
            </SubmitButton>
        </FormCard>
    );
};

export default CreateSubject;
