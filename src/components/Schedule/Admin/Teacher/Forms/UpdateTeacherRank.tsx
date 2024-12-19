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
import {TeacherRanks} from "../../../../../models/enums/TeacherRanks.ts";

const UpdateTeacherRankValidationSchema = Yup.object().shape({
    teacher_uuid: Yup.string().required("Teacher is required"),
    rank: Yup.string()
        .oneOf(Object.values(TeacherRanks), 'Invalid rank')
        .required('Rank is required'),
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
            messageApi.loading({ key: key, content: 'Updating teacher rank...' });
            try {
                const response = await updateTeacherRank(
                    values.teacher_uuid,
                    {
                        rank: values.rank,
                    }
                );
                navigate("/admin/manage/teacher", { state:
                        {
                            successMessage: `Teacher Rank updated successfully`,
                            teacherInfo: response.data,
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
                <FormLabel htmlFor="teacher_uuid">Teacher</FormLabel>
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
                {formik.isSubmitting ? 'Updating Teacher Rank...' : 'Update Teacher Rank'}
            </SubmitButton>
        </FormCard>
    );
};

export default UpdateTeacherRank;
