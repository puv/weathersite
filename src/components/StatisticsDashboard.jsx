/* eslint-disable react/prop-types */
import { useMemo } from 'react';

export function StatisticsDashboard({ alerts }) {
    const stats = useMemo(() => {
        if (!alerts || alerts.length === 0) {
            return {
                total: 0,
                averageMagnitude: 0,
                maxMagnitude: 0,
                averageDepth: 0,
                bySource: {},
                byIntensity: {},
                last24h: 0,
                significant: 0
            };
        }

        const now = Date.now();
        const oneDayAgo = now - 24 * 60 * 60 * 1000;

        const bySource = {};
        const byIntensity = {};
        let totalMagnitude = 0;
        let totalDepth = 0;
        let maxMag = 0;
        let last24hCount = 0;
        let significantCount = 0;

        alerts.forEach(alert => {
            const mag = alert.properties.magnitude.no;
            const depth = alert.properties.depth || 0;
            const time = new Date(alert.properties.time).getTime();
            const intensity = alert.properties.intensity.no;
            const source = alert.tag;

            // Magnitude stats
            totalMagnitude += mag;
            if (mag > maxMag) maxMag = mag;
            if (mag >= 5.0) significantCount++;

            // Depth stats
            totalDepth += depth;

            // Time stats
            if (time >= oneDayAgo) last24hCount++;

            // By source
            bySource[source] = (bySource[source] || 0) + 1;

            // By intensity
            byIntensity[intensity] = (byIntensity[intensity] || 0) + 1;
        });

        return {
            total: alerts.length,
            averageMagnitude: (totalMagnitude / alerts.length).toFixed(2),
            maxMagnitude: maxMag.toFixed(2),
            averageDepth: (totalDepth / alerts.length).toFixed(0),
            bySource,
            byIntensity,
            last24h: last24hCount,
            significant: significantCount
        };
    }, [alerts]);

    const mostActiveSource = useMemo(() => {
        if (Object.keys(stats.bySource).length === 0) return null;
        return Object.entries(stats.bySource).reduce((a, b) =>
            a[1] > b[1] ? a : b
        );
    }, [stats.bySource]);

    return (
        <div className="bg-base-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-chart-simple"></i>
                Earthquake Statistics
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {/* Total Earthquakes */}
                <div className="stat bg-base-100 rounded-lg p-3">
                    <div className="stat-title text-xs">Total Events</div>
                    <div className="stat-value text-2xl text-primary">{stats.total}</div>
                    <div className="stat-desc">All recorded</div>
                </div>

                {/* Last 24 hours */}
                <div className="stat bg-base-100 rounded-lg p-3">
                    <div className="stat-title text-xs">Last 24 Hours</div>
                    <div className="stat-value text-2xl text-secondary">{stats.last24h}</div>
                    <div className="stat-desc">Recent activity</div>
                </div>

                {/* Significant */}
                <div className="stat bg-base-100 rounded-lg p-3">
                    <div className="stat-title text-xs">Significant</div>
                    <div className="stat-value text-2xl text-warning">{stats.significant}</div>
                    <div className="stat-desc">Magnitude ≥ 5.0</div>
                </div>

                {/* Max Magnitude */}
                <div className="stat bg-base-100 rounded-lg p-3">
                    <div className="stat-title text-xs">Max Magnitude</div>
                    <div className="stat-value text-2xl text-error">{stats.maxMagnitude}</div>
                    <div className="stat-desc">Highest recorded</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Average Stats */}
                <div className="bg-base-100 rounded-lg p-3">
                    <h4 className="font-semibold text-sm mb-2">Average Values</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs">Magnitude:</span>
                            <span className="badge badge-primary">{stats.averageMagnitude}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs">Depth:</span>
                            <span className="badge badge-secondary">{stats.averageDepth} km</span>
                        </div>
                    </div>
                </div>

                {/* Most Active Source */}
                <div className="bg-base-100 rounded-lg p-3">
                    <h4 className="font-semibold text-sm mb-2">Data Sources</h4>
                    {mostActiveSource ? (
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs">Most Active:</span>
                                <span className="badge badge-accent">{mostActiveSource[0]}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs">Events:</span>
                                <span className="badge">{mostActiveSource[1]}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs">Total Sources:</span>
                                <span className="badge">{Object.keys(stats.bySource).length}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500">No data available</p>
                    )}
                </div>
            </div>

            {/* Intensity Distribution */}
            {Object.keys(stats.byIntensity).length > 0 && (
                <div className="bg-base-100 rounded-lg p-3 mt-4">
                    <h4 className="font-semibold text-sm mb-2">By Intensity</h4>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(stats.byIntensity)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 8)
                            .map(([intensity, count]) => (
                                <div key={intensity} className="badge badge-outline gap-1">
                                    <span className="font-bold">{intensity}:</span>
                                    <span>{count}</span>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export function calculateTrend(alerts, hours = 24) {
    if (!alerts || alerts.length < 2) return 0;

    const now = Date.now();
    const cutoff = now - hours * 60 * 60 * 1000;
    const previousCutoff = cutoff - hours * 60 * 60 * 1000;

    const currentPeriod = alerts.filter(a =>
        new Date(a.properties.time).getTime() >= cutoff
    ).length;

    const previousPeriod = alerts.filter(a => {
        const time = new Date(a.properties.time).getTime();
        return time >= previousCutoff && time < cutoff;
    }).length;

    if (previousPeriod === 0) return 100;

    return ((currentPeriod - previousPeriod) / previousPeriod * 100).toFixed(1);
}
