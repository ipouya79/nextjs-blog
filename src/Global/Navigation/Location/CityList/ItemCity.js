import { UseAppContext } from '../../../../Context/context';

const ItemCity = ({ cityName, cityId }) => {
  const { dispatchCity } = UseAppContext();

  const removeCity = (e) => {
    dispatchCity({ type: 'removeCity', payload: { id: e.target.value } });
  };

  return (
    <li className="d-flex justify-content-between align-items-center">
      <span className="dropdown-item">{cityName}</span>
      <button
        type="button"
        className="btn-close btn-sm"
        aria-label="Close"
        value={cityId}
        onClick={(e) => removeCity(e)}
      ></button>
    </li>
  );
};

export default ItemCity;
