import React from "react";
import { FormSectionContainer, FormSectionTitle } from "./formStyled.ts";

interface FormSectionProps {
    title?: string;
    children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => (
    <FormSectionContainer>
        {title && <FormSectionTitle>{title}</FormSectionTitle>}
        {children}
    </FormSectionContainer>
);

export default FormSection;
