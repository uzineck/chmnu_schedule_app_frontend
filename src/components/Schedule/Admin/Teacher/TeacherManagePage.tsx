import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import styled from "styled-components";
import { FaPlus, FaSearch } from "react-icons/fa";
import { Teacher } from "../../../../models/teacher/Teacher.ts";
import { getListOfTeachers } from "../../../../api/schedule/teacher.ts";
import { ApiCallError } from "../../../../api/errors.ts";
import { rankOptionsUa, TeacherRanks } from "../../../../models/enums/TeacherRanks.ts";
import { media } from "../../../../styles/media.ts";
import { FormFieldInput, FormFieldSelect } from "../../../Forms/formStyled.ts";
import Title from "../../../Title/Title.tsx";
import CreateTeacherModal from "./CreateTeacherModal.tsx";
import TeacherRow from "./TeacherRow.tsx";

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
    /* On tablet+, lay out as a 2-row grid so the Create button sits next to
       the Search bar (matching other manage pages) and the Rank filter has
       its own row below. */
    ${media.up('tablet')} {
        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-areas:
            "search create"
            "rank rank";
        align-items: stretch;
    }
`;

const SearchWrap = styled.div`
    position: relative;
    width: 100%;
    min-width: 0;
    ${media.up('tablet')} { grid-area: search; }
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

const RankSelect = styled(FormFieldSelect)`
    ${media.up('tablet')} { grid-area: rank; max-width: 320px; }
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
    ${media.up('tablet')} { grid-area: create; min-width: 160px; }
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
    &:focus-visible { box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryFocusShadow}; }
    &:disabled { cursor: not-allowed; opacity: 0.6; }
`;

const useDebounced = <T,>(value: T, delay: number): T => {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
};

const TeacherManagePage: React.FC = () => {
    const [items, setItems] = useState<Teacher[]>([]);
    const [total, setTotal] = useState<number | null>(null);
    const [query, setQuery] = useState("");
    const [rankFilter, setRankFilter] = useState<TeacherRanks | "">("");
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const debouncedQuery = useDebounced(query, SEARCH_DEBOUNCE_MS);
    const requestGenRef = useRef(0);

    const fetchPage = useCallback(
        async (offset: number, name: string, rank: TeacherRanks | "", generation: number) => {
            try {
                const response = await getListOfTeachers(
                    {
                        name: name.trim() || null,
                        rank: rank || null,
                    },
                    { offset, limit: PAGE_SIZE },
                );
                if (generation !== requestGenRef.current) return;
                const page = response.data;
                setTotal(page.pagination.total);
                setItems((prev) => (offset === 0 ? page.items : [...prev, ...page.items]));
            } catch (error) {
                if (generation !== requestGenRef.current) return;
                const text = error instanceof ApiCallError ? error.message : "Не вдалось завантажити викладачів";
                messageApi.error({ content: text, duration: 3 });
            }
        },
        [messageApi],
    );

    useEffect(() => {
        const generation = ++requestGenRef.current;
        setIsLoading(true);
        setItems([]);
        setTotal(null);
        fetchPage(0, debouncedQuery, rankFilter, generation).finally(() => {
            if (generation === requestGenRef.current) setIsLoading(false);
        });
    }, [debouncedQuery, rankFilter, fetchPage]);

    const canLoadMore = total !== null && items.length < total && !isLoading;

    const handleLoadMore = () => {
        if (!canLoadMore || isLoadingMore) return;
        const generation = requestGenRef.current;
        setIsLoadingMore(true);
        fetchPage(items.length, debouncedQuery, rankFilter, generation).finally(() => {
            setIsLoadingMore(false);
        });
    };

    const handleCreated = (teacher: Teacher) => {
        setItems((prev) => [teacher, ...prev]);
        setTotal((prev) => (prev === null ? null : prev + 1));
    };
    const handleUpdated = (teacher: Teacher) => {
        setItems((prev) => prev.map((t) => (t.uuid === teacher.uuid ? teacher : t)));
    };
    const handleDeleted = (uuid: string) => {
        setItems((prev) => prev.filter((t) => t.uuid !== uuid));
        setTotal((prev) => (prev === null ? null : Math.max(0, prev - 1)));
    };

    const hasFilter = debouncedQuery.trim().length > 0 || rankFilter !== "";
    const metaLabel = useMemo(() => {
        if (total === null) return null;
        return hasFilter ? `Знайдено: ${total}` : `Усього: ${total}`;
    }, [total, hasFilter]);

    const renderBody = () => {
        if (isLoading && items.length === 0) return <EmptyState>Завантаження...</EmptyState>;
        if (items.length === 0) {
            if (hasFilter) {
                return (
                    <EmptyState>
                        За заданими фільтрами нічого не знайдено.<br />
                        Спробуйте інший запит або скиньте фільтр звання.
                    </EmptyState>
                );
            }
            return (
                <EmptyState>
                    Жодного викладача ще не створено.<br />
                    Натисніть «Створити», щоб додати першого.
                </EmptyState>
            );
        }

        return (
            <>
                {metaLabel && <ResultMeta>{metaLabel}</ResultMeta>}
                <List>
                    {items.map((teacher) => (
                        <TeacherRow
                            key={teacher.uuid}
                            teacher={teacher}
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
                <Title text="Панель викладачів" />
            </Header>

            <Controls>
                <SearchWrap>
                    <SearchIcon aria-hidden />
                    <SearchInput
                        type="search"
                        placeholder="Пошук за прізвищем, ім'ям..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="Пошук викладачів"
                    />
                </SearchWrap>
                <RankSelect
                    value={rankFilter}
                    onChange={(e) => setRankFilter(e.target.value as TeacherRanks | "")}
                    aria-label="Фільтр за званням"
                >
                    <option value="">Усі звання</option>
                    {rankOptionsUa.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </RankSelect>
                <CreateButton type="button" onClick={() => setCreateOpen(true)}>
                    <FaPlus /> Створити
                </CreateButton>
            </Controls>

            {renderBody()}

            <CreateTeacherModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={handleCreated}
                messageApi={messageApi}
            />
        </Page>
    );
};

export default TeacherManagePage;
