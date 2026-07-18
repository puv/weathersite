const dataToggleLegend = [
    {
        title: 'Temperature',
        name: 'temperature_2m',
        icon: 'fas fa-thermometer-half',
        required: true
    },
    {
        title: 'Humidity',
        name: 'relative_humidity_2m',
        icon: 'fas fa-water'
    },
    {
        title: 'Apparent Temperature',
        name: 'apparent_temperature',
        icon: 'fas fa-thermometer-three-quarters'
    },
    {
        title: 'Precipitation',
        name: 'precipitation',
        icon: 'fas fa-tint',
        required: true
    },
    {
        title: 'Rain',
        name: 'rain',
        icon: 'fas fa-cloud-rain'
    },
    {
        title: 'Showers',
        name: 'showers',
        icon: 'fas fa-shower'
    },
    {
        title: 'Snowfall',
        name: 'snowfall',
        icon: 'fas fa-snowflake'
    },
    {
        title: 'Cloud Cover',
        name: 'cloud_cover',
        icon: 'fas fa-cloud'
    },
    {
        title: 'Pressure',
        name: 'pressure_msl',
        icon: 'fas fa-tachometer-alt'
    },
    {
        title: 'Surface Pressure',
        name: 'surface_pressure',
        icon: 'fas fa-tachometer-alt'
    },
    {
        title: 'Wind Speed',
        name: 'wind_speed_10m',
        icon: 'fas fa-wind',
        required: true
    },
    {
        title: 'Wind Direction',
        name: 'wind_direction_10m',
        icon: 'fas fa-compass'
    },
    {
        title: 'Wind Gusts',
        name: 'wind_gusts_10m',
        icon: 'fas fa-wind'
    }
];

const extendedSummaryLegend = [
    {
        title: 'Temperature',
        name: 'temperature_2m',
        enabled: true,
    },
    {
        title: 'Relative Humidity',
        name: 'relative_humidity_2m',
    },
    {
        title: 'Apparent Temperature',
        name: 'apparent_temperature',
    },
    {
        title: 'Precipitation Probability',
        name: 'precipitation_probability',
        enabled: true,
    },
    {
        title: 'Precipitation',
        name: 'precipitation',
    },
    {
        title: 'Rain',
        name: 'rain',
    },
    {
        title: 'Showers',
        name: 'showers',
    },
    {
        title: 'Snowfall',
        name: 'snowfall',
    },
    {
        title: 'Snow Depth',
        name: 'snow_depth',
    },
    {
        title: 'Wind Speed',
        name: 'wind_speed_10m',
        enabled: true,
    },
    {
        title: 'Wind Direction',
        name: 'wind_direction_10m',
    },
    {
        title: 'Wind Gusts',
        name: 'wind_gusts_10m',
    },
];

const unitLegend = {
    temperature: [
        {
            title: 'Celsius',
            name: '',
        }, 
        {
            title: 'Fahrenheit',
            name: 'fahrenheit',
        }
    ],
    wind_speed: [
        {
            title: 'Km/h',
            name: '',
        },
        {
            title: 'm/s',
            name: 'ms',
        },
        {
            title: 'mph',
            name: 'mph',
        },
        {
            title: 'Knots',
            name: 'knots',
        }
    ],
    precipitation: [
        {
            title: 'Millimeters',
            name: '',
        }, 
        {
            title: 'Inches',
            name: 'inch',
        }
    ]
};

export { dataToggleLegend, extendedSummaryLegend, unitLegend };