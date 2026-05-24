import React, { useState } from "react";
import type { MessageInstance } from "antd/es/message/interface";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { FaChevronDown, FaTrashAlt } from "react-icons/fa";
import { Room } from "../../../../models/room/Room.ts";
import {
    deleteRoom,
    updateRoomDescription,
    updateRoomNumber,
} from "../../../../api/schedule/room.ts";
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

const RowDescription = styled.span<{ $muted?: boolean }>`
    font-size: 0.9rem;
    color: ${({ $muted, theme }) => ($muted ? theme.colors.textMuted : theme.colors.textSubtle)};
    font-style: ${({ $muted }) => ($muted ? "italic" : "normal")};
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
    number: Yup.string().required("Номер обов'язковий"),
    description: Yup.string().nullable(),
});

interface RoomRowProps {
    room: Room;
    messageApi: MessageInstance;
    onUpdated: (room: Room) => void;
    onDeleted: (uuid: string) => void;
}

const RoomRow: React.FC<RoomRowProps> = ({ room, messageApi, onUpdated, onDeleted }) => {
    const [open, setOpen] = useState(false);
    const confirm = useConfirm();

    const formik = useFormik({
        initialValues: { number: room.number, description: room.description ?? "" },
        enableReinitialize: true,
        validationSchema: EditSchema,
        onSubmit: async (values, { setSubmitting }) => {
            const numberChanged = values.number !== room.number;
            const descChanged = values.description !== (room.description ?? "");
            if (!numberChanged && !descChanged) {
                setOpen(false);
                setSubmitting(false);
                return;
            }
            messageApi.loading({ key: `edit-room-${room.uuid}`, content: "Збереження..." });
            try {
                const calls: Promise<{ data: Room }>[] = [];
                if (numberChanged) calls.push(updateRoomNumber(room.uuid, { number: values.number }));
                if (descChanged) calls.push(updateRoomDescription(room.uuid, { description: values.description }));
                const results = await Promise.all(calls);
                const latest = results[results.length - 1].data;
                messageApi.success({ key: `edit-room-${room.uuid}`, content: "Збережено", duration: 2 });
                onUpdated(latest);
                setOpen(false);
            } catch (error) {
                const text = error instanceof ApiCallError ? error.message : "Виникла невідома помилка";
                messageApi.error({ key: `edit-room-${room.uuid}`, content: text, duration: 3 });
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
                title: "Видалити аудиторію?",
                content: `Аудиторію «${room.number}» буде видалено. Цю дію не можна скасувати.`,
                okText: "Видалити",
                danger: true,
            },
            async () => {
                messageApi.loading({ key: `delete-room-${room.uuid}`, content: "Видалення..." });
                try {
                    await deleteRoom(room.uuid);
                    messageApi.success({ key: `delete-room-${room.uuid}`, content: "Видалено", duration: 2 });
                    onDeleted(room.uuid);
                } catch (error) {
                    const text = error instanceof ApiCallError ? error.message : "Виникла невідома помилка";
                    messageApi.error({ key: `delete-room-${room.uuid}`, content: text, duration: 3 });
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
                aria-controls={`room-edit-${room.uuid}`}
            >
                <RowMain>
                    <RowNumber>{room.number}</RowNumber>
                    <RowDescription $muted={!room.description}>
                        {room.description || "Без опису"}
                    </RowDescription>
                </RowMain>
                <RowActions onClick={(e) => e.stopPropagation()}>
                    <DeleteIconButton type="button" aria-label={`Видалити аудиторію ${room.number}`} onClick={handleDelete}>
                        <FaTrashAlt />
                    </DeleteIconButton>
                    <Chevron $open={open} aria-hidden />
                </RowActions>
            </RowHeader>

            {open && (
                <EditPanel id={`room-edit-${room.uuid}`}>
                    <form onSubmit={formik.handleSubmit} noValidate>
                        <FormField
                            {...formik.getFieldProps('number')}
                            label="Номер аудиторії"
                            type="text"
                            touched={formik.touched.number}
                            error={formik.errors.number}
                        />
                        <div style={{ height: 12 }} />
                        <FormField
                            {...formik.getFieldProps('description')}
                            label="Опис (необов'язково)"
                            type="text"
                            touched={formik.touched.description}
                            error={formik.errors.description}
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

export default RoomRow;
