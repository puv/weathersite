import { useEffect, useState } from 'react';

export function useEarthquakeNotifications(alerts) {
    const [lastAlert, setLastAlert] = useState(null);
    const [permission, setPermission] = useState(
        'Notification' in window ? Notification.permission : 'denied'
    );

    useEffect(() => {
        if (!alerts || alerts.length === 0) return;

        // Get the most recent significant earthquake (magnitude >= 5.0)
        const significantQuakes = alerts
            .filter(alert => alert.properties.magnitude.no >= 5.0)
            .sort((a, b) =>
                new Date(b.properties.time) - new Date(a.properties.time)
            );

        if (significantQuakes.length === 0) return;

        const latestQuake = significantQuakes[0];

        // Check if this is a new alert
        if (lastAlert !== latestQuake.id && permission === 'granted') {
            sendNotification(latestQuake);
            setLastAlert(latestQuake.id);
        }
    }, [alerts, permission, lastAlert]);

    const sendNotification = (alert) => {
        const { magnitude, location, time } = alert.properties;
        const timeStr = new Date(time).toLocaleString();

        new Notification(`Earthquake Alert: M${magnitude.no}`, {
            body: `Location: ${location}\nTime: ${timeStr}`,
            icon: '/images/earthquake-icon.png',
            tag: alert.id,
            requireInteraction: true,
        });
    };

    const requestPermission = async () => {
        if ('Notification' in window) {
            const result = await Notification.requestPermission();
            setPermission(result);
            return result;
        }
        return 'denied';
    };

    return { requestPermission, permission };
}

export function useNotificationSettings() {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('notificationSettings');
        return saved ? JSON.parse(saved) : {
            enabled: false,
            minMagnitude: 5.0,
            regions: [],
        };
    });

    useEffect(() => {
        localStorage.setItem('notificationSettings', JSON.stringify(settings));
    }, [settings]);

    return [settings, setSettings];
}
