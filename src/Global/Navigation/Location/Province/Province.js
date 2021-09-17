import { useQuery } from 'react-query';
import getRequest from '../../../../Util/GET/getRequest';
import ReactLoading from 'react-loading';

const Province = ({ setProvince }) => {
  const { isLoading, data } = useQuery(
    'provinces',
    getRequest('/api/province/getall')
  );

  const chooseProvince = (e) => {
    setProvince(e.target.value);
  };

  let provinces =
    data &&
    data.length &&
    data.map((itm) => {
      return (
        <option key={itm.id} value={itm.id}>
          {itm.province}
        </option>
      );
    });

  if (isLoading) {
    return (
      <ReactLoading type="bubbles" color="#6b6b6b" height={40} width={40} />
    );
  } else {
    return (
      <select className="form-select" onChange={(e) => chooseProvince(e)}>
        <option>لطفا استان مورد نظر را انتخاب کنید</option>
        {provinces}
      </select>
    );
  }
};

export default Province;
