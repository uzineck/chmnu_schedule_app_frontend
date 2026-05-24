import React, { useState } from "react";
import type { MessageInstance } from "antd/es/message/interface";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { FaChevronDown, FaTrashAlt } from "react-icons/fa";
import { GroupWithHeadman } from "../../../../models/group/GroupWithHeadman.ts";
import { deleteGroup, updateGroupHeadman } from "../../../../api/schedule/group.ts";
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

const RowNumber = styled.span`
    font-weight: 700;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.primary};
`;

const RowMeta = styled.span`
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.textSubtle};
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
`;

const Badge = styled.span`
    font-size: 0.72rem;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 999px;
    background-color: ${({ theme }) => theme.colors.surfaceMuted};
    color: ${({ theme }) => theme.colors.textSubtle};
    text-transform: uppercase;
    letter-spacing: 0.02em;
`;

const RowHeadman = styled.span<{ $muted?: boolean }>`
    font-size: 0.85rem;
    color: ${({ theme, $muted }) => ($muted ? theme.colors.textMuted : theme.colors.textSubtle)};
    font-style: ${({ $muted }) => ($muted ? 'italic' : 'normal')};
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
    headman_email: Yup.string().email("Невірний формат email").required("Email старости обов'язковий"),
});

interface GroupRowProps {
    group: GroupWithHeadman;
    messageApi: MessageInstance;
    onUpdated: (group: GroupWithHeadman) => void;
    onDeleted: (uuid: string) => void;
}

const GroupRow: React.FC<GroupRowProps> = ({ group, messageApi, onUpdated, onDeleted }) => {
    const [open, setOpen] = useState(false);
    const confirm = useConfirm();

    const formik = useFormik({
        initialValues: { headman_email: group.headman?.email ?? "" },
        enableReinitialize: true,
        validationSchema: EditSchema,
        onSubmit: async (values, { setSubmitting }) => {
            if (values.headman_email === (group.headman?.email ?? "")) {
                setOpen(false);
                setSubmitting(false);
                return;
            }
            messageApi.loading({ key: `edit-group-${group.uuid}`, content: "Збереження..." });
            try {
                const response = await updateGroupHeadman(group.uuid, { headman_email: values.headman_email });
                messageApi.success({ key: `edit-group-${group.uuid}`, content: "Старосту змінено", duration: 2 });
                onUpdated(response.data);
                setOpen(false);
            } catch (error) {
                const text = error instanceof ApiCallError ? error.message : "Виникла невідома помилка";
                messageApi.error({ key: `edit-group-${group.uuid}`, content: text, duration: 3 });
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
                title: "Видалити групу?",
                content: `Групу «${group.number}» буде видалено разом з її розкладом. Цю дію не можна скасувати.`,
                okText: "Видалити",
                danger: true,
            },
            async () => {
                messageApi.loading({ key: `delete-group-${group.uuid}`, content: "Видалення..." });
                try {
                    await deleteGroup(group.uuid);
                    messageApi.success({ key: `delete-group-${group.uuid}`, content: "Видалено", duration: 2 });
                    onDeleted(group.uuid);
                } catch (error) {
                    const text = error instanceof ApiCallError ? error.message : "Виникла невідома помилка";
                    messageApi.error({ key: `delete-group-${group.uuid}`, content: text, duration: 3 });
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
                aria-controls={`group-edit-${group.uuid}`}
            >
                <RowMain>
                    <RowNumber>{group.number}</RowNumber>
                    <RowMeta>
                        <span>{group.faculty.code_name}</span>
                        {group.has_subgroups && <Badge>З підгрупами</Badge>}
                    </RowMeta>
                    <RowHeadman $muted={!group.headman}>
                        {group.headman ? `Староста: ${group.headman.email}` : "Без старости"}
                    </RowHeadman>
                </RowMain>
                <RowActions onClick={(e) => e.stopPropagation()}>
                    <DeleteIconButton
                        type="button"
                        aria-label={`Видалити групу ${group.number}`}
                        onClick={handleDelete}
                    >
                        <FaTrashAlt />
                    </DeleteIconButton>
                    <Chevron $open={open} aria-hidden />
                </RowActions>
            </RowHeader>

            {open && (
                <EditPanel id={`group-edit-${group.uuid}`}>
                    <form onSubmit={formik.handleSubmit} noValidate>
                        <FormField
                            {...formik.getFieldProps('headman_email')}
                            label="Email старости"
                            type="email"
                            autoComplete="email"
                            touched={formik.touched.headman_email}
                            error={formik.errors.headman_email}
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

export default GroupRow;
