import { useState, useEffect } from "react";
import { ApiResponse } from "../../models/ApiResponse.ts";
import {ApiCallError} from "../errors.ts";

export const useFetchData = <T,>(fetchData: () => Promise<ApiResponse<T>>) => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        fetchData()
            .then((result) => {
                setData(result.data);
                setError(null);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
                if (err instanceof ApiCallError) {
                    setError(err.message);
                } else {
                    setError("An error occurred");
                }

                setIsLoading(false);
            });
    }, [fetchData]);

    return { data, isLoading, error };
};
