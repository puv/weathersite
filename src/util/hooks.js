import { useRef, useCallback } from 'react';
import { useSettings } from './AppContext';

/**
 * Shared view-switching logic used by both App.jsx and Overlay.jsx.
 * Sets the weather slider to the appropriate position and persists
 * the view choice to localStorage and the DOM data-view attribute.
 */
export function useViewSafe(weatherData, setWeatherSlider) {
    const { settings, setSettings } = useSettings();

    const setViewSafe = useCallback((view) => {
        if (view === 'satellite') {
            if (weatherData?.satellite) setWeatherSlider(weatherData.satellite.infrared.length - 1);
            else setWeatherSlider(0);
        }
        if (view === 'weather') {
            if (weatherData?.cast) setWeatherSlider(weatherData.cast.length - 4);
            else setWeatherSlider(0);
        }
        if (view === 'temperature') {
            setWeatherSlider(0);
        }
        localStorage.setItem('view', view);
        document.documentElement.setAttribute('data-view', view);
        setSettings({ ...settings, view });
    }, [weatherData, setWeatherSlider, settings, setSettings]);

    return setViewSafe;
}

/**
 * A debounce hook that returns a debounced version of the callback.
 * Uses useRef internally to avoid unnecessary re-renders.
 */
export function useDebounce(callback, delay) {
    const timeoutRef = useRef(null);

    const debouncedFn = useCallback((...args) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);

    return debouncedFn;
}
