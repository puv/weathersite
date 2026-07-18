/* eslint-disable react/prop-types */

import { dataToggleLegend, extendedSummaryLegend } from '../util/StatLegend';
import { useCities, useSettings } from '../util/AppContext';
import { useEffect, useState, useMemo, memo, useRef, useCallback } from 'react';

import { WeatherCodeLegend } from '../util/WeatherCodeLegend';

function Widget({ city }) {
    const { settings } = useSettings();
    const [units, setUnits] = useState({});
    const { cities, setCities } = useCities();
    const [data, setData] = useState(null);
    const [time, setTime] = useState("");
    const timeIntervalRef = useRef(null);
    const refreshTimeoutRef = useRef(null);

    const removeCity = useCallback(() => {
        setCities(cities.filter(c => c.id !== city.id));
    }, [cities, city.id, setCities]);

    const updateTime = useCallback((timezone) => {
        const options = { hour: 'numeric', minute: 'numeric', hour12: false, timeZone: timezone };
        const newTime = new Date().toLocaleTimeString('en-US', options);
        setTime(prev => prev === newTime ? prev : newTime);
    }, []);

    const fetchData = useCallback(async (paramString = "") => {
        if (settings.widget.units.temperature) paramString += `&temperature_unit=${settings.widget.units.temperature}`;
        if (settings.widget.units.wind_speed) paramString += `&wind_speed_unit=${settings.widget.units.wind_speed}`;
        if (settings.widget.units.precipitation) paramString += `&precipitation_unit=${settings.widget.units.precipitation}`;

        paramString += "&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m";
        paramString += "&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m";

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&timezone=auto${paramString}`);
        const fetchedData = await response.json();
        setData(fetchedData);
        updateTime(fetchedData.timezone);
    }, [settings.widget.units, city.lat, city.lon, updateTime]);

    // Fetch data on mount and unit change
    useEffect(() => {
        const unitsStr = JSON.stringify(settings.widget.units);
        if (units !== unitsStr) {
            setUnits(unitsStr);
            fetchData();
        }
    }, [settings, units, fetchData]);

    // Update time every second with cleanup
    useEffect(() => {
        if (!data?.timezone) return;

        timeIntervalRef.current = setInterval(() => {
            updateTime(data.timezone);
        }, 1000);

        return () => {
            if (timeIntervalRef.current) {
                clearInterval(timeIntervalRef.current);
                timeIntervalRef.current = null;
            }
        };
    }, [data?.timezone, updateTime]);

    // Refetch data every 30 minutes with cleanup
    useEffect(() => {
        if (!data) return;

        refreshTimeoutRef.current = setTimeout(() => {
            fetchData();
        }, 1000 * 60 * 30);

        return () => {
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
                refreshTimeoutRef.current = null;
            }
        };
    }, [data, fetchData]);

    // Cleanup all timers on unmount
    useEffect(() => {
        return () => {
            if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
            if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
        };
    }, []);

    function getWeatherForSpecificTimes(weatherData, desiredTimes, timezone) {
        const options = { timeZone: timezone };
        const result = [];
        // Get the current time with the correct timezone
        const currentTime = new Date().toLocaleString('en-US', options);
        const currentTimeMs = new Date(currentTime).getTime();

        weatherData.time.forEach((timestamp, index) => {
            const timePart = timestamp.split("T")[1]; // Get the time part from the timestamp
            const weatherTime = new Date(timestamp).toLocaleString('en-US', options); // Convert the timestamp to a Date object
            const weatherTimeMs = new Date(weatherTime).getTime();

            // Check if the weather time is within the next 24 hours and matches desired times
            if (currentTimeMs < weatherTimeMs && desiredTimes.includes(timePart)) {
                let obj = {};
                obj.time = timestamp;
                Object.keys(weatherData).forEach(key => {
                    if (weatherData[key][index] != undefined) {
                        obj[key] = weatherData[key][index];
                    }
                });
                result.push(obj);
            }
        });

        return result.slice(0, 4);
    }

    if (!data) return <></>;
    if (!data.current) return <></>;
    return (
        <>
            <div className="collapse bg-base-100">
                <input type="checkbox" />
                <div className="grid collapse-title text-sm w-full font-medium px-4 py-0 h-[6rem] items-center"
                    style={{
                        gridTemplateColumns: '4rem 4rem 3rem auto min-content',
                        columnGap: '1.5rem'
                    }}>
                    <div className="btn border-none w-16 p-0 h-full bg-base-100 content-center">
                        {
                            <img src={WeatherCodeLegend[data.current.weather_code].icon['day']}
                                alt={WeatherCodeLegend[data.current.weather_code].label}
                                title={WeatherCodeLegend[data.current.weather_code].label}
                                className="h-8 w-8" />
                        }
                        <label className='h-min text-xs overflow-hidden flex items-center'>{WeatherCodeLegend[data.current.weather_code].label}</label>
                    </div>
                    <div className="h-min p-0 items-center gap-1 flex">
                        <label className="text-lg">
                            {
                                data.current.temperature_2m
                            }
                        </label>
                        <label className="text-xs">
                            {
                                data.current_units.temperature_2m
                            }
                        </label>
                    </div>
                    <div className="h-min p-0 text-sm">
                        {
                            time
                        }
                    </div>

                    <label className='h-full text-md overflow-hidden flex items-center'>{city.name}</label>

                    <div className="flex flex-row gap-2">
                        <div className="justify-center w-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="collapse-content">
                    <div className="flex flex-col w-full rounded-none gap-2">
                        {
                            settings.widget.options.includes('extended_data') && <>
                                <div className="bg-base-300 rounded-xl place-items-center h-12 p-2">
                                    <InlineStats stats={data.current} units={data.current_units} />
                                </div>
                            </>
                        }
                        {
                            settings.widget.options.includes('extended_summary') && <>
                                <div className="bg-base-300 rounded-xl flex flex-row place-items-center h-max p-2">
                                    {
                                        getWeatherForSpecificTimes(data.hourly, ["00:00", "06:00", "12:00", "18:00"], data.timezone).map((weather, index) => {
                                            return (<WeatherStat key={index} time={weather.time} stats={weather} units={data.hourly_units} timezone={data.timezone} />);
                                        })
                                    }
                                </div>
                            </>
                        }
                        {
                            <div className="justify-center w-full flex items-center" onClick={() => removeCity(city.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="bg-base-300 rounded-lg h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

const InlineStats = memo(({ stats, units }) => {
    const { settings } = useSettings();

    const Stat = memo(({ legend, stat, unit }) => {
        return (
            <div className="flex gap-2 items-center" title={legend.title}>
                <i className={legend.icon} />
                <label className="text-lg">
                    {
                        stat
                    }
                </label>
                <label className="text-xs">
                    {
                        unit
                    }
                </label>
            </div>
        );
    });

    const displayedStats = useMemo(() =>
        settings.widget.extended_data.map((option, index) => {
            const legend = dataToggleLegend.find(x => x.name === option);
            return { key: index, legend, stat: stats[option], unit: units[option] };
        }).filter(item => item.stat !== undefined),
        [settings.widget.extended_data, stats, units]);

    return (
        <>
            <div className={`grid grid-cols-${settings.widget.extended_data.length} place-items-center h-max p-1`}>
                {
                    displayedStats.map(({ key, legend, stat, unit }) => (
                        <Stat key={key} legend={legend} stat={stat} unit={unit} />
                    ))
                }
            </div>
        </>

    );
});

const WeatherStat = ({ time, stats, units, timezone }) => {
    const { settings } = useSettings();
    const options = { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: timezone };
    const timeString = new Date(time).toLocaleTimeString('en-US', options);
    return (
        <div className="stat p-0 place-items-center">
            <div className="stat-value text-xs font-normal">{timeString}</div>
            <img src={WeatherCodeLegend[stats.weather_code].icon['day']}
                alt={WeatherCodeLegend[stats.weather_code].label}
                title={WeatherCodeLegend[stats.weather_code].label}
                className="h-8 w-8" />
            {
                settings.widget.extended_summary.map((option) => {
                    if (stats[option] != undefined) {
                        return (
                            <>
                                <div className="stat-value text-sm gap-1 flex items-center" title={extendedSummaryLegend.find(x => x.name == option).title}>
                                    <label className="text-sm">
                                        {
                                            stats[option]
                                        }
                                    </label>
                                    <label className="text-xs">
                                        {
                                            units[option]
                                        }
                                    </label>
                                </div>
                            </>
                        );
                    }
                })
            }
        </div>
    );
}

export default Widget;