import './css/App.css'

import { useEffect, useState } from 'react';

import Map from './components/Map';
import Overlay from './components/Overlay';
import { fetchAlerts } from './util/Alerts';
import { useSettings } from './util/AppContext';
import { useViewSafe } from './util/hooks';

const JAWG_TOKEN = import.meta.env.VITE_JAWG_ACCESS_TOKEN || '';
const OWM_TOKEN = import.meta.env.VITE_OPENWEATHER_API_KEY || '';

const fetchWeatherCast = async () => {
	try {
		const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
		let data = await response.json();

		const timePathArray = [];
		timePathArray.push(data.radar.nowcast);
		timePathArray.push(data.radar.past);
		const timePathArrayFlatten = timePathArray.flat();
		timePathArrayFlatten.sort((a, b) => a.time - b.time);

		data.cast = timePathArrayFlatten;
		return data;
	} catch (err) {
		console.error('Failed to fetch weather data:', err);
		return null;
	}
};

function App() {
	const { settings, setSettings } = useSettings();
	const [alerts, setAlerts] = useState([]);
	const [weatherData, setWeatherData] = useState([]);
	const [weatherSlider, setWeatherSlider] = useState(0);

	const setViewSafe = useViewSafe(weatherData, setWeatherSlider);

	useEffect(() => {
		let cancelled = false;

		fetchAlerts().then(alerts => {
			if (!cancelled) setAlerts(alerts);
		});

		const interval = setInterval(() => {
			fetchAlerts().then(alerts => {
				if (!cancelled && alerts.length > 0) {
					setAlerts(alerts);
				}
			});
		}, 10000);

		return () => {
			cancelled = true;
			clearInterval(interval);
		};
	}, []);

	useEffect(() => {
		const getCast = async () => {
			const data = await fetchWeatherCast();
			if (data) setWeatherData(data);
		};
		getCast();

		const interval = setInterval(getCast, 60000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const localView = localStorage.getItem('view');
		if (localView) {
			setViewSafe(localView);
		}
		// Only run on mount
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', settings.theme);
	}, [settings.theme]);

	return (
		<>
			<Map
				accessTokens={{
					jawg: JAWG_TOKEN,
					owm: OWM_TOKEN
				}}
				alerts={alerts}
				weatherData={weatherData}
				weatherSlider={weatherSlider}
			/>
			{
				weatherData?.host && <Overlay
					alerts={alerts}
					weatherData={weatherData}
					weatherSlider={weatherSlider}
					setWeatherSlider={setWeatherSlider}
				/>
			}
		</>
	)
}

export default App;
