/* eslint-disable react/prop-types */
import { useState } from 'react';

export function DateRangeSelector({ onDateChange, currentDate }) {
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date.toISOString().split('T')[0];
    });

    const [endDate, setEndDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });

    const [showPicker, setShowPicker] = useState(false);

    const handleApply = () => {
        if (startDate && endDate) {
            if (new Date(startDate) > new Date(endDate)) {
                alert('Start date must be before end date');
                return;
            }
            onDateChange(startDate, endDate);
            setShowPicker(false);
        }
    };

    const setPreset = (days) => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - days);

        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(end.toISOString().split('T')[0]);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowPicker(!showPicker)}
                className="btn btn-sm btn-ghost"
                aria-label="Select date range"
            >
                <i className="fa-solid fa-calendar-days"></i>
                Date Range
            </button>

            {showPicker && (
                <div className="absolute top-full right-0 mt-2 bg-base-100 rounded-lg shadow-xl p-4 z-50 w-80">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold">Select Date Range</h3>
                        <button
                            onClick={() => setShowPicker(false)}
                            className="btn btn-ghost btn-xs btn-circle"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        <button
                            onClick={() => setPreset(1)}
                            className="btn btn-xs btn-ghost"
                        >
                            Last 24h
                        </button>
                        <button
                            onClick={() => setPreset(7)}
                            className="btn btn-xs btn-ghost"
                        >
                            Last 7 days
                        </button>
                        <button
                            onClick={() => setPreset(30)}
                            className="btn btn-xs btn-ghost"
                        >
                            Last 30 days
                        </button>
                    </div>

                    {/* Date Inputs */}
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-medium mb-1 block">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                max={endDate}
                                className="input input-bordered input-sm w-full"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium mb-1 block">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate}
                                max={new Date().toISOString().split('T')[0]}
                                className="input input-bordered input-sm w-full"
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="alert alert-info mt-3 py-2 text-xs">
                        <i className="fa-solid fa-info-circle"></i>
                        <span>Historical data may be limited by API providers</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 justify-end mt-3">
                        <button
                            onClick={() => setShowPicker(false)}
                            className="btn btn-ghost btn-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            className="btn btn-primary btn-sm"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export function formatDateForAPI(date) {
    if (typeof date === 'string') {
        return `${date}T00:00:00`;
    }
    return date.toISOString().split('.')[0];
}
