import styles from './FAQ.module.css';

const FAQIcon = () => {
  return (
    <div className="col-1 d-flex justify-content-center">
      <button type="button" className={`${styles.Qbtn}`}>
        <i className="fas fa-question" aria-hidden="true"></i>
      </button>
    </div>
  );
};

export default FAQIcon;
