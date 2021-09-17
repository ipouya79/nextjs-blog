import LocationMark from './LocationMark/LocationMark';
import styles from './Location.module.css';
import LocationModal from './LocationModal/LocationModal';

const Location = () => {
  return (
    <div
      className={`col-lg-6 col-1 d-flex justify-content-end ${styles.location}`}
    >
      <LocationMark text={true} />
      <LocationModal />
    </div>
  );
};

export default Location;
