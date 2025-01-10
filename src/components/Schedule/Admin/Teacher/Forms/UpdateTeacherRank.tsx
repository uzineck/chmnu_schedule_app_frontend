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
    FormLabel, SelectInput, SubmitButton
} from "../../../../Auth/Client/Forms/formikFormStyled.ts";
import {Teacher} from "../../../../../models/teacher/Teacher.ts";
import {updateTeacherRank} from "../../../../../api/schedule/teacher.ts";
import TeacherSearch from "../../../Teacher/TeacherSearch.tsx";
import {rankOptionsUa, TeacherRanks} from "../../../../../models/enums/TeacherRanks.ts";

const UpdateTeacherRankValidationSchema = Yup.object().shape({
    teacher_uuid: Yup.string().required("Викладач обов'язковий"),
    rank: Yup.string()
        .oneOf(Object.values(TeacherRanks), 'Невірне звання')
        .required('Звання обов\'язкове'),
});

const UpdateTeacherRank = () => {
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const key = 'updatable';

    const formik = useFormik({
        initialValues: {
            teacher_uuid: '',
            rank: selectedTeacher?.rank || TeacherRanks.LECTURER,
        },
        validationSchema: UpdateTeacherRankValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            messageApi.loading({ key: key, content: 'Завантаження...' });
            try {
                const response = await updateTeacherRank(
                    values.teacher_uuid,
                    {
                        rank: values.rank,
                    }
                );
                navigate("/admin/manage/teacher", { state:
                        {
                            successMessage: `Дані успішно оновлено`,
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

    const handleTeacherSelect = (teacher: Teacher | null) => {
        setSelectedTeacher(teacher);
        formik.setFieldValue('teacher_uuid', teacher ? teacher.uuid : '');
        formik.setFieldValue('rank', teacher? teacher.rank : TeacherRanks.LECTURER);
    };

    return (
        <FormCard onSubmit={formik.handleSubmit}>
            {contextHolder}

            {/* Teacher Selection */}
            <FormInputGroup>
                <FormLabel htmlFor="teacher_uuid">Викладач</FormLabel>
                <TeacherSearch
                    onTeacherSelect={handleTeacherSelect}
                    onTeacherListFetched={()=>{}}
                    selectedTeacher={selectedTeacher}
                />
                {formik.touched.teacher_uuid && formik.errors.teacher_uuid && (
                    <ErrorMessage>{formik.errors.teacher_uuid}</ErrorMessage>
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
                {formik.isSubmitting ? 'Завантаження...' : 'Змінити звання викладача'}
            </SubmitButton>
        </FormCard>
    );
};

export default UpdateTeacherRank;
