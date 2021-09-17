import LocationMark from '../LocationMark/LocationMark';
import LocationModal from '../LocationModal/LocationModal';
import styles from './CityList.module.css';
import ItemCity from './ItemCity';

const CityList = ({ cities }) => {
  let itemCities =
    cities &&
    cities.length &&
    cities.map((itm) => {
      return <ItemCity cityName={itm.city} cityId={itm.id} />;
    });

  return (
    <div className={`dropdown d-flex ${styles.cityList}`}>
      <LocationMark text={false} />
      <LocationModal />
      <button
        className="btn btn-white dropdown-toggle btn-sm ms-1"
        type="button"
        id="dropDownCities"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        شهر های منتخب
      </button>
      <ul className="dropdown-menu shadow-sm " aria-labelledby="dropDownCities">
        {itemCities}
      </ul>
    </div>
  );
};

export default CityList;
