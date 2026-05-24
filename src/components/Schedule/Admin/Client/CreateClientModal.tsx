import React from "react";
import { Modal } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ClientRole, clientRoleOptionsUa } from "../../../../models/enums/ClientRole.ts";
import { ClientPrivate } from "../../../../models/client/ClientPrivate.ts";
import { signUp } from "../../../../api/client/admin.ts";
import { ApiCallError } from "../../../../api/errors.ts";
import { FormCard } from "../../../Forms/formStyled.ts";
import FormField from "../../../Forms/FormField.tsx";
import FormSection from "../../../Forms/FormSection.tsx";
import FormActions from "../../../Forms/FormActions.tsx";
import FormCheckboxGroup from "../../../Forms/FormCheckboxGroup.tsx";

interface SignUpValues {
    first_name: string;
    last_name: string;
    middle_name: string;
    email: string;
    password: string;
    verify_password: string;
    roles: ClientRole[];
}

const SignUpSchema = Yup.object().shape({
    first_name: Yup.string().required("Ім'я обов'язкове"),
    last_name: Yup.string().required("Прізвище обов'язкове"),
    middle_name: Yup.string().required("Ім'я по-батькові обов'язкове"),
    roles: Yup.array()
        .of(Yup.string().oneOf(Object.values(ClientRole), "Невірно вибрана роль"))
        .min(1, "Має бути обрана принаймні одна роль")
        .required("Роль обов'язкова"),
    email: Yup.string()
        .email("Невірний формат email")
        .required("Email обов'язковий"),
    password: Yup.string()
        .min(8, "Пароль має містити не менше 8 символів")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!#%^:;.,`~'"*?&+=\-_()]{8,}$/g,
            "Пароль повинен містити великі та малі літери, принаймні одну цифру",
        )
        .required("Пароль обов'язковий"),
    verify_password: Yup.string()
        .oneOf([Yup.ref("password"), undefined], "Підтвердження паролю має співпадати з паролем")
        .required("Підтвердження паролю обов'язкове"),
});

interface CreateClientModalProps {
    open: boolean;
    onClose: () => void;
    onCreated: (client: ClientPrivate) => void;
    messageApi: MessageInstance;
}

const CreateClientModal: React.FC<CreateClientModalProps> = ({ open, onClose, onCreated, messageApi }) => {
    const formik = useFormik<SignUpValues>({
        initialValues: {
            first_name: '',
            last_name: '',
            middle_name: '',
            email: '',
            password: '',
            verify_password: '',
            roles: [],
        },
        validationSchema: SignUpSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            messageApi.loading({ key: "create-client", content: "Реєстрація..." });
            try {
                const response = await signUp({
                    first_name: values.first_name,
                    last_name: values.last_name,
                    middle_name: values.middle_name,
                    roles: values.roles,
                    email: values.email,
                    password: values.password,
                    verify_password: values.verify_password,
                });
                messageApi.success({ key: "create-client", content: "Користувача зареєстровано", duration: 2 });
                onCreated(response.data);
                resetForm();
                onClose();
            } catch (error) {
                const text = error instanceof ApiCallError ? error.message : "Виникла невідома помилка";
                messageApi.error({ key: "create-client", content: text, duration: 3 });
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleCancel = () => {
        if (formik.isSubmitting) return;
        formik.resetForm();
        onClose();
    };

    const rolesError =
        formik.touched.roles && typeof formik.errors.roles === 'string'
            ? formik.errors.roles
            : undefined;

    return (
        <Modal
            open={open}
            onCancel={handleCancel}
            footer={null}
            title="Зареєструвати клієнта"
            centered
            destroyOnClose
            width={520}
        >
            <FormCard onSubmit={formik.handleSubmit} noValidate>
                <FormSection title="Особисті дані">
                    <FormField
                        {...formik.getFieldProps('last_name')}
                        label="Прізвище"
                        type="text"
                        autoComplete="family-name"
                        touched={formik.touched.last_name}
                        error={formik.errors.last_name}
                    />
                    <FormField
                        {...formik.getFieldProps('first_name')}
                        label="Ім'я"
                        type="text"
                        autoComplete="given-name"
                        touched={formik.touched.first_name}
                        error={formik.errors.first_name}
                    />
                    <FormField
                        {...formik.getFieldProps('middle_name')}
                        label="По-батькові"
                        type="text"
                        autoComplete="additional-name"
                        touched={formik.touched.middle_name}
                        error={formik.errors.middle_name}
                    />
                </FormSection>

                <FormSection title="Обліковий запис">
                    <FormField
                        {...formik.getFieldProps('email')}
                        label="Email"
                        type="email"
                        autoComplete="email"
                        touched={formik.touched.email}
                        error={formik.errors.email}
                    />
                    <FormField
                        {...formik.getFieldProps('password')}
                        label="Пароль"
                        type="password"
                        autoComplete="new-password"
                        helper="Мінімум 8 символів, велика та мала літери, цифра."
                        touched={formik.touched.password}
                        error={formik.errors.password}
                    />
                    <FormField
                        {...formik.getFieldProps('verify_password')}
                        label="Підтвердження паролю"
                        type="password"
                        autoComplete="new-password"
                        touched={formik.touched.verify_password}
                        error={formik.errors.verify_password}
                    />
                </FormSection>

                <FormSection title="Ролі">
                    <FormField
                        name="roles"
                        label="Ролі користувача"
                        touched={formik.touched.roles as boolean | undefined}
                        error={rolesError}
                    >
                        <FormCheckboxGroup<ClientRole>
                            name="roles"
                            options={clientRoleOptionsUa}
                            value={formik.values.roles}
                            onChange={(next) => formik.setFieldValue("roles", next)}
                            onBlur={() => formik.setFieldTouched('roles', true)}
                            $hasError={Boolean(rolesError)}
                        />
                    </FormField>
                </FormSection>

                <FormActions
                    submitLabel="Зареєструвати"
                    submitLoadingLabel="Реєстрація..."
                    onCancel={handleCancel}
                    isSubmitting={formik.isSubmitting}
                />
            </FormCard>
        </Modal>
    );
};

export default CreateClientModal;
