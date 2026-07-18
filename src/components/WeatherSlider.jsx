import { useSettings } from '../util/AppContext';
import { useEffect, useRef, useState } from 'react';

/**
 * Converts a weather/satellite slider index to a human-readable timestamp.
 */
export function timestampToTime(view, weatherData, sliderPoint) {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    if (view === 'weather') {
        if (sliderPoint >= weatherData.cast.length - 1) {
            return new Date(weatherData.cast[weatherData.cast.length - 1].time * 1000).toLocaleTimeString('en-US', options);
        }
        return new Date(weatherData.cast[sliderPoint].time * 1000).toLocaleTimeString('en-US', options);
    }
    if (view === 'satellite') {
        if (sliderPoint >= weatherData.satellite.infrared.length - 1) {
            return new Date(weatherData.satellite.infrared[weatherData.satellite.infrared.length - 1].time * 1000).toLocaleTimeString('en-US', options);
        }
        return new Date(weatherData.satellite.infrared[sliderPoint].time * 1000).toLocaleTimeString('en-US', options);
    }
    return null;
}

const SPEED_MAP = { 1: 1000, 2: 750, 3: 500 };

function WeatherSlider({ weatherData, weatherSlider, setWeatherSlider }) {
    const { settings } = useSettings();
    const [isLooping, setIsLooping] = useState(false);
    const [speed, setSpeed] = useState(1);
    const intervalRef = useRef(null);
    const isLoopingRef = useRef(isLooping);
    const speedRef = useRef(speed);

    // Keep refs in sync
    isLoopingRef.current = isLooping;
    speedRef.current = speed;

    const view = settings.view;

    const maxSlider = view === 'weather'
        ? weatherData.cast.length - 1
        : view === 'satellite'
            ? weatherData.satellite.infrared.length - 1
            : 0;

    // Loop interval with stable callback
    useEffect(() => {
        if (!isLooping) return;

        intervalRef.current = setInterval(() => {
            setWeatherSlider(prev => prev < maxSlider ? prev + 1 : 0);
        }, SPEED_MAP[speed] || 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isLooping, speed, maxSlider, setWeatherSlider]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const handleToggleLoop = () => setIsLooping(prev => !prev);

    return (
        <div className="flex flex-col gap-4 text-center card bg-base-300 text-base-content p-4">
            <label className="text-xl font-medium">{timestampToTime(view, weatherData, weatherSlider)}</label>
            <div className="flex flex-row items-center gap-2">
                <label className="text-xs">{timestampToTime(view, weatherData, 0)}</label>
                <input
                    type="range"
                    min={0}
                    value={weatherSlider}
                    max={maxSlider}
                    className="range w-72"
                    step={1}
                    onChange={(e) => setWeatherSlider(Number(e.target.value))}
                    onClick={() => setIsLooping(false)}
                />
                <label className="text-xs">{timestampToTime(view, weatherData, maxSlider)}</label>
            </div>
            <div className="flex flex-row items-center justify-center gap-2">
                <button
                    className={`btn border-none ${isLooping ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={handleToggleLoop}
                    title={isLooping ? 'Pause' : 'Play'}
                >
                    <i className={`fas ${isLooping ? 'fa-pause' : 'fa-play'}`}></i>
                </button>
                <div className="join">
                    <button className={`btn join-item ${speed === 1 ? 'btn-primary' : 'btn-neutral'}`} onClick={() => setSpeed(1)}><i className="fas fa-play" title="1x Speed"></i></button>
                    <button className={`btn join-item ${speed === 2 ? 'btn-primary' : 'btn-neutral'}`} onClick={() => setSpeed(2)}><i className="fas fa-forward" title="1.5x Speed"></i></button>
                    <button className={`btn join-item ${speed === 3 ? 'btn-primary' : 'btn-neutral'}`} onClick={() => setSpeed(3)}><i className="fas fa-fast-forward" title="2x Speed"></i></button>
                </div>
            </div>
        </div>
    );
}

export default WeatherSlider;
