import intToString from '../../../Util/ChangeDisplayFormat/IntToString';
import styles from './My.module.css';

const My = ({ children, credit, entity }) => {
  return (
    <div className={`input-group input-group-sm mb-1 w-75 ${styles.my}`}>
      <span className="input-group-text">{children}</span>
      <input
        type="text"
        className="form-control bg-white shadow-none text-center"
        placeholder={intToString(entity)}
        readOnly
      />
      <span className="input-group-text d-flex justify-content-center">
        {credit}
      </span>
    </div>
  );
};

export default My;
