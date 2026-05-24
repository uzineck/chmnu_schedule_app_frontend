import React, { useState } from "react";
import type { MessageInstance } from "antd/es/message/interface";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { FaChevronDown, FaTrashAlt } from "react-icons/fa";
import { Faculty } from "../../../../models/faculty/Faculty.ts";
import {
    deleteFaculty,
    updateFacultyCodeName,
    updateFacultyName,
} from "../../../../api/schedule/faculty.ts";
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

    &:hover {
        background-color: ${({ theme }) => theme.colors.surfaceMuted};
    }

    &:focus-visible {
        outline: 2px solid ${({ theme }) => theme.colors.primary};
        outline-offset: -2px;
    }
`;

const RowMain = styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const RowCode = styled.span`
    font-weight: 700;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.primary};
`;

const RowName = styled.span`
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.textSubtle};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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

    &:hover {
        background-color: ${({ theme }) => theme.colors.surfaceMutedHover};
        color: ${({ theme }) => theme.colors.error};
    }

    &:focus-visible {
        outline: 2px solid ${({ theme }) => theme.colors.error};
        outline-offset: -2px;
    }
`;

const EditPanel = styled.div`
    padding: 14px;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.surfaceSubtle};
    display: flex;
    flex-direction: column;
    gap: 12px;

    ${media.up('tablet')} {
        padding: 18px;
        gap: 14px;
    }
`;

const EditSchema = Yup.object().shape({
    name: Yup.string().required("Назва обов'язкова"),
    code_name: Yup.string().required("Абривіатура обов'язкова"),
});

interface FacultyRowProps {
    faculty: Faculty;
    messageApi: MessageInstance;
    onUpdated: (faculty: Faculty) => void;
    onDeleted: (uuid: string) => void;
}

const FacultyRow: React.FC<FacultyRowProps> = ({ faculty, messageApi, onUpdated, onDeleted }) => {
    const [open, setOpen] = useState(false);
    const confirm = useConfirm();

    const formik = useFormik({
        initialValues: { name: faculty.name, code_name: faculty.code_name },
        enableReinitialize: true,
        validationSchema: EditSchema,
        onSubmit: async (values, { setSubmitting }) => {
            const nameChanged = values.name !== faculty.name;
            const codeChanged = values.code_name !== faculty.code_name;
            if (!nameChanged && !codeChanged) {
                setOpen(false);
                setSubmitting(false);
                return;
            }
            messageApi.loading({ key: `edit-faculty-${faculty.uuid}`, content: "Збереження..." });
            try {
                const calls: Promise<{ data: Faculty }>[] = [];
                if (nameChanged) calls.push(updateFacultyName(faculty.uuid, { name: values.name }));
                if (codeChanged) calls.push(updateFacultyCodeName(faculty.uuid, { code_name: values.code_name }));
                const results = await Promise.all(calls);
                const latest = results[results.length - 1].data;
                messageApi.success({ key: `edit-faculty-${faculty.uuid}`, content: "Збережено", duration: 2 });
                onUpdated(latest);
                setOpen(false);
            } catch (error) {
                const text = error instanceof ApiCallError ? error.message : "Виникла невідома помилка";
                messageApi.error({ key: `edit-faculty-${faculty.uuid}`, content: text, duration: 3 });
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleHeaderClick = () => {
        if (open) {
            formik.resetForm();
        }
        setOpen((prev) => !prev);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        confirm(
            {
                title: "Видалити факультет?",
                content: `Факультет «${faculty.name}» буде видалено. Цю дію не можна скасувати.`,
                okText: "Видалити",
                danger: true,
            },
            async () => {
                messageApi.loading({ key: `delete-faculty-${faculty.uuid}`, content: "Видалення..." });
                try {
                    await deleteFaculty(faculty.uuid);
                    messageApi.success({ key: `delete-faculty-${faculty.uuid}`, content: "Видалено", duration: 2 });
                    onDeleted(faculty.uuid);
                } catch (error) {
                    const text = error instanceof ApiCallError ? error.message : "Виникла невідома помилка";
                    messageApi.error({ key: `delete-faculty-${faculty.uuid}`, content: text, duration: 3 });
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
                aria-controls={`faculty-edit-${faculty.uuid}`}
            >
                <RowMain>
                    <RowCode>{faculty.code_name}</RowCode>
                    <RowName>{faculty.name}</RowName>
                </RowMain>
                <RowActions onClick={(e) => e.stopPropagation()}>
                    <DeleteIconButton
                        type="button"
                        aria-label={`Видалити факультет ${faculty.code_name}`}
                        onClick={handleDelete}
                    >
                        <FaTrashAlt />
                    </DeleteIconButton>
                    <Chevron $open={open} aria-hidden />
                </RowActions>
            </RowHeader>

            {open && (
                <EditPanel id={`faculty-edit-${faculty.uuid}`}>
                    <form onSubmit={formik.handleSubmit} noValidate>
                        <FormField
                            {...formik.getFieldProps('name')}
                            label="Назва факультету"
                            type="text"
                            touched={formik.touched.name}
                            error={formik.errors.name}
                        />
                        <div style={{ height: 12 }} />
                        <FormField
                            {...formik.getFieldProps('code_name')}
                            label="Абривіатура"
                            type="text"
                            touched={formik.touched.code_name}
                            error={formik.errors.code_name}
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

export default FacultyRow;
