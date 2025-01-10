import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import {updateGroupHeadman} from "../../../../../api/schedule/group.ts";
import {ApiCallError} from "../../../../../api/errors.ts";
import {
    ErrorMessage,
    FormCard,
    FormInput,
    FormInputGroup,
    FormLabel, SubmitButton
} from "../../../../Auth/Client/Forms/formikFormStyled.ts";
import {Group} from "../../../../../models/group/Group.ts";
import GroupSearch from "../../../Group/GroupSearch.tsx";

const UpdateGroupHeadmanValidationSchema = Yup.object().shape({
    group_uuid: Yup.string().required("Група обов'язкова"),
    headman_email: Yup.string().email('Невірний формат email').required("Еmail старости обов'язковий"),
});

const UpdateGroupHeadman = () => {
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const key = 'updatable';

    const formik = useFormik({
        initialValues: {
            group_uuid: '',
            headman_email: '',
        },
        validationSchema: UpdateGroupHeadmanValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            messageApi.loading({ key: key, content: 'Завантаження...' });
            try {
                const response = await updateGroupHeadman(
                    values.group_uuid,
                    {headman_email: values.headman_email}
                );
                navigate("/admin/manage/group", { state:
                        {
                            successMessage: `Дані успішно оновлено`,
                            groupInfo: response.data,
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

    const handleGroupSelect = (group: Group | null) => {
        setSelectedGroup(group);
        formik.setFieldValue('group_uuid', group ? group.uuid : '');
    };

    return (
        <FormCard onSubmit={formik.handleSubmit}>
            {contextHolder}

            {/* Group Selection */}
            <FormInputGroup>
                <FormLabel htmlFor="group_uuid">Група</FormLabel>
                <GroupSearch
                    onGroupSelect={handleGroupSelect}
                    onGroupListFetched={()=>{}}
                    selectedGroup={selectedGroup}
                />
                {formik.touched.group_uuid && formik.errors.group_uuid && (
                    <ErrorMessage>{formik.errors.group_uuid}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* Headman Email */}
            <FormInputGroup>
                <FormLabel htmlFor="headman_email">Email нового/ої старости</FormLabel>
                <FormInput
                    id="headman_email"
                    type="email"
                    {...formik.getFieldProps('headman_email')}
                />
                {formik.touched.headman_email && formik.errors.headman_email && (
                    <ErrorMessage>{formik.errors.headman_email}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* Submit Button */}
            <SubmitButton type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Завантаження...' : 'Змінити старосту'}
            </SubmitButton>
        </FormCard>
    );
};

export default UpdateGroupHeadman;
