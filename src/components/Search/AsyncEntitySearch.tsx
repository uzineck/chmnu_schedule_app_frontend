import { useCallback, useEffect, useRef, useState } from "react";
import Select, { SingleValue } from "react-select";
import { ApiResponse } from "../../models/ApiResponse.ts";
import { ListPaginatedResponse, PaginationIn } from "../../models/ListPaginatedResponse.ts";
import { SearchFilter } from "../../models/filters/SearchFilter.ts";
import { OptionType } from "./BaseDropDownSearch.tsx";
import { BaseDropdown, customStyles } from "./selectStyled.ts";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

interface AsyncEntitySearchProps<T> {
    /**
     * Fetch one page from the backend. Receives a search-shaped filter that
     * may be the unified `SearchFilter` or any entity-specific filter (e.g.
     * `{name, rank}` for Teacher) — the consumer wires the right signature.
     */
    fetchPage: (
        filter: SearchFilter & Record<string, string | null | undefined>,
        pagination: PaginationIn,
    ) => Promise<ApiResponse<ListPaginatedResponse<T>>>;
    /** Map an entity to a react-select option. `value` is typically `uuid`. */
    mapToOption: (item: T) => OptionType;
    /** Currently selected option (controlled). */
    selected: OptionType | null;
    /** Selection callback — null when user clears. */
    onSelect: (item: T | null) => void;
    placeholder?: string;
    noOptionsMessage?: string;
    /** Extra filter values merged into every request (e.g. `{rank}`). */
    extraFilter?: Record<string, string | null | undefined>;
}

const AsyncEntitySearch = <T,>({
    fetchPage,
    mapToOption,
    selected,
    onSelect,
    placeholder = "Виберіть...",
    noOptionsMessage = "Немає даних",
    extraFilter,
}: AsyncEntitySearchProps<T>) => {
    const [items, setItems] = useState<T[]>([]);
    const [total, setTotal] = useState<number | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [debouncedInput, setDebouncedInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const requestGenRef = useRef(0);
    // Whether the user has opened the menu at least once. Used to gate the
    // refetch-on-deps-change effect so it doesn't double-fire alongside the
    // imperative open-time fetch below.
    const hasInitialFetchedRef = useRef(false);

    // Debounce input → debouncedInput.
    useEffect(() => {
        const t = setTimeout(() => setDebouncedInput(inputValue), SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(t);
    }, [inputValue]);

    const doFetch = useCallback(
        async (offset: number, search: string, generation: number) => {
            try {
                const response = await fetchPage(
                    { search: search.trim() || null, ...(extraFilter ?? {}) },
                    { offset, limit: PAGE_SIZE },
                );
                if (generation !== requestGenRef.current) return;
                const page = response.data;
                setTotal(page.pagination.total);
                setItems((prev) => (offset === 0 ? page.items : [...prev, ...page.items]));
            } catch {
                if (generation !== requestGenRef.current) return;
                // Errors here are silent — the dropdown just shows the existing list
                // (or "Немає даних" if empty). The page-level message holder owns
                // any user-facing error UX for the form this dropdown lives in.
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [fetchPage, JSON.stringify(extraFilter ?? {})],
    );

    // Refetch page 0 when the debounced query OR extraFilter changes — but
    // only after the first menu open. The initial fetch is fired imperatively
    // by handleMenuOpen so opening the menu doesn't double-fire here.
    useEffect(() => {
        if (!hasInitialFetchedRef.current) return;
        const generation = ++requestGenRef.current;
        setIsLoading(true);
        setItems([]);
        setTotal(null);
        doFetch(0, debouncedInput, generation).finally(() => {
            if (generation === requestGenRef.current) setIsLoading(false);
        });
    }, [debouncedInput, doFetch]);

    const handleMenuOpen = () => {
        if (hasInitialFetchedRef.current || isLoading) return;
        hasInitialFetchedRef.current = true;
        const generation = ++requestGenRef.current;
        setIsLoading(true);
        doFetch(0, debouncedInput, generation).finally(() => {
            if (generation === requestGenRef.current) setIsLoading(false);
        });
    };

    const handleScrollToBottom = () => {
        if (isLoading) return;
        if (total === null || items.length >= total) return;
        const generation = requestGenRef.current;
        setIsLoading(true);
        doFetch(items.length, debouncedInput, generation).finally(() => {
            if (generation === requestGenRef.current) setIsLoading(false);
        });
    };

    const handleChange = (option: SingleValue<OptionType>) => {
        if (!option) {
            onSelect(null);
            return;
        }
        const item = items.find((it) => mapToOption(it).value === option.value);
        onSelect(item ?? null);
    };

    const options = items.map(mapToOption);

    return (
        <BaseDropdown>
            <Select
                options={options}
                value={selected}
                onChange={handleChange}
                onInputChange={(value, meta) => {
                    // Track typing as the user types; clear on selection or menu
                    // close so the picked option's label isn't hidden behind a
                    // stale controlled input. (react-select's default behaviour
                    // when uncontrolled — we have to mirror it explicitly.)
                    if (meta.action === "input-change") {
                        setInputValue(value);
                    } else if (meta.action === "set-value" || meta.action === "menu-close") {
                        setInputValue("");
                    }
                }}
                inputValue={inputValue}
                onMenuOpen={handleMenuOpen}
                onMenuScrollToBottom={handleScrollToBottom}
                isLoading={isLoading}
                isClearable
                isSearchable
                placeholder={placeholder}
                noOptionsMessage={() => (isLoading ? "Завантаження..." : noOptionsMessage)}
                loadingMessage={() => "Завантаження..."}
                // Backend already filtered — disable client-side filter so
                // typed query doesn't hide options the server matched.
                filterOption={null}
                menuPortalTarget={document.body}
                styles={{
                    ...customStyles,
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
            />
        </BaseDropdown>
    );
};

export default AsyncEntitySearch;
