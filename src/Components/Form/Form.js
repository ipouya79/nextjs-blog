const Form = ({ formSubmitHandler, formClass, children }) => {
  return (
    <form onSubmit={formSubmitHandler} className={formClass}>
      {children}
    </form>
  );
};

export default Form;
