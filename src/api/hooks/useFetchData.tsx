import { useState, useEffect } from "react";
import {ApiResponse} from "../../models/ApiResponse.ts";

export const useFetchData = <T,>(fetchData: () => Promise<ApiResponse<T>>) => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setIsLoading(true);
        fetchData()
            .then((result) => {
                setData(result.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
                setError(err);
                setIsLoading(false);
            });
    }, [fetchData]);

    return { data, isLoading, error };
};
