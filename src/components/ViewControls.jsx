function SwitchButton({ label, onClick, image, isChecked }) {
    return (
        <div className={`join-item btn flex gap-4 border-none pointer-cursor justify-start ${isChecked ? 'btn-primary' : ''}`} onClick={onClick}>
            <div className="avatar">
                <div className={`w-8 rounded ${typeof image === 'string' ? 'ring-black ring-offset-base-100 ring' : 'place-content-center text-[1.75em]'}`}>
                    {typeof image === 'string' ? <img src={image} alt={label} /> : image}
                </div>
            </div>
            <label>{label}</label>
        </div>
    );
}

function ScaleSwitcher({ scale, setScale }) {
    return (
        <div className="join join-vertical">
            <SwitchButton label="Intensity" onClick={() => setScale('intensity')} image={<i className="fa-solid fa-gauge-high"></i>} isChecked={scale === 'intensity'} />
            <SwitchButton label="Magnitude" onClick={() => setScale('magnitude')} image={<i className="fa-solid fa-gauge-simple-high"></i>} isChecked={scale === 'magnitude'} />
        </div>
    );
}

function ViewSwitcher({ view, setView }) {
    return (
        <div className="justify-between h-48 join join-vertical">
            <SwitchButton label="Earthquakes" onClick={() => setView('earthquake')} image={<i className="fa-solid fa-house-crack"></i>} isChecked={view === 'earthquake'} />
            <SwitchButton label="Weather" onClick={() => setView('weather')} image={<i className="fa-solid fa-cloud" />} isChecked={view === 'weather'} />
            <SwitchButton label="Temperature" onClick={() => setView('temperature')} image={<i className="fa-solid fa-thermometer-half" />} isChecked={view === 'temperature'} />
            <SwitchButton label="Satellite" onClick={() => setView('satellite')} image={<i className="fa-solid fa-satellite" />} isChecked={view === 'satellite'} />
        </div>
    );
}

export { SwitchButton, ScaleSwitcher, ViewSwitcher };
