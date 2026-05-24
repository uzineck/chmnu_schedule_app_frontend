import React, { useState } from "react";
import type { MessageInstance } from "antd/es/message/interface";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { FaChevronDown } from "react-icons/fa";
import { ClientPrivate } from "../../../../models/client/ClientPrivate.ts";
import { ClientRole, clientRoleOptionsUa, getClientRoleLabels } from "../../../../models/enums/ClientRole.ts";
import { updateClientRoles, updatePasswordAdmin } from "../../../../api/client/admin.ts";
import { ApiCallError } from "../../../../api/errors.ts";
import { useConfirm } from "../../../Forms/useConfirm.ts";
import FormField from "../../../Forms/FormField.tsx";
import FormActions from "../../../Forms/FormActions.tsx";
import FormSection from "../../../Forms/FormSection.tsx";
import FormCheckboxGroup from "../../../Forms/FormCheckboxGroup.tsx";
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
    font-weight: 700;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.primary};
`;

const RowEmail = styled.span`
    font-size: 0.88rem;
    color: ${({ theme }) => theme.colors.textSubtle};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const RowRoles = styled.span`
    font-size: 0.78rem;
    color: ${({ theme }) => theme.colors.textMuted};
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

const EditPanel = styled.div`
    padding: 14px;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.surfaceSubtle};
    display: flex;
    flex-direction: column;
    gap: 12px;

    ${media.up('tablet')} { padding: 18px; gap: 14px; }
`;

const SubForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const arraysEqual = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    const sa = [...a].sort();
    const sb = [...b].sort();
    return sa.every((v, i) => v === sb[i]);
};

const RolesSchema = Yup.object().shape({
    roles: Yup.array()
        .of(Yup.string().oneOf(Object.values(ClientRole), "Невірно вибрана роль"))
        .min(1, "Має бути обрана принаймні одна роль")
        .required("Роль обов'язкова"),
});

const PasswordSchema = Yup.object().shape({
    new_password: Yup.string()
        .min(8, "Пароль має містити не менше 8 символів")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!#%^:;.,`~'"*?&+=\-_()]{8,}$/g,
            "Пароль повинен містити великі та малі літери, принаймні одну цифру",
        )
        .required("Новий пароль обов'язковий"),
    verify_password: Yup.string()
        .oneOf([Yup.ref("new_password"), undefined], "Підтвердження має співпадати з новим паролем")
        .required("Підтвердження нового паролю обов'язкове"),
});

interface ClientRowProps {
    client: ClientPrivate;
    messageApi: MessageInstance;
    onUpdated: (client: ClientPrivate) => void;
}

const ClientRow: React.FC<ClientRowProps> = ({ client, messageApi, onUpdated }) => {
    const [open, setOpen] = useState(false);
    const confirm = useConfirm();

    const rolesFormik = useFormik<{ roles: ClientRole[] }>({
        initialValues: { roles: client.roles },
        enableReinitialize: true,
        validationSchema: RolesSchema,
        onSubmit: async (values, { setSubmitting }) => {
            if (arraysEqual(values.roles, client.roles)) {
                setSubmitting(false);
                return;
            }
            messageApi.loading({ key: `roles-${client.email}`, content: "Збереження..." });
            try {
                const response = await updateClientRoles(client.email, { roles: values.roles });
                messageApi.success({ key: `roles-${client.email}`, content: "Ролі оновлено", duration: 2 });
                onUpdated(response.data);
            } catch (error) {
                const text = error instanceof ApiCallError ? error.message : "Виникла невідома помилка";
                messageApi.error({ key: `roles-${client.email}`, content: text, duration: 3 });
            } finally {
                setSubmitting(false);
            }
        },
    });

    const passwordFormik = useFormik({
        initialValues: { new_password: "", verify_password: "" },
        validationSchema: PasswordSchema,
        onSubmit: (values, { setSubmitting }) => {
            confirm(
                {
                    title: "Скинути пароль клієнта?",
                    content: `Пароль користувача «${client.email}» буде замінено. Повідомте новий пароль клієнту окремо.`,
                    okText: "Скинути",
                    danger: true,
                },
                async () => {
                    messageApi.loading({ key: `pwd-${client.email}`, content: "Збереження..." });
                    try {
                        await updatePasswordAdmin(client.email, {
                            new_password: values.new_password,
                            verify_password: values.verify_password,
                        });
                        messageApi.success({ key: `pwd-${client.email}`, content: "Пароль скинуто", duration: 2 });
                        passwordFormik.resetForm();
                    } catch (error) {
                        const text = error instanceof ApiCallError ? error.message : "Виникла невідома помилка";
                        messageApi.error({ key: `pwd-${client.email}`, content: text, duration: 3 });
                    }
                },
            );
            setSubmitting(false);
        },
    });

    const handleHeaderClick = () => {
        if (open) {
            rolesFormik.resetForm();
            passwordFormik.resetForm();
        }
        setOpen((prev) => !prev);
    };

    const fullName = [client.last_name, client.first_name, client.middle_name].filter(Boolean).join(" ");
    const rolesError =
        rolesFormik.touched.roles && typeof rolesFormik.errors.roles === "string"
            ? rolesFormik.errors.roles
            : undefined;

    return (
        <Row $open={open}>
            <RowHeader
                type="button"
                onClick={handleHeaderClick}
                aria-expanded={open}
                aria-controls={`client-edit-${client.email}`}
            >
                <RowMain>
                    <RowName>{fullName || client.email}</RowName>
                    <RowEmail>{client.email}</RowEmail>
                    <RowRoles>{getClientRoleLabels(client.roles)}</RowRoles>
                </RowMain>
                <RowActions onClick={(e) => e.stopPropagation()}>
                    <Chevron $open={open} aria-hidden />
                </RowActions>
            </RowHeader>

            {open && (
                <EditPanel id={`client-edit-${client.email}`}>
                    <FormSection title="Ролі">
                        <SubForm onSubmit={rolesFormik.handleSubmit} noValidate>
                            <FormField
                                name="roles"
                                label="Ролі користувача"
                                touched={rolesFormik.touched.roles as boolean | undefined}
                                error={rolesError}
                            >
                                <FormCheckboxGroup<ClientRole>
                                    name="roles"
                                    options={clientRoleOptionsUa}
                                    value={rolesFormik.values.roles}
                                    onChange={(next) => rolesFormik.setFieldValue("roles", next)}
                                    onBlur={() => rolesFormik.setFieldTouched("roles", true)}
                                    $hasError={Boolean(rolesError)}
                                />
                            </FormField>
                            <FormActions
                                submitLabel="Зберегти ролі"
                                submitLoadingLabel="Збереження..."
                                cancelLabel="Скасувати"
                                onCancel={() => {
                                    rolesFormik.resetForm();
                                    setOpen(false);
                                }}
                                isSubmitting={rolesFormik.isSubmitting}
                            />
                        </SubForm>
                    </FormSection>

                    <FormSection title="Скинути пароль">
                        <SubForm onSubmit={passwordFormik.handleSubmit} noValidate>
                            <FormField
                                {...passwordFormik.getFieldProps('new_password')}
                                label="Новий пароль"
                                type="password"
                                autoComplete="new-password"
                                helper="Мінімум 8 символів, велика та мала літери, цифра."
                                touched={passwordFormik.touched.new_password}
                                error={passwordFormik.errors.new_password}
                            />
                            <FormField
                                {...passwordFormik.getFieldProps('verify_password')}
                                label="Підтвердження нового паролю"
                                type="password"
                                autoComplete="new-password"
                                touched={passwordFormik.touched.verify_password}
                                error={passwordFormik.errors.verify_password}
                            />
                            <FormActions
                                submitLabel="Скинути пароль"
                                submitLoadingLabel="Збереження..."
                                cancelLabel="Очистити"
                                onCancel={() => passwordFormik.resetForm()}
                                isSubmitting={passwordFormik.isSubmitting}
                                danger
                            />
                        </SubForm>
                    </FormSection>
                </EditPanel>
            )}
        </Row>
    );
};

export default ClientRow;
