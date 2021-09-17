import Location from '../Location/Location';
import Path from '../Path/Path';
import { UseAppContext } from '../../../Context/context';
import { useEffect, useState } from 'react';
import CityList from '../Location/CityList/CityList';

const NavigationWrapper = () => {
  const [chooseCity, setChooseCity] = useState(false);
  const { cities } = UseAppContext();

  useEffect(() => {
    if (cities.length) {
      setChooseCity(true);
    } else {
      setChooseCity(false);
    }
  }, [cities]);

  return (
    <div className="container-fluid px-5 mb-3">
      <div className="bg-white rounded-pill d-flex px-3 justify-content-between align-items-center shadow-sm">
        <Path />
        {chooseCity ? <CityList cities={cities} /> : <Location />}
      </div>
    </div>
  );
};

export default NavigationWrapper;
