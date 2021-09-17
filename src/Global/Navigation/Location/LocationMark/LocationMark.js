import { useEffect, useState } from 'react';
import { UseAppContext } from '../../../../Context/context';

const LocationMark = ({ text }) => {
  const [icon, setIcon] = useState('fa fa-map-marker');

  const { cities } = UseAppContext();

  useEffect(() => {
    if (cities.length) {
      setIcon('fas fa-plus');
    } else {
      setIcon('fa fa-map-marker');
    }
  }, [cities]);

  return (
    <div className="d-flex">
      <button
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#locationModal"
        className="bg-white"
      >
        <i className={icon} aria-hidden="true"></i>
      </button>
      {text && (
        <p className="d-none d-lg-block mb-0 ms-2">شهر خود را انتخاب کنید</p>
      )}
    </div>
  );
};

export default LocationMark;
