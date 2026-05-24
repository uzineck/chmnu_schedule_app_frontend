import React, { useState } from "react";
import type { MessageInstance } from "antd/es/message/interface";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { FaChevronDown, FaTrashAlt } from "react-icons/fa";
import { Teacher } from "../../../../models/teacher/Teacher.ts";
import {
    deactivateTeacher,
    updateTeacherName,
    updateTeacherRank,
} from "../../../../api/schedule/teacher.ts";
import { ApiCallError } from "../../../../api/errors.ts";
import { rankOptionsUa, TeacherRanks } from "../../../../models/enums/TeacherRanks.ts";
import { useConfirm } from "../../../Forms/useConfirm.ts";
import FormField from "../../../Forms/FormField.tsx";
import FormActions from "../../../Forms/FormActions.tsx";
import { FormFieldSelect } from "../../../Forms/formStyled.ts";
import { media } from "../../../../styles/media.ts";

const Row = styled.div<{ $open?: boolean }>`
    border: none;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.colors.surface};
    box-shadow:
        inset 0 0 0 1px ${({ theme, $open }) => ($open ? theme.colors.primary : theme.colors.border)},
        0 1px 4px ${({ theme }) => theme.colors.shadow};
    overflow: hidden;
    transition: box-shadow 0.15s ease;
`;

const RowHeader = styled.button`
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 12px 14px;
    background: none;
    border: none;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.textPrimary};
    text-align: left;
    transition: background-color 0.15s ease;

    &:hover { background-color: ${({ theme }) => theme.colors.surfaceMuted}; }
    &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.primary}; outline-offset: -2px; }
`;

const RowMain = styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const RowName = styled.span`
    font-weight: 600;
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.textPrimary};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const RowRank = styled.span`
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.textSubtle};
`;

const RowActions = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.colors.textMuted};
`;

const Chevron = styled(FaChevronDown)<{ $open?: boolean }>`
    transition: transform 0.2s ease;
    transform: rotate(${({ $open }) => ($open ? 180 : 0)}deg);
`;

const DeleteIconButton = styled.button`
    background: none;
    border: none;
    padding: 6px;
    border-radius: 6px;
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: background-color 0.15s ease, color 0.15s ease;

    &:hover { background-color: ${({ theme }) => theme.colors.surfaceMutedHover}; color: ${({ theme }) => theme.colors.error}; }
    &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.error}; outline-offset: -2px; }
`;

const EditPanel = styled.div`
    padding: 14px;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.surfaceSubtle};
    display: flex;
    flex-direction: column;
    gap: 12px;
    ${media.up('tablet')} { padding: 18px; gap: 14px; }
`;

const EditSchema = Yup.object().shape({
    last_name: Yup.string().required("Прізвище обов'язкове"),
    first_name: Yup.string().required("Ім'я обов'язкове"),
    middle_name: Yup.string().required("Ім'я по-батькові обов'язкове"),
    rank: Yup.string()
        .oneOf(Object.values(TeacherRanks), "Невірне звання")
        .required("Звання обов'язкове"),
});

const teacherFullName = (t: Teacher) =>
    `${t.last_name} ${t.first_name} ${t.middle_name}`.trim();

const rankLabel = (rank: TeacherRanks): string =>
    rankOptionsUa.find((o) => o.value === rank)?.label ?? rank;

interface TeacherRowProps {
    teacher: Teacher;
    messageApi: MessageInstance;
    onUpdated: (teacher: Teacher) => void;
    onDeleted: (uuid: string) => void;
}

const TeacherRow: React.FC<TeacherRowProps> = ({ teacher, messageApi, onUpdated, onDeleted }) => {
    const [open, setOpen] = useState(false);
    const confirm = useConfirm();

    const formik = useFormik<{
        last_name: string;
        first_name: string;
        middle_name: string;
        rank: TeacherRanks;
    }>({
        initialValues: {
            last_name: teacher.last_name,
            first_name: teacher.first_name,
            middle_name: teacher.middle_name,
            rank: teacher.rank,
        },
        enableReinitialize: true,
        validationSchema: EditSchema,
        onSubmit: async (values, { setSubmitting }) => {
            const nameChanged =
                values.last_name !== teacher.last_name ||
                values.first_name !== teacher.first_name ||
                values.middle_name !== teacher.middle_name;
            const rankChanged = values.rank !== teacher.rank;
            if (!nameChanged && !rankChanged) {
                setOpen(false);
                setSubmitting(false);
                return;
            }
            messageApi.loading({ key: `edit-teacher-${teacher.uuid}`, content: "Збереження..." });
            try {
                const calls: Promise<{ data: Teacher }>[] = [];
                if (nameChanged) {
                    calls.push(updateTeacherName(teacher.uuid, {
                        first_name: values.first_name,
                        last_name: values.last_name,
                        middle_name: values.middle_name,
                    }));
                }
                if (rankChanged) {
                    calls.push(updateTeacherRank(teacher.uuid, { rank: values.rank }));
                }
                const results = await Promise.all(calls);
                const latest = results[results.length - 1].data;
                messageApi.success({ key: `edit-teacher-${teacher.uuid}`, content: "Збережено", duration: 2 });
                onUpdated(latest);
                setOpen(false);
            } catch (error) {
                const text = error instanceof ApiCallError ? error.message : "Виникла невідома помилка";
                messageApi.error({ key: `edit-teacher-${teacher.uuid}`, content: text, duration: 3 });
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleHeaderClick = () => {
        if (open) formik.resetForm();
        setOpen((prev) => !prev);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        confirm(
            {
                title: "Деактивувати викладача?",
                content: `Викладача «${teacherFullName(teacher)}» буде деактивовано. Цю дію можна скасувати лише вручну.`,
                okText: "Деактивувати",
                danger: true,
            },
            async () => {
                messageApi.loading({ key: `deactivate-teacher-${teacher.uuid}`, content: "Деактивація..." });
                try {
                    await deactivateTeacher(teacher.uuid);
                    messageApi.success({ key: `deactivate-teacher-${teacher.uuid}`, content: "Деактивовано", duration: 2 });
                    onDeleted(teacher.uuid);
                } catch (error) {
                    const text = error instanceof ApiCallError ? error.message : "Виникла невідома помилка";
                    messageApi.error({ key: `deactivate-teacher-${teacher.uuid}`, content: text, duration: 3 });
                }
            },
        );
    };

    return (
        <Row $open={open}>
            <RowHeader
                type="button"
                onClick={handleHeaderClick}
                aria-expanded={open}
                aria-controls={`teacher-edit-${teacher.uuid}`}
            >
                <RowMain>
                    <RowName>{teacherFullName(teacher)}</RowName>
                    <RowRank>{rankLabel(teacher.rank)}</RowRank>
                </RowMain>
                <RowActions onClick={(e) => e.stopPropagation()}>
                    <DeleteIconButton type="button" aria-label={`Деактивувати викладача ${teacherFullName(teacher)}`} onClick={handleDelete}>
                        <FaTrashAlt />
                    </DeleteIconButton>
                    <Chevron $open={open} aria-hidden />
                </RowActions>
            </RowHeader>

            {open && (
                <EditPanel id={`teacher-edit-${teacher.uuid}`}>
                    <form onSubmit={formik.handleSubmit} noValidate>
                        <FormField
                            {...formik.getFieldProps('last_name')}
                            label="Прізвище"
                            type="text"
                            autoComplete="family-name"
                            touched={formik.touched.last_name}
                            error={formik.errors.last_name}
                        />
                        <div style={{ height: 12 }} />
                        <FormField
                            {...formik.getFieldProps('first_name')}
                            label="Ім'я"
                            type="text"
                            autoComplete="given-name"
                            touched={formik.touched.first_name}
                            error={formik.errors.first_name}
                        />
                        <div style={{ height: 12 }} />
                        <FormField
                            {...formik.getFieldProps('middle_name')}
                            label="По-батькові"
                            type="text"
                            autoComplete="additional-name"
                            touched={formik.touched.middle_name}
                            error={formik.errors.middle_name}
                        />
                        <div style={{ height: 12 }} />
                        <FormField
                            name="rank"
                            label="Звання"
                            touched={formik.touched.rank}
                            error={formik.errors.rank}
                        >
                            <FormFieldSelect
                                id={`rank-${teacher.uuid}`}
                                $hasError={Boolean(formik.touched.rank && formik.errors.rank)}
                                {...formik.getFieldProps('rank')}
                            >
                                {rankOptionsUa.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </FormFieldSelect>
                        </FormField>
                        <div style={{ height: 14 }} />
                        <FormActions
                            submitLabel="Зберегти"
                            submitLoadingLabel="Збереження..."
                            cancelLabel="Скасувати"
                            onCancel={() => {
                                formik.resetForm();
                                setOpen(false);
                            }}
                            isSubmitting={formik.isSubmitting}
                        />
                    </form>
                </EditPanel>
            )}
        </Row>
    );
};

export default TeacherRow;
