// 0	Clear sky
// 1, 2, 3	Mainly clear, partly cloudy, and overcast
// 45, 48	Fog and depositing rime fog
// 51, 53, 55	Drizzle: Light, moderate, and dense intensity
// 56, 57	Freezing Drizzle: Light and dense intensity
// 61, 63, 65	Rain: Slight, moderate and heavy intensity
// 66, 67	Freezing Rain: Light and heavy intensity
// 71, 73, 75	Snow fall: Slight, moderate, and heavy intensity
// 77	Snow grains
// 80, 81, 82	Rain showers: Slight, moderate, and violent
// 85, 86	Snow showers slight and heavy
// 95 *	Thunderstorm: Slight or moderate
// 96, 99 *	Thunderstorm with slight and heavy hail

const WeatherCodeLegend = {
    0: {
        label: 'Clear',
        icon: {
            day: '/images/weathericons/sunny.png',
            night: '/images/weathericons/clear_night.png'
        }
    },
    1: {
        label: 'Mostly Clear',
        icon: {
            day: '/images/weathericons/mostly_sunny.png',
            night: '/images/weathericons/mostly_clear_night.png'
        }
    },
    2: {
        label: 'Partly Cloudy',
        icon: {
            day: '/images/weathericons/partly_cloudy.png',
            night: '/images/weathericons/partly_cloudy_night.png'
        }
    },
    3: {
        label: 'Overcast',
        icon: {
            day: '/images/weathericons/mostly_cloudy_day.png',
            night: '/images/weathericons/mostly_cloudy_night.png'
        }
    },
    45: {
        label: 'Fog',
        icon: {
            day: '/images/weathericons/haze_fog_dust_smoke.png',
            night: '/images/weathericons/haze_fog_dust_smoke.png'
        }
    },
    48: {
        label: 'Rime Fog',
        icon: {
            day: '/images/weathericons/haze_fog_dust_smoke.png',
            night: '/images/weathericons/haze_fog_dust_smoke.png'
        }
    },
    51: {
        label: 'Light Drizzle',
        icon: {
            day: '/images/weathericons/drizzle.png',
            night: '/images/weathericons/drizzle.png'
        }
    },
    53: {
        label: 'Moderate Drizzle',
        icon: {
            day: '/images/weathericons/drizzle.png',
            night: '/images/weathericons/drizzle.png'
        }
    },
    55: {
        label: 'Heavy Drizzle',
        icon: {
            day: '/images/weathericons/drizzle.png',
            night: '/images/weathericons/drizzle.png'
        }
    },
    56: {
        label: 'Light Drizzle',
        icon: {
            day: '/images/weathericons/flurries.png',
            night: '/images/weathericons/flurries.png'
        }
    },
    57: {
        label: 'Heavy Drizzle',
        icon: {
            day: '/images/weathericons/flurries.png',
            night: '/images/weathericons/flurries.png'
        }
    },
    61: {
        label: 'Light Rain',
        icon: {
            day: '/images/weathericons/showers_rain.png',
            night: '/images/weathericons/showers_rain.png'
        }
    },
    63: {
        label: 'Moderate Rain',
        icon: {
            day: '/images/weathericons/heavy_rain.png',
            night: '/images/weathericons/heavy_rain.png'
        }
    },
    65: {
        label: 'Heavy Rain',
        icon: {
            day: '/images/weathericons/heavy_rain.png',
            night: '/images/weathericons/heavy_rain.png'
        }
    },
    66: {
        label: 'Light Rain',
        icon: {
            day: '/images/weathericons/wintry_mix_rain_snow.png',
            night: '/images/weathericons/wintry_mix_rain_snow.png'
        }
    },
    67: {
        label: 'Heavy Rain',
        icon: {
            day: '/images/weathericons/wintry_mix_rain_snow.png',
            night: '/images/weathericons/wintry_mix_rain_snow.png'
        }
    },
    71: {
        label: 'Light Snowfall',
        icon: {
            day: '/images/weathericons/flurries.png',
            night: '/images/weathericons/flurries.png'
        }
    },
    73: {
        label: 'Moderate Snowfall',
        icon: {
            day: '/images/weathericons/snow_showers_snow.png',
            night: '/images/weathericons/snow_showers_snow.png'
        }
    },
    75: {
        label: 'Heavy Snowfall',
        icon: {
            day: '/images/weathericons/heavy_snow.png',
            night: '/images/weathericons/heavy_snow.png'
        }
    },
    77: {
        label: 'Snow Grains',
        icon: {
            day: '/images/weathericons/flurries.png',
            night: '/images/weathericons/flurries.png'
        }
    },
    80: {
        label: 'Light Showers',
        icon: {
            day: '/images/weathericons/showers_rain.png',
            night: '/images/weathericons/showers_rain.png'
        }
    },
    81: {
        label: 'Moderate Showers',
        icon: {
            day: '/images/weathericons/showers_rain.png',
            night: '/images/weathericons/showers_rain.png'
        }
    },
    82: {
        label: 'Heavy Showers',
        icon: {
            day: '/images/weathericons/showers_rain.png',
            night: '/images/weathericons/showers_rain.png'
        }
    },
    85: {
        label: 'Light Snow',
        icon: {
            day: '/images/weathericons/snow_showers_snow.png',
            night: '/images/weathericons/snow_showers_snow.png'
        }
    },
    86: {
        label: 'Heavy Showers',
        icon: {
            day: '/images/weathericons/snow_showers_snow.png',
            night: '/images/weathericons/snow_showers_snow.png'
        }
    },
    95: {
        label: 'Thunderstorm',
        icon: {
            day: '/images/weathericons/strong_storms.png',
            night: '/images/weathericons/strong_storms.png'
        }
    },
    96: {
        label: 'Hail Storm',
        icon: {
            day: '/images/weathericons/strong_storms.png',
            night: '/images/weathericons/strong_storms.png'
        }
    },
    99: {
        label: 'Heavy Hail Storm',
        icon: {
            day: '/images/weathericons/strong_storms.png',
            night: '/images/weathericons/strong_storms.png'
        }
    },
}

export { WeatherCodeLegend };