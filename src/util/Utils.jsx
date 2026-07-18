function toMilliseconds(timestamp) {

    let milliseconds;

    if (typeof timestamp === "string") {
        milliseconds = new Date(timestamp).getTime();
    } else {
        milliseconds = timestamp;
    }

    return milliseconds;
}

function getCurrentDate() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}T00:00:00`;
}

function getIntensity(magnitude) {
    return {
        i: getIntensityNumber(magnitude),
        color: getIntensityColor(getIntensityNumber(magnitude)),
    }
}

const getIntensityNumber = (mag) => {
    if (mag <= 0.4) return "0";
    else if (mag <= 1.4) return "1";
    else if (mag <= 2.4) return "2";
    else if (mag <= 3.4) return "3";
    else if (mag <= 4.4) return "4";
    else if (mag <= 4.9) return "5-";
    else if (mag <= 5.4) return "5+";
    else if (mag <= 5.9) return "6-";
    else if (mag <= 6.4) return "6+";
    else return "7";
}


const getIntensityColor = (intensity) => {
    switch (intensity) {
        case "0":
            return "#008080";
        case "1":
            return "#008000";
        case "2":
            return "#00ff00";
        case "3":
            return "#00ff80";
        case "4":
            return "#ffff00";
        case "5-":
            return "#ffff00";
        case "5+":
            return "#ff8000";
        case "6-":
            return "#ff0000";
        case "6+":
            return "#800000";
        case "7":
            return "#800000";
        default:
            return "#808080";
    }
}

function getMagnitudeColor(num) {
    const r0 = 255, g0 = 255, b0 = 255;
    const r10 = 255, g10 = 0, b10 = 0;

    if (num < 0) return '#ffffff';
    if (num > 9) return '#000000';

    const r = Math.round(r0 - (r0 - r10) * num / 10).toString(16).padStart(2, '0');
    const g = Math.round(g0 - (g0 - g10) * num / 10).toString(16).padStart(2, '0');
    const b = Math.round(b0 - (b0 - b10) * num / 10).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
}

function Patcher(array) {
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const now = new Date();

    return array
        .filter(item => item.properties.time >= cutoff && item.properties.time <= now)
        .map(item => ({
            id: item.id,
            tag: item.tag,
            properties: {
                magnitude: {
                    no: item.properties.magnitude,
                    color: getMagnitudeColor(item.properties.magnitude),
                },
                location: item.properties.location,
                time: item.properties.time,
                title: item.properties.title,
                url: item.properties.url,
                depth: item.properties.depth,
                intensity: {
                    no: item.properties.intensity || getIntensityNumber(item.properties.magnitude),
                    color: getIntensityColor(item.properties.intensity || getIntensityNumber(item.properties.magnitude)),
                },
            },
            coordinates: {
                longitude: item.coordinates.longitude,
                latitude: item.coordinates.latitude,
            },
        }));
}

function round(num, r) {
    if (r === 0) return Math.round(num);
    else if (r < 0) return Math.round(num / Math.pow(10, -r)) * Math.pow(10, -r);
    else if (r > 0) return Math.round(num * Math.pow(10, r)) / Math.pow(10, r);
    else return num;
}

const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

// Export earthquake data to CSV format
function exportToCSV(alerts, filename = 'earthquakes.csv') {
    const headers = ['ID', 'Magnitude', 'Intensity', 'Location', 'Time', 'Depth (km)', 'Latitude', 'Longitude', 'Source', 'URL'];

    const rows = alerts.map(alert => [
        alert.id || '',
        alert.properties.magnitude.no || '',
        alert.properties.intensity.no || '',
        alert.properties.location || '',
        new Date(alert.properties.time).toISOString(),
        alert.properties.depth || '',
        alert.coordinates.latitude || '',
        alert.coordinates.longitude || '',
        alert.tag || '',
        alert.properties.url || ''
    ]);

    const csv = [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Export earthquake data to GeoJSON format
function exportToGeoJSON(alerts, filename = 'earthquakes.geojson') {
    const geoJSON = {
        type: 'FeatureCollection',
        features: alerts.map(alert => ({
            type: 'Feature',
            id: alert.id,
            properties: {
                magnitude: alert.properties.magnitude.no,
                intensity: alert.properties.intensity.no,
                location: alert.properties.location,
                time: alert.properties.time,
                depth: alert.properties.depth,
                source: alert.tag,
                url: alert.properties.url
            },
            geometry: {
                type: 'Point',
                coordinates: [
                    alert.coordinates.longitude,
                    alert.coordinates.latitude,
                    -alert.properties.depth // Depth as negative elevation
                ]
            }
        }))
    };

    const blob = new Blob([JSON.stringify(geoJSON, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${Date.now()}.geojson`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export { toMilliseconds, getCurrentDate, getIntensity, getMagnitudeColor, Patcher, round, debounce, exportToCSV, exportToGeoJSON };