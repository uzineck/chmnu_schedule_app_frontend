import React, { useState } from "react";
import { message } from "antd";
import styled from "styled-components";
import { FaChevronDown } from "react-icons/fa";
import Title from "../../Title/Title.tsx";
import { useAuth } from "../Context/hooks/useAuth.ts";
import { getClientRoleLabels } from "../../../models/enums/ClientRole.ts";
import { media } from "../../../styles/media.ts";
import ChangeEmailForm from "./Forms/ChangeEmailForm.tsx";
import ChangePasswordForm from "./Forms/ChangePasswordForm.tsx";
import ChangeCredentialsForm from "./Forms/ChangeCredentialsForm.tsx";

type SectionKey = "change_email" | "change_password" | "change_credentials";

const Page = styled.div`
    width: 100%;
    max-width: 720px;
    margin: 0 auto;
    padding: 1rem 0.75rem 3rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    ${media.up('phone')} { padding: 1.5rem 1rem 3rem; gap: 1.25rem; }
    ${media.up('tablet')} { padding: 2rem 1.5rem 4rem; gap: 1.5rem; }
`;

const Header = styled.div`
    width: 100%;
    & > h1 { width: 100%; display: block; }
`;

const AccountCard = styled.div`
    background-color: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 10px;
    padding: 14px 16px;
    box-shadow: 0 1px 4px ${({ theme }) => theme.colors.shadow};
    display: flex;
    flex-direction: column;
    gap: 6px;

    ${media.up('tablet')} {
        padding: 18px 20px;
    }
`;

const AccountRow = styled.div`
    font-size: 0.92rem;
    color: ${({ theme }) => theme.colors.textPrimary};
    line-height: 1.4;
    overflow-wrap: anywhere;

    & > span { color: ${({ theme }) => theme.colors.textSubtle}; margin-right: 6px; }
`;

const Sections = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    ${media.up('tablet')} { gap: 12px; }
`;

const SectionCard = styled.div<{ $open?: boolean }>`
    border: none;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.colors.surface};
    box-shadow:
        inset 0 0 0 1px ${({ theme, $open }) => ($open ? theme.colors.primary : theme.colors.border)},
        0 1px 4px ${({ theme }) => theme.colors.shadow};
    overflow: hidden;
    transition: box-shadow 0.15s ease;
`;

const SectionHeader = styled.button`
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

const SectionMain = styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const SectionLabel = styled.span`
    font-weight: 600;
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.textPrimary};
`;

const SectionPreview = styled.span<{ $muted?: boolean }>`
    font-size: 0.85rem;
    color: ${({ theme, $muted }) => ($muted ? theme.colors.textMuted : theme.colors.textSubtle)};
    font-style: ${({ $muted }) => ($muted ? 'italic' : 'normal')};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const SectionActions = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.85rem;
    font-weight: 600;
`;

const Chevron = styled(FaChevronDown)<{ $open?: boolean }>`
    transition: transform 0.2s ease;
    transform: rotate(${({ $open }) => ($open ? 180 : 0)}deg);
`;

const SectionBody = styled.div`
    padding: 14px;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.surfaceSubtle};

    ${media.up('tablet')} { padding: 18px; }
`;

const Profile: React.FC = () => {
    const { client } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();

    const [openSection, setOpenSection] = useState<SectionKey | null>(null);

    const toggleSection = (key: SectionKey) => {
        setOpenSection((current) => (current === key ? null : key));
    };

    const closeSection = () => {
        setOpenSection(null);
    };

    const fullName = [client?.last_name, client?.first_name, client?.middle_name].filter(Boolean).join(" ") || "—";
    const emailPreview = client?.email ?? "—";
    const rolesLabel = client?.roles ? getClientRoleLabels(client.roles) : "—";

    const sections: Array<{
        key: SectionKey;
        label: string;
        preview: string;
        renderForm: () => React.ReactNode;
    }> = [
        {
            key: "change_email",
            label: "Email",
            preview: emailPreview,
            renderForm: () => <ChangeEmailForm messageApi={messageApi} onSuccess={closeSection} onCancel={closeSection} />,
        },
        {
            key: "change_password",
            label: "Пароль",
            preview: "••••••••",
            renderForm: () => <ChangePasswordForm messageApi={messageApi} onSuccess={closeSection} onCancel={closeSection} />,
        },
        {
            key: "change_credentials",
            label: "Повне ім'я",
            preview: fullName,
            renderForm: () => <ChangeCredentialsForm messageApi={messageApi} onSuccess={closeSection} onCancel={closeSection} />,
        },
    ];

    return (
        <Page>
            {contextHolder}
            <Header>
                <Title text="Профіль" />
            </Header>

            <AccountCard>
                <AccountRow><span>Повне ім'я:</span>{fullName}</AccountRow>
                <AccountRow><span>Email:</span>{emailPreview}</AccountRow>
                <AccountRow><span>Ролі:</span>{rolesLabel}</AccountRow>
            </AccountCard>

            <Sections>
                {sections.map(({ key, label, preview, renderForm }) => {
                    const isOpen = openSection === key;
                    return (
                        <SectionCard key={key} $open={isOpen}>
                            <SectionHeader
                                type="button"
                                onClick={() => toggleSection(key)}
                                aria-expanded={isOpen}
                                aria-controls={`profile-section-${key}`}
                            >
                                <SectionMain>
                                    <SectionLabel>{label}</SectionLabel>
                                    <SectionPreview $muted={preview === "—"}>{preview}</SectionPreview>
                                </SectionMain>
                                <SectionActions>
                                    <span>{isOpen ? "Згорнути" : "Змінити"}</span>
                                    <Chevron $open={isOpen} aria-hidden />
                                </SectionActions>
                            </SectionHeader>
                            {isOpen && (
                                <SectionBody id={`profile-section-${key}`}>
                                    {renderForm()}
                                </SectionBody>
                            )}
                        </SectionCard>
                    );
                })}
            </Sections>
        </Page>
    );
};

export default Profile;
