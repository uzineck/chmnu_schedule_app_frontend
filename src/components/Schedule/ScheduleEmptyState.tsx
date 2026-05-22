import { AiOutlineCalendar } from "react-icons/ai";
import styled from "styled-components";
import { media } from "../../styles/media.ts";

const EmptyContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    max-width: 560px;
    margin: 16px auto;
    padding: 28px 20px;
    gap: 12px;
    background-color: ${({theme}) => theme.colors.surfaceAlt};
    border: 1px dashed ${({theme}) => theme.colors.border};
    border-radius: 14px;

    ${media.up('tablet')} {
        margin: 32px auto;
        padding: 40px 28px;
        gap: 16px;
    }
`;

const EmptyIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: ${({theme}) => theme.colors.accentLavender};
    color: ${({theme}) => theme.colors.primary};
    font-size: 32px;

    ${media.up('tablet')} {
        width: 80px;
        height: 80px;
        font-size: 40px;
    }
`;

const EmptyMessage = styled.div`
    font-size: 1.1rem;
    font-weight: 600;
    color: ${({theme}) => theme.colors.textPrimary};
    line-height: 1.35;

    ${media.up('tablet')} {
        font-size: 1.25rem;
    }
`;

const EmptyHint = styled.div`
    font-size: 0.95rem;
    color: ${({theme}) => theme.colors.textSubtle};
    line-height: 1.4;

    ${media.up('tablet')} {
        font-size: 1rem;
    }
`;

interface ScheduleEmptyStateProps {
    message: string;
    hint?: string;
}

const ScheduleEmptyState = ({ message, hint }: ScheduleEmptyStateProps) => {
    return (
        <EmptyContainer role="status" aria-live="polite">
            <EmptyIcon aria-hidden="true">
                <AiOutlineCalendar />
            </EmptyIcon>
            <EmptyMessage>{message}</EmptyMessage>
            {hint && <EmptyHint>{hint}</EmptyHint>}
        </EmptyContainer>
    );
};

export default ScheduleEmptyState;
