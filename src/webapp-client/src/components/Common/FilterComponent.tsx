import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Amendment, Filter } from '../../types';

interface FilterComponentProps {
    amendments: Amendment[];
    activeFilters: Filter[];
    setActiveFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
    searchText: string;
    setSearchText: React.Dispatch<React.SetStateAction<string>>;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ amendments, activeFilters, setActiveFilters, searchText, setSearchText }) => {
    const [suggestions, setSuggestions] = useState<Filter[]>([]);
    const [isSuggestionsVisible, setSuggestionsVisible] = useState(false);
    const filterWrapperRef = useRef<HTMLDivElement>(null);

    const filterCategories = useMemo<Array<{type: keyof Amendment, label: string}>>(() => [
        { type: 'groupe', label: 'Groupe' },
        { type: 'sort', label: 'Sort' },
        { type: 'ia_type_mesure', label: 'Type de mesure' },
        { type: 'ia_acteur_gagnant', label: 'Gagnant' },
        { type: 'ia_acteur_perdant', label: 'Perdant' },
        { type: 'ia_theme', label: 'Thème' }
    ], []);

    const allFilterOptions = useMemo(() => {
        const options: Filter[] = [];
        filterCategories.forEach(({ type, label }) => {
            const values = [...new Set(amendments.map(a => a[type]).filter(Boolean))];
            values.forEach(value => {
                // FIX: Cast value to string. The type inference was resulting in `unknown`,
                // causing a type error. `filter(Boolean)` ensures it's a truthy string at runtime.
                options.push({ type, label, value: value as string });
            });
        });
        return options;
    }, [amendments, filterCategories]);

    useEffect(() => {
        if (searchText.trim() === '') {
            setSuggestions([]);
            return;
        }
        const lowercasedInput = searchText.toLowerCase();
        const filteredSuggestions = allFilterOptions.filter(opt => {
            const fullText = `${opt.label}: ${opt.value}`.toLowerCase();
            return fullText.includes(lowercasedInput) && 
                   !activeFilters.some(af => af.type === opt.type && af.value === opt.value);
        });
        setSuggestions(filteredSuggestions.slice(0, 10));
    }, [searchText, allFilterOptions, activeFilters]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterWrapperRef.current && !filterWrapperRef.current.contains(event.target as Node)) {
                setSuggestionsVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const addFilter = (filter: Filter) => {
        setActiveFilters(prev => [...prev, filter]);
        setSearchText('');
        setSuggestionsVisible(false);
    };
    
    const removeFilter = (filterToRemove: Filter) => {
        setActiveFilters(prev => prev.filter(f => f.type !== filterToRemove.type || f.value !== filterToRemove.value));
    };

    return (
        <div className="filter-section">
            <div className="filters" ref={filterWrapperRef}>
                <div className="filter-input-wrapper">
                    <span className="material-icons filter-input-icon">search</span>
                    <input
                        type="text"
                        placeholder="Rechercher ou ajouter un filtre..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onFocus={() => setSuggestionsVisible(true)}
                    />
                    {isSuggestionsVisible && suggestions.length > 0 && (
                        <ul className="filter-suggestions">
                            {suggestions.map((s, i) => (
                               <li key={`${s.type}-${s.value}-${i}`} onClick={() => addFilter(s)}>
                                   <strong>{s.label}:</strong> {s.value}
                               </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <div className="chip-container">
                {activeFilters.map((f, i) => (
                    <div key={`${f.type}-${f.value}-${i}`} className="chip">
                        <span><strong>{f.label}:</strong> {f.value}</span>
                        <button onClick={() => removeFilter(f)} className="chip-remove">
                            <span className="material-icons">close</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FilterComponent;