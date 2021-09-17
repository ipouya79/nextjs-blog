import { useQuery } from 'react-query';
import getRequest from '../../../../Util/GET/getRequest';
import ReactLoading from 'react-loading';
import _ from 'lodash';
import { UseAppContext } from '../../../../Context/context';

const City = ({ provinceId, setCity }) => {
  const { isLoading, data } = useQuery(
    ['cities', provinceId],
    getRequest(`/api/province/get/${provinceId}`),
    {
      enabled: !!provinceId,
    }
  );

  const { cities } = UseAppContext();

  const addCity = (e) => {
    let selected = Array.from(e.target.options).filter(
      (option) => option.selected
    );

    setCity({ city: selected[0].dataset.value, id: selected[0].value });
  };

  let optionCities =
    data &&
    data.Cities &&
    data.Cities.length &&
    _.xorBy(data.Cities, cities, 'id').map((itm) => {
      return (
        <option key={itm.id} value={itm.id} data-value={itm.city}>
          {itm.city}
        </option>
      );
    });

  if (isLoading) {
    return (
      <ReactLoading type="bubbles" color="#6b6b6b" height={40} width={40} />
    );
  } else {
    return (
      <select className="form-select" onChange={(e) => addCity(e)}>
        <option>لطفا شهر مورد نظر را انتخاب کنید</option>
        {optionCities}
      </select>
    );
  }
};

export default City;
