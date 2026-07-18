import { toMilliseconds } from "./Utils";

function createAlert(tag, alertData) {
    // Normalize intensity: some APIs return {no, color} objects, others return plain numbers/strings
    let intensity = alertData.intensity || null;
    if (intensity && typeof intensity === 'object' && intensity.no !== undefined) {
        intensity = intensity.no;
    }

    return {
        id: alertData.id,
        tag: tag,
        properties: {
            magnitude: parseFloat(alertData.magnitude).toFixed(1),
            location: alertData.location || "Unknown Location",
            time: toMilliseconds(alertData.time),
            title: alertData.title || null,
            url: alertData.url || "",
            depth: parseFloat(alertData.depth) || null,
            intensity: intensity,
        },
        coordinates: {
            latitude: parseFloat(alertData.latitude) || null,
            longitude: parseFloat(alertData.longitude) || null,
        }
    };
}

function parseXML(tag, data) {
    const lines = data.split("\n");
    return lines.map(alert => {
        const parts = alert.split("|");
        if (parts.length < 11 || alert.includes("#") || alert.includes("EventID")) return null;

        return createAlert(tag, {
            id: parts[0],
            magnitude: parts[10],
            location: (parts[parts.length - 1].trim() === "earthquake" ? parts[parts.length - 2] : parts[parts.length - 1]),
            time: parts[1],
            depth: parts[4],
            latitude: parts[2],
            longitude: parts[3]
        });
    }).filter(alert => alert !== null);
}

function parseJSON(tag, data) {
    return data.map(alert => {
        const { id, properties, geometry } = alert;
        const { publicId, publicID, mag, magnitude, place, locality, time, title, url, depth, long, lat, flynn_region } = properties;
        const coordinates = geometry ? geometry.coordinates : [];

        return createAlert(tag, {
            id: id || publicId || publicID,
            magnitude: mag || magnitude,
            location: place || locality || flynn_region,
            time: time,
            title: title,
            url: url,
            depth: depth || coordinates[2],
            latitude: coordinates[1] || lat,
            longitude: coordinates[0] || long
        });
    });
}

function parseOBJ(tag, data) {
    return Object.keys(data).map(key => {
        const alert = data[key];
        return createAlert(tag, {
            id: key,
            magnitude: alert.magnitude,
            location: alert.location,
            time: alert.time,
            depth: alert.depth,
            latitude: alert.latitude,
            longitude: alert.longitude,
            intensity: alert.shindo
        });
    });
}

function parseSINGLE(tag, data) {
    return [data].map(alert => {
        const { EventID, origin_time, report_time, OriginTime, AnnouncedTime, Latitude, Longitude, latitude, longitude, region_name, Magunitude,
            magunitude, depth, calcintensity, Depth, MaxIntensity, HypoCenter, Title, Hypocenter } = alert;

        return createAlert(tag, {
            id: EventID || origin_time,
            magnitude: Magunitude || magunitude,
            location: HypoCenter || Hypocenter || region_name,
            time: OriginTime || AnnouncedTime || origin_time || report_time || EventID,
            title: Title,
            depth: Depth || depth,
            intensity: MaxIntensity || calcintensity,
            latitude: Latitude || latitude,
            longitude: Longitude || longitude
        });
    });
}

export { parseXML as _XML, parseJSON as _JSON, parseOBJ as _OBJ, parseSINGLE as _SINGLE };
