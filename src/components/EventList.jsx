import Alert from './Alert';

function EventList({ alerts, scale }) {
    return (
        <div className="item alert-list">
            <div className="drawer drawer-end">
                <input id="sidebar" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <label htmlFor="sidebar" className="drawer-button btn btn-primary">Open Event List</label>
                </div>
                <div className="drawer-side">
                    <ul className="min-h-full menu bg-base-200 text-base-content w-80">
                        <label htmlFor="sidebar" className="w-full my-2 drawer-button btn btn-primary">Close</label>
                        <div className="w-full alerts">
                            {alerts.map(alert => <Alert key={alert.id} alert={alert} scale={scale} />)}
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default EventList;
