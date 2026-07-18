/* eslint-disable react/prop-types */

import { useEffect, useState, useRef } from 'react';
import { CircleMarker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

import { round } from '../util/Utils';
import { useSettings } from '../util/AppContext';

function EarthquakeMap({ alerts, minZoom, maxZoom, zoomLevel }) {
    const { settings } = useSettings();
    const [showMarkers, setShowMarkers] = useState(false);

    // Custom heatmap layer using leaflet.heat directly (compatible with react-leaflet v5)
    function HeatLayer({ points, radius, max, blur, gradient, maxZoom }) {
        const map = useMap();
        const layerRef = useRef(null);

        useEffect(() => {
            if (!points || points.length === 0) return;

            // leaflet.heat expects [[lat, lng, intensity], ...]
            const heatData = points.map(p => [p.lat, p.lng, p.value]);

            const heatLayer = L.heatLayer(heatData, {
                radius,
                max,
                blur,
                gradient,
                maxZoom,
                minOpacity: 0.3,
            });

            heatLayer.addTo(map);
            layerRef.current = heatLayer;

            return () => {
                map.removeLayer(heatLayer);
            };
        }, [map, points, radius, max, blur, gradient, maxZoom]);

        // Update layer options when they change without full teardown
        useEffect(() => {
            if (layerRef.current) {
                layerRef.current.setOptions({ radius, blur, max, gradient, maxZoom });
            }
        }, [radius, blur, max, gradient, maxZoom]);

        return null;
    }

    const gradients = {
        'jawg-dark': {
            0.0: 'rgb(255, 255, 255)',
            0.2: 'rgb(255, 224, 0)',
            0.4: 'rgb(255, 193, 0)',
            0.6: 'rgb(255, 162, 0)',
            0.8: 'rgb(255, 131, 0)',
            1.0: 'rgb(255, 100, 0)',
        },
        'jawg-light': {
            0.0: 'rgb(0, 0, 0)',
            0.2: 'rgb(0, 0, 224)',
            0.4: 'rgb(0, 0, 193)',
            0.6: 'rgb(0, 0, 162)',
            0.8: 'rgb(0, 0, 131)',
            1.0: 'rgb(0, 0, 100)',
        }
    };

    // Show individual markers when zoomed in
    useEffect(() => {
        setShowMarkers(zoomLevel >= 6);
    }, [zoomLevel]);

    const getMarkerSize = (intensity) => {
        const value = parseFloat(intensity) || 1;
        return Math.max(4, Math.min(value * 2, 20));
    };

    const getMarkerColor = (intensity) => {
        const value = parseFloat(intensity) || 1;
        if (value >= 7) return '#DC2626'; // red-600
        if (value >= 6) return '#EA580C'; // orange-600
        if (value >= 5) return '#F59E0B'; // amber-500
        if (value >= 4) return '#EAB308'; // yellow-500
        if (value >= 3) return '#84CC16'; // lime-500
        return '#22C55E'; // green-500
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    const MapEvents = () => {
        useMapEvents({
            click: (e) => {
                const alert = alerts.find(alert =>
                    round(alert.coordinates.latitude, 0) === round(e.latlng.lat, 0) &&
                    round(alert.coordinates.longitude, 0) === round(e.latlng.lng, 0)
                );

                if (alert) {
                    console.log('Earthquake:', alert);
                }
            },
        });
        return null;
    };

    const heatmapData = alerts.map(alert => ({
        lat: alert.coordinates.latitude,
        lng: alert.coordinates.longitude,
        value: parseInt(alert.properties.intensity) || parseFloat(alert.properties.magnitude) || 1
    }));

    const getValue = (val, min, max) => {
        val = Math.min(Math.max(val, minZoom), maxZoom);
        return min + (max - min) * ((val - minZoom) / (maxZoom - minZoom)) ** 2;
    };

    return (
        <>
            {!showMarkers && (
                <HeatLayer
                    points={heatmapData}
                    radius={getValue(zoomLevel, 25, 8)}
                    max={10}
                    blur={getValue(zoomLevel, 20, 8)}
                    gradient={gradients[settings.map]}
                    maxZoom={maxZoom}
                />
            )}
            {showMarkers && alerts.map((alert) => {
                // Safely extract intensity: handle objects ({no, color}), strings, and numbers
                const rawIntensity = alert.properties.intensity || alert.properties.magnitude || 1;
                const intensity = typeof rawIntensity === 'object' ? (rawIntensity.no || 1) : rawIntensity;
                const scale = alert.properties.intensity ? 'intensity' : 'magnitude';

                return (
                    <CircleMarker
                        key={alert.id}
                        center={[alert.coordinates.latitude, alert.coordinates.longitude]}
                        radius={getMarkerSize(intensity)}
                        pathOptions={{
                            fillColor: getMarkerColor(intensity),
                            color: '#fff',
                            weight: 1.5,
                            opacity: 0.9,
                            fillOpacity: 0.7
                        }}
                    >
                        <Popup>
                            <div className="min-w-[240px]">
                                <div className="pb-2 mb-2 text-lg font-bold border-b">
                                    {alert.properties.location}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm opacity-70">
                                            {scale === 'intensity' ? 'Intensity' : 'Magnitude'}
                                        </span>
                                        <span
                                            className="font-bold badge badge-lg"
                                            style={{
                                                backgroundColor: getMarkerColor(intensity),
                                                color: 'white',
                                                border: 'none'
                                            }}
                                        >
                                            {intensity}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm opacity-70">Depth</span>
                                        <span className="font-semibold">
                                            {Math.round(alert.properties.depth)} km
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm opacity-70">Time</span>
                                        <span className="text-sm">
                                            {formatTime(alert.properties.time)}
                                        </span>
                                    </div>
                                    <div className="pt-2 text-xs border-t opacity-60">
                                        {new Date(alert.properties.time).toLocaleString('en-US', {
                                            weekday: 'short',
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </CircleMarker>
                );
            })}
            <MapEvents />
        </>
    );
}

export default EarthquakeMap;