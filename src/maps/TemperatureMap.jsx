/* eslint-disable react/prop-types */

import { TileLayer, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { useSettings } from '../util/AppContext';

function TemperatureMap({ accessToken }) {
    const { settings } = useSettings();
    const squareSize = 256;
    const layer = 'temp_new';
    const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, temp: null });
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    const convertTemperature = (kelvin) => {
        const celsius = kelvin - 273.15;
        const unit = settings.widget?.units?.temperature || 'celsius';

        switch (unit) {
            case 'fahrenheit':
                return `${(celsius * 9 / 5 + 32).toFixed(1)}°F`;
            case 'celsius':
                return `${celsius.toFixed(1)}°C`;
            case 'kelvin':
                return `${kelvin.toFixed(1)}K`;
            default:
                return `${celsius.toFixed(1)}°C`;
        }
    };

    const fetchTemperature = async (lat, lon) => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${accessToken}`
            );
            const data = await response.json();
            if (data.main && data.main.temp) {
                return data.main.temp;
            }
        } catch (error) {
            console.error('Error fetching temperature:', error);
        }
        return null;
    };

    const MapHoverEvents = () => {
        useMapEvents({
            mousemove: (e) => {
                const { lat, lng } = e.latlng;
                const { x, y } = e.containerPoint;

                // Clear existing timeout
                if (debounceTimeout) {
                    clearTimeout(debounceTimeout);
                }

                // Set new timeout to avoid too many API calls
                const newTimeout = setTimeout(async () => {
                    const temp = await fetchTemperature(lat, lng);
                    if (temp !== null) {
                        setTooltip({
                            show: true,
                            x: x + 15,
                            y: y + 15,
                            temp: convertTemperature(temp)
                        });
                    }
                }, 100);

                setDebounceTimeout(newTimeout);
            },
            mouseout: () => {
                setTooltip({ show: false, x: 0, y: 0, temp: null });
                if (debounceTimeout) {
                    clearTimeout(debounceTimeout);
                }
            }
        });

        return null;
    };

    useEffect(() => {
        return () => {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }
        };
    }, [debounceTimeout]);

    return (
        <>
            <TileLayer
                minZoom={3}
                maxZoom={10}
                tileSize={squareSize}
                opacity={0.75}
                zIndex={10}
                url={`https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${accessToken}`}
            />
            <MapHoverEvents />
            {tooltip.show && tooltip.temp && (
                <div
                    style={{
                        position: 'fixed',
                        left: `${tooltip.x}px`,
                        top: `${tooltip.y}px`,
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        zIndex: 1000,
                        pointerEvents: 'none',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {tooltip.temp}
                </div>
            )}
        </>
    );
}

export default TemperatureMap;
