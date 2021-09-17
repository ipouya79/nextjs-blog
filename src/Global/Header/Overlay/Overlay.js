import styles from './Overlay.module.css';

const OverLay = ({ showStyle, children, overLayStyle }) => {
  return (
    <div className={`${styles[overLayStyle]} ${styles[showStyle]}`}>
      {children}
    </div>
  );
};

export default OverLay;
