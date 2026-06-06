import BaseDropDownSearch, { OptionType } from "./BaseDropDownSearch.tsx";
import { useFetchData } from "../../api/hooks/useFetchData.tsx";
import { ApiResponse } from "../../models/ApiResponse.ts";
import { SingleValue } from "react-select";

interface EntitySearchProps<T> {
    fetchData: () => Promise<ApiResponse<T[]>>;
    mapToOption: (entity: T) => OptionType;
    onEntitySelect: (entity: T | null) => void;
    selectedOption: OptionType | null;
    placeholder: string;
    noOptionsMessage: string;
}

const EntitySearch = <T,>({
    fetchData,
    mapToOption,
    onEntitySelect,
    selectedOption,
    placeholder,
    noOptionsMessage,
}: EntitySearchProps<T>) => {
    const { data: entities, isLoading } = useFetchData(fetchData);

    const options = (entities ?? []).map(mapToOption);

    const handleChange = (option: SingleValue<OptionType>) => {
        const entity = entities?.find((e) => mapToOption(e).value === option?.value) ?? null;
        onEntitySelect(entity);
    };

    return (
        <BaseDropDownSearch
            options={options}
            onChange={handleChange}
            placeholder={placeholder}
            isLoading={isLoading}
            noOptionsMessage={noOptionsMessage}
            value={selectedOption}
        />
    );
};

export default EntitySearch;
