import { describe, it, expect } from 'vitest';
import { toMilliseconds, getCurrentDate, getIntensity, round, exportToCSV } from '../Utils';

describe('Utils - Date and Time Functions', () => {
    it('should convert string timestamp to milliseconds', () => {
        const timestamp = '2024-01-01T00:00:00Z';
        const result = toMilliseconds(timestamp);
        expect(result).toBeGreaterThan(0);
        expect(typeof result).toBe('number');
    });

    it('should handle numeric timestamps', () => {
        const timestamp = 1704067200000;
        const result = toMilliseconds(timestamp);
        expect(result).toBe(timestamp);
    });

    it('should return current date in correct format', () => {
        const result = getCurrentDate();
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T00:00:00$/);
    });
});

describe('Utils - Earthquake Intensity', () => {
    it('should calculate intensity for magnitude 5.5', () => {
        const result = getIntensity(5.5);
        expect(result.i).toBe('6-');
        expect(result.color).toBe('#ff0000');
    });

    it('should calculate intensity for low magnitude', () => {
        const result = getIntensity(1.0);
        expect(result.i).toBe('1');
        expect(result.color).toBe('#008000');
    });

    it('should calculate intensity for high magnitude', () => {
        const result = getIntensity(7.5);
        expect(result.i).toBe('7');
        expect(result.color).toBe('#800000');
    });
});

describe('Utils - Rounding Function', () => {
    it('should round to nearest integer when r=0', () => {
        expect(round(5.6, 0)).toBe(6);
        expect(round(5.4, 0)).toBe(5);
    });

    it('should round to decimal places when r>0', () => {
        expect(round(5.556, 2)).toBe(5.56);
        expect(round(5.554, 2)).toBe(5.55);
    });

    it('should round to tens/hundreds when r<0', () => {
        expect(round(155, -1)).toBe(160);
        expect(round(144, -1)).toBe(140);
    });
});

describe('Utils - Export Functions', () => {
    it('should not throw error when exporting valid alerts', () => {
        const mockAlerts = [
            {
                id: 'test1',
                properties: {
                    magnitude: { no: 5.5 },
                    intensity: { no: '5+' },
                    location: 'Test Location',
                    time: '2024-01-01T00:00:00Z',
                    depth: 10,
                    url: 'http://test.com'
                },
                coordinates: {
                    latitude: 35.5,
                    longitude: 139.0
                },
                tag: 'TEST'
            }
        ];

        // Mock DOM elements
        global.document = {
            createElement: () => ({
                click: () => { },
                remove: () => { }
            }),
            body: {
                appendChild: () => { },
                removeChild: () => { }
            }
        };

        global.URL = {
            createObjectURL: () => 'blob:test',
            revokeObjectURL: () => { }
        };

        expect(() => exportToCSV(mockAlerts, 'test')).not.toThrow();
    });
});
