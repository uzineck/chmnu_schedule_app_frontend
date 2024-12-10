import BaseDropDownSearch, {OptionType} from "../Search/BaseDropDownSearch.tsx";
import {useFetchData} from "../../api/hooks/useFetchData.tsx";
import {ApiResponse} from "../../models/ApiResponse.ts";
import {SingleValue} from "react-select";
import {useEffect} from "react";

interface EntitySearchProps<T> {
    fetchData: () => Promise<ApiResponse<T[]>>;
    mapToOptions: (data: T) => { value: string; label: string };
    onEntitySelect: (entity: T | null) => void;
    placeholder: string;
    noOptionsMessage: string;
    selectedOption: OptionType | null;
    onDataFetched: (data: T[]) => void;
}

const EntitySearch = <T,>({
                              fetchData,
                              mapToOptions,
                              onEntitySelect,
                              placeholder,
                              noOptionsMessage,
                              selectedOption,
                              onDataFetched
                          }: EntitySearchProps<T>) => {
    const { data: entities, isLoading } = useFetchData(fetchData);

    useEffect(() => {
        if (entities) {
            onDataFetched(entities);
        }
    }, [entities, onDataFetched]);

    const options = (entities || []).map(mapToOptions);

    const handleChange = (selectedOption: SingleValue<OptionType>) => {
        const entity = entities?.find(
            (item: T) => mapToOptions(item).value === selectedOption?.value
        ) || null;
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
