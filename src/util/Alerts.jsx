import { Patcher, getCurrentDate, round, toMilliseconds } from "./Utils";
import { _JSON, _OBJ, _SINGLE, _XML } from "./Parsers";
import { rateLimitedFetch, apiRateLimiter } from "./RateLimiter";

const ENDPOINTS = {
    USGS: `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${getCurrentDate()}`,
    GEONET: `https://api.geonet.org.nz/quake?MMI=-1`,
    INGV: `https://webservices.ingv.it/fdsnws/event/1/query?starttime=${getCurrentDate()}&format=text`,
    EMSC: `https://www.seismicportal.eu/fdsnws/event/1/query?starttime=${getCurrentDate()}&format=json`,
    IRIS: `https://service.iris.edu/fdsnws/event/1/query?starttime=${getCurrentDate()}&format=geocsv`,
    CENC: `https://api.wolfx.jp/cenc_eqlist.json`,
    SC: `https://api.wolfx.jp/sc_eew.json`,
    JMA: `https://api.wolfx.jp/jma_eqlist.json`,
    NIED: `https://api.wolfx.jp/nied_eew.json`,
    JMA2: `https://api.wolfx.jp/jma_eew.json`
};

async function getAndParseData(tag, url, parser) {
    try {
        const res = await rateLimitedFetch(url, { key: `alerts-${tag}` }, apiRateLimiter);
        if (!res.ok) return [];
        const data = await res.json();
        return Patcher(parser(tag, data.features || data));
    } catch (e) {
        if (e.message === 'Rate limit exceeded') {
            console.warn(`Rate limit reached for ${tag}, retrying in ${e.retryAfter}s`);
            // Wait and retry
            await new Promise(resolve => setTimeout(resolve, e.retryAfter * 1000));
            return getAndParseData(tag, url, parser);
        }
        console.error(e.message);
        return [];
    }
}

async function fetchAlerts() {
    const dataSources = [
        { name: 'USGS', url: ENDPOINTS.USGS, parser: _JSON },
        { name: 'GEONET', url: ENDPOINTS.GEONET, parser: _JSON },
        { name: 'EMSC', url: ENDPOINTS.EMSC, parser: _JSON },
        // { name: 'INGV', url: ENDPOINTS.INGV, parser: _XML },
        // { name: 'IRIS', url: ENDPOINTS.IRIS, parser: _XML },
        { name: 'CENC', url: ENDPOINTS.CENC, parser: _OBJ },
        { name: 'SC', url: ENDPOINTS.SC, parser: _SINGLE },
        { name: 'JMA', url: ENDPOINTS.JMA, parser: _SINGLE },
        { name: 'NIED', url: ENDPOINTS.NIED, parser: _OBJ },
        { name: 'JMA2', url: ENDPOINTS.JMA2, parser: _SINGLE }
    ];

    const dataPromises = dataSources.map(({ name, url, parser }) => getAndParseData(name, url, parser));
    const allData = await Promise.all(dataPromises);

    const uniqueAlerts = UniqueAlerts(allData.flat());

    return uniqueAlerts;
}

//Return alerts with unique coordinates
function UniqueAlerts(alerts) {
    let r = 3;

    try {
        const recentAlerts = alerts.filter(o => {
            if (!o.properties) return false;
            const alertTime = toMilliseconds(o.properties.time);
            const longTime = new Date().getTime() - 3 * 24 * 60 * 60 * 1000;
            return alertTime > longTime && alertTime < new Date().getTime();
        });

        const uniqueAlerts = recentAlerts.filter((obj, index, self) =>
            index === self.findIndex((o) => (
                round(o.coordinates.latitude, r) === round(obj.coordinates.latitude, r) &&
                round(o.coordinates.longitude, r) === round(obj.coordinates.longitude, r)
            ))
        );

        return uniqueAlerts.sort((a, b) => b.properties.time - a.properties.time);
    } catch (e) {
        console.error(e);
        return [];
    }
}

export { fetchAlerts };
