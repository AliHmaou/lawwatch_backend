import { useState, useEffect, useCallback } from 'react';
import { Amendment } from '../types';
import { parseJSON } from '../utils/helpers';

export const useAmendments = () => {
    const [amendments, setAmendments] = useState<Amendment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleDataLoaded = useCallback((fileContent: string) => {
        try {
            const data = parseJSON(fileContent);
            setAmendments(data);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            setError(`Erreur de parsing JSON : ${errorMessage}`);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('https://huggingface.co/datasets/alihmaou/plf2026_amendements/resolve/main/PLF2026_LECTURE_1_ANALYSE_AMENDEMENTS_NOTEXT.json');
                if (!response.ok) {
                    throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
                }
                const text = await response.text();
                handleDataLoaded(text);
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : String(e);
                setError(`Impossible de charger les données : ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [handleDataLoaded]);

    return { amendments, loading, error };
};
