import { useCities } from '../util/AppContext';
import { useState, useRef, useCallback } from 'react';

const CityComboBox = () => {
    const { cities, setCities } = useCities();
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const debounceRef = useRef(null);

    const handleInputChange = useCallback(async (value) => {
        if (value && value.length > 2) {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&extratags=1&addressdetails=1`);
                const data = await response.json();
                const cityNames = new Set(cities.map(city => city.display_name));
                const filteredData = data.filter(option => !cityNames.has(option.display_name));
                setFilteredOptions(filteredData);
                setIsOpen(true);
            } catch {
                setFilteredOptions([]);
                setIsOpen(false);
            }
        } else {
            setFilteredOptions([]);
            setIsOpen(false);
        }
    }, [cities]);

    const onChange = (e) => {
        const value = e.target.value;
        setSelectedOption(value);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            handleInputChange(value);
        }, 500); // Nominatim requires max 1 req/sec
    };

    const handleOptionClick = (option) => {
        const city = {
            id: option.place_id,
            name: option.name,
            display_name: option.display_name,
            lat: option.lat,
            lon: option.lon
        };
        setCities([...cities, city]);
        setSelectedOption('');
        setFilteredOptions([]);
        setIsOpen(false);
    };

    return (
        <div className="form-control card bg-base-300 flex flex-col text-center !p-2">
            <label className="label cursor-pointer flex flex-col gap-4 !p-2">
                <div className="relative w-full">
                    <input
                        type="text"
                        className="w-full text-center input input-bordered"
                        value={selectedOption}
                        placeholder="Add a new city"
                        onChange={onChange}
                        onFocus={() => setIsOpen(true)}
                    />
                    {isOpen && (
                        <ul className="absolute z-10 w-full mt-1 overflow-y-auto rounded-lg shadow-lg bg-base-200 max-h-60">
                            {filteredOptions.map((option, index) => (
                                <li
                                    key={index}
                                    className="p-2 cursor-pointer hover:bg-base-300"
                                    onClick={() => handleOptionClick(option)}
                                >
                                    {option.display_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </label>
        </div>
    );
};

export default CityComboBox;
