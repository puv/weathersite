/* eslint-disable react/prop-types */

import { dataToggleLegend, extendedSummaryLegend, unitLegend } from '../util/StatLegend';

import { mapLegend } from '../util/MapLegend';
import { themeLegend } from '../util/ThemeLegend';
import { useSettings } from '../util/AppContext';
import { useId } from 'react';

function Settings() {
    const { settings } = useSettings();

    const children = [
        <SettingBlock key="base" title="Base Settings">
            <SettingDropdown
                label="Theme"
                type="theme"
                options={themeLegend}
                selected={settings.theme}
                ariaLabel="Select color theme"
            />
            <SettingDropdown
                label="Map"
                type="map"
                options={mapLegend}
                selected={settings.map}
                ariaLabel="Select map style"
            />
            <SettingDropdown
                label="Temperature Units"
                type="widget.units.temperature"
                options={unitLegend.temperature}
                selected={settings.widget.units.temperature}
                ariaLabel="Select temperature unit"
            />
            <SettingDropdown
                label="Wind Speed Units"
                type="widget.units.wind_speed"
                options={unitLegend.wind_speed}
                selected={settings.widget.units.wind_speed}
                ariaLabel="Select wind speed unit"
            />
            <SettingDropdown
                label="Precipitation Units"
                type="widget.units.precipitation"
                options={unitLegend.precipitation}
                selected={settings.widget.units.precipitation}
                ariaLabel="Select precipitation unit"
            />
            <>
                <SettingToggle
                    label="Extended Widget Summary"
                    type="widget.options"
                    name="extended_summary"
                    selected={settings.widget.options.includes('extended_summary')}
                    ariaLabel="Toggle extended widget summary display"
                />
                <SettingToggle
                    label="Extended Widget Data"
                    type="widget.options"
                    name="extended_data"
                    selected={settings.widget.options.includes('extended_data')}
                />
            </>
        </SettingBlock>
    ];

    if (settings.widget.options.includes('extended_summary')) {
        children.push(
            <SettingBlock title="Summary Settings">
                {
                    extendedSummaryLegend.map(option => {
                        return (<SettingToggle key={option.name} label={option.title} type="widget.extended_summary" name={option.name} selected={settings.widget.extended_summary.includes(option.name)} />);
                    })
                }
            </SettingBlock>
        );
    }

    if (settings.widget.options.includes('extended_data')) {
        children.push(
            <SettingBlock title="Data Settings">
                {
                    // without is_day and weather_code
                    dataToggleLegend.map(option => {
                        return (<SettingToggle key={option.name} label={option.title} type="widget.extended_data" name={option.name} selected={settings.widget.extended_data.includes(option.name)} />);
                    })
                }
            </SettingBlock >
        );
    }

    return (
        <>
            <button className="btn focus:outline-none" onClick={() => document.getElementById('settings_modal').showModal()}>
                <i className="fa-solid fa-gear" aria-label='Settings' />
            </button>
            <dialog id="settings_modal" className="modal">
                <div className={`col-start-1 row-start-1 w-[${24 * children.length}rem] overflow-visible`}>
                    <div className="flex justify-between items-start gap-8">
                        {children}
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button className='bg-transparent border-none outline-none'>close</button>
                </form>
            </dialog>
        </>
    );
}

function SettingToggle({ label, type, name, selected }) {
    const { settings, setSettings } = useSettings();

    const updateSetting = (settingType, value) => {
        const keys = settingType.split('.');
        const newSettings = { ...settings };
        let current = newSettings;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!current[key]) current[key] = {};

            current = current[key];
        }

        // if the array already contains the value, remove it
        if (current[keys[keys.length - 1]].includes(value)) {
            current[keys[keys.length - 1]] = current[keys[keys.length - 1]].filter(item => item !== value);
        } else {
            current[keys[keys.length - 1]].push(value);
        }
        setSettings(newSettings);
    };

    const isDisabled = ((type === 'widget.extended_data' || type === 'widget.extended_summary') && settings.widget[type.split('.')[1]]?.length > 3) && !selected;

    return (
        <div className="form-control">
            <label className="label cursor-pointer">
                <span className="label-text text-lg">{label}</span>
                <input type="checkbox" className="toggle" defaultChecked={selected} onClick={() => updateSetting(type, name)} disabled={isDisabled} />
            </label>
        </div>
    );

}

function SettingBlock({ title, children }) {
    return (
        <>
            <div className="bg-base-100 p-4 rounded-lg min-w-96">
                <h4 className="text-center font-bold">{title}</h4>
                <div className="divider m-0"></div>
                {
                    children && children.map(child => {
                        return (
                            <>
                                {child}
                                <div className="divider m-0"></div>
                            </>
                        );
                    })
                }
            </div>
        </>
    );
}

function SettingDropdown({ label, type, options, selected }) {
    return (
        <div className="flex flex-row w-full justify-between gap-4 items-center">
            <label className="text-lg font-medium">{label}</label>
            <div className="join join-vertical">
                <details className="dropdown dropdown-end">
                    <summary className="btn m-1">
                        {options.find(option => option.name === selected)?.title ?? selected}
                        <svg
                            width="12px"
                            height="12px"
                            className="inline-block h-2 w-2 fill-current opacity-60"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 2048 2048">
                            <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                        </svg>
                    </summary>
                    <ul className="menu dropdown-content bg-base-300 rounded-box z-50 w-52 p-2 shadow-2xl max-h-72 grid overflow-y-auto absolute">
                        {options.map(option => <SettingsButton key={option.name} option={option} settingType={type} dropdownName={`${type}-dropdown`} />)}
                    </ul>
                </details>
            </div>
        </div>
    );
}

function SettingsButton({ option, settingType, dropdownName }) {
    const { settings, setSettings } = useSettings();
    const stableId = useId();
    const name = dropdownName || `${stableId}-dropdown`;

    const updateSetting = (settingType, value) => {
        const keys = settingType.split('.');
        const newSettings = { ...settings };
        let current = newSettings;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!current[key]) current[key] = {};

            current = current[key];
        }

        current[keys[keys.length - 1]] = value;
        setSettings(newSettings);
    };

    return (
        <li>
            <input
                type="radio"
                name={dropdownName}
                className={`btn btn-sm btn-block justify-start ${(settings[settingType] === option.name) ? 'btn-primary' : 'btn-ghost'}`}
                aria-label={option.title}
                value={option.name}
                onClick={() => updateSetting(settingType, option.name)} />
        </li>
    );
}


export default Settings;
