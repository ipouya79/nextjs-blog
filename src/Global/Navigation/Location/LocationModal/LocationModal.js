import { useEffect, useState } from 'react';
import City from '../City/City';
import Province from '../Province/Province';
import { UseAppContext } from '../../../../Context/context';

const LocationModal = () => {
  const [province, setProvince] = useState(null);
  const [city, setCity] = useState(null);

  const { dispatchCity } = UseAppContext();

  useEffect(() => {
    function remLoc(e) {
      let target = e.target.closest('#locationModal');

      if (!target) {
        setProvince(null);
        setCity(null);
      } else return;
    }

    document.addEventListener('click', remLoc);

    return () => document.removeEventListener('click', remLoc);
  }, []);

  const disposeModal = () => {
    dispatchCity({
      type: 'addCity',
      payload: { id: city.id, city: city.city },
    });
  };

  const refreshLoc = () => {
    setProvince(null);
    setCity(null);
  };

  return (
    <div
      className="modal fade"
      id="locationModal"
      tabIndex="-1"
      aria-labelledby="locationModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="locationModalLabel">
              انتخاب استان و شهر
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={refreshLoc}
            ></button>
          </div>
          <div className="modal-body d-flex justify-content-center">
            {province ? (
              <City provinceId={province} setCity={setCity} />
            ) : (
              <Province setProvince={setProvince} />
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
              onClick={disposeModal}
              disabled={province ? false : true}
            >
              ثبت
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
