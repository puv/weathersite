/* eslint-disable react/prop-types */

function getTime(timestamp) {
    // Return HH:mm AM/PM format
    const options = { hour: 'numeric', minute: 'numeric', hour12: false };
    return new Date(timestamp).toLocaleTimeString('en-US', options);
}

function getDate(timestamp) {
    // Return Tue, Jan 1, 2023 format
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date(timestamp).toLocaleDateString('en-US', options);
}

function Alert({ alert, scale }) {
    const intensity = scale == 'intensity';

    return (
        <>
            <div className="collapse bg-base-100">
                <input type="checkbox" />
                <div className="grid collapse-title text-sm w-full font-medium px-4 py-0 h-[3.75rem] items-center"
                style={{
                    gridTemplateColumns: '3rem 12rem 1rem',
                    columnGap: '0.5rem'
                }}>
                    <div className="btn h-full p-0 bg-base-100 border-none">
                        <div className={`badge badge-lg w-12 border-2 !border-[${intensity ? alert.properties.intensity.color : alert.properties.magnitude.color}]`}>
                            {
                                intensity ? alert.properties.intensity.no : alert.properties.magnitude.no
                            }
                        </div>
                    </div>
                    <label className='h-full overflow-hidden flex items-center'>{alert.properties.location}</label>
                    <div className="justify-center w-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                <div className="collapse-content">
                    <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                        <div className="stat text-center">
                            <div className="stat-title">Date</div>
                            <div className="stat-value">{getTime(alert.properties.time)}</div>
                            <div className="stat-desc">{getDate(alert.properties.time)}</div>
                        </div>

                        <div className="stat text-center">
                            <div className="stat-title">Depth</div>
                            <div className="stat-value">{Math.round(alert.properties.depth)}</div>
                            <div className="stat-desc">km</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Alert;