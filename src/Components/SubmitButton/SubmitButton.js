const SubmitButton = ({ submitbuttonClass, disabled, children }) => {
  return (
    <button type="submit" className={submitbuttonClass} disabled={disabled}>
      {children}
    </button>
  );
};

export default SubmitButton;
