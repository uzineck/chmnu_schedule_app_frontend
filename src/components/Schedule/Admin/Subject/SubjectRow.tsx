import React, { useState } from "react";
import type { MessageInstance } from "antd/es/message/interface";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { FaChevronDown, FaTrashAlt } from "react-icons/fa";
import { Subject } from "../../../../models/subject/Subject.ts";
import { deleteSubject, updateSubject } from "../../../../api/schedule/subject.ts";
import { ApiCallError } from "../../../../api/errors.ts";
import { useConfirm } from "../../../Forms/useConfirm.ts";
import FormField from "../../../Forms/FormField.tsx";
import FormActions from "../../../Forms/FormActions.tsx";
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

const RowTitle = styled.span`
    font-weight: 600;
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.textPrimary};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const RowSlug = styled.span`
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.textMuted};
    font-family: monospace;
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
    title: Yup.string().required("Назва обов'язкова"),
});

interface SubjectRowProps {
    subject: Subject;
    messageApi: MessageInstance;
    onUpdated: (subject: Subject) => void;
    onDeleted: (uuid: string) => void;
}

const SubjectRow: React.FC<SubjectRowProps> = ({ subject, messageApi, onUpdated, onDeleted }) => {
    const [open, setOpen] = useState(false);
    const confirm = useConfirm();

    const formik = useFormik({
        initialValues: { title: subject.title },
        enableReinitialize: true,
        validationSchema: EditSchema,
        onSubmit: async (values, { setSubmitting }) => {
            if (values.title === subject.title) {
                setOpen(false);
                setSubmitting(false);
                return;
            }
            messageApi.loading({ key: `edit-subject-${subject.uuid}`, content: "Збереження..." });
            try {
                const response = await updateSubject(subject.uuid, { title: values.title });
                messageApi.success({ key: `edit-subject-${subject.uuid}`, content: "Збережено", duration: 2 });
                onUpdated(response.data);
                setOpen(false);
            } catch (error) {
                const text = error instanceof ApiCallError ? error.message : "Виникла невідома помилка";
                messageApi.error({ key: `edit-subject-${subject.uuid}`, content: text, duration: 3 });
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
                title: "Видалити дисципліну?",
                content: `Дисципліну «${subject.title}» буде видалено. Цю дію не можна скасувати.`,
                okText: "Видалити",
                danger: true,
            },
            async () => {
                messageApi.loading({ key: `delete-subject-${subject.uuid}`, content: "Видалення..." });
                try {
                    await deleteSubject(subject.uuid);
                    messageApi.success({ key: `delete-subject-${subject.uuid}`, content: "Видалено", duration: 2 });
                    onDeleted(subject.uuid);
                } catch (error) {
                    const text = error instanceof ApiCallError ? error.message : "Виникла невідома помилка";
                    messageApi.error({ key: `delete-subject-${subject.uuid}`, content: text, duration: 3 });
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
                aria-controls={`subject-edit-${subject.uuid}`}
            >
                <RowMain>
                    <RowTitle>{subject.title}</RowTitle>
                    {subject.slug && <RowSlug>{subject.slug}</RowSlug>}
                </RowMain>
                <RowActions onClick={(e) => e.stopPropagation()}>
                    <DeleteIconButton type="button" aria-label={`Видалити дисципліну ${subject.title}`} onClick={handleDelete}>
                        <FaTrashAlt />
                    </DeleteIconButton>
                    <Chevron $open={open} aria-hidden />
                </RowActions>
            </RowHeader>

            {open && (
                <EditPanel id={`subject-edit-${subject.uuid}`}>
                    <form onSubmit={formik.handleSubmit} noValidate>
                        <FormField
                            {...formik.getFieldProps('title')}
                            label="Назва дисципліни"
                            type="text"
                            touched={formik.touched.title}
                            error={formik.errors.title}
                        />
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

export default SubjectRow;
