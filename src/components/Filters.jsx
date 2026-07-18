/* eslint-disable react/prop-types */
import { useState, useMemo } from 'react';

export function AlertFilters({ onFilterChange, alerts }) {
    const [minMagnitude, setMinMagnitude] = useState(0);
    const [maxMagnitude, setMaxMagnitude] = useState(10);
    const [minDepth, setMinDepth] = useState(0);
    const [maxDepth, setMaxDepth] = useState(1000);
    const [selectedSources, setSelectedSources] = useState([]);
    const [searchLocation, setSearchLocation] = useState('');

    // Get unique sources from alerts
    const availableSources = useMemo(() => {
        if (!alerts) return [];
        const sources = [...new Set(alerts.map(a => a.tag))].filter(Boolean);
        return sources.sort();
    }, [alerts]);

    const applyFilters = () => {
        onFilterChange({
            minMagnitude,
            maxMagnitude,
            minDepth,
            maxDepth,
            sources: selectedSources,
            location: searchLocation
        });
    };

    const resetFilters = () => {
        setMinMagnitude(0);
        setMaxMagnitude(10);
        setMinDepth(0);
        setMaxDepth(1000);
        setSelectedSources([]);
        setSearchLocation('');
        onFilterChange({
            minMagnitude: 0,
            maxMagnitude: 10,
            minDepth: 0,
            maxDepth: 1000,
            sources: [],
            location: ''
        });
    };

    const toggleSource = (source) => {
        setSelectedSources(prev =>
            prev.includes(source)
                ? prev.filter(s => s !== source)
                : [...prev, source]
        );
    };

    return (
        <div className="bg-base-200 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <i className="fa-solid fa-filter"></i>
                Filter Earthquakes
            </h3>

            {/* Magnitude Filter */}
            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Magnitude: {minMagnitude.toFixed(1)} - {maxMagnitude.toFixed(1)}
                </label>
                <div className="flex gap-2 items-center">
                    <span className="text-xs">Min</span>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.1"
                        value={minMagnitude}
                        onChange={(e) => setMinMagnitude(parseFloat(e.target.value))}
                        className="range range-sm range-primary flex-1"
                    />
                    <span className="text-xs">Max</span>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.1"
                        value={maxMagnitude}
                        onChange={(e) => setMaxMagnitude(parseFloat(e.target.value))}
                        className="range range-sm range-primary flex-1"
                    />
                </div>
            </div>

            {/* Depth Filter */}
            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Depth (km): {minDepth} - {maxDepth}
                </label>
                <div className="flex gap-2 items-center">
                    <span className="text-xs">Min</span>
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        step="10"
                        value={minDepth}
                        onChange={(e) => setMinDepth(parseInt(e.target.value))}
                        className="range range-sm range-secondary flex-1"
                    />
                    <span className="text-xs">Max</span>
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        step="10"
                        value={maxDepth}
                        onChange={(e) => setMaxDepth(parseInt(e.target.value))}
                        className="range range-sm range-secondary flex-1"
                    />
                </div>
            </div>

            {/* Location Search */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Location Search</label>
                <input
                    type="text"
                    placeholder="Search by location..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="input input-bordered input-sm w-full"
                />
            </div>

            {/* Source Filter */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Data Sources</label>
                <div className="flex flex-wrap gap-2">
                    {availableSources.map(source => (
                        <button
                            key={source}
                            onClick={() => toggleSource(source)}
                            className={`badge ${selectedSources.includes(source)
                                    ? 'badge-primary'
                                    : 'badge-ghost'
                                } cursor-pointer`}
                        >
                            {source}
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
                <button
                    onClick={resetFilters}
                    className="btn btn-ghost btn-sm"
                >
                    <i className="fa-solid fa-rotate-right"></i>
                    Reset
                </button>
                <button
                    onClick={applyFilters}
                    className="btn btn-primary btn-sm"
                >
                    <i className="fa-solid fa-check"></i>
                    Apply Filters
                </button>
            </div>
        </div>
    );
}

export function applyAlertFilters(alerts, filters) {
    if (!alerts) return [];

    return alerts.filter(alert => {
        const mag = alert.properties.magnitude.no;
        const depth = alert.properties.depth || 0;
        const location = alert.properties.location || '';
        const source = alert.tag;

        // Magnitude filter
        if (mag < filters.minMagnitude || mag > filters.maxMagnitude) {
            return false;
        }

        // Depth filter
        if (depth < filters.minDepth || depth > filters.maxDepth) {
            return false;
        }

        // Location filter
        if (filters.location && !location.toLowerCase().includes(filters.location.toLowerCase())) {
            return false;
        }

        // Source filter
        if (filters.sources && filters.sources.length > 0 && !filters.sources.includes(source)) {
            return false;
        }

        return true;
    });
}
