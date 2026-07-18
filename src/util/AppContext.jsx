/* eslint-disable react/prop-types */

import { createContext, useContext, useState } from 'react';

// Cities Context
const CitiesContext = createContext();

export function CitiesProvider({ children }) {
    const [cities, setCities] = useState(JSON.parse(localStorage.getItem('cities')) || []);

    const setCitiesSafe = (cities) => {
        setCities(cities);
        localStorage.setItem('cities', JSON.stringify(cities));
        return cities;
    };

    return (
        <CitiesContext.Provider value={{ cities, setCities: setCitiesSafe }}>
            {children}
        </CitiesContext.Provider>
    );
}

export function useCities() {
    return useContext(CitiesContext);
}

// Settings Context
const SettingsContext = createContext();

const defaultSettings = {
    theme: 'dark',
    map: 'jawg-dark',
    view: 'earthquake',
    widget: {
        options: [],
        extended_data: [],
        extended_summary: [],
        units: {
            temperature: '',
            wind_speed: '',
            precipitation: '',
        }
    }
};

// Helper function to check if the object matches the structure of the defaultSettings
const isMatchingStructure = (obj, reference) => {
    if (typeof obj !== typeof reference) return false;

    if (typeof obj === 'object' && !Array.isArray(obj) && obj !== null) {
        const keys = Object.keys(reference);
        for (let key of keys) {
            if (!(key in obj) || !isMatchingStructure(obj[key], reference[key])) {
                return false;
            }
        }
    }

    return true;
};

export function SettingsProvider({ children }) {
    const loadSettings = () => {
        const savedSettings = localStorage.getItem('settings') ?
            JSON.parse(localStorage.getItem('settings')) : null;

        // Check if the saved settings match the structure of defaultSettings
        if (savedSettings && isMatchingStructure(savedSettings, defaultSettings)) {
            return savedSettings;
        } else {
            return defaultSettings;
        }
    };

    const [settings, setSettingsSafe] = useState(loadSettings);

    const setSettings = (newSettings) => {
        setSettingsSafe(newSettings);
        localStorage.setItem('settings', JSON.stringify(newSettings));
        return newSettings;
    };

    return (
        <SettingsContext.Provider value={{ settings, setSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return useContext(SettingsContext);
}

// Units Context
const UnitsContext = createContext();

export function UnitsProvider({ children }) {
    const { settings } = useSettings();
    const [units, setUnits] = useState(settings.widget.units);

    return (
        <UnitsContext.Provider value={{ units, setUnits: setUnits }}>
            {children}
        </UnitsContext.Provider>
    );
}

export function useUnits() {
    return useContext(UnitsContext);
}

// Combined Provider
export function AppProvider({ children }) {
    return (
        <SettingsProvider>
            <CitiesProvider>
                <UnitsProvider>
                    {children}
                </UnitsProvider>
            </CitiesProvider>
        </SettingsProvider>
    );
}
