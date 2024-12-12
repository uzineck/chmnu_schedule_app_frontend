import { useState, useCallback } from 'react';
import {ApiResponse} from "../../models/ApiResponse.ts";

interface UseLoadDataReturn<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
    loadData: () => void;
}

export const useLoadData = <T,>(fetchData: () => Promise<ApiResponse<T>>): UseLoadDataReturn<T> => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(() => {
        setIsLoading(true);
        setError(null);
        fetchData()
            .then((response) => {
                setData(response.data);
                setError(null);
            })
            .catch((err) => {
                setError((err.message || "Unknown error occurred while loading data"));
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [fetchData]);

    return { data, isLoading, error, loadData };
};
