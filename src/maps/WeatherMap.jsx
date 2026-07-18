/* eslint-disable react/prop-types */

import { TileLayer } from 'react-leaflet';

function WeatherMap({ view, weatherData, weatherSlider }) {
    const squareSize = 256;
    const getMapUrl = () => {
        if (view === 'satellite') {
            return `${weatherData.host}${weatherData.satellite.infrared[weatherSlider].path}/${squareSize}/{z}/{x}/{y}/0/1_0.png`;
        }
        if (view === 'weather') {
            // 1, 2, 3, 5, EIGHT
            return `${weatherData.host}${weatherData.cast[weatherSlider].path}/${squareSize}/{z}/{x}/{y}/8/1_1.png`;
        }
    };

    return (
        <>
            {
                ((view == 'satellite' && weatherData?.satellite) ||
                    (view == 'weather' && weatherData?.cast)) &&
                <TileLayer
                    minZoom={3}
                    maxZoom={10}
                    tileSize={squareSize}
                    opacity={0.75}
                    zIndex={10}
                    url={getMapUrl()}
                />
            }
        </>
    )
}

export default WeatherMap;