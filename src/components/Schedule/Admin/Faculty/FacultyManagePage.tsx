import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import styled from "styled-components";
import { FaPlus, FaSearch } from "react-icons/fa";
import { Faculty } from "../../../../models/faculty/Faculty.ts";
import { getListOfFaculties } from "../../../../api/schedule/faculty.ts";
import { ApiCallError } from "../../../../api/errors.ts";
import { media } from "../../../../styles/media.ts";
import { FormFieldInput } from "../../../Forms/formStyled.ts";
import Title from "../../../Title/Title.tsx";
import CreateFacultyModal from "./CreateFacultyModal.tsx";
import FacultyRow from "./FacultyRow.tsx";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

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

const Controls = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    ${media.up('phone')} { flex-direction: row; align-items: stretch; gap: 0.75rem; }
`;

const SearchWrap = styled.div`
    position: relative;
    flex: 1;
    min-width: 0;
`;

const SearchIcon = styled(FaSearch)`
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textMuted};
    pointer-events: none;
    font-size: 0.85rem;
`;

const SearchInput = styled(FormFieldInput)`
    padding-left: 34px;
`;

const CreateButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textInverse};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    min-height: 42px;
    transition: background-color 0.15s ease, border-color 0.15s ease;
    white-space: nowrap;

    &:hover, &:focus-visible {
        background-color: ${({ theme }) => theme.colors.primaryHover};
        border-color: ${({ theme }) => theme.colors.primaryHover};
        outline: none;
    }
    &:focus-visible { box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryFocusShadow}; }
    ${media.up('phone')} { flex: 0 0 auto; min-width: 160px; }
`;

const ResultMeta = styled.div`
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.textSubtle};
`;

const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    ${media.up('tablet')} { gap: 12px; }
`;

const EmptyState = styled.div`
    text-align: center;
    color: ${({ theme }) => theme.colors.textMuted};
    padding: 2rem 1rem;
    font-size: 0.95rem;
    line-height: 1.5;
`;

const LoadMoreButton = styled.button`
    align-self: center;
    margin-top: 4px;
    padding: 10px 18px;
    border-radius: 8px;
    background-color: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.border};
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    min-height: 42px;
    min-width: 200px;
    transition: background-color 0.15s ease, border-color 0.15s ease;

    &:hover:not(:disabled), &:focus-visible:not(:disabled) {
        background-color: ${({ theme }) => theme.colors.surfaceMuted};
        border-color: ${({ theme }) => theme.colors.borderInput};
        outline: none;
    }
    &:focus-visible {
        box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryFocusShadow};
    }
    &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
`;

const useDebounced = <T,>(value: T, delay: number): T => {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
};

const FacultyManagePage: React.FC = () => {
    const [items, setItems] = useState<Faculty[]>([]);
    const [total, setTotal] = useState<number | null>(null);
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const debouncedQuery = useDebounced(query, SEARCH_DEBOUNCE_MS);
    // Counter that increments whenever the query changes — used as a "request
    // generation" so out-of-order responses for stale queries are discarded.
    const requestGenRef = useRef(0);

    const fetchPage = useCallback(
        async (offset: number, search: string, generation: number) => {
            try {
                const response = await getListOfFaculties(
                    { search: search.trim() || null },
                    { offset, limit: PAGE_SIZE },
                );
                if (generation !== requestGenRef.current) return;
                const page = response.data;
                setTotal(page.pagination.total);
                setItems((prev) => (offset === 0 ? page.items : [...prev, ...page.items]));
            } catch (error) {
                if (generation !== requestGenRef.current) return;
                const text = error instanceof ApiCallError ? error.message : "Не вдалось завантажити факультети";
                messageApi.error({ content: text, duration: 3 });
            }
        },
        [messageApi],
    );

    // Refetch from offset 0 whenever the debounced query changes.
    useEffect(() => {
        const generation = ++requestGenRef.current;
        setIsLoading(true);
        setItems([]);
        setTotal(null);
        fetchPage(0, debouncedQuery, generation).finally(() => {
            if (generation === requestGenRef.current) setIsLoading(false);
        });
    }, [debouncedQuery, fetchPage]);

    const canLoadMore = total !== null && items.length < total && !isLoading;

    const handleLoadMore = () => {
        if (!canLoadMore || isLoadingMore) return;
        const generation = requestGenRef.current;
        setIsLoadingMore(true);
        fetchPage(items.length, debouncedQuery, generation).finally(() => {
            setIsLoadingMore(false);
        });
    };

    const handleCreated = (faculty: Faculty) => {
        setItems((prev) => [faculty, ...prev]);
        setTotal((prev) => (prev === null ? null : prev + 1));
    };
    const handleUpdated = (faculty: Faculty) => {
        setItems((prev) => prev.map((f) => (f.uuid === faculty.uuid ? faculty : f)));
    };
    const handleDeleted = (uuid: string) => {
        setItems((prev) => prev.filter((f) => f.uuid !== uuid));
        setTotal((prev) => (prev === null ? null : Math.max(0, prev - 1)));
    };

    const hasQuery = debouncedQuery.trim().length > 0;
    const metaLabel = useMemo(() => {
        if (total === null) return null;
        return hasQuery ? `Знайдено: ${total}` : `Усього: ${total}`;
    }, [total, hasQuery]);

    const renderBody = () => {
        if (isLoading && items.length === 0) {
            return <EmptyState>Завантаження...</EmptyState>;
        }
        if (items.length === 0) {
            if (hasQuery) {
                return (
                    <EmptyState>
                        За запитом «{debouncedQuery}» нічого не знайдено.<br />
                        Перевірте написання або створіть новий факультет.
                    </EmptyState>
                );
            }
            return (
                <EmptyState>
                    Жодного факультету ще не створено.<br />
                    Натисніть «Створити», щоб додати перший.
                </EmptyState>
            );
        }

        return (
            <>
                {metaLabel && <ResultMeta>{metaLabel}</ResultMeta>}
                <List>
                    {items.map((faculty) => (
                        <FacultyRow
                            key={faculty.uuid}
                            faculty={faculty}
                            messageApi={messageApi}
                            onUpdated={handleUpdated}
                            onDeleted={handleDeleted}
                        />
                    ))}
                </List>
                {canLoadMore && (
                    <LoadMoreButton type="button" onClick={handleLoadMore} disabled={isLoadingMore}>
                        {isLoadingMore ? "Завантаження..." : `Завантажити ще (${total! - items.length})`}
                    </LoadMoreButton>
                )}
            </>
        );
    };

    return (
        <Page>
            {contextHolder}

            <Header>
                <Title text="Панель факультетів" />
            </Header>

            <Controls>
                <SearchWrap>
                    <SearchIcon aria-hidden />
                    <SearchInput
                        type="search"
                        placeholder="Пошук за назвою або абривіатурою..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="Пошук факультетів"
                    />
                </SearchWrap>
                <CreateButton type="button" onClick={() => setCreateOpen(true)}>
                    <FaPlus /> Створити
                </CreateButton>
            </Controls>

            {renderBody()}

            <CreateFacultyModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={handleCreated}
                messageApi={messageApi}
            />
        </Page>
    );
};

export default FacultyManagePage;
