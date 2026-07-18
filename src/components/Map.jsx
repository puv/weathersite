/* eslint-disable react/prop-types */

import '../css/Map.css';

import { Circle, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';

import EarthquakeMap from '../maps/EarthquakeMap';
import WeatherMap from '../maps/WeatherMap';
import TemperatureMap from '../maps/TemperatureMap';
import { useSettings } from '../util/AppContext';

function Map({ accessTokens, alerts, weatherData, weatherSlider }) {
    const { settings } = useSettings();
    const [zoomLevel, setZoomLevel] = useState(3);
    const [mapId, setMapId] = useState('jawg-dark');
    const [userLocation, setUserLocation] = useState(null);
    const minZoom = 3;
    const maxZoom = 15;

    useEffect(() => {
        setMapId(settings.map);
    }, [settings.map]);

    const MapEvents = () => {
        const map = useMapEvents({
            zoomend: () => {
                setZoomLevel(map.getZoom());
            },
            moveend: () => {
                map.invalidateSize();
            },
            locationfound: (e) => {
            },
        });

        return null;
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]);
        });
    }, []);


    const UserLocationEvent = () => {
        const map = useMap();

        if (!userLocation) map.locate({ setView: true, maxZoom: ((minZoom + maxZoom) / 3), animate: true, duration: 1 });

        const calculateRadius = () => {
            const minRadius = 500;
            const maxRadius = 50000;
            const latLng = userLocation ? L.latLng(userLocation) : map.getCenter();
            const pointC = map.latLngToContainerPoint(latLng); // convert latLng to container point (pixels)
            const pointX = [pointC.x + 25, pointC.y]; // 100 pixels to the right
            const latLngX = map.containerPointToLatLng(pointX); // convert that point back to latLng
            const distance = latLng.distanceTo(latLngX); // calculate distance between the two points in meters
            if (distance < minRadius) return minRadius;
            if (distance > maxRadius) return maxRadius;
            return distance;
        };

        return userLocation ? (
            <>
                <Circle
                    className='bg-accent'
                    center={userLocation}
                    radius={calculateRadius()} // set dynamic radius based on zoom
                    pathOptions={{
                        color: 'transparent',
                        fillColor: 'var(--fallback-p, oklch(var(--p) / var(--tw-bg-opacity)))',
                        fillOpacity: 0.65,
                    }}
                />
            </>
        ) : null;
    };

    return (
        <>
            <div className="relative w-full h-full">
                <MapContainer
                    center={[30, 20]}
                    minZoom={minZoom}
                    maxZoom={maxZoom}
                    zoom={zoomLevel}
                    zoomControl={false}
                    markerZoomAnimation={true}
                    boxZoom={true}
                    touchZoom={true}
                    maxBounds={[[-90, -240], [90, 240]]}
                >
                    <TileLayer
                        url={`https://tile.jawg.io/${mapId}/{z}/{x}/{y}{r}.png?access-token=${accessTokens.jawg}`}
                        updateWhenZooming={true}
                    />
                    {(settings.view === 'weather' || settings.view === 'satellite') && (
                        <WeatherMap view={settings.view} weatherData={weatherData} weatherSlider={weatherSlider} />
                    )}
                    {settings.view === 'temperature' && (
                        <TemperatureMap accessToken={accessTokens.owm} />
                    )}
                    {settings.view === 'earthquake' && (
                        <EarthquakeMap alerts={alerts} minZoom={minZoom} maxZoom={maxZoom} zoomLevel={zoomLevel} />
                    )}
                    <MapEvents />
                    <UserLocationEvent />
                </MapContainer>
            </div>
        </>
    );
}

export default Map;
