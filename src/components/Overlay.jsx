import '../css/Overlay.css'

import { useSettings } from '../util/AppContext';
import { useState } from 'react';

import Settings from './Settings';
import EventList from './EventList';
import WidgetList from './WidgetList';
import WeatherSlider from './WeatherSlider';
import { ViewSwitcher, ScaleSwitcher } from './ViewControls';
import { useViewSafe } from '../util/hooks';

function Overlay({ alerts, weatherData, weatherSlider, setWeatherSlider }) {
    const { settings } = useSettings();
    const [scale, setScale] = useState('intensity');

    const setView = useViewSafe(weatherData, setWeatherSlider);

    return (
        <div className="overlay">
            <div className="item top-4">
                <Settings />
            </div>
            <div className="flex flex-col w-48 h-48 gap-4 item bottom-4">
                <ViewSwitcher view={settings.view} setView={setView} />
            </div>
            {settings.view === 'earthquake' && (
                <>
                    <div className="item right-4">
                        <EventList alerts={alerts} scale={scale} />
                    </div>
                    <div className="absolute inset-x-0 flex flex-col mx-auto item bottom-4 w-max">
                        <ScaleSwitcher scale={scale} setScale={setScale} />
                    </div>
                </>
            )}
            {(settings.view === 'weather' || settings.view === 'satellite' || settings.view === 'temperature') && (
                <>
                    <div className="item right-4">
                        <WidgetList />
                    </div>
                    {(settings.view === 'weather' || settings.view === 'satellite') && (
                        <div className="absolute inset-x-0 flex flex-col mx-auto item bottom-4 w-max">
                            <WeatherSlider weatherData={weatherData} weatherSlider={weatherSlider} setWeatherSlider={setWeatherSlider} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Overlay;