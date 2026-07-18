import { useCities } from '../util/AppContext';
import Widget from './Widget';
import CityComboBox from './CityComboBox';

function WidgetList() {
    const { cities } = useCities();

    return (
        <div className="item widget-list">
            <div className="drawer drawer-end">
                <input id="sidebar" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <label htmlFor="sidebar" className="drawer-button btn btn-primary">Open Widget List</label>
                </div>
                <div className="drawer-side">
                    <ul className="menu bg-base-200 text-base-content min-h-full w-[32rem]">
                        <label htmlFor="sidebar" className="w-full my-2 drawer-button btn btn-primary">Close</label>
                        <div className="w-full alerts">
                            {cities.map(city => <Widget key={city.id} city={city} />)}
                            <CityComboBox />
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default WidgetList;
