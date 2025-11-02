import { useMemo } from 'react';
import { Amendment, Filter } from '../types';

export const useFilteredAmendments = (amendments: Amendment[], activeFilters: Filter[], searchText: string) => {
    return useMemo(() => {
        let results = amendments;

        if (activeFilters.length > 0) {
            const groupedFilters = activeFilters.reduce((acc: Record<string, string[]>, filter) => {
                const { type, value } = filter;
                if (!acc[type]) {
                    acc[type] = [];
                }
                acc[type].push(value);
                return acc;
            }, {} as Record<string, string[]>);
        
            results = results.filter(am => {
                return Object.entries(groupedFilters).every(([type, values]) => {
                    const key = type as keyof Amendment;
                    return values.includes(String(am[key]));
                });
            });
        }

        const lowercasedQuery = searchText.trim().toLowerCase();
        if (lowercasedQuery) {
            results = results.filter(am => {
                return Object.values(am).some(value => 
                    String(value).toLowerCase().includes(lowercasedQuery)
                );
            });
        }

        return results;
    }, [amendments, activeFilters, searchText]);
};
